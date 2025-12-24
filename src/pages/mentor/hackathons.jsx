import {
  SearchOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { Alert, Input, Select, Spin } from 'antd';
import dayjs from 'dayjs';
import { Archive, CheckCircle, Hourglass, Layers, Terminal, Zap } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useGetHackathons } from '../../hooks/student/hackathon';
import { getStatusDisplay } from '../../configs/statusConfig';

const { Search } = Input;
const { Option } = Select;

// Helper format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return dayjs(dateString).format('DD/MM/YYYY');
};

// Helper lấy màu và icon theo trạng thái
const getStatusConfig = (status) => {
  const statusDisplay = getStatusDisplay(status, 'hackathon');

  // Map color từ statusConfig sang styles
  const styleMap = {
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    processing: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
    success: 'bg-zinc-800 text-zinc-400 border-zinc-700',
    default: 'bg-zinc-800 text-zinc-400 border-zinc-700',
  };

  const iconMap = {
    warning: Hourglass,
    processing: Zap,
    success: Archive,
    default: Archive,
  };

  return {
    label: statusDisplay.text,
    styles: styleMap[statusDisplay.color] || styleMap.default,
    icon: iconMap[statusDisplay.color] || iconMap.default
  };
};

const HackathonCard = ({ item }) => {
  const statusConfig = getStatusConfig(item.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="group relative bg-card-background border border-card-border backdrop-blur-xl hover:border-emerald-500/50 rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 flex flex-col h-full">
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
        {/* Timeline Bar */}
        <div className="bg-card-background/50 p-3 rounded-lg border border-card-border flex items-center justify-between group-hover:border-emerald-500/30 transition-colors">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-muted-foreground font-semibold mb-0.5">Bắt đầu</span>
            <span className="text-sm font-medium text-text-primary">{formatDate(item.startDate)}</span>
          </div>

          <div className="flex-1 px-4 flex items-center justify-center">
            <div className="w-full relative flex items-center">
              {/* Start Dot */}
              <div className="w-2 h-2 rounded-full bg-emerald-500/40 ring-2 ring-emerald-500/20 ring-offset-2 ring-offset-card-background z-10 group-hover:bg-emerald-500/60 group-hover:ring-emerald-500/40 transition-all"></div>

              {/* Line */}
              <div className="flex-1 h-[2px] bg-gradient-to-r from-card-border via-emerald-500/20 to-card-border group-hover:from-emerald-500/40 group-hover:via-emerald-500/50 group-hover:to-emerald-500/40 transition-all"></div>

              {/* End Dot */}
              <div className="w-2 h-2 rounded-full bg-emerald-500/40 ring-2 ring-emerald-500/20 ring-offset-2 ring-offset-card-background z-10 group-hover:bg-emerald-500/60 group-hover:ring-emerald-500/40 transition-all"></div>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase text-muted-foreground font-semibold mb-0.5">Kết thúc</span>
            <span className="text-sm font-medium text-text-primary">{formatDate(item.endDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const MentorHackathons = () => {
  const { data: hackathons, isLoading, error } = useGetHackathons();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [seasonFilter, setSeasonFilter] = useState(null);

  // Get unique seasons from hackathons
  const uniqueSeasons = useMemo(() => {
    if (!hackathons || !Array.isArray(hackathons)) return [];
    const seasons = new Set();
    hackathons.forEach(h => {
      if (h.seasonName) {
        seasons.add(h.seasonName);
      }
    });
    return Array.from(seasons).sort();
  }, [hackathons]);

  // Filter hackathons based on search, status, and season
  const filteredHackathons = useMemo(() => {
    if (!hackathons || !Array.isArray(hackathons)) return [];

    return hackathons.filter(h => {
      // Filter out completed hackathons
      if (h.status?.toLowerCase() === 'completed') return false;

      // Search by name
      if (searchTerm) {
        const nameMatch = h.name?.toLowerCase().includes(searchTerm.toLowerCase());
        if (!nameMatch) return false;
      }

      // Filter by status
      if (statusFilter) {
        const hackathonStatus = h.status?.toLowerCase();
        if (statusFilter === 'active' && hackathonStatus !== 'active' && hackathonStatus !== 'inprogress') {
          return false;
        }
        if (statusFilter === 'upcoming' && hackathonStatus !== 'pending' && hackathonStatus !== 'upcoming') {
          return false;
        }
      }

      // Filter by season
      if (seasonFilter) {
        if (h.seasonName !== seasonFilter) {
          return false;
        }
      }

      return true;
    });
  }, [hackathons, searchTerm, statusFilter, seasonFilter]);

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
            Xem các hackathon đang diễn ra
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-8">
        <Search
          placeholder="Tìm kiếm hackathon..."
          allowClear
          className="flex-1"
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onSearch={setSearchTerm}
        />
        <Select
          placeholder="Lọc theo trạng thái"
          style={{ width: 180 }}
          allowClear
          value={statusFilter}
          onChange={setStatusFilter}
        >
          <Option value="active">Đang diễn ra</Option>
          <Option value="upcoming">Sắp diễn ra</Option>
        </Select>
        <Select
          placeholder="Lọc theo mùa"
          style={{ width: 180 }}
          allowClear
          value={seasonFilter}
          onChange={setSeasonFilter}
        >
          {uniqueSeasons.map((season) => (
            <Option key={season} value={season}>
              {season}
            </Option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredHackathons.map((hackathon) => (
          <HackathonCard
            key={hackathon.hackathonId}
            item={hackathon}
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

export default MentorHackathons;
