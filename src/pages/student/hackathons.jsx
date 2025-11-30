import {
  PlusOutlined,
  SearchOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { Alert, Button, Input, Select, Spin } from 'antd';
import dayjs from 'dayjs';
import { Archive, ArrowRight, Hourglass, Layers, Terminal, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../../constants';
import { useGetHackathons } from '../../hooks/student/hackathon';

const { Search } = Input;
const { Option } = Select;

// Helper format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return dayjs(dateString).format('DD/MM/YYYY');
};

// Helper lấy màu và icon theo trạng thái
const getStatusConfig = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
    case 'inprogress':
      return {
        label: 'Đang diễn ra',
        styles: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
        icon: Zap
      };
    case 'pending':
    case 'upcoming':
      return {
        label: 'Sắp diễn ra',
        styles: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        icon: Hourglass
      };
    default: // Completed, Unactive
      return {
        label: 'Đã đóng',
        styles: 'bg-zinc-800 text-zinc-400 border-zinc-700',
        icon: Archive
      };
  }
};

const HackathonCard = ({ item, onViewDetails }) => {
  const statusConfig = getStatusConfig(item.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="group relative bg-card-background border border-card-border backdrop-blur-xl hover:border-emerald-500/50 rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 flex flex-col h-full cursor-pointer" onClick={() => onViewDetails(item.hackathonId)}>
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-10 transition-opacity text-emerald-500">
        <Terminal size={140} />
      </div>

      {/* Top: Season Badge */}
      <div className="flex justify-between items-start mb-4 z-10">
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-white/5 text-text-secondary border border-card-border">
          <Layers size={12} className="mr-1.5 text-muted-foreground" />
          {item.seasonName || 'Hackathon'}
        </span>
        
        {/* Status Badge */}
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.styles}`}>
          <StatusIcon size={12} className="mr-1.5" />
          {statusConfig.label}
        </span>
      </div>

      {/* Main Content */}
      <div className="mb-6 z-10 flex-1">
        <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-emerald-400 transition-colors">
          {item.name}
        </h3>
        <p className="text-sm text-text-secondary line-clamp-2">
          {item.description || item.theme || "Chưa có mô tả chi tiết cho cuộc thi này."}
        </p>
      </div>

      {/* Footer Info */}
      <div className="space-y-4 z-10">
        {/* Timeline Bar - CẢI TIẾN VISUAL */}
        <div className="bg-card-background/50 p-3 rounded-lg border border-card-border flex items-center justify-between group-hover:border-emerald-500/30 transition-colors">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-muted-foreground font-semibold mb-0.5">Bắt đầu</span>
            <span className="text-sm font-medium text-text-primary">{formatDate(item.startDate)}</span>
          </div>
          
          {/* Visual Connector: Dot - Line - Arrow - Line - Dot */}
          <div className="flex-1 px-4 flex items-center justify-center">
             <div className="w-full relative flex items-center">
                {/* Start Dot */}
                <div className="w-2 h-2 rounded-full bg-emerald-500/40 ring-2 ring-emerald-500/20 ring-offset-2 ring-offset-card-background z-10 group-hover:bg-emerald-500/60 group-hover:ring-emerald-500/40 transition-all"></div>
                
                {/* Line */}
                <div className="flex-1 h-[2px] bg-gradient-to-r from-card-border via-emerald-500/20 to-card-border group-hover:from-emerald-500/40 group-hover:via-emerald-500/50 group-hover:to-emerald-500/40 transition-all"></div>
                
                {/* Central Arrow */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500/10 backdrop-blur-md text-emerald-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-300 group-hover:scale-110 p-2 rounded-full border border-emerald-500/30 group-hover:border-emerald-500/50 shadow-lg shadow-emerald-500/10 group-hover:shadow-emerald-500/20 z-20 transition-all duration-300">
                   <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
                
                {/* End Dot */}
                <div className="w-2 h-2 rounded-full bg-emerald-500/40 ring-2 ring-emerald-500/20 ring-offset-2 ring-offset-card-background z-10 group-hover:bg-emerald-500/60 group-hover:ring-emerald-500/40 transition-all"></div>
             </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase text-muted-foreground font-semibold mb-0.5">Kết thúc</span>
            <span className="text-sm font-medium text-text-primary">{formatDate(item.endDate)}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button className="text-sm font-medium text-emerald-500 hover:text-emerald-400 flex items-center gap-1.5 transition-colors group/btn">
            Xem chi tiết
            <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

const StudentHackathons = () => {
  const navigate = useNavigate();
  const { data: hackathons, isLoading, error } = useGetHackathons();

  const handleViewDetails = (hackathonId) => {
    navigate(`/student/hackathons/${hackathonId}`);
  };



  const filteredHackathons = hackathons?.filter(h => h.status?.toLowerCase() !== 'completed') || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Alert
          message="Lỗi tải dữ liệu"
          description="Không thể tải danh sách hackathon. Vui lòng thử lại sau."
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
            Hackathons
          </h1>
          <p className="text-muted-foreground mt-2">
            Khám phá và tham gia các hackathon thú vị
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            icon={<PlusOutlined />}
            className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 transition-all"
            onClick={() => navigate(PATH_NAME.STUDENT_TEAMS)}
          >
            Tạo đội mới
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-8">
        <Search
          placeholder="Tìm kiếm hackathon..."
          allowClear
          className="flex-1"
          prefix={<SearchOutlined />}
        />
        <Select
          placeholder="Lọc theo trạng thái"
          style={{ width: 150 }}
          allowClear
        >
          <Option value="active">Đang diễn ra</Option>
          <Option value="upcoming">Sắp diễn ra</Option>
        </Select>
        <Select
          placeholder="Lọc theo độ khó"
          style={{ width: 150 }}
          allowClear
        >
          <Option value="beginner">Beginner</Option>
          <Option value="intermediate">Intermediate</Option>
          <Option value="advanced">Advanced</Option>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredHackathons.map((hackathon) => (
          <HackathonCard
            key={hackathon.hackathonId}
            item={hackathon}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      {filteredHackathons.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-card-background/50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
            <TrophyOutlined className="text-4xl text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            Không tìm thấy hackathon nào
          </h3>
          <p className="text-muted-foreground">
            Hãy thử thay đổi bộ lọc hoặc kiểm tra lại sau
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentHackathons;

