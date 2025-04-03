import styles from './Test.module.css';
import React from 'react';

type Props = {
  test: string;
};

const Test: React.FC<Props> = ({ test }) => {
  console.log(test);
  return <div className={styles.container}>Add your component code here</div>;
};

export default Test;
