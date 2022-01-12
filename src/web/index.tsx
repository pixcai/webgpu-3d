import React from 'react';
import ReactDOM from 'react-dom';
import SceneEditor from './scene-editor';
import AttributePanel from './components/AttributePanel';
import styles from './index.module.less';

const App = () => {
  return (
    <div className={styles.app}>
      <div className={styles.workspace}>
        <SceneEditor />
      </div>
      <div className={styles.panel}>
        <AttributePanel />
      </div>
    </div>
  );
};

export default (container: ReactDOM.Container) => {
  ReactDOM.render(<App />, container);
};