import {
  TrophyOutlined,
  CheckCircleOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import Login from './login';
import Register from './register';

function AuthPage() {
  const [isLoginForm, setIsLoginForm] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-700 to-green-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 border-8 border-white rounded-full -translate-x-20 -translate-y-20" />
          <div className="absolute bottom-0 right-0 w-60 h-60 border-8 border-white rounded-full translate-x-20 translate-y-20" />
        </div>

        <div className="flex flex-col justify-center px-16 relative z-10">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                <TrophyOutlined className="text-3xl !text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">SEAL</h1>
                <p className="text-green-200">
                  Software Engineering Agile League
                </p>
              </div>
            </div>

            <h2 className="text-4xl font-bold text-white mb-6">
              Nền tảng Quản lý Cuộc thi Hackathon SEAL
            </h2>
            <p className="text-green-100 text-lg mb-12">
              Hệ thống quản lý toàn diện cho các sự kiện hackathon của Khoa SE
              tại Đại học FPT TP.HCM
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircleOutlined className="text-2xl !text-white" />
              <span className="text-white text-lg">
                Quản lý đăng ký và phân chia đội thi
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircleOutlined className="text-2xl !text-white" />
              <span className="text-white text-lg">
                Hệ thống chấm điểm và xếp hạng tự động
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircleOutlined className="text-2xl !text-white" />
              <span className="text-white text-lg">
                Quản lý mentor và đánh giá dự án
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircleOutlined className="text-2xl !text-white" />
              <span className="text-white text-lg">
                Theo dõi tiến độ và phân phối giải thưởng
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-16">
            <div>
              <p className="text-4xl font-bold text-white">3</p>
              <p className="text-green-200">Hackathons/Năm</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">100+</p>
              <p className="text-green-200">Dự án</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">500+</p>
              <p className="text-green-200">Sinh viên</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <TrophyOutlined className="text-2xl !text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">SEAL</h1>
            </div>
          </div>

          {isLoginForm ? (
            <Login onSwitchToLogin={() => setIsLoginForm(false)} />
          ) : (
            <Register onSwitchToLogin={() => setIsLoginForm(true)} />
          )}

          <div className="text-center mt-6 text-sm text-gray-500">
            <p>
              © 2025 SEAL. Hệ thống Quản lý Hackathon SE Department - FPT
              University.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
