import { Scene } from './Scene';

export interface RenderableData {
  color: number[];
  vertex: number[];
}

export enum RenderableObjectState {
  VISIBLE,
  HIDDEN,
}

export type RenderTask = (renderPassEncoder: GPURenderPassEncoder) => void;

export abstract class RenderableObject<T extends RenderableData = RenderableData> {
  abstract data: T;
  state: RenderableObjectState = RenderableObjectState.VISIBLE;

  abstract commit(scene: Scene): RenderTask;
}