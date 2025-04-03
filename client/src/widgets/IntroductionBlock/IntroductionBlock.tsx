import React from 'react';
import styles from './IntroductionBlock.module.css';

type IntroductionBlockPropsType = {
  title: string;
  content: string;
  imagePath: string;
  imagePosition: 'left' | 'right';
};

export function IntroductionBlock({
  title,
  content,
  imagePath,
  imagePosition,
}: IntroductionBlockPropsType): React.JSX.Element {
  return (
    <div className={`${styles.container} ${imagePosition === 'right' ? styles.reverse : ''}`}>
      <img src={imagePath} alt="introduction" className={styles.img} />
      <div className={styles.textContainer}>
        <h1 className={styles.header}>{title}</h1>
        <span>{content}</span>
      </div>
    </div>
  );
}
