import React from 'react';
import Panel from '../../base-components/Panel';
import styles from './index.module.less';

const AttributePanel: React.FC = ({ children }) => {
  return (
    <div className={styles.panel}>
      <Panel>{children}</Panel>
    </div>
  );
};

export default AttributePanel;