import { Spin } from 'antd';
import { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import LandingLayout from '../components/layouts/LandingLayout';
import { PATH_NAME } from '../constants';
import AuthPage from '../pages/auth';
import NotFound from '../pages/notfound';
import AdminRoutes from './AdminRoutes';
import GuestRoute from './GuestRoute';
import MemberRoutes from './MemberRoutes';

const LandingPage = lazy(() => import('../pages/landing'));
const MemberPage = lazy(() => import('../pages/member'));
const AdminPage = lazy(() => import('../pages/admin'));
const AdminChallengeCreatePage = lazy(() => import('../pages/admin/challenge-create'));

const withSuspense = (Component) => (
  <Suspense
    fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    }
  >
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    element: (
      <LandingLayout>
        <Outlet />
      </LandingLayout>
    ),
    children: [
      {
        path: PATH_NAME.HOME,
        element: withSuspense(LandingPage),
      },
      {
        element: <MemberRoutes />,
        children: [
          {
            path: PATH_NAME.MEMBER,
            element: withSuspense(MemberPage),
            children: [],
          },
        ],
      },
    ],
  },
  {
    element: <GuestRoute />,
    children: [
      {
        path: PATH_NAME.AUTH,
        element: <AuthPage />,
      },
    ],
  },

  {
    element: <AdminRoutes />,
    children: [
      {
        path: PATH_NAME.ADMIN,
        element: withSuspense(AdminPage),
      },
      {
        path: PATH_NAME.ADMIN_CHALLENGE_CREATE,
        element: withSuspense(AdminChallengeCreatePage),
      },
    ],
  },

  {
    path: PATH_NAME.NOT_FOUND,
    element: <NotFound />,
  },
]);

export default router;
