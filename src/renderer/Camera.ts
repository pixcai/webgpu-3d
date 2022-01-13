import { Vector3 } from './Vector';
import { Matrix4 } from './Matrix';

export abstract class Camera {
  matrix = new Matrix4();
}

export class PerspectiveCamera extends Camera {
  private viewMat = new Matrix4();
  private projectionMat = new Matrix4();

  private position = new Vector3();
  private target = new Vector3();
  private up = new Vector3(0, 1, 0);

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

  lookAt(eye: Vector3, target = this.target, up = this.up) {
    this.position = eye;
    this.target = target;
    this.up = up;
    this.update();
  }

  private update() {
    const Z = this.position.clone().sub(this.target).normalize();
    const X = this.up.clone().cross(Z).normalize();
    const Y = Z.clone().cross(X).normalize();

    this.viewMat.data.set([
      X.x, Y.x, Z.x, 0,
      X.y, Y.y, Z.y, 0,
      X.z, Y.z, Z.z, 0,
      -X.dot(this.position), -Y.dot(this.position), -Z.dot(this.position), 1,
    ]);
    Matrix4.mul(this.matrix, this.projectionMat, this.viewMat);
  }

  translate(dx: number, dy: number, dz: number) {
    this.position.x += dx;
    this.position.y += dy;
    this.position.z += dz;
    this.target.x += dx;
    this.target.y += dy;
    this.target.z += dz;
    this.update();
  }

  rotateX(thetaX: number) {
    const { y, z } = this.position;
    this.position.y = y * Math.cos(thetaX) - z * Math.sin(thetaX);
    this.position.z = y * Math.sin(thetaX) + z * Math.cos(thetaX);
    this.update();
  }

  rotateY(thetaY: number) {
    const { x, z } = this.position;
    this.position.x = x * Math.cos(thetaY) + z * Math.sin(thetaY);
    this.position.z = z * Math.cos(thetaY) - x * Math.sin(thetaY);
    this.update();
  }

  rotateZ(thetaZ: number) {
    const { x, y } = this.position;
    this.position.y = x * Math.cos(thetaZ) - y * Math.sin(thetaZ);
    this.position.z = x * Math.sin(thetaZ) + y * Math.cos(thetaZ);
    this.update();
  }
}