import Renderer from './Renderer';

export * from './Scene';
export * from './Geometry';
export * from './Vector';
export * from './Matrix';

export async function initRenderer(canvas: HTMLCanvasElement): Promise<Renderer> {
  const context = canvas.getContext('webgpu') as unknown as GPUCanvasContext;
  const adapter = await navigator.gpu.requestAdapter() as GPUAdapter;
  const device = await adapter.requestDevice();
  const format = context.getPreferredFormat(adapter);

  context.configure({
    device,
    format,
    size: [canvas.width, canvas.height],
  });

  return new Renderer(canvas, context, device, format);
}