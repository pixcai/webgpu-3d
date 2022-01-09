import { RenderableData, RenderableObject } from './RenderableObject';
import { Scene } from './Scene';
import { ShaderType, ShaderLocation } from './Shader';

export interface AxisOptions {
  lines?: number;
  step?: number;
  showX?: boolean;
  showY?: boolean;
  showZ?: boolean;
}

const createAxisData = (options: AxisOptions = {}): RenderableData => {
  const { lines = 50, step = 0.5, showX = true, showY = true, showZ = true } = options;
  const half = lines / 2, cs = [], vs = [];

  if (showX) {
    vs.push(half, 0, 0, -half, 0, 0);
    cs.push(1, 0, 0, 1, 0, 0);
  }
  if (showY) {
    vs.push(0, half, 0, 0, -half, 0);
    cs.push(0, 1, 0, 0, 1, 0);
  }
  if (showZ) {
    vs.push(0, 0, half, 0, 0, -half);
    cs.push(0, 0, 1, 0, 0, 1);
  }
  for (let i = 0; i < lines / 2; i += step) {
    vs.push(
      half, 0, -i, -half, 0, -i, half, 0, i, -half, 0, i,
      i, 0, half, i, 0, -half, -i, 0, half, -i, 0, -half,
    );
    for (let j = 0; j < 8; j++) {
      cs.push(0.4, 0.4, 0.4);
    }
  }
  return { color: cs, vertex: vs };
};

export class Axis extends RenderableObject {
  data: RenderableData;

  constructor(options?: AxisOptions) {
    super();
    this.data = createAxisData(options);
  }

  commit({ renderer, camera }: Scene) {
    const { color, vertex } = this.data;
    const vertexCount = vertex.length / 3;
    const colorBuffer = renderer.createVertexBuffer(new Float32Array(color));
    const vertexBuffer = renderer.createVertexBuffer(new Float32Array(vertex));
    const pipeline = renderer.createRenderPipeline(ShaderType.DEFAULT, { topology: 'line-list' });
    const mvpUniformBuffer = renderer.createUniformBuffer(camera.matrix.data.byteLength);
    const mvpBindGroup = renderer.device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [{
        binding: 0,
        resource: {
          buffer: mvpUniformBuffer,
          offset: 0,
          size: camera.matrix.data.byteLength,
        },
      }],
    });

    return (renderPassEncoder: GPURenderPassEncoder) => {
      renderer.device.queue.writeBuffer(mvpUniformBuffer, 0, camera.matrix.data);
      renderPassEncoder.setPipeline(pipeline);
      renderPassEncoder.setBindGroup(0, mvpBindGroup);
      renderPassEncoder.setVertexBuffer(ShaderLocation.COLOR, colorBuffer);
      renderPassEncoder.setVertexBuffer(ShaderLocation.VERTEX, vertexBuffer);
      renderPassEncoder.draw(vertexCount);
    };
  }
}