import React from 'react';
import styles from './index.module.less';

const Panel: React.FC = ({ children }) => {
  return <div className={styles.panel}>{children}</div>;
};

export default Panel;