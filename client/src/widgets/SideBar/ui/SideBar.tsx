import styles from './Sidebar.module.css';
import React, { useState } from 'react';
import { ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons'; // Иконки
import { DOMTreeAnalyzer } from '@/features/DOMTreeAnalyzer';
import { Button } from 'antd';

export const Sidebar = (): React.JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleSidebar = (): void => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.sidebarContainer}>
      <Button
        type="link"
        onClick={toggleSidebar}
        className={`${styles.sidebarButton} ${isOpen ? styles.openButton : ''}`}
      >
        {isOpen ? <ArrowLeftOutlined /> : <ArrowRightOutlined />}
      </Button>

      <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <DOMTreeAnalyzer />
      </div>
    </div>
  );
};

export default Sidebar;
