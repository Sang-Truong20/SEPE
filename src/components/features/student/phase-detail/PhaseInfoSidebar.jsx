import { CheckCircleOutlined } from '@ant-design/icons';
import { Card, Tag } from 'antd';

const PhaseInfoSidebar = ({ phaseStatus, tracksCount, selectedTrack, registration, phaseId }) => {
  return (
    <Card className="bg-card-background border border-card-border backdrop-blur-xl">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Thông tin
      </h3>
      <div className="space-y-3 text-sm">
        <div>
          <p className="text-muted-foreground">Trạng thái</p>
          <p className="text-text-primary font-medium">
            {phaseStatus?.text || 'Không xác định'}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Số lượng Track</p>
          <p className="text-text-primary font-medium">
            {tracksCount} track
          </p>
        </div>
        {registration?.selectedTrackId && parseInt(phaseId) === registration?.selectedPhaseId && (
          <div>
            <Tag color="green" icon={<CheckCircleOutlined />}>
              Đã chọn track
            </Tag>
            <p className="text-text-primary text-sm mt-2">
              {selectedTrack?.name || 'Track đã chọn'}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PhaseInfoSidebar;

