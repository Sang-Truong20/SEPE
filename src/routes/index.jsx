import { Spin } from 'antd';
import { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import LandingLayout from '../components/layouts/LandingLayout';
import { PATH_NAME } from '../constants';
import NotFound from '../pages/notfound';
import AdminRoutes from './AdminRoutes';
import MemberRoutes from './MemberRoutes';
import StudentRoutes from './StudentRoutes';

const LandingPage = lazy(() => import('../pages/landing'));
const MemberPage = lazy(() => import('../pages/member'));
const AdminChallengeCreatePage = lazy(
  () => import('../pages/admin/challenge-create'),
);
const DashboardPage = lazy(() => import('../pages/admin/dashboard'));
const HackathonCreatePage = lazy(() => import('../pages/admin/hackathon'));

const StudentDashboardPage = lazy(() => import('../pages/student/dashboard'));
const StudentHackathonsPage = lazy(() => import('../pages/student/hackathons'));
const StudentTeamsPage = lazy(() => import('../pages/student/teams'));
const StudentSubmissionsPage = lazy(() => import('../pages/student/submissions'));
const StudentProfilePage = lazy(() => import('../pages/student/profile'));
const StudentLeaderboardPage = lazy(() => import('../pages/student/leaderboard'));

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
    element: <AdminRoutes />,
    children: [
      {
        path: PATH_NAME.ADMIN,
        children: [
          { path: 'dashboard', element: withSuspense(DashboardPage) },
          {
            path: 'challenge/create',
            element: withSuspense(AdminChallengeCreatePage),
          },
          {
            path: 'hackathon/create',
            element: withSuspense(HackathonCreatePage),
          },
        ],
      },
    ],
  },
  {
    element: <StudentRoutes />,
    children: [
      {
        path: PATH_NAME.STUDENT,
        children: [
          { path: 'dashboard', element: withSuspense(StudentDashboardPage) },
          { path: 'hackathons', element: withSuspense(StudentHackathonsPage) },
          { path: 'teams', element: withSuspense(StudentTeamsPage) },
          { path: 'submissions', element: withSuspense(StudentSubmissionsPage) },
          { path: 'profile', element: withSuspense(StudentProfilePage) },
          { path: 'leaderboard', element: withSuspense(StudentLeaderboardPage) },
        ],
      },
    ],
  },

  {
    path: PATH_NAME.NOT_FOUND,
    element: <NotFound />,
  },
]);

export default router;
