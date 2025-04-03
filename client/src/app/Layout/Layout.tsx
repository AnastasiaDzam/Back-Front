import styles from './Layout.module.css';
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppDispatch } from '@/shared/hooks/reduxHooks';
import Navbar from '@/widgets/Navbar';
import { getAllUsersThunk, refreshTokensThunk } from '@/entities/user';
import { Sidebar } from '@/widgets/SideBar';
import { DynamicTitle } from '@/features/DynamicTitle';

export default function Layout(): React.JSX.Element {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(refreshTokensThunk()).unwrap();
    void dispatch(getAllUsersThunk());
  }, [dispatch]);

  return (
    <>
      <DynamicTitle />
      <Navbar />
      <Sidebar />
      <main className={styles.root}>
        <Outlet />
      </main>
    </>
  );
}
