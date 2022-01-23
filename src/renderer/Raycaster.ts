import { Vector3, Vector4 } from './Vector';
import { RenderableObjectKind } from './RenderableObject';
import { Scene } from './Scene';
import { Geometry } from './Geometry';

export class Raycaster {
  scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  intersect(x: number, y: number) {
    const { width, height } = this.scene.renderer.canvas;
    const unprojectMat = this.scene.camera.matrix.clone().inverse();
    const xInNDC = 2 * x / width - 1;
    const yInNDC = 1 - 2 * y / height;
    const worldStart = Vector4.from([xInNDC, yInNDC, -1, 1]).transform(unprojectMat);
    const worldEnd = Vector4.from([xInNDC, yInNDC, 1, 1]).transform(unprojectMat);
    const origin = worldStart.toXYZ();
    const direction = worldEnd.toXYZ().sub(origin).normalize();
    const objects = this.scene.getRenderableObjects().filter((object) => object.kind === RenderableObjectKind.GEOMETRY_3D);
    let selectedObject = null, minNear = Infinity;

    objects.forEach((object) => {
      const result = this.rayCasting(object as Geometry, origin, direction);
      
      if (result.near < result.far && result.near < minNear) {
        selectedObject = object;
        minNear = result.near;
      }
    });

    return selectedObject;
  }

  private rayCasting(object: Geometry, origin: Vector3, direction: Vector3) {
    const { min, max } = object.getBoundingBox();
    const dir = direction.clone().inverse();
    const t1 = min.clone().sub(origin).mul(dir);
    const t2 = max.clone().sub(origin).mul(dir);

    Vector3.min(min, t1, t2);
    Vector3.max(max, t1, t2);
    return {
      near: Math.max(min.x, min.y, min.z),
      far: Math.min(max.x, max.y, max.z),
    };
  }
}