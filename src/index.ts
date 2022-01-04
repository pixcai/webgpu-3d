import { initRenderer } from './renderer';
import { Cube } from './objects';
import './index.css';

const app = document.getElementById('app') as HTMLCanvasElement;

initRenderer(app)
  .then((renderer) => {
    const cube = new Cube(renderer);

    renderer.add(cube).render();
  })
  .catch((e: Error) => {
    document.write(e.message);
  });