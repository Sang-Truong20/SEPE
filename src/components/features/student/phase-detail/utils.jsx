import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

export const getPhaseStatus = (phase) => {
  if (!phase) return null;
  const now = dayjs();
  const startDate = dayjs(phase.startDate);
  const endDate = dayjs(phase.endDate);

  if (now.isBefore(startDate)) {
    return { 
      status: 'upcoming', 
      text: 'SẮP BẮT ĐẦU', 
      color: 'processing', 
      icon: <ClockCircleOutlined /> 
    };
  } else if (now.isAfter(endDate)) {
    return { 
      status: 'completed', 
      text: 'ĐÃ KẾT THÚC', 
      color: 'red', 
      icon: <CheckCircleOutlined /> 
    };
  } else {
    return { 
      status: 'active', 
      text: 'ĐANG DIỄN RA', 
      color: 'success', 
      icon: <ClockCircleOutlined /> 
    };
  }
};

