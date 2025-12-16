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
import GroupDetail from '../pages/admin/group/group-detail/index.jsx';

const LandingPage = lazy(() => import('../pages/landing'));
const MemberPage = lazy(() => import('../pages/member'));
const Hackathons = lazy(() => import('../pages/admin/hackathon'));
const HackathonPhases = lazy(() => import('../pages/admin/hackathon-phase'));
const Challenges = lazy(() => import('../pages/admin/challenge/index.jsx'));
const Prizes = lazy(() => import('../pages/admin/prizes'));
const Rankings = lazy(() => import('../pages/admin/ranking'));
const Seasons = lazy(() => import('../pages/admin/season'));
const Appeals = lazy(() => import('../pages/admin/appeal'));
const Groups = lazy(() => import('../pages/admin/group'));
const Users = lazy(() => import('../pages/admin/users'));
const Teams = lazy(() => import('../pages/admin/team/index.jsx'));

const PChallenges = lazy(() => import('../pages/partner/challenge/index.jsx'));
const PHackathons = lazy(() => import('../pages/partner/hackathon'));
const PHackathonPhases = lazy(() => import('../pages/partner/hackathon-phase'));
import PHackathonDetail from '../pages/partner/hackathon/detail/index.jsx';
import PHackathonPhaseDetail from '../pages/partner/hackathon-phase/hackathon-phase-detail';
import PChallengeDetail from '../pages/partner/challenge/detail/index.jsx';
import PChallengeForm from '../pages/partner/challenge/form/index.jsx';
const PSHackathons = lazy(() => import('../pages/partner/score/hackathon'));
const PSHackathonPhases = lazy(() => import('../pages/partner/score/hackathon-phase'));
const PScore = lazy(() => import('../pages/partner/score'));
import PScoreDetail from '../pages/partner/score/detail/index.jsx';
const PPrizes = lazy(() => import('../pages/partner/prizes'));
import PPrizeDetail from '../pages/partner/prizes/prize-detail/index.jsx';

import JudgeRoutes from './JudgeRoutes.jsx';
const JHackathons = lazy(() => import('../pages/judge/hackathon'));
const JHackathonPhases = lazy(() => import('../pages/judge/hackathon-phase'));
const JHackathonDetail = lazy(() => import('../pages/judge/hackathon/detail/index.jsx'));
import JHackathonPhaseDetail from '../pages/judge/hackathon-phase/hackathon-phase-detail';
const JScore = lazy(() => import('../pages/judge/score'));
import JScoreDetail from '../pages/judge/score/detail/index.jsx';
import JChallengeDetail from '../pages/judge/challenge/detail/index.jsx';
const JScoringHistoryPage = lazy(() => import('../pages/judge/scoring-history/index.jsx'));

const StudentDashboardPage = lazy(() => import('../pages/student/dashboard'));
const StudentHackathonsPage = lazy(() => import('../pages/student/hackathons'));
const StudentHackathonDetailPage = lazy(() => import('../pages/student/hackathon-detail'));
const StudentTeamsPage = lazy(() => import('../pages/student/teams'));
const StudentMyTeamPage = lazy(() => import('../pages/student/my-team'));
const StudentProfilePage = lazy(() => import('../pages/student/profile'));
const StudentLeaderboardPage = lazy(() => import('../pages/student/leaderboard'));
const StudentNotificationsPage = lazy(() => import('../pages/student/notifications'));
const StudentMentorRegistrationPage = lazy(() => import('../pages/student/mentor-registration'));
const StudentPhaseDetailPage = lazy(() => import('../pages/student/phase-detail'));
const StudentTeamJoinSuccessPage = lazy(() => import('../pages/student/team-join-success'));

const ChapterDashboardPage = lazy(() => import('../pages/chapter/dashboard'));
const ChapterVerifyStudentsPage = lazy(() => import('../pages/chapter/verify-students'));
const ChapterMentorManagementPage = lazy(() => import('../pages/chapter/mentor-management'));
const ChapterTeamHackathonApprovalPage = lazy(() => import('../pages/chapter/team-hackathon-approval'));

const MentorDashboardPage = lazy(() => import('../pages/mentor/dashboard'));
const MentorNotificationsPage = lazy(() => import('../pages/mentor/notifications'));
const MentorProfilePage = lazy(() => import('../pages/mentor/profile'));
const MentorAssignmentsPage = lazy(() => import('../pages/mentor/assignments'));
const MentorGroupChatPage = lazy(() => import('../pages/mentor/group-chat'));

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
          {
            path: 'challenges',
            children: [
              { index: true, element: withSuspense(Challenges) },
              { path: ':id', element: withSuspense(ChallengeDetail) },
              {
                path: 'edit/:id',
                element: withSuspense(() => <ChallengeForm mode="edit"  />),
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
              {
                path: 'rankings',
                children: [
                  { index: true, element: withSuspense(Rankings) },
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
            path: 'groups',
            children: [
              { index: true, element: withSuspense(Groups) },
              { path: ':id', element: withSuspense(GroupDetail) },
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
            path: 'appeal',
            children: [
              { index: true, element: withSuspense(Appeals) },
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
              {
                path: 'hackathon-phases',
                children: [
                  { index: true, element: withSuspense(PHackathonPhases) },
                  { path: ':id', element: withSuspense(PHackathonPhaseDetail) },
                ],
              },
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
          {
            path: 'score',
            children: [
              { index: true, element: withSuspense(PScore) },
              {
                path:  'phase',
                element: withSuspense(PSHackathonPhases)
              },
              {
                path:  'hackathon',
                element: withSuspense(PSHackathons)
              },
              { path: ':id', element: withSuspense(PScoreDetail) },
            ],
          },
          {
            path: 'prizes',
            children: [
              { index: true, element: withSuspense(PPrizes) },
              { path: ':id', element: withSuspense(PPrizeDetail) },
            ],
          },
        ],
      },
    ],
  },
  {
    element: <JudgeRoutes />,
    children: [
      {
        path: PATH_NAME.JUDGE,
        children: [
          {
            path: 'hackathons',
            children: [
              { index: true, element: withSuspense(JHackathons) },
              { path: ':id', element: withSuspense(() => <JHackathonDetail />) },
            ],
          },
          {
            path: 'scoring-history',
            element: withSuspense(() => <JScoringHistoryPage />),
          },
          {
            path: 'score',
            children: [
              { index: true, element: withSuspense(JScore) },
              {
                path:  'phase',
                children: [
                  { index: true, element: withSuspense(JHackathonPhases) },
                  { path: ':id', element: withSuspense(JHackathonPhaseDetail) },
                ],
              },
              {
                path:  'hackathon',
                element: withSuspense(JHackathons)
              },
              { path: ':id', element: withSuspense(JScoreDetail) },
            ],
          },
          {
            path: 'challenges',
            children: [
              { path: ':id', element: withSuspense(JChallengeDetail) },
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
          {
            path: 'hackathons/:id',
            element: withSuspense(StudentHackathonDetailPage),
          },
          {
            path: 'hackathons/:hackathonId/mentor-registration',
            element: withSuspense(StudentMentorRegistrationPage),
          },
          {
            path: 'hackathons/:hackathonId/phases/:phaseId',
            element: withSuspense(StudentPhaseDetailPage),
          },
          { path: 'teams', element: withSuspense(StudentTeamsPage) },
          { path: 'teams/:id', element: withSuspense(StudentMyTeamPage) },
          { path: 'profile', element: withSuspense(StudentProfilePage) },
          {
            path: 'leaderboard',
            element: withSuspense(StudentLeaderboardPage),
          },
          {
            path: 'notifications',
            element: withSuspense(StudentNotificationsPage),
          },
          {
            path: 'team-join-success',
            element: withSuspense(StudentTeamJoinSuccessPage),
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
          { path: 'notifications', element: withSuspense(MentorNotificationsPage) },
          { path: 'profile', element: withSuspense(MentorProfilePage) },
          { path: 'assignments', element: withSuspense(MentorAssignmentsPage) },
          { path: 'group-chat', element: withSuspense(MentorGroupChatPage) },
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
