import { Scene } from './Scene';
import {
  RenderableData,
  RenderableObject,
  RenderableObjectKind,
  RenderableObjectMode,
  RenderTask,
} from './RenderableObject';
import { Matrix4 } from './Matrix';
import { Vector3 } from './Vector';
import { ShaderType, ShaderLocation } from './Shader';
import { Vector4 } from './Vector';
import { Texture } from './Texture';

export interface GeometryData extends RenderableData {
  normal: number[];
  OBB: {
    min: Vector3,
    max: Vector3,
  };
}

export interface SquareOptions {
  L?: number;
  W?: number;
  H?: number;
}

const createSquareData = (options: SquareOptions = {}): GeometryData & { uvs: number[] } => {
  const { L = 1, W = 1, H = 1 } = options;
  const l = L / 2, w = W / 2, h = H / 2;
  
  return {
    color: [
      -l, -h, w, l, -h, w, -l, h, w,
      l, -h, w, l, h, w, -l, h, w,
      -l, -h, -w, -l, h, -w, l, -h, -w,
      -l, h, -w, l, h, -w, l, -h, -w,
      -l, -h, -w, -l, -h, w, -l, h, -w,
      -l, -h, w, -l, h, w, -l, h, -w,
      l, -h, w, l, -h, -w, l, h, w,
      l, -h, -w, l, h, -w, l, h, w,
      -l, h, w, l, h, w, -l, h, -w,
      l, h, w, l, h, -w, -l, h, -w,
      -l, -h, w, -l, -h, -w, l, -h, w,
      -l, -h, -w, l, -h, -w, l, -h, w,
    ],
    vertex: [
      -l, -h, w, l, -h, w, -l, h, w,
      l, -h, w, l, h, w, -l, h, w,
      -l, -h, -w, -l, h, -w, l, -h, -w,
      -l, h, -w, l, h, -w, l, -h, -w,
      -l, -h, -w, -l, -h, w, -l, h, -w,
      -l, -h, w, -l, h, w, -l, h, -w,
      l, -h, w, l, -h, -w, l, h, w,
      l, -h, -w, l, h, -w, l, h, w,
      -l, h, w, l, h, w, -l, h, -w,
      l, h, w, l, h, -w, -l, h, -w,
      -l, -h, w, -l, -h, -w, l, -h, w,
      -l, -h, -w, l, -h, -w, l, -h, w,
    ],
    normal: [
      0, 0, 1, 0, 0, 1, 0, 0, 1,
      0, 0, 1, 0, 0, 1, 0, 0, 1,
      0, 0, -1, 0, 0, -1, 0, 0, -1,
      0, 0, -1, 0, 0, -1, 0, 0, -1,
      -1, 0, 0, -1, 0, 0, -1, 0, 0,
      -1, 0, 0, -1, 0, 0, -1, 0, 0,
      1, 0, 0, 1, 0, 0, 1, 0, 0,
      1, 0, 0, 1, 0, 0, 1, 0, 0,
      0, 1, 0, 0, 1, 0, 0, 1, 0,
      0, 1, 0, 0, 1, 0, 0, 1, 0,
      0, -1, 0, 0, -1, 0, 0, -1, 0,
      0, -1, 0, 0, -1, 0, 0, -1, 0,
    ],
    uvs: [
      0, 0, L, 0, 0, H, L, 0, L, H, 0, H,
      0, 0, L, 0, 0, H, L, 0, L, H, 0, H,
      0, 0, L, 0, 0, H, L, 0, L, H, 0, H,
      0, 0, L, 0, 0, H, L, 0, L, H, 0, H,
      0, 0, L, 0, 0, H, L, 0, L, H, 0, H,
      0, 0, L, 0, 0, H, L, 0, L, H, 0, H,
    ],
    OBB: {
      min: new Vector3(-l, -w, -h),
      max: new Vector3(l, w, h),
    },
  };
};

export interface SphereOptions {
  R?: number;
  u?: number;
  v?: number;
}

const createSphereData = (options: SphereOptions = {}): GeometryData => {
  const { R = 1, u = 512, v = 512 } = options;
  const pv = [], cs = [], vs = [], ns = [];
  let pu, x, y, z, r, t, p, a, b, c, d, e = new Vector3(), f = new Vector3();

  for (let i = 0; i < v; i++) {
    pu = [];
    t = i / (v - 1) * Math.PI;
    r = R * Math.sin(t);
    y = R * Math.cos(t);
    for (let j = 0; j < u; j++) {
      p = j / (u - 1) * Math.PI * 2;
      x = r * Math.cos(p);
      z = r * Math.sin(p);
      pu.push([x, y, -z]);
    }
    pv.push(pu);
  }
  for (let i = 0; i < v - 1; i++) {
    for (let j = 0; j < u - 1; j++) {
      a = pv[i][j];
      b = pv[i + 1][j];
      c = pv[i][j + 1];
      d = pv[i + 1][j + 1];
      cs.push(...b, ...a, ...c, ...c, ...b, ...d);
      vs.push(...b, ...a, ...c, ...c, ...b, ...d);
      e.x = b[0] - c[0];
      e.y = b[1] - c[1];
      e.z = b[2] - c[2];
      f.x = d[0] - a[0];
      f.y = d[1] - a[1];
      f.z = d[2] - a[2];
      e.cross(f);
      ns.push(e.x, e.y, e.z, e.x, e.y, e.z, e.x, e.y, e.z, e.x, e.y, e.z, e.x, e.y, e.z, e.x, e.y, e.z);
    }
  }
  return {
    color: cs,
    vertex: vs,
    normal: ns,
    OBB: {
      min: new Vector3(-R, -R, -R),
      max: new Vector3(R, R, R),
    },
  };
};

export interface TorusOptions {
  R?: number;
  r?: number;
  u?: number;
  v?: number;
}

const createTorusData = (options: TorusOptions = {}): GeometryData => {
  const { R = 0.8, r = 0.2, u = 512, v = 512 } = options;
  const pu = [], cs = [], vs = [], ns = [];
  let pv, x, y, z, dx, dz, dr, t, p, a, b, c, d, e = new Vector3(), f = new Vector3();

  for (let i = 0; i < u; i++) {
    pv = [];
    t = i / (u - 1) * Math.PI * 2;
    dx = Math.sin(t);
    dz = Math.cos(t);
    x = R * dx;
    z = R * dz;
    for (let j = 0; j < v; j++) {
      p = j / (v - 1) * Math.PI * 2;
      y = r * Math.sin(p);
      dr = r * Math.cos(p);
      pv.push([x - dr * dx, y, dr * dz - z]);
    }
    pu.push(pv);
  }
  for (let i = 0; i < u - 1; i++) {
    for (let j = 0; j < v - 1; j++) {
      a = pu[i][j];
      b = pu[i + 1][j];
      c = pu[i][j + 1];
      d = pu[i + 1][j + 1];
      cs.push(...c, ...a, ...b, ...b, ...d, ...c);
      vs.push(...c, ...a, ...b, ...b, ...d, ...c);
      e.x = b[0] - c[0];
      e.y = b[1] - c[1];
      e.z = b[2] - c[2];
      f.x = d[0] - a[0];
      f.y = d[1] - a[1];
      f.z = d[2] - a[2];
      e.cross(f);
      ns.push(e.x, e.y, e.z, e.x, e.y, e.z, e.x, e.y, e.z, e.x, e.y, e.z, e.x, e.y, e.z, e.x, e.y, e.z);
    }
  }
  return {
    color: cs,
    vertex: vs,
    normal: ns,
    OBB: {
      min: new Vector3(-(R + r), -r, -(R + r)),
      max: new Vector3(R + r, r, R + r),
    },
  };
};

export class Geometry extends RenderableObject<GeometryData> {
  static Square: typeof Square;
  static Sphere: typeof Sphere;
  static Torus: typeof Torus;

  private topology: GPUPrimitiveTopology;

  constructor(data: GeometryData, topology: GPUPrimitiveTopology = 'triangle-list') {
    super(RenderableObjectKind.GEOMETRY_3D, data);
    this.topology = topology;
  }

  commit({ renderer, camera }: Scene) {
    const { color, vertex, normal } = this.data;
    const vertexCount = vertex.length / 3;
    const mvpMat = new Matrix4();
    const colorBuffer = renderer.createVertexBuffer(new Float32Array(color));
    const vertexBuffer = renderer.createVertexBuffer(new Float32Array(vertex));
    const normalBuffer = renderer.createVertexBuffer(new Float32Array(normal));
    const pipeline = renderer.createRenderPipeline(ShaderType.LIGHT, { topology: this.topology });
    const mvpUniformBuffer = renderer.createUniformBuffer(mvpMat.elements.byteLength);
    const fragmentUniformBuffer = renderer.createUniformBuffer(32);
    const mvpBindGroup = renderer.device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [{
        binding: 0,
        resource: {
          buffer: mvpUniformBuffer,
          offset: 0,
          size: mvpMat.elements.byteLength,
        },
      }, {
        binding: 1,
        resource: {
          buffer: fragmentUniformBuffer,
          offset: 0,
          size: 32,
        },
      }],
    });
    const cameraPos = camera.position.buffer;

    return (renderPassEncoder: GPURenderPassEncoder) => {
      Matrix4.mul(mvpMat, camera.matrix, this.modelMat);
      renderer.device.queue.writeBuffer(mvpUniformBuffer, 0, mvpMat.elements.buffer);
      renderer.device.queue.writeBuffer(fragmentUniformBuffer, 0, cameraPos);
      renderer.device.queue.writeBuffer(fragmentUniformBuffer, 16, cameraPos);
      renderPassEncoder.setPipeline(pipeline);
      renderPassEncoder.setBindGroup(0, mvpBindGroup);
      renderPassEncoder.setVertexBuffer(ShaderLocation.COLOR, colorBuffer);
      renderPassEncoder.setVertexBuffer(ShaderLocation.VERTEX, vertexBuffer);
      renderPassEncoder.setVertexBuffer(ShaderLocation.NORMAL, normalBuffer);
      renderPassEncoder.draw(vertexCount);
    };
  }

  getBoundingBox() {
    const { min, max } = this.data.OBB;
    const { x: minX, y: minY, z: minZ } = new Vector4(min.x, min.y, min.z, 1).transform(this.modelMat);
    const { x: maxX, y: maxY, z: maxZ } = new Vector4(max.x, max.y, max.z, 1).transform(this.modelMat);

    return {
      min: new Vector3(minX, minY, minZ),
      max: new Vector3(maxX, maxY, maxZ),
    };
  }
}

class Square extends Geometry {  
  private texture?: GPUTexture;
  private sampler?: GPUSampler;

  constructor(options?: SquareOptions) {
    super(createSquareData(options));
  }

  setTexture({ sampler, texture }: Texture) {
    this.texture = texture;
    this.sampler = sampler;
    this.mode = RenderableObjectMode.TEXTURE;
  }

  private renderTexture({ renderer, camera }: Scene) {
    // @ts-ignore
    const { uvs, vertex } = this.data;
    const vertexCount = vertex.length / 3;
    const mvpMat = new Matrix4();
    const uvBuffer = renderer.createVertexBuffer(new Float32Array(uvs));
    const vertexBuffer = renderer.createVertexBuffer(new Float32Array(vertex));
    const pipeline = renderer.createRenderPipeline(ShaderType.TEXTURE);
    const mvpUniformBuffer = renderer.createUniformBuffer(mvpMat.elements.byteLength);
    const mvpBindGroup = renderer.device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [{
        binding: 0,
        resource: {
          buffer: mvpUniformBuffer,
          offset: 0,
          size: mvpMat.elements.byteLength,
        },
      }, {
        binding: 1,
        resource: this.sampler!,
      }, {
        binding: 2,
        resource: this.texture!.createView(),
      }],
    });

    return (renderPassEncoder: GPURenderPassEncoder) => {
      Matrix4.mul(mvpMat, camera.matrix, this.modelMat);
      renderer.device.queue.writeBuffer(mvpUniformBuffer, 0, mvpMat.elements.buffer);
      renderPassEncoder.setPipeline(pipeline);
      renderPassEncoder.setBindGroup(0, mvpBindGroup);
      renderPassEncoder.setVertexBuffer(ShaderLocation.TEXTURE, uvBuffer);
      renderPassEncoder.setVertexBuffer(ShaderLocation.VERTEX, vertexBuffer);
      renderPassEncoder.draw(vertexCount);
    };
  }

  private renderDefault(scene: Scene) {
    return super.commit(scene);
  }

  commit(scene: Scene) {
    let mode: RenderableObjectMode;
    let renderTask: RenderTask;

    return (renderPassEncoder: GPURenderPassEncoder) => {
      if (mode !== this.mode) {
        switch (this.mode) {
          case RenderableObjectMode.TEXTURE:
            renderTask = this.renderTexture(scene);
            break;
          default:
            renderTask = this.renderDefault(scene);
            break;
        }
        mode = this.mode;
      }
      return renderTask(renderPassEncoder);
    };
  }
}

class Sphere extends Geometry {
  constructor(options?: SphereOptions) {
    super(createSphereData(options));
  }
}

class Torus extends Geometry {
  constructor(options?: TorusOptions) {
    super(createTorusData(options));
  }
}

Geometry.Square = Square;
Geometry.Sphere = Sphere;
Geometry.Torus = Torus;