import { CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Card, Empty, Spin, Tag } from 'antd';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useGetHackathonPhases } from '../../../hooks/student/hackathon-phase';

const HackathonPhases = ({ hackathonId }) => {
  const navigate = useNavigate();
  const { data: phases = [], isLoading: phasesLoading } = useGetHackathonPhases(hackathonId);

  const getPhaseStatus = (phase) => {
    const now = dayjs();
    const startDate = dayjs(phase.startDate);
    const endDate = dayjs(phase.endDate);

    if (now.isBefore(startDate)) {
      return { status: 'upcoming', text: 'SẮP BẮT ĐẦU', color: 'processing', icon: <ClockCircleOutlined /> };
    } else if (now.isAfter(endDate)) {
      return { status: 'completed', text: 'ĐÃ KẾT THÚC', color: 'red', icon: <CheckCircleOutlined /> };
    } else {
      return { status: 'active', text: 'ĐANG DIỄN RA', color: 'success', icon: <ClockCircleOutlined /> };
    }
  };

  const handlePhaseClick = (phase) => {
    const phaseStatus = getPhaseStatus(phase);
    // Chỉ cho phép click vào phase đang diễn ra
    if (phaseStatus.status === 'active') {
      navigate(`/student/hackathons/${hackathonId}/phases/${phase.phaseId}`);
    }
  };

  return (
    <Card className="bg-card-background border border-card-border backdrop-blur-xl">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Các giai đoạn của Hackathon
      </h3>
      {phasesLoading ? (
        <div className="flex justify-center py-8">
          <Spin />
        </div>
      ) : phases && phases.length > 0 ? (
        <div className="space-y-3">
          {phases.map((phase) => {
            const phaseStatus = getPhaseStatus(phase);
            const isActive = phaseStatus.status === 'active';
            return (
              <Card
                key={phase.phaseId}
                className={`bg-card-background/50 border border-card-border/50 ${
                  isActive ? 'cursor-pointer hover:bg-card-background/70 hover:border-primary/50 transition-all' : 'opacity-60'
                }`}
                size="small"
                onClick={() => handlePhaseClick(phase)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-text-primary font-medium">
                        {phase.phaseName}
                      </h4>
                      <Tag color={phaseStatus.color} icon={phaseStatus.icon}>
                        {phaseStatus.text}
                      </Tag>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Tag color="green" icon={<CalendarOutlined />}>
                        Bắt đầu: {dayjs(phase.startDate).format('DD/MM/YYYY HH:mm')}
                      </Tag>
                      <Tag color="blue" icon={<CalendarOutlined />}>
                        Kết thúc: {dayjs(phase.endDate).format('DD/MM/YYYY HH:mm')}
                      </Tag>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Empty description="Chưa có giai đoạn nào" />
      )}
    </Card>
  );
};

export default HackathonPhases;

