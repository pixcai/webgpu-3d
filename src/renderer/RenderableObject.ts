import { Matrix4 } from './Matrix';
import { Scene } from './Scene';

export interface RenderableData {
  color: number[];
  vertex: number[];
}

export enum RenderableObjectKind {
  DEFAULT,
  GEOMETRY_3D,
}

export enum RenderableObjectMode {
  DEFAULT,
  TEXTURE,
}

let globalObjectId = 0;

export type RenderTask = (renderPassEncoder: GPURenderPassEncoder) => void;

export abstract class RenderableObject<T extends RenderableData = RenderableData> {
  readonly objectId = ++globalObjectId;
  protected mode = RenderableObjectMode.DEFAULT;
  
  protected data: T;
  readonly kind: RenderableObjectKind;

  private visible = true;
  protected modelMat = new Matrix4();

  constructor(kind: RenderableObjectKind, data: T) {
    this.kind = kind;
    this.data = data;
  }

  setVisible(visible: boolean) {
    this.visible = visible;
  }

  isVisible() {
    return this.visible;
  }
  
  translate(dx: number, dy: number, dz: number) {
    this.modelMat.translate(dx, dy, dz);
    return this;
  }

  rotateX(theta: number) {
    this.modelMat.rotateX(theta);
    return this;
  }

  rotateY(theta: number) {
    this.modelMat.rotateY(theta);
    return this;
  }

  rotateZ(theta: number) {
    this.modelMat.rotateZ(theta);
    return this;
  }

  scale(sx: number, sy: number, sz: number) {
    this.modelMat.scale(sx, sy, sz);
    return this;
  }

  abstract commit(scene: Scene): RenderTask;
}