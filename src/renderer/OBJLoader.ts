import { Geometry } from './Geometry';
import { Vector3 } from './Vector';

export class OBJLoader {
  static async load(objFile: string): Promise<Geometry> {
    const objSource = await fetch(objFile);
    const text = await objSource.text();
    const lines = text.split('\r\n');
    const color: number[] = [];
    const vs: number[][] = [];
    const vertex: number[] = [];
    const ns: number[][] = [];
    const normal: number[] = [];
    const min = new Vector3();
    const max = new Vector3();
    let o, p, q;
    const e = new Vector3(), f = new Vector3();

    for (let i = 0, v, x, y, z; i < lines.length; i++) {
      if (lines[i][0] === '#') {
        continue;
      }
      v = lines[i].split(/\s+/).filter((s) => !!s);
      if (v[0] === 'vn') {
        x = parseFloat(v[1]);
        y = parseFloat(v[2]);
        z = parseFloat(v[3]);
        ns.push([x, y, z]);
      } else if (v[0] === 'v') {
        x = parseFloat(v[1]);
        y = parseFloat(v[2]);
        z = parseFloat(v[3]);
        vs.push([x, y, z]);
        min.x = x < min.x ? x : min.x;
        max.x = x > max.x ? x : max.x;
        min.y = y < min.y ? y : min.y;
        max.y = y > max.y ? y : max.y;
        min.z = x < min.z ? z : min.z;
        max.z = x > max.z ? z : max.z;
      } else if (v[0] === 'f') {
        for (let i = 0; i < v.length - 3; i++) {
          x = v[1].split('/').map((s) => parseInt(s, 10));
          y = v[2 + i].split('/').map((s) => parseInt(s, 10));
          z = v[3 + i].split('/').map((s) => parseInt(s, 10));
          o = vs[x[0] - 1];
          p = vs[y[0] - 1];
          q = vs[z[0] - 1];
          vertex.push(...o, ...p, ...q);
          e.x = o[0] - p[0];
          e.y = o[1] - p[1];
          e.z = o[2] - p[2];
          f.x = o[0] - q[0];
          f.y = o[1] - q[1];
          f.z = o[2] - q[2];
          e.cross(f);
          normal.push(e.x, e.y, e.z, e.x, e.y, e.z, e.x, e.y, e.z);
        }
      }
    }
    const c = Math.hypot(max.x, max.y, max.z);
    min.div(c);
    max.div(c);
    for (let i = 0; i < vertex.length; i += 3) {
      vertex[i] /= c;
      vertex[i + 1] /= c;
      vertex[i + 2] /= c;
      color.push(0, 0, 1);
    }
    return new Geometry({
      color,
      vertex,
      normal,
      OBB: { min, max },
    });
  }
}