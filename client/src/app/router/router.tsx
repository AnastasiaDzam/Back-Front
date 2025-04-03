import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from '@/shared/enums/routes';
import Layout from '../Layout/Layout';
import { HomePage, StartPage } from '@/pages';
import RouterErrorFallback from './RouterErrorFallback';
import AuthGuard from './AuthGuard';
import PublicGuard from './PublicGuard';

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Layout />,
    children: [
      {
        path: ROUTES.HOME,
        element: (
          <PublicGuard>
            <StartPage />
          </PublicGuard>
        ),
        errorElement: <RouterErrorFallback />,
      },
      {
        path: ROUTES.APP,
        element: (
          <AuthGuard>
            <HomePage />
          </AuthGuard>
        ),
        errorElement: <RouterErrorFallback />,
      },
      {
        path: '*',
        lazy: () =>
          import('@/pages').then((module) => ({
            Component: (props) => <module.Page404 {...props} />,
          })),
      },
    ],
  },
]);
