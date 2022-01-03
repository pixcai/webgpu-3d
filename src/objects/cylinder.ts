import { vec3 } from 'gl-matrix';
import { Renderer, WireframeObject, LightObject } from '../classes';

export interface CylinderOptions {
  rin?: number;
  rout?: number;
  height?: number;
  n?: number;
  center?: vec3;
}

const compute = (radius: number, theta: number, y: number, center: vec3 = [0, 0, 0]) => {
  const snt = Math.sin(theta * Math.PI / 180);
  const cnt = Math.cos(theta * Math.PI / 180);
  return vec3.fromValues(center[0] + radius * cnt, center[1] + y, center[2] - radius * snt);
};

export const buildWireframeData = (options: CylinderOptions = {}) => {
  const { rin = 0.8, rout = 1.5, height = 3, n = 60, center } = options;
  if (n < 3 || rin >= rout) {
    return {
      vertex: new Float32Array(),
    };
  }

  const pts = [];
  const h = height / 2;
  for (let i = 0; i < n; i++) {
    pts.push([
      compute(rout, i * 360/(n-1), h, center),
      compute(rout, i * 360/(n-1), -h, center),
      compute(rin, i * 360/(n-1), -h, center),
      compute(rin, i * 360/(n-1), h, center),
    ]);
  }

  const ps = [];
  let p0, p1, p2, p3, p4, p5, p6, p7;
  for (let i = 0; i < n-1; i++) {
    p0 = pts[i][0];
    p1 = pts[i][1];
    p2 = pts[i][2];
    p3 = pts[i][3];
    p4 = pts[i+1][0];
    p5 = pts[i+1][1];
    p6 = pts[i+1][2];
    p7 = pts[i+1][3];
    ps.push(
      ...p0, ...p3, ...p3, ...p7, ...p4, ...p0,
      ...p1, ...p2, ...p2, ...p6, ...p5, ...p1,
      ...p0, ...p1, ...p3, ...p2,
    );
  }

  return {
    vertex: new Float32Array(ps),
  };
};

export class CylinderWireframe extends WireframeObject {
  constructor(renderer: Renderer, options?: CylinderOptions) {
    super(renderer, buildWireframeData(options));
  }
}

export const buildData = (options: CylinderOptions = {}) => {
  const { rin = 0.8, rout = 1.5, height = 3, n = 60, center } = options;
  if (n < 3 || rin >= rout) {
    return {
      vertex: new Float32Array(),
      normal: new Float32Array(),
    };
  }

  const pts = [];
  const h = height / 2;
  for (let i = 0; i < n; i++) {
    pts.push([
      compute(rout, i * 360/(n-1), h, center),
      compute(rout, i * 360/(n-1), -h, center),
      compute(rin, i * 360/(n-1), -h, center),
      compute(rin, i * 360/(n-1), h, center),
    ]);
  }

  const ps = [], ns = [];
  let p0, p1, p2, p3, p4, p5, p6, p7;
  for (let i = 0; i < n-1; i++) {
    p0 = pts[i][0];
    p1 = pts[i][1];
    p2 = pts[i][2];
    p3 = pts[i][3];
    p4 = pts[i+1][0];
    p5 = pts[i+1][1];
    p6 = pts[i+1][2];
    p7 = pts[i+1][3];
    ps.push(
      ...p0, ...p4, ...p7, ...p7, ...p3, ...p0,
      ...p1, ...p2, ...p6, ...p6, ...p5, ...p1,
      ...p0, ...p1, ...p5, ...p5, ...p4, ...p0,
      ...p2, ...p3, ...p7, ...p7, ...p6, ...p2,
    );
    ns.push(
      0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
      0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
      p0[0] / rout, 0, p0[2] / rout, p1[0] / rout, 0, p1[2] / rout, p5[0] / rout, 0, p5[2] / rout,
      p5[0] / rout, 0, p5[2] / rout, p4[0] / rout, 0, p4[2] / rout, p0[0] / rout, 0, p0[2] / rout,
      p3[0] / rout, 0, p3[2] / rout, p7[0] / rout, 0, p7[2] / rout, p6[0] / rout, 0, p6[2] / rout,
      p6[0] / rout, 0, p6[2] / rout, p2[0] / rout, 0, p2[2] / rout, p3[0] / rout, 0, p3[2] / rout,
    );
  }

  return {
    vertex: new Float32Array(ps),
    normal: new Float32Array(ns),
  };
};

export class Cylinder extends LightObject {
  constructor(renderer: Renderer, options?: CylinderOptions) {
    super(renderer, buildData(options));
  }
}