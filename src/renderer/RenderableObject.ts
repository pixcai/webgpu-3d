import { Matrix4 } from './Matrix';
import { Scene } from './Scene';

export interface RenderableData {
  color: number[];
  vertex: number[];
}

let globalObjectId = 0;

export type RenderTask = (renderPassEncoder: GPURenderPassEncoder) => void;

export abstract class RenderableObject<T extends RenderableData = RenderableData> {
  readonly objectId: number;
  
  protected data: T;

  private visible = true;
  protected modelMat = new Matrix4();

  constructor(data: T) {
    this.data = data;
    this.objectId = ++globalObjectId;
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