import ChapterLayout from '../components/layouts/ChapterLayout';
import { Spin } from 'antd';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserData } from '../hooks/useUserData';

const ChapterRoutes = () => {
  const { isLoading, userInfo } = useUserData();

  const isChapter = userInfo && userInfo.roleName?.toLowerCase() === "chapter";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return isChapter ? (
    <ChapterLayout>
      <Outlet />
    </ChapterLayout>
  ) : (
    <Navigate to="/" replace />
  );
};

export default ChapterRoutes;

