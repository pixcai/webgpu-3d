import { RenderableData, RenderableObject } from './RenderableObject';
import { Scene } from './Scene';
import { ShaderType, ShaderLocation } from './Shader';

export interface AxesOptions {
  lines?: number;
  colors?: number[][];
  step?: number;
}

const createAxesData = (options: AxesOptions = {}): RenderableData => {
  const { lines = 20, step = 0.5, colors = [[0.4, 0.4, 0.4], [0.8, 0.8, 0.8]] } = options;
  const half = lines / 2, cs = [], vs = [];
  let a, b, c, d, n = 0;

  for (let i = -half; i < half; i += step) {
    for (let j = -half; j < half; j += step) {
      a = [i, 0, j];
      b = [i + step, 0, j];
      c = [i + step, 0, j + step];
      d = [i, 0, j + step]
      vs.push(...b, ...a, ...d, ...d, ...c, ...b);
      cs.push(...colors[n], ...colors[n], ...colors[n], ...colors[n], ...colors[n], ...colors[n]);
      n = ++n % colors.length;
    }
    colors.push(colors.shift()!);
  }
  return { color: cs, vertex: vs };
};

export class Axes extends RenderableObject {
  data: RenderableData;

  constructor(options?: AxesOptions) {
    super();
    this.data = createAxesData(options);
  }

  commit({ renderer, camera }: Scene) {
    const { color, vertex } = this.data;
    const vertexCount = vertex.length / 3;
    const colorBuffer = renderer.createVertexBuffer(new Float32Array(color));
    const vertexBuffer = renderer.createVertexBuffer(new Float32Array(vertex));
    const pipeline = renderer.createRenderPipeline(ShaderType.DEFAULT);
    const mvpUniformBuffer = renderer.createUniformBuffer(camera.matrix.elements.byteLength);
    const mvpBindGroup = renderer.device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [{
        binding: 0,
        resource: {
          buffer: mvpUniformBuffer,
          offset: 0,
          size: camera.matrix.elements.byteLength,
        },
      }],
    });

    return (renderPassEncoder: GPURenderPassEncoder) => {
      renderer.device.queue.writeBuffer(mvpUniformBuffer, 0, camera.matrix.elements.buffer);
      renderPassEncoder.setPipeline(pipeline);
      renderPassEncoder.setBindGroup(0, mvpBindGroup);
      renderPassEncoder.setVertexBuffer(ShaderLocation.COLOR, colorBuffer);
      renderPassEncoder.setVertexBuffer(ShaderLocation.VERTEX, vertexBuffer);
      renderPassEncoder.draw(vertexCount);
    };
  }
}