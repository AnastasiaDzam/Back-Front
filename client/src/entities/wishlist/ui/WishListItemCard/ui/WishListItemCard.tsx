import styles from './WishListItemCard.module.css';
import type { WishlistItemType } from '@/entities/wishlist/model';
import React from 'react';
import { PriorityWidget } from '../../PriorityWidget';
import { LinksWidget } from '../../LinksWidget';
import { Slider } from '@/shared/ui/Slider';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/reduxHooks';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import {
  closeModalDeleteWishListItem,
  closeModalUpdateWishListItem,
  showModalDeleteWishListItem,
  showModalUpdateWishListItem,
} from '@/shared/model/slices/modalSlice';
import { deleteWishListItemByIdThunk } from '@/entities/wishlist/api';
import { UpdateWishListItemForm } from '@/widgets/UpdateWishListItemForm';

type Props = {
  wishListItem: WishlistItemType;
};

export function WishListItemCard({ wishListItem }: Props): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { id, title, priority, description, images, minPrice, maxPrice, links, authorId } =
    wishListItem;
  const { user } = useAppSelector((state) => state.user);
  const { isModalDeleteWishListItemOpen, isModalUpdateWishListItemOpen } = useAppSelector(
    (state) => state.modals,
  );

  const handleCancel = (): void => {
    dispatch(closeModalDeleteWishListItem());
    dispatch(closeModalUpdateWishListItem());
  };

  const handleDeleteWishListItem = async (): Promise<void> => {
    if (authorId !== user?.id) return;

    await dispatch(deleteWishListItemByIdThunk(id)).unwrap();

    dispatch(closeModalDeleteWishListItem());
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        <Slider images={images} />
      </div>
      <div className={styles.container}>
        <div className={styles.point}>
          <span>Название:</span>
          <span className={styles.title}>{title}</span>
        </div>

        <PriorityWidget priority={priority} />

        <div className={styles.point}>
          <span>Описание:</span>
          <span
            dangerouslySetInnerHTML={{
              __html: description,
            }}
          />
        </div>

        <div className={styles.point}>
          <span>Диапазон цен:</span>
          <span>
            {minPrice}р - {maxPrice}р
          </span>
        </div>

        <LinksWidget links={links} />

        {authorId === user?.id && (
          <>
            <Button
              type="primary"
              onClick={() => {
                dispatch(showModalUpdateWishListItem());
              }}
              icon={<EditOutlined />}
            />
            <Button
              type="primary"
              danger
              onClick={() => {
                dispatch(showModalDeleteWishListItem());
              }}
              icon={<DeleteOutlined />}
            />
          </>
        )}
      </div>

      <Modal
        title="Подтверждение"
        open={isModalDeleteWishListItemOpen}
        onOk={handleDeleteWishListItem}
        onCancel={handleCancel}
        okText="Удалить"
        okButtonProps={{ danger: true }}
        cancelText="Отмена"
      >
        <p>Вы действительно хотите удалить это желание? Это действие необратимо.</p>
      </Modal>

      <Modal
        title="Изменить желание"
        open={isModalUpdateWishListItemOpen}
        footer={null}
        onCancel={() => dispatch(closeModalUpdateWishListItem())}
      >
        <UpdateWishListItemForm wishListItem={wishListItem} />
      </Modal>
    </div>
  );
}
