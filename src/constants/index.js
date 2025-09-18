const PATH_NAME = {
  HOME: '/',
  AUTH: '/auth',
  POST: '/post',
  POST_DETAIL: '/post/:id',
  NOT_FOUND: '*',
  MEMBER: '/member',
  ADMIN: '/admin',
};

const NAV_ELEMENTS = [
  {
    name: 'TRANG CHỦ',
    path: '/',
  },
  {
    name: 'BÀI VIẾT',
    path: '#',
  },
  {
    name: 'TRỢ LÝ ẢO',
    path: '#',
  },
  {
    name: 'VỀ CHÚNG TÔI',
    path: '/contact',
  },
];

export { PATH_NAME, NAV_ELEMENTS };
