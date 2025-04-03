import styles from './PriorityWidget.module.css';
import React from 'react';
import { Priority } from '@/entities/wishlist/model';

type Props = {
  priority: Priority;
};

export function PriorityWidget({ priority }: Props): React.JSX.Element {
  const getPriorityColor = (itemPriority: Priority): string => {
    switch (itemPriority) {
      case Priority.LOW:
        return 'gray';
      case Priority.MEDIUM:
        return 'blue';
      case Priority.HIGH:
        return 'orange';
      case Priority.CRITICAL:
        return 'red';
      default:
        return 'black';
    }
  };

  return (
    <div className={styles.container}>
      <span className={styles.priorityText}>Статус:</span>
      <span style={{ color: getPriorityColor(priority) }} className={styles.priorityText}>
        {priority}
      </span>
    </div>
  );
}
