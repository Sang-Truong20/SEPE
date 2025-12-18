import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Alert, Button, Spin } from 'antd';
import axiosClient from '../../configs/axiosClient';
import { PATH_NAME } from '../../constants';
import { useUserData } from '../../hooks/useUserData';

const TeamInviteAcceptPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teamInfo, setTeamInfo] = useState(null);
  const { userInfo, isLoading: userLoading } = useUserData();

  const homeByRole = useMemo(() => {
    const role = userInfo?.roleName || userInfo?.role;
    if (!role) return PATH_NAME.HOME;
    const r = String(role).toLowerCase();
    if (r === 'admin') return PATH_NAME.ADMIN;
    if (r === 'partner') return PATH_NAME.PARTNER;
    if (r === 'judge') return PATH_NAME.JUDGE;
    if (r === 'member' || r === 'student') return PATH_NAME.STUDENT;
    if (r === 'mentor') return PATH_NAME.MENTOR;
    if (r === 'chapterleader' || r === 'chapter') return PATH_NAME.CHAPTER;
    return PATH_NAME.HOME;
  }, [userInfo]);

  useEffect(() => {
    if (!userLoading && !userInfo) {
      window.location.href = 'https://seal-fpt.vercel.app/';
      return;
    }
  }, [userInfo, userLoading]);

  useEffect(() => {
    const accept = async () => {
      if (userLoading || !userInfo) {
        return;
      }

      if (!code) {
        setError('Thiếu mã lời mời (code) trong đường dẫn');
        setLoading(false);
        return;
      }
      try {
        const res = await axiosClient.post(
          '/TeamInvitation/accept-link',
          null,
          { params: { code } },
        );
        const payload = res?.data;
        if (payload?.success && payload?.data) {
          setTeamInfo(payload.data);
          navigate(`${PATH_NAME.STUDENT_TEAMS}/${payload.data.teamId}`, { replace: true });
          return;
        }
        setError(payload?.message || 'Không thể tham gia đội.');
      } catch (err) {
        const msg = err?.response?.data?.message || 'Không thể tham gia đội. Vui lòng thử lại.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    accept();
  }, [code, navigate, userInfo, userLoading]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-white bg-black">
        <Spin size="large" />
        <div>Đang xử lý lời mời tham gia đội...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <div className="max-w-md w-full">
          <Alert
            message="Không thể tham gia đội"
            description={error}
            type="error"
            showIcon
            className="mb-4"
          />
          <Button block type="primary" onClick={() => navigate(homeByRole)}>
            Về trang đội của tôi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="max-w-md w-full space-y-4 text-center">
        <div className="text-2xl font-semibold">Bạn đã tham gia đội thành công</div>
        <div className="text-gray-300">
          {teamInfo?.teamName ? `Đội: ${teamInfo.teamName}` : 'Chào mừng bạn vào đội mới.'}
        </div>
        <Button
          type="primary"
          block
          onClick={() =>
            navigate(
              teamInfo?.teamId ? `${PATH_NAME.STUDENT_TEAMS}/${teamInfo.teamId}` : homeByRole,
            )
          }
        >
          Đi tới đội
        </Button>
      </div>
    </div>
  );
};

export default TeamInviteAcceptPage;

