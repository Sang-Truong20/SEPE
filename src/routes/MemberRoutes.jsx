import { Navigate, Outlet } from 'react-router-dom';
import { PATH_NAME } from '../constants';
import { useUserData } from '../hooks/useUserData';
import { Spin } from 'antd';

const MemberRoutes = () => {
  const { isLoading, userInfo } = useUserData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  const isMember = userInfo && userInfo.roleId === 1;

  return isMember ? <Outlet /> : <Navigate to={PATH_NAME.NOT_FOUND} replace />;
};

export default MemberRoutes;
