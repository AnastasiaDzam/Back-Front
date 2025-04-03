import styles from './WishListItemsList.module.css';
import React from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/reduxHooks';
import { WishListItemCard } from '@/entities/wishlist';
import { Modal } from 'antd';
import { closeModalCreateWishListItem } from '@/shared/model/slices/modalSlice';
import { CreateWishListItemCard } from '@/widgets/CreateWishListItemCard';
import { CreateWishListItemForm } from '@/widgets/CreateWishListItemForm';

export function WishListItemsList(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { selectedUserInWishlistId, currentUserWishListItems } = useAppSelector(
    (state) => state.wishlist,
  );
  const { user } = useAppSelector((state) => state.user);
  const { isModalCreateWishListItemOpen } = useAppSelector((state) => state.modals);

  return (
    <section className={styles.container}>
      {user?.id === selectedUserInWishlistId && <CreateWishListItemCard />}
      {currentUserWishListItems.length ? (
        currentUserWishListItems.map((el) => <WishListItemCard key={el.id} wishListItem={el} />)
      ) : (
        <h2>У этого пользователя пока нет желаний, он ничего не хочет</h2>
      )}

      <Modal
        title="Cоздать желание"
        open={isModalCreateWishListItemOpen}
        footer={null}
        onCancel={() => dispatch(closeModalCreateWishListItem())}
      >
        <CreateWishListItemForm />
      </Modal>
    </section>
  );
}
