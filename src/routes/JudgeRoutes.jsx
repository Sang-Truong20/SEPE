import JudgeLayout from '../components/layouts/JudgeLayout.jsx';
import { Spin } from 'antd';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserData } from '../hooks/useUserData';

const JudgeRoutes = () => {
  const { isLoading, userInfo } = useUserData();

  const isJudge = userInfo && userInfo.roleName?.toLowerCase() === "judge";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return isJudge ? (
    <JudgeLayout>
      <Outlet />
    </JudgeLayout>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default JudgeRoutes;
