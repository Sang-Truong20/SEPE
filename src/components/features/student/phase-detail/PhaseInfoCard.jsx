import { CalendarOutlined } from '@ant-design/icons';
import { Card, Tag } from 'antd';
import dayjs from 'dayjs';

const PhaseInfoCard = ({ phase, phaseStatus, hackathon }) => {
  return (
    <Card className="bg-card-background border border-card-border backdrop-blur-xl">
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-text-primary">
                {phase.phaseName}
              </h1>
              {phaseStatus && (
                <Tag color={phaseStatus.color} icon={phaseStatus.icon} size="large">
                  {phaseStatus.text}
                </Tag>
              )}
            </div>
            {hackathon && (
              <p className="text-muted-foreground mb-4">
                Hackathon: {hackathon.name}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <CalendarOutlined className="text-primary text-lg" />
          <div>
            <p className="text-sm text-muted-foreground">Thời gian bắt đầu</p>
            <p className="text-text-primary font-medium">
              {dayjs(phase.startDate).format('DD/MM/YYYY HH:mm')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <CalendarOutlined className="text-primary text-lg" />
          <div>
            <p className="text-sm text-muted-foreground">Thời gian kết thúc</p>
            <p className="text-text-primary font-medium">
              {dayjs(phase.endDate).format('DD/MM/YYYY HH:mm')}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PhaseInfoCard;

