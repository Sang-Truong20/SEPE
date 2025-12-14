import MentorLayout from '../components/layouts/MentorLayout';
import { Spin } from 'antd';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserData } from '../hooks/useUserData';

const MentorRoutes = () => {
  const { isLoading, userInfo } = useUserData();

  const isMentor = userInfo && userInfo.roleName?.toLowerCase() === "mentor";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return isMentor ? (
    <MentorLayout>
      <Outlet />
    </MentorLayout>
  ) : (
    <Navigate to="/" replace />
  );
};

export default MentorRoutes;





