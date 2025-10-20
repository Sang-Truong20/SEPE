import StudentLayout from '../components/layouts/StudentLayout';
import { Spin } from 'antd';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserData } from '../hooks/useUserData';

const StudentRoutes = () => {
  const { isLoading,  } = useUserData();

  const isStudent = true; 

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return isStudent ? (
    <StudentLayout>
      <Outlet />
    </StudentLayout>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default StudentRoutes;
