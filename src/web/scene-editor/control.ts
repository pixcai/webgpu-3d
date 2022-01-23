import { Scene, RenderableObject, Raycaster } from '../../renderer';

export const initControl = (scene: Scene) => {
  const { camera, renderer } = scene;
  const { width, height } = renderer.canvas;
  const raycaster = new Raycaster(scene);
  const mouse = { button: -1, x: 0, y: 0, t: 0 };
  let selectedObject: RenderableObject | null = null;

  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  });
  window.addEventListener('mousedown', (e) => {
    selectedObject = raycaster.intersect(e.x, e.y);
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
        if (selectedObject) {
          selectedObject.rotateX(-dy / 360);
          selectedObject.rotateY(-dx / 360);
        } else {
          camera.rotateX(dy / 360);
        }
      } else {
        if (selectedObject) {
          selectedObject.translate(-dx * dt / width, dy * dt / height, 0);
        } else {
          camera.rotateY(dx / 360);
        }
      }
    } else if (mouse.button === 2) {
      if (e.ctrlKey) {
        camera.translate(0, dy * dt / height, 0);
      } else {
        camera.translate(-dx * dt / width, 0, 0);
      }
    }
    mouse.x = e.x;
    mouse.y = e.y;
    mouse.t += dt;
  });
  renderer.canvas.addEventListener('wheel', (e) => {
    const object = selectedObject || camera;
    const dt = Date.now() - mouse.t;
    const ds = e.deltaY * dt / 100;

    object.scale(ds, ds, ds);
    mouse.t += dt;
  });
};
