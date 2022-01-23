export class Matrix4 {
  readonly elements = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

  clone() {
    const output = new Matrix4();

    output.elements.set(this.elements);
    return output;
  }

  identity() {
    this.elements.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    return this;
  }

  set(elements: number[]) {
    this.elements.fill(0).set(elements.slice(0, 16));
    return this;
  }

  static mul(output: Matrix4, left: Matrix4, right: Matrix4) {
    const [x0, x1, x2, x3, y0, y1, y2, y3, z0, z1, z2, z3, w0, w1, w2, w3] = left.elements;
    const [a0, a1, a2, a3, b0, b1, b2, b3, c0, c1, c2, c3, d0, d1, d2, d3] = right.elements;

    output.elements.set([
      x0 * a0 + y0 * a1 + z0 * a2 + w0 * a3,
      x1 * a0 + y1 * a1 + z1 * a2 + w1 * a3,
      x2 * a0 + y2 * a1 + z2 * a2 + w2 * a3,
      x3 * a0 + y3 * a1 + z3 * a2 + w3 * a3,
      x0 * b0 + y0 * b1 + z0 * b2 + w0 * b3,
      x1 * b0 + y1 * b1 + z1 * b2 + w1 * b3,
      x2 * b0 + y2 * b1 + z2 * b2 + w2 * b3,
      x3 * b0 + y3 * b1 + z3 * b2 + w3 * b3,
      x0 * c0 + y0 * c1 + z0 * c2 + w0 * c3,
      x1 * c0 + y1 * c1 + z1 * c2 + w1 * c3,
      x2 * c0 + y2 * c1 + z2 * c2 + w2 * c3,
      x3 * c0 + y3 * c1 + z3 * c2 + w3 * c3,
      x0 * d0 + y0 * d1 + z0 * d2 + w0 * d3,
      x1 * d0 + y1 * d1 + z1 * d2 + w1 * d3,
      x2 * d0 + y2 * d1 + z2 * d2 + w2 * d3,
      x3 * d0 + y3 * d1 + z3 * d2 + w3 * d3,
    ]);
    return output;
  }

  mul(input: Matrix4) {
    return Matrix4.mul(this, this, input);
  }

  inverse() {
    const [a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33] = this.elements;
    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    det = det !== 0 ? 1 / det : det;
    this.elements.set([
      (a11 * b11 - a12 * b10 + a13 * b09) * det,
      (a02 * a10 - a01 * a11 - a03 * b09) * det,
      (a31 * b05 - a32 * b04 + a33 * b03) * det,
      (a22 * b04 - a21 * b05 - a23 * b03) * det,
      (a12 * b04 - a10 * b05 - a13 * b03) * det,
      (a00 * b11 - a02 * b08 + a03 * b07) * det,
      (a32 * b02 - a30 * b05 - a33 * b01) * det,
      (a20 * b05 - a22 * b02 + a23 * b01) * det,
      (a10 * b10 - a11 * b08 + a13 * b06) * det,
      (a01 * b08 - a00 * b10 - a03 * b06) * det,
      (a30 * b04 - a31 * b02 + a33 * b00) * det,
      (a21 * b02 - a20 * b04 - a23 * b00) * det,
      (a11 * b07 - a10 * b09 - a12 * b06) * det,
      (a00 * b09 - a01 * b07 + a02 * b06) * det,
      (a31 * b01 - a30 * b03 - a32 * b00) * det,
      (a20 * b03 - a21 * b01 + a22 * b00) * det,
    ]);
    return this;
  }

  translate(dx: number, dy: number, dz: number) {
    const [x0, x1, x2, x3, y0, y1, y2, y3, z0, z1, z2, z3, w0, w1, w2, w3] = this.elements;

    this.elements.set([
      x0 + x3 * dx, x1 + x3 * dy, x2 + x3 * dz, x3,
      y0 + y3 * dx, y1 + y3 * dy, y2 + z3 * dz, y3,
      z0 + z3 * dx, z1 + y3 * dy, z2 + z3 * dz, z3,
      w0 + w3 * dx, w1 + w3 * dy, w2 + w3 * dz, w3,
    ]);
    return this;
  }

  rotateX(theta: number) {
    const cos = Math.cos(theta), sin = Math.sin(theta);
    const [x0, x1, x2, x3, y0, y1, y2, y3, z0, z1, z2, z3, w0, w1, w2, w3] = this.elements;

    this.elements.set([
      x0, x1, x2, x3,
      y0 * cos + z0 * sin, y1 * cos + z1 * sin, y2 * cos + z2 * sin, y3 * cos + z3 * sin,
      z0 * cos - y0 * sin, z1 * cos - y1 * sin, z2 * cos - y2 * sin, z3 * cos - y3 * sin,
      w0, w1, w2, w3,
    ]);
    return this;
  }

  rotateY(theta: number) {
    const cos = Math.cos(theta), sin = Math.sin(theta);
    const [x0, x1, x2, x3, y0, y1, y2, y3, z0, z1, z2, z3, w0, w1, w2, w3] = this.elements;

    this.elements.set([
      x0 * cos - z0 * sin, x1 * cos - z1 * sin, x2 * cos - z2 * sin, x3 * cos - z3 * sin,
      y0, y1, y2, y3,
      x0 * sin + z0 * cos, x1 * sin + z1 * cos, x2 * sin + z2 * cos, x3 * sin + cos * z3,
      w0, w1, w2, w3,
    ]);
    return this;
  }

  rotateZ(theta: number) {
    const cos = Math.cos(theta), sin = Math.sin(theta);
    const [x0, x1, x2, x3, y0, y1, y2, y3, z0, z1, z2, z3, w0, w1, w2, w3] = this.elements;

    this.elements.set([
      x0 * cos + y0 * sin, x1 * cos + y1 * sin, x2 * cos + y2 * sin, x3 * cos + y3 * sin,
      y0 * cos - x0 * sin, y1 * cos - x1 * sin, y2 * cos - x2 * sin, y3 * cos - x3 * sin,
      z0, z1, z2, z3,
      w0, w1, w2, w3,
    ]);
    return this;
  }

  scale(sx: number, sy: number, sz: number) {
    const [x0, x1, x2, x3, y0, y1, y2, y3, z0, z1, z2, z3, w0, w1, w2, w3] = this.elements;

    this.elements.set([
      x0 * sx, x1 * sy, x2 * sz, x3,
      y0 * sx, y1 * sy, y2 * sz, y3,
      z0 * sx, z1 * sy, z2 * sz, z3,
      w0 * sx, w1 * sy, w2 * sz, w3,
    ]);
    return this;
  }

  toString() {
    const [x0, x1, x2, x3, y0, y1, y2, y3, z0, z1, z2, z3, w0, w1, w2, w3] = [...this.elements].map((v) => v.toFixed(7).padStart(12));

    return `
      [${x0}, ${y0}, ${z0}, ${w0}]
      |${x1}, ${y1}, ${z1}, ${w1}|
      |${x2}, ${y2}, ${z2}, ${w2}|
      [${x3}, ${y3}, ${z3}, ${w3}]
    `;
  }
}