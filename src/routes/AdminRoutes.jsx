import { Navigate } from 'react-router-dom';
import AdminLayout from '../components/layouts/AdminLayout';

const AdminRoutes = () => {
  const isAdmin = true;

  return isAdmin ? <AdminLayout /> : <Navigate to="/login" replace />;
};

export default AdminRoutes;
