import AdminLayout from '../components/layouts/AdminLayout';
import { Spin } from 'antd';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserData } from '../hooks/useUserData';

const AdminRoutes = () => {
  const { isLoading, userInfo } = useUserData();

  const isAdmin = userInfo && userInfo.roleName?.toLowerCase() === "admin" ;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return isAdmin ? (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default AdminRoutes;
