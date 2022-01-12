import { Vector3 } from './Vector';
import { Matrix4 } from './Matrix';

export abstract class Camera {
  matrix = new Matrix4();
}

export class PerspectiveCamera extends Camera {
  private modelMat = new Matrix4();

  protected viewMat = new Matrix4();
  protected projectionMat = new Matrix4();

  perspective(fovy: number, aspect: number, near: number, far: number) {
    const f = 1 / Math.tan(fovy / 2);
    const d = 1 / (near - far);

    this.projectionMat.data.set([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * d, -1,
      0, 0, 2 * near * far * d, 0,
    ]);
    Matrix4.mul(this.matrix, this.projectionMat, this.viewMat);
  }

  lookAt(eye: Vector3, center = new Vector3(0, 0, 0), up = new Vector3(0, 1, 0)) {
    const Z = eye.clone().sub(center).normalize();
    const X = up.clone().cross(Z).normalize();
    const Y = Z.clone().cross(X).normalize();

    this.viewMat.data.set([
      X.x, Y.x, Z.x, 0,
      X.y, Y.y, Z.y, 0,
      X.z, Y.z, Z.z, 0,
      -X.dot(eye), -Y.dot(eye), -Z.dot(eye), 1,
    ]);
    Matrix4.mul(this.matrix, this.projectionMat, this.viewMat);
  }

  translate(dx: number, dy: number, dz: number) {
    this.modelMat.translate(dx, dy, dz);
    Matrix4.mul(this.matrix, this.matrix, this.modelMat);
    this.modelMat.identity();
  }

  rotate(thetaX: number, thetaY: number, thetaZ: number) {
    this.modelMat.rotateX(thetaX);
    this.modelMat.rotateY(thetaY);
    this.modelMat.rotateZ(thetaZ);
    Matrix4.mul(this.matrix, this.matrix, this.modelMat);
    this.modelMat.identity();
  }

  scale(dx: number, dy: number, dz: number) {
    this.modelMat.scale(dx, dy, dz);
    Matrix4.mul(this.matrix, this.matrix, this.modelMat);
    this.modelMat.identity();
  }
}