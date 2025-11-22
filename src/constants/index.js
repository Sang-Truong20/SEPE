const PATH_NAME = {
  HOME: '/',
  AUTH: '/auth',
  NOT_FOUND: '*',
  MEMBER: '/member',
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_SEASON: '/admin/season',
  ADMIN_TEAMS: '/admin/team',
  ADMIN_HACKATHONS: '/admin/hackathons',
  ADMIN_HACKATHON_PHASES: '/admin/hackathons/hackathon-phases',
  ADMIN_PRIZES: '/admin/hackathons/prizes',
  ADMIN_CHALLENGES: '/admin/challenges',
  ADMIN_TRACKS: '/admin/tracks',
  ADMIN_CRITERIAS: '/admin/criterias',
  PARTNER: '/partner',
  PARTNER_HACKATHONS: '/partner/hackathons',
  PARTNER_CHALLENGES: '/partner/challenges',
  PARTNER_TEAM_SCORES: '/partner/score/',
};

const GROUP = {
  [PATH_NAME.ADMIN_HACKATHON_PHASES]: [
    PATH_NAME.ADMIN_TRACKS,
    PATH_NAME.ADMIN_CRITERIAS,
  ],
};

export { PATH_NAME, GROUP };
