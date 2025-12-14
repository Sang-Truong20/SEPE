import JudgeLayout from '../components/layouts/JudgeLayout.jsx';
import { Spin } from 'antd';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUserData } from '../hooks/useUserData';
import { PATH_NAME } from '../constants';

const JudgeRoutes = () => {
  const { isLoading, userInfo } = useUserData();
  const location = useLocation();

  const isJudge = userInfo && userInfo.roleName?.toLowerCase() === "judge";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  // Redirect to score page if navigating to /judge directly
  if (isJudge && location.pathname === PATH_NAME.JUDGE) {
    return <Navigate to={`${PATH_NAME.JUDGE}/score`} replace />;
  }

  return isJudge ? (
    <JudgeLayout>
      <Outlet />
    </JudgeLayout>
  ) : (
    <Navigate to="/" replace />
  );
};

export default JudgeRoutes;
