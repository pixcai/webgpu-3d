import { vec3 } from 'gl-matrix';
import { Renderer, WireframeObject, LightObject } from '../classes';

export interface TorusOptions {
  radius?: number;
  r?: number;
  u?: number;
  v?: number;
  center?: vec3;
}

const compute = (radius: number, r: number, theta: number, phi: number, center: vec3 = [0, 0, 0]) => {
  const snt = Math.sin(theta * Math.PI * 2);
  const cnt = Math.cos(theta * Math.PI * 2);
  const snp = Math.sin(phi * Math.PI * 2);
  const cnp = Math.cos(phi * Math.PI * 2);
  return vec3.fromValues(center[0] + radius * cnt + r * cnp * cnt, center[1] + r * snp, center[2] + radius * snt + r * cnp * snt);
};

export const buildWireframeData = (options: TorusOptions = {}) => {
  const { radius = 1.5, r = 0.5, u = 50, v = 30, center } = options;
  if (u < 4 || v < 4 || r >= radius) {
    return {
      vertex: new Float32Array(),
    };
  }

  const pts = [];
  for (let i = 0; i < u; i++) {
    const pt1: vec3[] = [];
    for (let j = 0; j < v; j++) {
      pt1.push(compute(radius, r, i / (u - 1), j / (v - 1), center));
    }
    pts.push(pt1);
  }

  const ps = [];
  let p0, p1, p2;
  for (let i = 0; i < u - 1; i++) {
    for (let j = 0; j < v - 1; j++) {
      p0 = pts[i][j];
      p1 = pts[i][j + 1];
      p2 = pts[i + 1][j];
      ps.push(...p0, ...p1, ...p0, ...p2);
    }
  }

  return {
    vertex: new Float32Array(ps),
  };
};

export class TorusWireframe extends WireframeObject {
  constructor(renderer: Renderer, options?: TorusOptions) {
    super(renderer, buildWireframeData(options));
  }
}

export const buildData = (options: TorusOptions = {}) => {
  const { radius = 1.5, r = 0.5, u = 50, v = 30, center } = options;
  if (u < 4 || v < 4 || r >= radius) {
    return {
      vertex: new Float32Array(),
      normal: new Float32Array(),
    };
  }

  const pts = [];
  for (let i = 0; i < u; i++) {
    const pt1: vec3[] = [];
    for (let j = 0; j < v; j++) {
      pt1.push(compute(radius, r, i / (u - 1), j / (v - 1), center));
    }
    pts.push(pt1);
  }

  const ps = [], ns = [];
  let p0, p1, p2, p3;
  let ca: vec3, db: vec3, cp: vec3;
  for (let i = 0; i < u - 1; i++) {
    for (let j = 0; j < v - 1; j++) {
      p0 = pts[i][j];
      p1 = pts[i][j + 1];
      p2 = pts[i + 1][j];
      p3 = pts[i + 1][j + 1];
      ps.push(...p0, ...p1, ...p2, ...p2, ...p1, ...p3);
      ca = vec3.sub(vec3.create(), p2, p1);
      db = vec3.sub(vec3.create(), p3, p0);
      cp = vec3.cross(vec3.create(), ca, db);
      vec3.normalize(cp, cp);
      ns.push(...cp, ...cp, ...cp, ...cp, ...cp, ...cp);
    }
  }

  return {
    vertex: new Float32Array(ps),
    normal: new Float32Array(ns),
  };
};

export class Torus extends LightObject {
  constructor(renderer: Renderer, options?: TorusOptions) {
    super(renderer, buildData(options));
  }
}