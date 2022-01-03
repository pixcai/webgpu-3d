import { vec3 } from 'gl-matrix';
import { Renderer, WireframeObject, LightObject } from '../classes';

export interface SphereOptions {
  radius?: number;
  u?: number;
  v?: number;
  center?: vec3;
}

const compute = (radius: number, theta: number, phi: number, center: vec3 = [0, 0, 0]) => {
  const snt = Math.sin(theta * Math.PI);
  const cnt = Math.cos(theta * Math.PI);
  const snp = Math.sin(phi * Math.PI * 2);
  const cnp = Math.cos(phi * Math.PI * 2);
  return vec3.fromValues(center[0] + radius * snt * cnp, center[1] + radius * cnt, center[2] + radius * snt * snp);
};

export const buildWireframeData = (options: SphereOptions = {}) => {
  const { radius = 2, u = 50, v = 30, center } = options;
  if (u < 3 || v < 3) {
    return {
      vertex: new Float32Array(),
    };
  }

  const pts = [];
  for (let i = 0; i < u; i++) {
    const pt1: vec3[] = [];
    for (let j = 0; j < v; j++) {
      pt1.push(compute(radius, i / (u - 1), j / (v - 1), center));
    }
    pts.push(pt1);
  }

  const ps = [];
  let p0, p1, p2, p3;
  for (let i = 0; i < u - 1; i++) {
    for (let j = 0; j < v - 1; j++) {
      p0 = pts[i][j];
      p1 = pts[i + 1][j];
      p2 = pts[i][j + 1];
      p3 = pts[i + 1][j + 1];
      ps.push(...p0, ...p1, ...p0, ...p2);
    }
  }

  return {
    vertex: new Float32Array(ps),
  };
};

export class SphereWireframe extends WireframeObject {
  constructor(renderer: Renderer, options?: SphereOptions) {
    super(renderer, buildWireframeData(options));
  }
}

export const buildData = (options: SphereOptions = {}) => {
  const { radius = 2, u = 60, v = 40, center } = options;
  if (u < 3 || v < 3) {
    return {
      vertex: new Float32Array(),
      normal: new Float32Array(),
    };
  }

  const pts = [];
  for (let i = 0; i < u; i++) {
    const pt1: vec3[] = [];
    for (let j = 0; j < v; j++) {
      pt1.push(compute(radius, i / (u - 1), j / (v - 1), center));
    }
    pts.push(pt1);
  }

  const ps = [], ns = [];
  let p0, p1, p2, p3;
  for (let i = 0; i < u - 1; i++) {
    for (let j = 0; j < v - 1; j++) {
      p0 = pts[i][j];
      p1 = pts[i + 1][j];
      p2 = pts[i][j + 1];
      p3 = pts[i + 1][j + 1];
      ps.push(...p0, ...p1, ...p2, ...p2, ...p1, ...p3);
      ns.push(
        p0[0] / radius, p0[1] / radius, p0[2] / radius,
        p1[0] / radius, p1[1] / radius, p1[2] / radius,
        p2[0] / radius, p2[1] / radius, p2[2] / radius,
        p2[0] / radius, p2[1] / radius, p2[2] / radius,
        p1[0] / radius, p1[1] / radius, p1[2] / radius,
        p3[0] / radius, p3[1] / radius, p3[2] / radius,
      );
    }
  }

  return {
    vertex: new Float32Array(ps),
    normal: new Float32Array(ns),
  };
};

export class Sphere extends LightObject {
  constructor(renderer: Renderer, options?: SphereOptions) {
    super(renderer, buildData(options));
  }
}