import React from 'react';

const Footer = () => {
  return (
    <footer className="py-20 border-t border-white/10">
      <div className="container mx-auto px-6 grid md:grid-cols-4 gap-12">
        <div>
          <h3 className="font-bold text-xl mb-6">SEAL Hackathon</h3>
          <p className="text-gray-400">
            Hệ thống quản lý hackathon hiện đại, công bằng và minh bạch.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4">Liên kết nhanh</h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a href="#home">Trang chủ</a>
            </li>
            <li>
              <a href="#features">Tính năng</a>
            </li>
            <li>
              <a href="#hackathons">Hackathon</a>
            </li>
            <li>
              <a href="#timeline">Dòng thời gian</a>
            </li>
            <li>
              <a href="#faq">FAQ</a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Kết nối</h4>
          <ul className="space-y-2 text-gray-400">
            <li>Email: contact@seal-hackathon.vn</li>
            <li>Facebook: fb.com/sealhackathon</li>
            <li>Zalo: 0123 456 789</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Tài liệu</h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a href="#">Hướng dẫn</a>
            </li>
            <li>
              <a href="#">Quy định</a>
            </li>
            <li>
              <a href="#">Điều khoản</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="text-center text-gray-500 mt-12">
        © 2025 SEAL Hackathon. Bản quyền thuộc về Ban tổ chức.
      </div>
    </footer>
  );
};

export default React.memo(Footer);
