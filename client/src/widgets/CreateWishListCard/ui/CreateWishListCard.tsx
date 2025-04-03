import styles from './CreateWishListCard.module.css';
import React from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useAppDispatch } from '@/shared/hooks/reduxHooks';
import { showModalCreateWishlist } from '@/shared/model/slices/modalSlice';

export function CreateWishListCard(): React.JSX.Element {
  const dispatch = useAppDispatch();
  return (
    <div className={styles.container}>
      <Button
        type="link"
        shape="circle"
        icon={<PlusOutlined />}
        className={styles.addButton}
        onClick={() => dispatch(showModalCreateWishlist())}
      />
    </div>
  );
}
