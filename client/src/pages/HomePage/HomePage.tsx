import React, { Suspense } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/reduxHooks';
import {
  closeModalCreateWishlist,
  closeModalUpdateWishlist,
} from '@/shared/model/slices/modalSlice';
import { Modal } from 'antd';
import { CreateWishListForm } from '@/widgets/CreateWishlistForm';
import { UpdateWishlistForm } from '@/widgets/UpdateWishlistForm';
import { Loader } from '@/shared/ui/Loader';
import { WishList } from '@/widgets/WishList';
import { Divider } from '@/shared/ui/Divider';

const WishListsGroup = React.lazy(() => import('@/widgets/WishListsGroup'));

export function HomePage(): React.JSX.Element {
  const { isModalCreateWishlistOpen, isModalUpdateWishlistOpen } = useAppSelector(
    (state) => state.modals,
  );
  const dispatch = useAppDispatch();
  return (
    <>
      <Suspense fallback={<Loader loading={true} />}>
        <WishListsGroup />
        <Divider margin={20} />
        <WishList />
      </Suspense>
      <Modal
        title="Создать новый вишлист"
        open={isModalCreateWishlistOpen}
        footer={null}
        onCancel={() => dispatch(closeModalCreateWishlist())}
      >
        <CreateWishListForm />
      </Modal>
      <Modal
        title="Изменить вишлист"
        open={isModalUpdateWishlistOpen}
        footer={null}
        onCancel={() => dispatch(closeModalUpdateWishlist())}
      >
        <UpdateWishlistForm />
      </Modal>
    </>
  );
}
