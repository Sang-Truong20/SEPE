import ChapterLayout from '../components/layouts/ChapterLayout';
import { Spin } from 'antd';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserData } from '../hooks/useUserData';

const ChapterRoutes = () => {
  const { isLoading } = useUserData();

  // Mock: Set to true for chapter role
  const isChapter = true;

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
    <Navigate to="/login" replace />
  );
};

export default ChapterRoutes;

