import StudentLayout from '../components/layouts/StudentLayout';
import { Spin } from 'antd';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserData } from '../hooks/useUserData';

const StudentRoutes = () => {
  const { isLoading, userInfo } = useUserData();

  const isStudent = userInfo && (userInfo.roleName?.toLowerCase() === "member" || userInfo.roleId === 1 || userInfo.role === 1); 

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
    <Navigate to="/" replace />
  );
};

export default StudentRoutes;

