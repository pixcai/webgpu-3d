import { RenderableObject, RenderableObjectState, RenderTask } from './RenderableObject';
import { PerspectiveCamera } from './Camera';
import Renderer from './Renderer';
import { Axis, AxisOptions } from './Axis';

export interface SceneOptions {
  axis: AxisOptions;
}

export class Scene {
  renderer: Renderer;
  camera = new PerspectiveCamera();

  private axis: Axis;
  private objects: Map<RenderableObject, RenderTask> = new Map();

  constructor(renderer: Renderer, options?: SceneOptions) {
    this.renderer = renderer;
    this.axis = new Axis(options?.axis);
    this.add(this.axis);
  }

  add(...objects: RenderableObject[]) {
    objects.forEach((object) => this.objects.set(object, object.commit(this)));
    return this;
  }

  delete(...objects: RenderableObject[]) {
    objects.forEach((object) => this.objects.delete(object));
    return this;
  }

  render() {
    const commandBuffers: GPUCommandBuffer[] = [];
    let commandBuffer: GPUCommandBuffer;

    this.objects.forEach((renderTask, object) => {
      if (object.state === RenderableObjectState.VISIBLE) {
        commandBuffer = this.renderer.beginRenderTask(renderTask);
        commandBuffers.push(commandBuffer);
      }
    });
    this.renderer.device.queue.submit(commandBuffers);
  }

  showAxis(show = true) {
    this.axis.state = show ? RenderableObjectState.VISIBLE : RenderableObjectState.HIDDEN;
  }
}