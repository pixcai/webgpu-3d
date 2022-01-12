export class Matrix4 {
  data = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

  constructor(data?: number[]) {
    if (data) {
      this.data.fill(0).set(data.slice(0, 16));
    }
  }

  static mul(output: Matrix4, left: Matrix4, right: Matrix4) {
    const [a0, a1, a2, a3, b0, b1, b2, b3, c0, c1, c2, c3, d0, d1, d2, d3] = left.data;
    const [x0, x1, x2, x3, y0, y1, y2, y3, z0, z1, z2, z3, w0, w1, w2, w3] = right.data;

    output.data.set([
      a0 * x0 + b0 * x1 + c0 * x2 + d0 * x3,
      a1 * x0 + b1 * x1 + c1 * x2 + d1 * x3,
      a2 * x0 + b2 * x1 + c2 * x2 + d2 * x3,
      a3 * x0 + b3 * x1 + c3 * x2 + d3 * x3,
      a0 * y0 + b0 * y1 + c0 * y2 + d0 * y3,
      a1 * y0 + b1 * y1 + c1 * y2 + d1 * y3,
      a2 * y0 + b2 * y1 + c2 * y2 + d2 * y3,
      a3 * y0 + b3 * y1 + c3 * y2 + d3 * y3,
      a0 * z0 + b0 * z1 + c0 * z2 + d0 * z3,
      a1 * z0 + b1 * z1 + c1 * z2 + d1 * z3,
      a2 * z0 + b2 * z1 + c2 * z2 + d2 * z3,
      a3 * z0 + b3 * z1 + c3 * z2 + d3 * z3,
      a0 * w0 + b0 * w1 + c0 * w2 + d0 * w3,
      a1 * w0 + b1 * w1 + c1 * w2 + d1 * w3,
      a2 * w0 + b2 * w1 + c2 * w2 + d2 * w3,
      a3 * w0 + b3 * w1 + c3 * w2 + d3 * w3,
    ]);
  }

  identity() {
    this.data.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    return this;
  }

  translate(dx: number, dy: number, dz: number) {
    Matrix4.mul(this, new Matrix4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, dx, dy, dz, 1]), this);
    return this;
  }

  rotateX(theta: number) {
    Matrix4.mul(this, new Matrix4([1, 0, 0, 0, 0, Math.cos(theta), Math.sin(theta), 0, 0, -Math.sin(theta), Math.cos(theta), 0, 0, 0, 0, 1]), this);
    return this;
  }

  rotateY(theta: number) {
    Matrix4.mul(this, new Matrix4([Math.cos(theta), 0, -Math.sin(theta), 0, 0, 1, 0, 0, Math.sin(theta), 0, Math.cos(theta), 0, 0, 0, 0, 1]), this);
    return this;
  }

  rotateZ(theta: number) {
    Matrix4.mul(this, new Matrix4([Math.cos(theta), Math.sin(theta), 0, 0, -Math.sin(theta), Math.cos(theta), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]), this);
    return this;
  }

  scale(dx: number, dy: number, dz: number) {
    Matrix4.mul(this, new Matrix4([dx, 0, 0, 0, 0, dy, 0, 0, 0, 0, dz, 0, 0, 0, 0, 1]), this);
    return this;
  }
}