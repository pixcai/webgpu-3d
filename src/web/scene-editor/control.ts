import { Scene } from '../../renderer';

export const initControl = ({ camera, renderer }: Scene) => {
  const { width, height } = renderer.canvas;
  const mouse = { button: -1, x: 0, y: 0, t: 0 };

  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  });
  window.addEventListener('mousedown', (e) => {
    mouse.button = e.button;
    mouse.x = e.x;
    mouse.y = e.y;
    mouse.t = Date.now();
  });
  window.addEventListener('mouseup', () => {
    mouse.button = -1;
  });
  renderer.canvas.addEventListener('mousemove', (e) => {
    if (mouse.button === -1) return;

    const dt = Date.now() - mouse.t;
    const dx = mouse.x - e.x;
    const dy = mouse.y - e.y;

    if (mouse.button === 0) {
      if (e.ctrlKey) {
        camera.rotateX(dy / 360);
      } else {
        camera.rotateY(dx / 360);
      }
    } else if (mouse.button === 2) {
      if (e.ctrlKey) {
        camera.translate(0, dy * dt / height, 0);
      } else {
        camera.translate(dx * dt / width, 0, 0);
      }
    }
    mouse.x = e.x;
    mouse.y = e.y;
    mouse.t += dt;
  });
  renderer.canvas.addEventListener('wheel', (e) => {
    const dt = Date.now() - mouse.t;

    camera.translate(0, 0, e.deltaY * dt / 100);
    mouse.t += dt;
  });
};
