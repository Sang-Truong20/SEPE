// src/routes/PartnerRoutes.jsx
import PartnerLayout from '../components/layouts/PartnerLayout';
import { Spin } from 'antd';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserData } from '../hooks/useUserData';

const PartnerRoutes = () => {
  const { isLoading, userInfo } = useUserData();

  // Giả lập: role 2 = Partner
  // const isPartner = userInfo && userInfo.role === 2;
  const isPartner = true;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return isPartner ? (
    <PartnerLayout>
      <Outlet />
    </PartnerLayout>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PartnerRoutes;