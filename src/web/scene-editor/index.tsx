import React, { Component, createRef } from 'react';
import { initRenderer, Scene, Geometry, Vector3 } from '../../renderer';
import { OBJLoader } from '../../renderer/OBJLoader';
import { Texture } from '../../renderer/Texture';
import { initControl } from './control';
import styles from './index.module.less';

class SceneEditor extends Component {
  sceneRef = createRef<HTMLCanvasElement>();

  componentDidMount() {
    const canvas = this.sceneRef.current as HTMLCanvasElement;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const aspect = canvas.width / canvas.height;

    initRenderer(canvas).then((renderer) => {
      const scene = new Scene(renderer);
      const square = new Geometry.Square();
      const torus = new Geometry.Torus();
      const sphere = new Geometry.Sphere();

      scene.camera.lookAt(new Vector3(0, 4, 6), new Vector3(0, 0, 0));
      scene.camera.perspective(Math.PI / 3, aspect, 0.1, 100);
      initControl(scene);

      Texture.load(renderer, 'public/assets/box1.jpg').then((texture) => {
        square.setTexture(texture);
      });
      OBJLoader.load('public/assets/bunny.obj').then((model) => {
        model.translate(0, 2, 0);
        scene.add(model);
      });
      OBJLoader.load('public/assets/man.obj').then((model) => {
        scene.add(model);
      });
    
      square.translate(-2, 0, -4);
      torus.translate(-2, 0, 0);
      sphere.translate(2, 0, 0);
      scene.add(square, torus, sphere);
    
      function render() {
        scene.render();
        requestAnimationFrame(render);
      }
      render();
    });
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return <canvas className={styles.scene} ref={this.sceneRef} />;
  }
}

export default SceneEditor;