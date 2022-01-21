import { Vector3 } from './Vector';
import { Matrix4 } from './Matrix';

export abstract class Camera {
  matrix = new Matrix4();
}

export class PerspectiveCamera extends Camera {
  private viewMat = new Matrix4();
  private projectionMat = new Matrix4();

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

  lookAt(position: Vector3, target: Vector3, up = new Vector3(0, 1, 0)) {
    const Z = position.clone().sub(target).normalize();
    const X = up.clone().cross(Z).normalize();
    const Y = Z.clone().cross(X).normalize();

    this.viewMat.data.set([
      X.x, Y.x, Z.x, 0,
      X.y, Y.y, Z.y, 0,
      X.z, Y.z, Z.z, 0,
      -X.dot(position), -Y.dot(position), -Z.dot(position), 1,
    ]);
    Matrix4.mul(this.matrix, this.projectionMat, this.viewMat);
  }

  translate(dx: number, dy: number, dz: number) {
    this.viewMat.translate(dx, dy, dz);
    Matrix4.mul(this.matrix, this.projectionMat, this.viewMat);
  }

  rotateX(thetaX: number) {
    this.viewMat.rotateX(thetaX);
    Matrix4.mul(this.matrix, this.projectionMat, this.viewMat);
  }

  rotateY(thetaY: number) {
    this.viewMat.rotateY(thetaY);
    Matrix4.mul(this.matrix, this.projectionMat, this.viewMat);
  }

  rotateZ(thetaZ: number) {
    this.viewMat.rotateZ(thetaZ);
    Matrix4.mul(this.matrix, this.projectionMat, this.viewMat);
  }

  scale(dx: number, dy: number, dz: number) {
    this.viewMat.scale(dx, dy, dz);
    Matrix4.mul(this.matrix, this.projectionMat, this.viewMat);
  }
}