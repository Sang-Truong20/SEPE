const PATH_NAME = {
  HOME: '/',
  AUTH: '/auth',
  NOT_FOUND: '*',
  MEMBER: '/member',
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_SEASON: '/admin/season',
  ADMIN_TEAMS: '/admin/team',
  ADMIN_GROUPS: '/admin/groups',
  ADMIN_APPEALS: '/admin/appeal',
  ADMIN_HACKATHONS: '/admin/hackathons',
  ADMIN_HACKATHON_PHASES: '/admin/hackathons/hackathon-phases',
  ADMIN_PRIZES: '/admin/hackathons/prizes',
  ADMIN_RANKINGS: '/admin/hackathons/rankings',
  ADMIN_CHALLENGES: '/admin/challenges',
  ADMIN_TRACKS: '/admin/tracks',
  ADMIN_CRITERIAS: '/admin/criterias',
  ADMIN_FILES: '/admin/files',
  ADMIN_SETTINGS: '/admin/settings',
  PARTNER: '/partner',
  PARTNER_HACKATHONS: '/partner/hackathons',
  PARTNER_HACKATHON_PHASES: '/partner/hackathons/hackathon-phases',
  PARTNER_CHALLENGES: '/partner/challenges',
  PARTNER_TEAM_SCORES: '/partner/score',
  JUDGE: '/judge',
  JUDGE_TEAM_SCORES: '/judge/score',
  JUDGE_CHALLENGES: '/judge/challenges',
  JUDGE_HACKATHON_PHASES: '/judge/score/phase',
};

const GROUP = {
  [PATH_NAME.ADMIN_HACKATHON_PHASES]: [
    PATH_NAME.ADMIN_TRACKS,
    PATH_NAME.ADMIN_CRITERIAS,
  ],
};

export { PATH_NAME, GROUP };
