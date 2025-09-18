import React from 'react';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative mx-auto w-full max-w-screen-xl">
        <div className="grid grid-cols-1 gap-8 px-6 py-12 md:grid-cols-2 lg:grid-cols-5 lg:py-16">
          <div className="lg:col-span-2 flex flex-col items-start space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-all duration-300">
                <span className="text-white font-bold text-2xl">L</span>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                  LawTraffic
                </span>
                <p className="text-blue-200 text-sm mt-1">
                  Tư vấn luật giao thông - Cập nhật văn bản pháp lý mới nhất
                </p>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed max-w-md">
              Chúng tôi cung cấp nền tảng tư vấn và chia sẻ kiến thức pháp luật
              giao thông toàn diện, giúp người dân hiểu rõ quyền và nghĩa vụ của
              mình trong tham gia giao thông.
            </p>

            <div className="flex space-x-4">
              {[
                {
                  icon: 'M18.896 0H1.104C.494 0 0 .493 0 1.104v17.792C0 19.507.494 20 1.104 20H10V12.307H7.539V9.231H10V7.021c0-2.454 1.496-3.792 3.678-3.792 1.044 0 1.942.078 2.202.113v2.553h-1.511c-1.185 0-1.414.563-1.414 1.39v1.825h2.828l-.369 3.076H13.955V20h4.941c.61 0 1.104-.493 1.104-1.104V1.104C20 .493 19.506 0 18.896 0Z',
                  label: 'Facebook',
                },
                {
                  icon: 'M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z',
                  label: 'Twitter',
                },
                {
                  icon: 'M16.942 1.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.585 11.585 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129 1.3A17.392 17.392 0 0 0 .182 13.218a15.785 15.785 0 0 0 4.963 2.521c.41-.564.773-1.16 1.084-1.785a10.63 10.63 0 0 1-1.706-.83c.143-.106.283-.217.418-.33a11.664 11.664 0 0 0 10.118 0c.137.113.277.224.418.33-.544.328-1.116.606-1.71.832a12.52 12.52 0 0 0 1.084 1.785 16.46 16.46 0 0 0 5.064-2.595 17.286 17.286 0 0 0-2.973-11.59ZM6.678 10.813a1.941 1.941 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.919 1.919 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Zm6.644 0a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.918 1.918 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Z',
                  label: 'Discord',
                },
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-blue-500/20 hover:scale-110 transition-all duration-300 group"
                >
                  <svg
                    className="w-5 h-5 text-blue-200 group-hover:text-white transition-colors"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d={social.icon}
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-blue-300 mb-4">
              Về chúng tôi
            </h3>
            <ul className="space-y-3">
              {['Giới thiệu', 'Sứ mệnh & Tầm nhìn', 'Đội ngũ luật sư'].map(
                (item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-slate-300 hover:text-blue-300 transition-colors duration-300 group flex items-center"
                    >
                      <span className="w-1 h-1 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-blue-300 mb-4">
              Chăm sóc khách hàng
            </h3>
            <ul className="space-y-3">
              {[
                'Gửi câu hỏi pháp lý',
                'Hỗ trợ trực tiếp',
                'Tư vấn miễn phí',
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-slate-300 hover:text-blue-300 transition-colors duration-300 group flex items-center"
                  >
                    <span className="w-1 h-1 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-blue-300 mb-4">
              Liên hệ & Chính sách
            </h3>
            <ul className="space-y-3">
              {[
                'Chính sách bảo mật',
                'Điều khoản sử dụng',
                'Liên hệ hợp tác',
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-slate-300 hover:text-blue-300 transition-colors duration-300 group flex items-center"
                  >
                    <span className="w-1 h-1 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <span className="text-slate-400 text-sm">
                © 2025
                <span className="text-blue-300 font-semibold mx-1">
                  LawTraffic™
                </span>
                All Rights Reserved.
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>
    </footer>
  );
};

export default React.memo(Footer);
