import { RenderableObject, RenderableObjectState, RenderTask } from './RenderableObject';
import { PerspectiveCamera } from './Camera';
import Renderer from './Renderer';
import { Axes, AxesOptions } from './Axes';

export interface SceneOptions {
  axes: AxesOptions;
}

export class Scene {
  renderer: Renderer;
  camera = new PerspectiveCamera();

  private axes: Axes;
  private objects: Map<RenderableObject, RenderTask> = new Map();

  constructor(renderer: Renderer, options?: SceneOptions) {
    this.renderer = renderer;
    this.axes = new Axes(options?.axes);
    this.add(this.axes);
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

  showAxes(show = true) {
    this.axes.state = show ? RenderableObjectState.VISIBLE : RenderableObjectState.HIDDEN;
  }
}