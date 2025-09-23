import { notification } from 'antd';

export const notify = (type, { description, duration = 3 } = {}) => {
  const defaultMessages = {
    info: 'Thông báo',
    success: 'Thành công',
    error: 'Lỗi',
    warning: 'Cảnh báo',
  };

  if (!['info', 'success', 'error', 'warning'].includes(type)) {
    console.warn('Loại thông báo không hợp lệ:', type);
    return;
  }

  notification[type]({
    message: defaultMessages[type],
    ...(description && { description }),
    duration,
  });
};
