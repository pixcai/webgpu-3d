import { Scene } from './Scene';
import { RenderableData, RenderableObject } from './RenderableObject';
import { Matrix4 } from './Matrix';
import { ShaderType, ShaderLocation } from './Shader';

export interface GeometryData extends RenderableData {
  normal: number[];
}

export interface SphereOptions {
  R?: number;
  u?: number;
  v?: number;
}

const createSphereData = (options: SphereOptions = {}): GeometryData => {
  const { R = 1, u = 64, v = 64 } = options;
  const pv = [], cs = [], vs = [];
  let pu, x, y, z, r, t, p, a, b, c, d;

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
    }
  }
  return { color: cs, vertex: vs, normal: [] };
};

export interface TorusOptions {
  R?: number;
  r?: number;
  u?: number;
  v?: number;
}

const createTorusData = (options: TorusOptions = {}): GeometryData => {
  const { R = 0.8, r = 0.2, u = 64, v = 32 } = options;
  const pu = [], cs = [], vs = [];
  let pv, x, y, z, dx, dz, dr, t, p, a, b, c, d;

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
    }
  }
  return { color: cs, vertex: vs, normal: [] };
};

export class Geometry extends RenderableObject<GeometryData> {
  static Sphere: typeof Sphere;
  static Torus: typeof Torus;

  data: GeometryData;

  protected modelMat = new Matrix4();  

  constructor(data: GeometryData) {
    super();
    this.data = data;
  }

  commit({ renderer, camera }: Scene) {
    const { color, vertex } = this.data;
    const vertexCount = vertex.length / 3;
    const mvpMat = new Matrix4();
    const colorBuffer = renderer.createVertexBuffer(new Float32Array(color));
    const vertexBuffer = renderer.createVertexBuffer(new Float32Array(vertex));
    const pipeline = renderer.createRenderPipeline(ShaderType.LIGHT);
    const mvpUniformBuffer = renderer.createUniformBuffer(mvpMat.data.byteLength);
    const mvpBindGroup = renderer.device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [{
        binding: 0,
        resource: {
          buffer: mvpUniformBuffer,
          offset: 0,
          size: mvpMat.data.byteLength,
        },
      }],
    });

    return (renderPassEncoder: GPURenderPassEncoder) => {
      Matrix4.mul(mvpMat, camera.matrix, this.modelMat);
      renderer.device.queue.writeBuffer(mvpUniformBuffer, 0, mvpMat.data);
      renderPassEncoder.setPipeline(pipeline);
      renderPassEncoder.setBindGroup(0, mvpBindGroup);
      renderPassEncoder.setVertexBuffer(ShaderLocation.COLOR, colorBuffer);
      renderPassEncoder.setVertexBuffer(ShaderLocation.VERTEX, vertexBuffer);
      renderPassEncoder.draw(vertexCount);
    };
  }

  translate(dx: number, dy: number, dz: number) {
    this.modelMat.translate(dx, dy, dz);
    return this;
  }

  rotate(thetaX: number, thetaY: number, thetaZ: number) {
    this.modelMat.rotateX(thetaX);
    this.modelMat.rotateY(thetaY);
    this.modelMat.rotateZ(thetaZ);
    return this;
  }

  scale(fx: number, fy: number, fz: number) {
    this.modelMat.scale(fx, fy, fz);
    return this;
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

Geometry.Sphere = Sphere;
Geometry.Torus = Torus;