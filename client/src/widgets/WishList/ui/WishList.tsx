import styles from './WishList.module.css';
import React from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/reduxHooks';
import { WishListUsersList } from '../WishListUsersList';
import { WishListItemsList } from '../WishListItemsList';
import { Modal } from 'antd';
import { closeModalInviteUserToWishlist } from '@/shared/model/slices/modalSlice';
import { InviteUserToWishlistForm } from '@/widgets/InviteUserToWishlistForm';

export function WishList(): React.JSX.Element {
  const { currentWishlist } = useAppSelector((state) => state.wishlist);
  const { isModalInviteUserToWishlistOpen } = useAppSelector((state) => state.modals);
  const dispatch = useAppDispatch();
  return (
    <>
      <h2 className={styles.title}>{currentWishlist?.title}</h2>
      <section className={styles.container}>
        <Modal
          title="Пригласить пользователя"
          open={isModalInviteUserToWishlistOpen}
          footer={null}
          onCancel={() => dispatch(closeModalInviteUserToWishlist())}
        >
          <InviteUserToWishlistForm />
        </Modal>
        <WishListUsersList />
        <WishListItemsList />
      </section>
    </>
  );
}
