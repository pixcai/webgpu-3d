import { vec3 } from 'gl-matrix';
import { Renderer, WireframeObject, LightObject } from '../classes';

export interface CubeOptions {
  width?: number;
  height?: number;
  center?: vec3;
}

export const buildWireframeData = (options: CubeOptions = {}) => {
  const { width = 2.4, height = 2.4, center = [0, 0, 0] } = options;
  if (width <= 0 || height <= 0) {
    return {
      vertex: new Float32Array(),
    };
  }

  const w = width / 2, h = height / 2;
  const p0 = [center[0] - w, center[1] + h, center[2] + w];
  const p1 = [center[0] + w, center[1] + h, center[2] + w];
  const p2 = [center[0] + w, center[1] + h, center[2] - w];
  const p3 = [center[0] - w, center[1] + h, center[2] - w];
  const p4 = [center[0] - w, center[1] - h, center[2] + w];
  const p5 = [center[0] + w, center[1] - h, center[2] + w];
  const p6 = [center[0] + w, center[1] - h, center[2] - w];
  const p7 = [center[0] - w, center[1] - h, center[2] - w];
  const ps = [
    ...p0, ...p1, ...p1, ...p2, ...p2, ...p3, ...p3, ...p0,
    ...p4, ...p5, ...p5, ...p6, ...p6, ...p7, ...p7, ...p4,
    ...p0, ...p4, ...p1, ...p5, ...p2, ...p6, ...p3, ...p7,
  ];

  return {
    vertex: new Float32Array(ps),
  };
};

export class CubeWireframe extends WireframeObject {
  constructor(renderer: Renderer, options?: CubeOptions) {
    super(renderer, buildWireframeData(options));
  }
}

export const buildData = (options: CubeOptions = {}) => {
  const { width = 2.4, height = 2.4, center = [0, 0, 0] } = options;
  if (width <= 0 || height <= 0) {
    return {
      vertex: new Float32Array(),
      normal: new Float32Array(),
    };
  }

  const w = width / 2, h = height / 2;
  const p0 = [center[0] - w, center[1] + h, center[2] + w];
  const p1 = [center[0] + w, center[1] + h, center[2] + w];
  const p2 = [center[0] + w, center[1] + h, center[2] - w];
  const p3 = [center[0] - w, center[1] + h, center[2] - w];
  const p4 = [center[0] - w, center[1] - h, center[2] + w];
  const p5 = [center[0] + w, center[1] - h, center[2] + w];
  const p6 = [center[0] + w, center[1] - h, center[2] - w];
  const p7 = [center[0] - w, center[1] - h, center[2] - w];
  const ps = [
    ...p0, ...p1, ...p3, ...p3, ...p1, ...p2,
    ...p4, ...p5, ...p7, ...p7, ...p5, ...p6,
    ...p7, ...p4, ...p3, ...p3, ...p4, ...p0,
    ...p5, ...p6, ...p1, ...p1, ...p6, ...p2,
    ...p4, ...p5, ...p0, ...p0, ...p5, ...p1,
    ...p7, ...p6, ...p3, ...p3, ...p6, ...p2,
  ];
  const ns = [
    0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
    0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
    -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
    0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
    0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
  ];

  return {
    vertex: new Float32Array(ps),
    normal: new Float32Array(ns),
  };
};

export class Cube extends LightObject {
  constructor(renderer: Renderer, options?: CubeOptions) {
    super(renderer, buildData(options));
  }
}