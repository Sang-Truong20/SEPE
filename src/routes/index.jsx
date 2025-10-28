import { Spin } from 'antd';
import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import LandingLayout from '../components/layouts/LandingLayout';
import { PATH_NAME } from '../constants';
import NotFound from '../pages/notfound';
import AdminRoutes from './AdminRoutes';
import MemberRoutes from './MemberRoutes';
import HackathonForm from '../pages/admin/hackathon/hackathon-form/index.jsx';
import HackathonDetail from '../pages/admin/hackathon/hackathon-detail/index.jsx';
import HackathonPhaseForm from '../pages/admin/hackathon-phases/hackathon-phase-form/index.jsx';
import HackathonPhaseDetail from '../pages/admin/hackathon-phases/hackathon-phase-detail/index.jsx';
import PrizeForm from '../pages/admin/prizes/prize-form/index.jsx';
import PrizeDetail from '../pages/admin/prizes/prize-detail/index.jsx';
import SeasonForm from '../pages/admin/season/season-form/index.jsx';
import SeasonDetail from '../pages/admin/season/season-detail/index.jsx';
import UserForm from '../pages/admin/users/user-form/index.jsx';
import StudentRoutes from './StudentRoutes';

const LandingPage = lazy(() => import('../pages/landing'));
const MemberPage = lazy(() => import('../pages/member'));
const AdminChallengeCreatePage = lazy(
  () => import('../pages/admin/challenge-create'),
);
const DashboardPage = lazy(() => import('../pages/admin/dashboard'));
const Hackathons = lazy(() => import('../pages/admin/hackathon'));
const HackathonPhases = lazy(() => import('../pages/admin/hackathon-phases'));
const Prizes = lazy(() => import('../pages/admin/prizes'));
const Seasons = lazy(() => import('../pages/admin/season'));
const Users = lazy(() => import('../pages/admin/users'));

const StudentDashboardPage = lazy(() => import('../pages/student/dashboard'));
const StudentHackathonsPage = lazy(() => import('../pages/student/hackathons'));
const StudentTeamsPage = lazy(() => import('../pages/student/teams'));
const StudentSubmissionsPage = lazy(
  () => import('../pages/student/submissions'),
);
const StudentProfilePage = lazy(() => import('../pages/student/profile'));
const StudentLeaderboardPage = lazy(
  () => import('../pages/student/leaderboard'),
);

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
        element: <LandingPage />,
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
            path: 'hackathons',
            children: [
              { index: true, element: withSuspense(Hackathons) },
              {
                path: 'create',
                element: withSuspense(() => <HackathonForm mode="create" />),
              },
              { path: ':id', element: withSuspense(HackathonDetail) },
              {
                path: 'edit/:id',
                element: withSuspense(() => <HackathonForm mode="edit" />),
              },
              {
                path: 'hackathon-phases',
                children: [
                  { index: true, element: withSuspense(HackathonPhases) },
                  {
                    path: 'create',
                    element: withSuspense(() => (
                      <HackathonPhaseForm mode="create" />
                    )),
                  },
                  { path: ':id', element: withSuspense(HackathonPhaseDetail) },
                  {
                    path: 'edit/:id',
                    element: withSuspense(() => (
                      <HackathonPhaseForm mode="edit" />
                    )),
                  },
                ],
              },
              {
                path: 'prizes',
                children: [
                  { index: true, element: withSuspense(Prizes) },
                  {
                    path: 'create',
                    element: withSuspense(() => <PrizeForm mode="create" />),
                  },
                  { path: ':id', element: withSuspense(PrizeDetail) },
                  {
                    path: 'edit/:id',
                    element: withSuspense(() => <PrizeForm mode="edit" />),
                  },
                ],
              },
            ],
          },
          {
            path: 'season',
            children: [
              { index: true, element: withSuspense(Seasons) },
              {
                path: 'create',
                element: withSuspense(() => <SeasonForm mode="create" />),
              },
              { path: ':id', element: withSuspense(SeasonDetail) },
              {
                path: 'edit/:id',
                element: withSuspense(() => <SeasonForm mode="edit" />),
              },
            ],
          },
          {
            path: 'users',
            children: [
              { index: true, element: withSuspense(Users) },
              { path: 'edit/:id', element: withSuspense(UserForm) },
            ],
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
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: 'dashboard', element: withSuspense(StudentDashboardPage) },
          { path: 'hackathons', element: withSuspense(StudentHackathonsPage) },
          { path: 'teams', element: withSuspense(StudentTeamsPage) },
          {
            path: 'submissions',
            element: withSuspense(StudentSubmissionsPage),
          },
          { path: 'profile', element: withSuspense(StudentProfilePage) },
          {
            path: 'leaderboard',
            element: withSuspense(StudentLeaderboardPage),
          },
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
