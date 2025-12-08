// src/routes/PartnerRoutes.jsx
import PartnerLayout from '../components/layouts/PartnerLayout';
import { Spin } from 'antd';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserData } from '../hooks/useUserData';

const PartnerRoutes = () => {
  const { isLoading, userInfo } = useUserData();

  const isPartner = userInfo && userInfo.roleName?.toLowerCase() === "partner";

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
    <Navigate to="/" replace />
  );
};

export default PartnerRoutes;