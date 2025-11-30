import { Spin } from 'antd';
import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import LandingLayout from '../components/layouts/LandingLayout';
import { PATH_NAME } from '../constants';
import NotFound from '../pages/notfound';
import AdminRoutes from './AdminRoutes';
import PartnerRoutes from './PartnerRoutes';
import MemberRoutes from './MemberRoutes';
import ChapterRoutes from './ChapterRoutes';
import MentorRoutes from './MentorRoutes';
import StudentRoutes from './StudentRoutes';
import HackathonForm from '../pages/admin/hackathon/form/index.jsx';
import HackathonDetail from '../pages/admin/hackathon/detail/index.jsx';
import HackathonPhaseForm from '../pages/admin/hackathon-phase/hackathon-phase-form';
import HackathonPhaseDetail from '../pages/admin/hackathon-phase/hackathon-phase-detail';
import PrizeForm from '../pages/admin/prizes/prize-form/index.jsx';
import PrizeDetail from '../pages/admin/prizes/prize-detail/index.jsx';
import SeasonForm from '../pages/admin/season/season-form/index.jsx';
import SeasonDetail from '../pages/admin/season/season-detail/index.jsx';
import UserForm from '../pages/admin/users/user-form/index.jsx';
import ChallengeDetail from '../pages/admin/challenge/detail/index.jsx';
import ChallengeForm from '../pages/admin/challenge/form/index.jsx';
import TeamDetail from '../pages/admin/team/detail/index.jsx';
import TrackForm from '../pages/admin/track/form/index.jsx';
import TrackDetail from '../pages/admin/track/detail/index.jsx';
import CriterionForm from '../pages/admin/criteria/form/index.jsx';
import CriterionDetail from '../pages/admin/criteria/detail/index.jsx';

const LandingPage = lazy(() => import('../pages/landing'));
const MemberPage = lazy(() => import('../pages/member'));
const DashboardPage = lazy(() => import('../pages/admin/dashboard'));
const Hackathons = lazy(() => import('../pages/admin/hackathon'));
const HackathonPhases = lazy(() => import('../pages/admin/hackathon-phase'));
const Challenges = lazy(() => import('../pages/admin/challenge/index.jsx'));
const Prizes = lazy(() => import('../pages/admin/prizes'));
const Seasons = lazy(() => import('../pages/admin/season'));
const Users = lazy(() => import('../pages/admin/users'));
const Teams = lazy(() => import('../pages/admin/team/index.jsx'));

const PChallenges = lazy(() => import('../pages/partner/challenge/index.jsx'));
const PHackathons = lazy(() => import('../pages/partner/hackathon'));
import PHackathonDetail from '../pages/partner/hackathon/detail/index.jsx';
import PChallengeDetail from '../pages/partner/challenge/detail/index.jsx';
import PChallengeForm from '../pages/partner/challenge/form/index.jsx';
import JudgeRoutes from './JudgeRoutes.jsx';

const StudentDashboardPage = lazy(() => import('../pages/student/dashboard'));
const StudentHackathonsPage = lazy(() => import('../pages/student/hackathons'));
const StudentHackathonDetailPage = lazy(() => import('../pages/student/hackathon-detail'));
const StudentTeamsPage = lazy(() => import('../pages/student/teams'));
const StudentMyTeamPage = lazy(() => import('../pages/student/my-team'));
const StudentSubmissionsPage = lazy(() => import('../pages/student/submissions'));
const StudentProfilePage = lazy(() => import('../pages/student/profile'));
const StudentLeaderboardPage = lazy(() => import('../pages/student/leaderboard'));
const StudentNotificationsPage = lazy(() => import('../pages/student/notifications'));
const StudentMentorRegistrationPage = lazy(() => import('../pages/student/mentor-registration'));

const ChapterDashboardPage = lazy(() => import('../pages/chapter/dashboard'));
const ChapterVerifyStudentsPage = lazy(() => import('../pages/chapter/verify-students'));
const ChapterMentorManagementPage = lazy(() => import('../pages/chapter/mentor-management'));
const ChapterTeamsPage = lazy(() => import('../pages/chapter/teams'));
const ChapterResultsPage = lazy(() => import('../pages/chapter/results'));
const ChapterTeamHackathonApprovalPage = lazy(() => import('../pages/chapter/team-hackathon-approval'));

const MentorDashboardPage = lazy(() => import('../pages/mentor/dashboard'));
const MentorHackathonsPage = lazy(() => import('../pages/mentor/hackathons'));
const MentorHackathonDetailPage = lazy(() => import('../pages/mentor/hackathon-detail'));
const MentorResourcesPage = lazy(() => import('../pages/mentor/resources'));

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
            path: 'challenges',
            children: [
              { index: true, element: withSuspense(Challenges) },
              { path: ':id', element: withSuspense(ChallengeDetail) },
              {
                path: 'edit/:id',
                element: withSuspense(() => <ChallengeForm mode="edit" />),
              },
              {
                path: 'create',
                element: withSuspense(() => <ChallengeForm mode="create" />),
              },
            ],
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
            path: 'tracks',
            children: [
              {
                path: 'create',
                element: withSuspense(() => <TrackForm mode="create" />),
              },
              { path: ':id', element: withSuspense(TrackDetail) },
              {
                path: 'edit/:id',
                element: withSuspense(() => <TrackForm mode="edit" />),
              },
            ],
          },
          {
            path: 'criterias',
            children: [
              {
                path: 'create',
                element: withSuspense(() => <CriterionForm mode="create" />),
              },
              { path: ':id', element: withSuspense(CriterionDetail) },
              {
                path: 'edit/:id',
                element: withSuspense(() => <CriterionForm mode="edit" />),
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
          {
            path: 'Team',
            children: [
              { index: true, element: withSuspense(Teams) },
              { path: ':id', element: withSuspense(TeamDetail) },
            ],
          },
        ],
      },
    ],
  },
  {
    element: <PartnerRoutes />,
    children: [
      {
        path: PATH_NAME.PARTNER,
        children: [
          {
            path: 'hackathons',
            children: [
              { index: true, element: withSuspense(PHackathons) },
              { path: ':id', element: withSuspense(PHackathonDetail) },
            ],
          },
          {
            path: 'challenges',
            children: [
              { index: true, element: withSuspense(PChallenges) },
              {
                path: ':id',
                element: withSuspense(PChallengeDetail),
              },
              {
                path: 'edit/:id',
                element: withSuspense(() => <PChallengeForm mode="edit" />),
              },
              {
                path: 'create',
                element: withSuspense(() => <PChallengeForm mode="create" />),
              },
            ],
          },
          // {
          //   path: 'hackathons/:hackathonId/scores',
          //   element: withSuspense(PartnerTeamScores),
          // },
        ],
      },
    ],
  },
  {
    element: <JudgeRoutes />,
    children: [
      {
        path: PATH_NAME.PARTNER,
        children: [
          {
            path: 'hackathons',
            children: [{ index: true, element: withSuspense(Hackathons) }],
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
          {
            path: 'hackathons/:id',
            element: withSuspense(StudentHackathonDetailPage),
          },
          {
            path: 'hackathons/:hackathonId/mentor-registration',
            element: withSuspense(StudentMentorRegistrationPage),
          },
          { path: 'teams', element: withSuspense(StudentTeamsPage) },
          { path: 'teams/:id', element: withSuspense(StudentMyTeamPage) },
          {
            path: 'submissions',
            element: withSuspense(StudentSubmissionsPage),
          },
          { path: 'profile', element: withSuspense(StudentProfilePage) },
          {
            path: 'leaderboard',
            element: withSuspense(StudentLeaderboardPage),
          },
          {
            path: 'notifications',
            element: withSuspense(StudentNotificationsPage),
          },
        ],
      },
    ],
  },
  {
    element: <ChapterRoutes />,
    children: [
      {
        path: PATH_NAME.CHAPTER,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: 'dashboard', element: withSuspense(ChapterDashboardPage) },
          { path: 'verify-students', element: withSuspense(ChapterVerifyStudentsPage) },
          { path: 'mentor-management', element: withSuspense(ChapterMentorManagementPage) },
          { path: 'teams', element: withSuspense(ChapterTeamsPage) },
          { path: 'results', element: withSuspense(ChapterResultsPage) },
          { path: 'team-hackathon-approval', element: withSuspense(ChapterTeamHackathonApprovalPage) },
        ],
      },
    ],
  },
  {
    element: <MentorRoutes />,
    children: [
      {
        path: PATH_NAME.MENTOR,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: 'dashboard', element: withSuspense(MentorDashboardPage) },
          { path: 'hackathons', element: withSuspense(MentorHackathonsPage) },
          {
            path: 'hackathons/:hackathonId',
            element: withSuspense(MentorHackathonDetailPage),
          },
          { path: 'resources', element: withSuspense(MentorResourcesPage) },
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
