import styles from './WishListUsersList.module.css';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/reduxHooks';
import { setCurrentSelectedUserOnWishlist, UserItem } from '@/entities/user';
import { kickOutUserToWishListThunk, setCurrentUserWishListItems } from '@/entities/wishlist';
import {
  closeModalKickOutUserFromWishlist,
  showModalKickOutUserFromWishlist,
} from '@/shared/model/slices/modalSlice';
import { Modal } from 'antd';
import { InviteUserToWishListCard } from '@/widgets/InviteUserToWishListCard';

export function WishListUsersList(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { isModalKickOutUserFromWishlistOpen } = useAppSelector((state) => state.modals);
  const { currentWishlist } = useAppSelector((state) => state.wishlist);
  const { user: currentUser } = useAppSelector((state) => state.user);
  const [kickOutUserId, setKickOutUserId] = useState<number | null>(null);

  const handleKickOutUser = async (): Promise<void> => {
    if (!kickOutUserId || !currentWishlist) return;
    await dispatch(
      kickOutUserToWishListThunk({ id: currentWishlist.id, userId: kickOutUserId }),
    ).unwrap();
    dispatch(closeModalKickOutUserFromWishlist());
  };

  const handleCancel = (): void => {
    dispatch(closeModalKickOutUserFromWishlist());
  };

  if (!currentWishlist) {
    return <></>;
  }

  return (
    <section className={styles.container}>
      <Modal
        title="Подтверждение"
        open={isModalKickOutUserFromWishlistOpen}
        onOk={handleKickOutUser}
        onCancel={handleCancel}
        okText="Выгнать"
        okButtonProps={{ danger: true }}
        cancelText="Отмена"
      >
        <p>Вы действительно хотите выгнать этого пользователя? Это действие необратимо.</p>
      </Modal>

      <UserItem
        user={currentWishlist.owner}
        isOwner
        onClick={() => {
          dispatch(setCurrentUserWishListItems(currentWishlist.ownerId));
          dispatch(setCurrentSelectedUserOnWishlist(currentWishlist.owner.id));
        }}
      />

      {currentWishlist?.invitedUsers.map((user) => (
        <UserItem
          key={user.id}
          user={user}
          onClick={() => {
            dispatch(setCurrentUserWishListItems(user.id));
            dispatch(setCurrentSelectedUserOnWishlist(user.id));
          }}
          onDelete={
            currentUser && currentUser.id === currentWishlist.ownerId
              ? () => {
                  setKickOutUserId(user.id);
                  dispatch(showModalKickOutUserFromWishlist());
                }
              : undefined
          }
        />
      ))}
      {currentUser && currentUser.id === currentWishlist.ownerId && <InviteUserToWishListCard />}
    </section>
  );
}
