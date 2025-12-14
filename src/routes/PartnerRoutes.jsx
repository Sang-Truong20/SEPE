// src/routes/PartnerRoutes.jsx
import PartnerLayout from '../components/layouts/PartnerLayout';
import { Spin } from 'antd';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUserData } from '../hooks/useUserData';
import { PATH_NAME } from '../constants';

const PartnerRoutes = () => {
  const { isLoading, userInfo } = useUserData();
  const location = useLocation();

  const isPartner = userInfo && userInfo.roleName?.toLowerCase() === "partner";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  // Redirect to hackathons page if navigating to /partner directly
  if (isPartner && location.pathname === PATH_NAME.PARTNER) {
    return <Navigate to={`${PATH_NAME.PARTNER}/hackathons`} replace />;
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