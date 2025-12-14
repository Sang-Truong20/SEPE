import { ArrowRightOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../../constants';

const TeamJoinSuccess = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(PATH_NAME.STUDENT_TEAMS);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleGoToTeams = () => {
    navigate(PATH_NAME.STUDENT_TEAMS);
  };

  const progressPercentage = ((5 - countdown) / 5) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* Success Icon with Animation */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/30 rounded-full blur-2xl animate-ping"></div>
            <div className="relative w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-400 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <CheckCircleOutlined className="text-white text-6xl" />
            </div>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
          <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Tham gia team
          </span>
          <br />
          <span className="text-white">thành công!</span>
        </h1>

        <p className="text-xl text-gray-300 mb-8 max-w-lg mx-auto leading-relaxed">
          Bạn đã join vào team thành công. Bạn sẽ được chuyển đến trang Teams trong{' '}
          <span className="text-green-400 font-bold text-2xl">{countdown}</span> giây.
        </p>

        {/* Progress Bar */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Team Icon */}
        

        {/* Action Button */}
        <Button
          type="primary"
          size="large"
          onClick={handleGoToTeams}
          icon={<ArrowRightOutlined />}
          className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 border-0 h-14 px-8 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          Đi đến trang Teams ngay
        </Button>

       
      </div>
    </div>
  );
};

export default TeamJoinSuccess;

