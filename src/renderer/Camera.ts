import { Vector3 } from './Vector';
import { Matrix4 } from './Matrix';

export abstract class Camera {
  matrix = new Matrix4();
}

export class PerspectiveCamera extends Camera {
  readonly position = new Vector3();

  private viewMat = new Matrix4();
  private projectionMat = new Matrix4();

  perspective(fovy: number, aspect: number, near: number, far: number) {
    const dw = 1 / Math.tan(fovy / 2);
    const dz = 1 / (near - far);

    Matrix4.mul(this.matrix, this.projectionMat.set([
      dw / aspect, 0, 0, 0,
      0, dw, 0, 0,
      0, 0, (near + far) * dz, -1,
      0, 0, 2 * near * far * dz, 0,
    ]), this.viewMat);
  }

  lookAt(position: Vector3, target: Vector3, up = new Vector3(0, 1, 0)) {
    const Z = position.clone().sub(target).normalize();
    const X = up.clone().cross(Z).normalize();
    const Y = Z.clone().cross(X).normalize();

    this.position.x = position.x;
    this.position.y = position.y;
    this.position.z = position.z;
    Matrix4.mul(this.matrix, this.projectionMat, this.viewMat.set([
      X.x, Y.x, Z.x, 0,
      X.y, Y.y, Z.y, 0,
      X.z, Y.z, Z.z, 0,
      -X.dot(position), -Y.dot(position), -Z.dot(position), 1,
    ]));
  }

  translate(dx: number, dy: number, dz: number) {
    Matrix4.mul(this.matrix, this.projectionMat, this.viewMat.translate(dx, dy, dz));
  }

  rotateX(theta: number) {
    Matrix4.mul(this.matrix, this.projectionMat, this.viewMat.rotateX(theta));
  }

  rotateY(theta: number) {
    Matrix4.mul(this.matrix, this.projectionMat, this.viewMat.rotateY(theta));
  }

  rotateZ(theta: number) {
    Matrix4.mul(this.matrix, this.projectionMat, this.viewMat.rotateZ(theta));
  }

  scale(sx: number, sy: number, sz: number) {
    Matrix4.mul(this.matrix, this.projectionMat, this.viewMat.scale(sx, sy, sz));
  }
}