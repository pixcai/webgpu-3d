export class Vector3 {
  x: number;
  y: number;
  z: number;

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  get length() {
    return Math.hypot(this.x, this.y, this.z);
  }
  
  clone() {
    return new Vector3(this.x, this.y, this.z);
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

  normalize() {
    let length = this.length;

    if (length > 0) {
      length = 1 / length;
    }
    this.x *= length;
    this.y *= length;
    this.z *= length;
    return this;
  }
}