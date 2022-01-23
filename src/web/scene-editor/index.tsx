import React, { Component, createRef } from 'react';
import { initRenderer, Scene, Geometry, Vector3 } from '../../renderer';
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
      const torus = new Geometry.Torus();
      const sphere = new Geometry.Sphere({ u: 6, v: 3 });

      scene.camera.lookAt(new Vector3(0, 4, 6), new Vector3(0, 0, 0));
      scene.camera.perspective(Math.PI / 3, aspect, 0.1, 100);
      initControl(scene);
    
      torus.translate(-2, 0, 0);
      sphere.translate(2, 0, 0);
      scene.add(torus, sphere);
    
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