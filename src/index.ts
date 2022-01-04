import { initRenderer } from './renderer';
import {
  Cube,
  CubeWireframe,
  Cylinder,
  CylinderWireframe,
  Sphere,
  SphereWireframe,
  Torus,
  TorusWireframe,
} from './objects';
import './index.css';

const app = document.getElementById('app') as HTMLCanvasElement;

initRenderer(app)
  .then((renderer) => {
    const cube = new Cube(renderer);
    const cubeWireframe = new CubeWireframe(renderer);
    const cylinder = new Cylinder(renderer);
    const cylinderWireframe = new CylinderWireframe(renderer);
    const sphere = new Sphere(renderer);
    const sphereWireframe = new SphereWireframe(renderer);
    const torus = new Torus(renderer);
    const torusWireframe = new TorusWireframe(renderer);

    cube.translate([-1.5, 2, 0]).scale([0.3, 0.3, 0.3]);
    cubeWireframe.translate([1, 2, 0]).scale([0.2, 0.2, 0.2]);
    renderer.add(cube, cubeWireframe);

    cylinder.translate([-1.5, 0.3, 0]).scale([0.3, 0.3, 0.3]);
    cylinderWireframe.translate([1.5, 0.6, 0]).scale([0.2, 0.2, 0.2]);
    renderer.add(cylinder, cylinderWireframe);

    sphere.translate([-1.5, -2, 0]).scale([0.3, 0.3, 0.3]);
    sphereWireframe.translate([1.5, -1, 0]).scale([0.2, 0.2, 0.2]);
    renderer.add(sphere, sphereWireframe);

    torus.translate([-1.5, -5, 0]).scale([0.3, 0.3, 0.3]);
    torusWireframe.translate([2, -3, 0]).scale([0.2, 0.2, 0.2]);
    renderer.add(torus, torusWireframe);

    renderer.render(false);
  })
  .catch((e: Error) => {
    document.write(e.message);
  });