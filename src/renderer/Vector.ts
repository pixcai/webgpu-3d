import { Matrix4 } from './Matrix';

export class Vector3 {
  x: number;
  y: number;
  z: number;

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  static from(xyz: number[]) {
    return new Vector3(xyz[0], xyz[1], xyz[2]);
  }

  static min(output: Vector3, left: Vector3, right: Vector3) {
    output.x = Math.min(left.x, right.x);
    output.y = Math.min(left.y, right.y);
    output.z = Math.min(left.z, right.z);
    return output;
  }

  static max(output: Vector3, left: Vector3, right: Vector3) {
    output.x = Math.max(left.x, right.x);
    output.y = Math.max(left.y, right.y);
    output.z = Math.max(left.z, right.z);
    return output;
  }

  clone() {
    return new Vector3(this.x, this.y, this.z);
  }

  normalize() {
    const n = Math.hypot(this.x, this.y, this.z);
    const v = n > 0 ? 1 / n : n;

    this.x *= v;
    this.y *= v;
    this.z *= v;
    return this;
  }

  dot(input: Vector3) {
    return this.x * input.x + this.y * input.y + this.z * input.z;
  }

  cross(input: Vector3) {
    const x = this.y * input.z - this.z * input.y;
    const y = this.z * input.x - this.x * input.z;
    const z = this.x * input.y - this.y * input.x;

    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  sub(input: Vector3) {
    this.x -= input.x;
    this.y -= input.y;
    this.z -= input.z;
    return this;
  }

  mul(input: Vector3) {
    this.x *= input.x;
    this.y *= input.y;
    this.z *= input.z;
    return this;
  }

  toString() {
    return `(${this.x.toFixed(7)}, ${this.y.toFixed(7)}, ${this.z.toFixed(7)})`;
  }
}

export class Vector4 {
  x: number;
  y: number;
  z: number;
  w: number;

  constructor(x = 0, y = 0, z = 0, w = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  static from(xyzw: number[]) {
    return new Vector4(xyzw[0], xyzw[1], xyzw[2], xyzw[3]);
  }

  clone() {
    return new Vector4(this.x, this.y, this.z, this.w);
  }

  normalize() {
    const n = Math.hypot(this.x, this.y, this.z, this.w);
    const v = n > 0 ? 1 / n : n;

    this.x *= v;
    this.y *= v;
    this.z *= v;
    this.w *= v;
    return this;
  }

  div(v: number) {
    this.x = this.x / v || 0;
    this.y = this.y / v || 0;
    this.z = this.z / v || 0;
    this.w = this.w / v || 0;
    return this;
  }

  transform(matrix: Matrix4) {
    const { x, y, z, w } = this;
    const [x0, x1, x2, x3, y0, y1, y2, y3, z0, z1, z2, z3, w0, w1, w2, w3] = matrix.elements;

    this.x = x0 * x + y0 * y + z0 * z + w0 * w;
    this.y = x1 * x + y1 * y + z1 * z + w1 * w;
    this.z = x2 * x + y2 * y + z2 * z + w2 * w;
    this.w = x3 * x + y3 * y + z3 * z + w3 * w;
    return this;
  }

  inverse() {
    this.x = 1 / this.x || 0;
    this.y = 1 / this.y || 0;
    this.z = 1 / this.z || 0;
    this.w = 1 / this.w || 0;
    return this;
  }

  toXYZ() {
    return new Vector3(this.x, this.y, this.z);
  }

  toString() {
    return `(${this.x.toFixed(7)}, ${this.y.toFixed(7)}, ${this.z.toFixed(7)}, ${this.w.toFixed(7)})`;
  }
}