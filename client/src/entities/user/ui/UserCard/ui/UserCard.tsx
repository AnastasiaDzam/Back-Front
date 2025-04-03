import styles from './UserCard.module.css';
import React from 'react';
import { Avatar, Tooltip } from 'antd';
import type { CatType } from '@/entities/user/model';
import { UserTooltipContent } from '../../UserTooltipContent';
import { useIsUserOnline } from '@/entities/user/hooks/useIsUserOnline';

type Props = {
  user: CatType;
};

export function UserCard({ user }: Props): React.JSX.Element {
  const isOnline = useIsUserOnline(user.id);

  return (
    <div className={`${styles.container} ${isOnline ? styles.online : ''}`}>
      <Tooltip
        title={
          <UserTooltipContent
            firstName={user.firstName}
            lastName={user.lastName}
            email={user.email}
          />
        }
      >
        <Avatar
          size={64}
          src={`${import.meta.env.VITE_IMAGES}/${user.avatarSrc}`}
          alt={`${user.firstName}'s avatar`}
        />
      </Tooltip>
    </div>
  );
}
