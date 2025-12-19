import AdminLayout from '../components/layouts/AdminLayout';
import { Spin } from 'antd';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUserData } from '../hooks/useUserData';
import { PATH_NAME } from '../constants';

const AdminRoutes = () => {
  const { isLoading, userInfo } = useUserData();
  const location = useLocation();

  const isAdmin = userInfo && userInfo.roleName?.toLowerCase() === "admin" ;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  // Redirect to hackathons if navigating to /admin directly
  if (isAdmin && location.pathname === PATH_NAME.ADMIN) {
    return <Navigate to={`${PATH_NAME.ADMIN_DASHBOARD}`} replace />;
  }

  return isAdmin ? (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  ) : (
    <Navigate to="/" replace />
  );
};

export default AdminRoutes;
