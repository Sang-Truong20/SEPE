import { Navigate, Outlet } from 'react-router-dom';

const AdminRoutes = () => {
  const isAdmin = true;

  return isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoutes;
