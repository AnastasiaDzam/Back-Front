import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/reduxHooks';
import { inviteUserToWishListThunk, kickOutUserToWishListThunk } from '@/entities/wishlist';
import { Select } from 'antd';
import { unwrapResult } from '@reduxjs/toolkit';

export function InviteUserToWishlistForm(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { loading, currentWishlist } = useAppSelector((state) => state.wishlist);
  const { users } = useAppSelector((state) => state.user);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

  useEffect(() => {
    if (currentWishlist?.invitedUsers) {
      setSelectedUserIds(currentWishlist.invitedUsers.map((user) => user.id));
    }
  }, [currentWishlist]);

  const handleSelectChange = async (newSelectedUserIds: number[]): Promise<void> => {
    if (!currentWishlist) return;

    const usersToInvite = newSelectedUserIds.filter((id) => !selectedUserIds.includes(id));
    const usersToKickOut = selectedUserIds.filter((id) => !newSelectedUserIds.includes(id));

    try {
      await Promise.all(
        usersToInvite.map(async (userId) => {
          const resultAction = await dispatch(
            inviteUserToWishListThunk({ id: currentWishlist.id, userId }),
          );
          unwrapResult(resultAction);
        }),
      );

      await Promise.all(
        usersToKickOut.map(async (userId) => {
          const resultAction = await dispatch(
            kickOutUserToWishListThunk({ id: currentWishlist.id, userId }),
          );
          unwrapResult(resultAction);
        }),
      );

      setSelectedUserIds(newSelectedUserIds);
    } catch (error) {
      console.error('Error while modifying invite list:', error);
    }
  };

  return (
    <Select
      style={{ width: '100%' }}
      mode="multiple"
      placeholder="Выберите пользователей"
      value={selectedUserIds}
      onChange={handleSelectChange}
      loading={loading}
      options={users.map((user) => ({
        label: user.email,
        value: user.id,
      }))}
    />
  );
}
