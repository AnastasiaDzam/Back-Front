import styles from './WishListsGroup.module.css';
import React from 'react';

export function PlaceholderCard(): React.JSX.Element {
  return (
    <div className={styles.placeholderCard}>
      <div style={{ textAlign: 'center', color: 'gray' }}>
        <h3>Не найдено вишлистов</h3>
      </div>
    </div>
  );
}
