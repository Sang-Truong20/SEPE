import MentorLayout from '../components/layouts/MentorLayout';
import { Spin } from 'antd';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserData } from '../hooks/useUserData';

const MentorRoutes = () => {
  const { isLoading } = useUserData();

  const isMentor = true; // Mock: set to true for now

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
    <Navigate to="/login" replace />
  );
};

export default MentorRoutes;




