import { initRenderer, Scene, Geometry, Vector3 } from './renderer';
import { initControl } from './control';
import './index.css';

const canvas = document.getElementById('container') as HTMLCanvasElement;

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

initRenderer(canvas).then((renderer) => {
  const scene = new Scene(renderer);
  const torus = new Geometry.Torus();
  const sphere = new Geometry.Sphere({ u: 6, v: 3 });

  scene.camera.lookAt(new Vector3(0, 4, 6));
  scene.camera.perspective(Math.PI / 3, canvas.width / canvas.height, 0.1, 100);
  initControl(scene);

  torus.translate(-2, 0, 0);
  sphere.translate(2, 0, 0);
  scene.add(torus, sphere);

  function render() {
    scene.render();
    // torus.rotate(0.002, 0.002, 0.002);
    // sphere.rotate(0.002, 0.002, 0.002);
    requestAnimationFrame(render);
  }
  render();
});