import { initRenderer } from './renderer';
import { Cube as Shape } from './objects';
import './index.css';

const app = document.getElementById('app') as HTMLCanvasElement;

initRenderer(app)
  .then((renderer) => {
    const shape = new Shape(renderer);
    shape.render();
  })
  .catch((e: Error) => {
    document.write(e.message);
  });