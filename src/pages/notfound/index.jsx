import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-6">
      <h1 className="text-9xl font-extrabold text-primary drop-shadow-lg">
        404
      </h1>
      <p className="mt-4 text-2xl md:text-3xl font-semibold text-gray-800">
        Ôi! Trang bạn tìm không tồn tại
      </p>
      <p className="mt-2 text-gray-600 text-center max-w-md">
        Có thể bạn đã nhập sai đường dẫn hoặc trang này đã bị di chuyển.
      </p>

      <div className="mt-8">
        <Link
          to="/"
          className="px-6 py-3 rounded-2xl bg-primary text-white font-medium shadow-md hover:bg-secondary transition"
        >
          Quay về Trang Chủ
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
