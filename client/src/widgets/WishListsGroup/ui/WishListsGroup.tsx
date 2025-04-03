import styles from './WishListsGroup.module.css';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/reduxHooks';
import {
  deleteWishListByIdThunk,
  getAllUserWishListsThunk,
  setCurrentWishlist,
  WishListCard,
} from '@/entities/wishlist';
import { CreateWishListCard } from '@/widgets/CreateWishListCard';
import {
  closeModalDeleteWishlist,
  showModalDeleteWishlist,
  showModalUpdateWishlist,
} from '@/shared/model/slices/modalSlice';
import { Modal } from 'antd';
import { PlaceholderCard } from './PlaceholderCard';
import { setCurrentSelectedUserOnWishlist } from '@/entities/user';

export function WishListsGroup(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { wishlists } = useAppSelector((state) => state.wishlist);
  const { user } = useAppSelector((state) => state.user);
  const { isModalDeleteWishlistOpen } = useAppSelector((state) => state.modals);
  const [deletingWishListId, setDeletingWishListId] = useState<number | null>(null);

  const extendedWishlists = wishlists.map((el) =>
    el.ownerId === user?.id ? { ...el, isOwned: true } : { ...el, isOwned: false },
  );

  const handleDeleteWishList = async (): Promise<void> => {
    if (!deletingWishListId) return;
    await dispatch(deleteWishListByIdThunk(deletingWishListId)).unwrap();
    dispatch(closeModalDeleteWishlist());
  };

  const handleUpdateWishList = (id: number): void => {
    dispatch(setCurrentWishlist(id));
    dispatch(showModalUpdateWishlist());
  };

  const handleCancel = (): void => {
    dispatch(closeModalDeleteWishlist());
  };

  useEffect(() => {
    void dispatch(getAllUserWishListsThunk()).unwrap();
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <Modal
        title="Подтверждение удаления"
        open={isModalDeleteWishlistOpen}
        onOk={handleDeleteWishList}
        onCancel={handleCancel}
        okText="Удалить"
        okButtonProps={{ danger: true }}
        cancelText="Отмена"
      >
        <p>Вы действительно хотите удалить этот вишлист? Это действие необратимо.</p>
      </Modal>

      <CreateWishListCard />
      {extendedWishlists.length > 0 ? (
        extendedWishlists.map((el) => (
          <WishListCard
            key={el.id}
            wishlist={el}
            isOwned={el.isOwned}
            onDelete={
              el.isOwned
                ? () => {
                    setDeletingWishListId(el.id);
                    dispatch(showModalDeleteWishlist());
                  }
                : undefined
            }
            onUpdate={el.isOwned ? () => handleUpdateWishList(el.id) : undefined}
            onClick={() => {
              dispatch(setCurrentWishlist(el.id));
              dispatch(setCurrentSelectedUserOnWishlist(el.ownerId));
            }}
          />
        ))
      ) : (
        <PlaceholderCard />
      )}
    </div>
  );
}
