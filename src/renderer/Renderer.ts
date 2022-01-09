import { RenderTask } from './RenderableObject';
import { createShader, ShaderType } from './Shader';

export default class Renderer {
  canvas: HTMLCanvasElement;
  context: GPUCanvasContext;
  device: GPUDevice;
  textureFormat: GPUTextureFormat;
  depthTexture: GPUTexture;
  depthTextureFormat: GPUTextureFormat = 'depth24plus';

  constructor(canvas: HTMLCanvasElement, context: GPUCanvasContext, device: GPUDevice, format: GPUTextureFormat) {
    this.canvas = canvas;
    this.context = context;
    this.device = device;
    this.textureFormat = format;
    this.depthTexture = device.createTexture({
      size: [this.canvas.width, this.canvas.height],
      format: this.depthTextureFormat,
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });
  }

  createVertexBuffer = (data: Float32Array) => {
    const buffer = this.device.createBuffer({
      size: data.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true,
    });

    new Float32Array(buffer.getMappedRange()).set(data);
    buffer.unmap();

    return buffer;
  };

  createUniformBuffer = (size: number) => {
    return this.device.createBuffer({
      size,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
  };

  createRenderPipeline = (type: ShaderType, primitive?: GPUPrimitiveState) => {
    const { vertex, fragment } = createShader(this, type);

    return this.device.createRenderPipeline({
      vertex,
      fragment,
      primitive,
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: 'less',
        format: this.depthTextureFormat,
      },
    });
  };

  beginRenderTask = (renderTask: RenderTask) => {
    const commandEncoder = this.device.createCommandEncoder();
    const renderPassEncoder = commandEncoder.beginRenderPass({
      colorAttachments: [
        {
          view: this.context.getCurrentTexture().createView(),
          storeOp: 'store',
          loadValue: 'load',
        },
      ],
      depthStencilAttachment: {
        view: this.depthTexture.createView(),
        depthLoadValue: 1,
        depthStoreOp: 'store',
        stencilLoadValue: 0,
        stencilStoreOp: 'store',
      },
    });

    renderTask(renderPassEncoder);
    renderPassEncoder.endPass();

    return commandEncoder.finish();
  };
}