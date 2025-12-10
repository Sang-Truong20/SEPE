// Từ điển trạng thái dùng chung cho toàn hệ thống.
// Hỗ trợ cả backend trả text hoặc số, có fallback ra giá trị gốc nếu không map được.

const STATUS_DICTIONARY = {
  default: [
    { keys: ['pending', '0'], text: 'Đang chờ.', color: 'warning' },
    { keys: ['processing', '1', 'inprogress'], text: 'Đang xử lý', color: 'processing' },
    { keys: ['active', 'running', 'open'], text: 'Đang hoạt động', color: 'success' },
    { keys: ['inactive', 'closed', 'disabled', 'unactive'], text: 'Ngưng hoạt động', color: 'default' },
    { keys: ['approved', 'success', 'completed', 'complete', 'done', '2'], text: 'Hoàn thành', color: 'success' },
    { keys: ['rejected', 'failed', 'error', 'cancel', 'cancelled', '3'], text: 'Từ chối/Hủy', color: 'error' },
  ],
  challenge: [
    { keys: ['pending', '0'], text: 'Đang chờ', color: 'warning' },
    { keys: ['complete', 'completed', '1'], text: 'Hoàn thành', color: 'success' },
    { keys: ['cancel', 'cancelled', '2'], text: 'Đã hủy', color: 'error' },
  ],
  appeal: [
    { keys: ['pending', '0'], text: 'Chờ xử lý', color: 'warning' },
    { keys: ['approved', '1'], text: 'Đã phê duyệt', color: 'success' },
    { keys: ['rejected', '2'], text: 'Từ chối', color: 'error' },
  ],
  score: [
    { keys: ['pending', '0'], text: 'Chưa chấm', color: 'warning' },
    { keys: ['scored', 'done', '1'], text: 'Đã chấm', color: 'success' },
  ],
};

const normalizeStatus = (status) => {
  if (status === 0) return '0';
  if (status === null || status === undefined) return '';
  return status.toString().trim().toLowerCase();
};

export const getStatusDisplay = (status, type = 'default') => {
  const normalized = normalizeStatus(status);
  const dictionary = STATUS_DICTIONARY[type] || STATUS_DICTIONARY.default;

  const matched = dictionary.find((item) =>
    item.keys?.some((k) => k === normalized),
  );

  return matched
    ? { key: matched.keys?.[0], text: matched.text, color: matched.color, raw: status }
    : { key: normalized || '--', text: status ?? '--', color: 'default', raw: status };
};

export { STATUS_DICTIONARY };

