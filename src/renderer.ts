import { Renderer } from './classes';

export async function initRenderer(canvas: HTMLCanvasElement): Promise<Renderer> {
  if (!navigator.gpu) {
    throw new Error('Your browser does not support WebGPU!');
  }
  const context = canvas.getContext('webgpu') as unknown as GPUCanvasContext;
  const adapter = await navigator.gpu.requestAdapter() as GPUAdapter;
  const device = await adapter.requestDevice();

  canvas.width = canvas.clientWidth * devicePixelRatio;
  canvas.height = canvas.clientHeight * devicePixelRatio;

  return new Renderer(context, {
    device,
    canvas,
    size: [canvas.width, canvas.height, 1.0],
    format: context.getPreferredFormat(adapter),
  });
}