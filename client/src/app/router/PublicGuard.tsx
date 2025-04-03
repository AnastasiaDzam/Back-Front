import { ROUTES } from '@/shared/enums/routes';
import { useAppSelector } from '@/shared/hooks/reduxHooks';
import { Loader } from '@/shared/ui/Loader';
import React, { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function PublicGuard({ children }: { children: ReactNode }): React.JSX.Element {
  const user = useAppSelector((state) => state.user.user);
  const isInitialized = useAppSelector((state) => state.user.isInitialized);
  const location = useLocation();

  if (!isInitialized) {
    return <Loader loading={true} />;
  }

  if (user) {
    return <Navigate to={ROUTES.APP} state={{ from: location }} replace />;
  }
  return <>{children}</>;
}
