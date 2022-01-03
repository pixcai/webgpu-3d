import { mat4 } from 'gl-matrix';
import { createViewProjection } from './helpers';
import { defaultShader, lightShader } from './shaders';

const createCamera = require('3d-view-controls');

export interface RenderableData {
  vertex: Float32Array;
}

export abstract class RenderableObject {
  renderer: Renderer;
  data: RenderableData;

  protected vertex: GPUBuffer;
  protected pipeline: GPURenderPipeline;

  protected vp: ReturnType<typeof createViewProjection>;
  protected mvpMat: mat4;
  protected modelMat: mat4;

  protected camera: ReturnType<typeof createCamera>;

  constructor(renderer: Renderer, data: RenderableData) {
    this.renderer = renderer;
    this.data = data;

    const { canvas } = this.renderer.options;
    const { vertex } = this.data;

    this.vertex = this.renderer.createVertexBuffer(vertex);
    this.pipeline = this.createRenderPipeline();

    this.vp = createViewProjection(canvas.width / canvas.height);
    this.mvpMat = mat4.create();
    this.modelMat = mat4.create();

    this.camera = createCamera(canvas, this.vp.cameraOptions);
  }

  abstract render(): void;
  protected abstract createRenderPipeline(): GPURenderPipeline;
}

export interface RendererOptions extends GPUCanvasConfiguration {
  canvas: HTMLCanvasElement;
}

export class Renderer {
  context: GPUCanvasContext;
  options: RendererOptions;

  constructor(context: GPUCanvasContext, options: RendererOptions) {
    this.context = context;
    this.options = options;
    this.context.configure(this.options);
  }

  createIndexBuffer(data: Uint32Array) {
    const buffer = this.options.device.createBuffer({
      size: data.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true,
    });

    new Uint32Array(buffer.getMappedRange()).set(data);
    buffer.unmap();

    return buffer;
  }

  createVertexBuffer(data: Float32Array) {
    const buffer = this.options.device.createBuffer({
      size: data.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true,
    });

    new Float32Array(buffer.getMappedRange()).set(data);
    buffer.unmap();

    return buffer;
  }
}

export class WireframeObject extends RenderableObject {  
  protected uniform: GPUBuffer;
  protected bindGroup: GPUBindGroup;

  constructor(renderer: Renderer, data: RenderableData) {
    super(renderer, data);

    const { device } = this.renderer.options;

    this.uniform = device.createBuffer({
      size: 64,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    this.bindGroup = device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [{
        binding: 0,
        resource: {
          buffer: this.uniform,
          offset: 0,
          size: 64,
        },
      }],
    });
  }

  render() {
    const { device } = this.renderer.options;
    const commandEncoder = device.createCommandEncoder();
    const encoder = commandEncoder.beginRenderPass({
      colorAttachments: [{
        view: this.renderer.context.getCurrentTexture().createView(),
        loadValue: 'load',
        storeOp: 'store',
      }],
    });

    if (this.camera.tick()) {
      mat4.mul(this.vp.viewProjectionMat, this.vp.projectionMat, this.camera.matrix);
    }
    mat4.mul(this.mvpMat, this.vp.viewProjectionMat, this.modelMat);

    device.queue.writeBuffer(this.uniform, 0, this.mvpMat as ArrayBuffer);
    encoder.setPipeline(this.pipeline);
    encoder.setVertexBuffer(0, this.vertex);
    encoder.setBindGroup(0, this.bindGroup);
    encoder.draw(this.data.vertex.length / 3);
    encoder.endPass();

    device.queue.submit([commandEncoder.finish()]);
    requestAnimationFrame(() => this.render());
  }

  createRenderPipeline() {
    const { device, format } = this.renderer.options;
    const { vertex, fragment } = defaultShader;

    return device.createRenderPipeline({
      vertex: {
        module: device.createShaderModule(vertex),
        entryPoint: 'main',
        buffers: [{
          arrayStride: 12,
          attributes: [{
            shaderLocation: 0,
            format: 'float32x3',
            offset: 0,
          }],
        }],
      },
      fragment: {
        module: device.createShaderModule(fragment),
        entryPoint: 'main',
        targets: [{ format }],
      },
      primitive: {
        topology: 'line-list',
      },
    });
  }
}

export interface LightData extends RenderableData {
  normal: Float32Array;
}

export class LightObject extends RenderableObject {
  protected texture: GPUTexture;
  protected normal: GPUBuffer;

  protected normalMat: mat4;

  protected vertexUniform: GPUBuffer;
  protected fragmentUniform: GPUBuffer;
  protected bindGroup: GPUBindGroup;

  constructor(renderer: Renderer, data: LightData) {
    super(renderer, data);
    
    const { device, size } = this.renderer.options;

    this.texture = device.createTexture({
      size: size as GPUExtent3D,
      format: 'depth24plus',
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });
    this.normal = this.renderer.createVertexBuffer(data.normal);
    this.normalMat = mat4.create();

    this.vertexUniform = device.createBuffer({
      size: 192,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    this.fragmentUniform = device.createBuffer({
      size: 32,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    this.bindGroup = device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [{
        binding: 0,
        resource: {
          buffer: this.vertexUniform,
          offset: 0,
          size: 192,
        },
      }, {
        binding: 1,
        resource: {
          buffer: this.fragmentUniform,
          offset: 0,
          size: 32,
        },
      }],
    });
  }

  render() {
    const { device } = this.renderer.options;
    const commandEncoder = device.createCommandEncoder();
    const encoder = commandEncoder.beginRenderPass({
      colorAttachments: [{
        view: this.renderer.context.getCurrentTexture().createView(),
        loadValue: 'load',
        storeOp: 'store',
      }],
      depthStencilAttachment: {
        view: this.texture.createView(),
        depthLoadValue: 1.0,
        depthStoreOp: 'store',
        stencilLoadValue: 0,
        stencilStoreOp: 'store',
      },
    });

    if (this.camera.tick()) {
      const eyePosition = new Float32Array(this.camera.eye.flat());
      const lightPosition = eyePosition;

      mat4.mul(this.vp.viewProjectionMat, this.vp.projectionMat, this.camera.matrix);
      device.queue.writeBuffer(this.vertexUniform, 0, this.vp.viewProjectionMat as ArrayBuffer);
      device.queue.writeBuffer(this.fragmentUniform, 0, eyePosition);
      device.queue.writeBuffer(this.fragmentUniform, 16, lightPosition);
    }
    mat4.invert(this.normalMat, this.modelMat);
    mat4.transpose(this.normalMat, this.normalMat);
    device.queue.writeBuffer(this.vertexUniform, 64, this.modelMat as ArrayBuffer);
    device.queue.writeBuffer(this.vertexUniform, 128, this.normalMat as ArrayBuffer);

    encoder.setPipeline(this.pipeline);
    encoder.setVertexBuffer(0, this.vertex);
    encoder.setVertexBuffer(1, this.normal);
    encoder.setBindGroup(0, this.bindGroup);
    encoder.draw(this.data.vertex.length / 3);
    encoder.endPass();

    device.queue.submit([commandEncoder.finish()]);
    requestAnimationFrame(() => this.render());
  }

  createRenderPipeline() {
    const { device, format } = this.renderer.options;
    const { vertex, fragment } = lightShader;

    return device.createRenderPipeline({
      vertex: {
        module: device.createShaderModule(vertex),
        entryPoint: 'main',
        buffers: [{
          arrayStride: 12,
          attributes: [{
            shaderLocation: 0,
            format: 'float32x3',
            offset: 0,
          }, {
            shaderLocation: 1,
            format: 'float32x3',
            offset: 0,
          }],
        }],
      },
      fragment: {
        module: device.createShaderModule(fragment),
        entryPoint: 'main',
        targets: [{ format }],
      },
      primitive: {
        topology: 'triangle-list',
      },
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: 'less',
        format: 'depth24plus',
      },
    });
  }
}