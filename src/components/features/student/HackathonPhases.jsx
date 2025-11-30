import { Card, Empty, Spin } from 'antd';
import dayjs from 'dayjs';
import { Calendar, CheckCircle2, Circle, Clock, Flag, Timer, ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGetHackathonPhases } from '../../../hooks/student/hackathon-phase';

// Helper: Format ngày giờ
const formatDateTime = (dateString) => {
  const date = dayjs(dateString);
  return {
    time: date.format('HH:mm'),
    date: date.format('DD/MM/YYYY'),
    full: date
  };
};

// Helper: Tính thời lượng
const getDuration = (start, end) => {
  const startTime = dayjs(start);
  const endTime = dayjs(end);
  const diffMins = endTime.diff(startTime, 'minute');
  const hours = Math.floor(diffMins / 60);
  const minutes = diffMins % 60;
  
  if (hours > 0) return `${hours} giờ${minutes > 0 ? ` ${minutes} phút` : ''}`;
  return `${minutes} phút`;
};

// Helper: Xác định trạng thái
const getPhaseStatus = (start, end) => {
  const now = dayjs();
  const startTime = dayjs(start);
  const endTime = dayjs(end);

  if (now.isAfter(endTime)) return 'completed';
  if (now.isAfter(startTime) && now.isBefore(endTime)) return 'active';
  return 'upcoming';
};

const PhaseItem = ({ phase, index, total, onPhaseClick }) => {
  const status = getPhaseStatus(phase.startDate, phase.endDate);
  const start = formatDateTime(phase.startDate);
  const end = formatDateTime(phase.endDate);
  const duration = getDuration(phase.startDate, phase.endDate);
  const isLast = index === total - 1;

  // Cấu hình style dựa trên status
  const statusStyles = {
    completed: {
      line: 'bg-emerald-500',
      dot: 'bg-emerald-500 ring-emerald-500/30',
      icon: <CheckCircle2 size={16} className="text-emerald-950" />,
      card: 'border-emerald-500/20 bg-emerald-900/5',
      text: 'text-text-secondary',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      badgeText: 'Đã hoàn thành'
    },
    active: {
      line: 'bg-card-border',
      dot: 'bg-amber-400 ring-amber-400/30 animate-pulse',
      icon: <Timer size={16} className="text-amber-900" />,
      card: 'border-amber-500/40 bg-amber-900/5 shadow-[0_0_20px_rgba(251,191,36,0.1)]',
      text: 'text-text-primary',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      badgeText: 'Đang diễn ra'
    },
    upcoming: {
      line: 'bg-card-border',
      dot: 'bg-muted-foreground ring-muted-foreground/50',
      icon: <Circle size={16} className="text-zinc-400" />,
      card: 'border-card-border bg-card-background/50 hover:border-emerald-500/30',
      text: 'text-text-secondary',
      badge: 'bg-white/5 text-muted-foreground border-card-border',
      badgeText: 'Sắp diễn ra'
    }
  };

  const style = statusStyles[status];

  return (
    <div className="flex gap-6 relative">
      {/* Timeline Column */}
      <div className="flex flex-col items-center w-12 flex-shrink-0 relative">
        {/* Dot */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ring-4 z-10 transition-all duration-500 ${style.dot}`}>
          {style.icon}
        </div>
        
        {/* Connector Line */}
        {!isLast && (
          <div className={`w-1 flex-1 my-2 rounded-full ${style.line} transition-colors duration-500`}></div>
        )}
      </div>

      {/* Content Card */}
      <div 
        className={`flex-1 mb-8 p-5 rounded-xl border transition-all duration-300 cursor-pointer ${style.card}`}
        onClick={() => onPhaseClick(phase)}
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border mb-2 ${style.badge}`}>
              {style.badgeText}
            </span>
            <h3 className={`text-xl font-bold ${status === 'active' ? 'text-amber-400' : 'text-text-primary'}`}>
              {phase.phaseName}
            </h3>
          </div>
          <div className="text-right">
             <div className="flex items-center gap-1.5 text-emerald-500/80 bg-emerald-500/5 px-2 py-1 rounded-lg border border-emerald-500/10">
                <Clock size={14} />
                <span className="text-xs font-mono font-medium">{duration}</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
           {/* Start Time */}
           <div className="flex items-start gap-3 p-3 rounded-lg bg-card-background/30 border border-card-border">
              <div className="p-1.5 rounded bg-white/5 text-muted-foreground mt-0.5">
                 <Calendar size={14} />
              </div>
              <div>
                 <p className="text-[10px] uppercase text-muted-foreground font-semibold mb-0.5">Bắt đầu</p>
                 <p className="text-sm font-medium text-text-primary">{start.time}</p>
                 <p className="text-xs text-text-secondary">{start.date}</p>
              </div>
           </div>

           {/* Arrow (mobile only) */}
           <div className="flex items-center justify-center sm:hidden">
              <ArrowDown size={16} className="text-muted-foreground" />
           </div>

           {/* End Time */}
           <div className="flex items-start gap-3 p-3 rounded-lg bg-card-background/30 border border-card-border">
              <div className="p-1.5 rounded bg-white/5 text-muted-foreground mt-0.5">
                 <Flag size={14} />
              </div>
              <div>
                 <p className="text-[10px] uppercase text-muted-foreground font-semibold mb-0.5">Kết thúc</p>
                 <p className="text-sm font-medium text-text-primary">{end.time}</p>
                 <p className="text-xs text-text-secondary">{end.date}</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const HackathonPhases = ({ hackathonId }) => {
  const navigate = useNavigate();
  const { data: phases = [], isLoading: phasesLoading } = useGetHackathonPhases(hackathonId);

  const handlePhaseClick = (phase) => {
    navigate(`/student/hackathons/${hackathonId}/phases/${phase.phaseId}`);
  };

  return (
    <Card className="bg-card-background border border-card-border backdrop-blur-xl">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          Các giai đoạn của Hackathon
        </h3>
        <p className="text-sm text-text-secondary">
          Theo dõi tiến độ các vòng thi
        </p>
      </div>
      
      {phasesLoading ? (
        <div className="flex justify-center py-8">
          <Spin />
        </div>
      ) : phases && phases.length > 0 ? (
        <div className="relative pl-2">
          {/* Timeline Line Background */}
          <div className="absolute left-[30px] top-4 bottom-10 w-px bg-card-border/50 -z-10"></div>

          <div className="flex flex-col">
            {phases.map((phase, index) => (
              <PhaseItem 
                key={phase.phaseId} 
                phase={phase} 
                index={index} 
                total={phases.length}
                onPhaseClick={handlePhaseClick}
              />
            ))}
            
            {/* Final decorative dot to close timeline */}
            <div className="flex gap-6 items-center opacity-30">
              <div className="w-12 flex justify-center">
                <div className="w-3 h-3 bg-card-border rounded-full"></div>
              </div>
              <div className="text-sm text-text-secondary italic">Kết thúc giải đấu</div>
            </div>
          </div>
        </div>
      ) : (
        <Empty description="Chưa có giai đoạn nào" />
      )}
    </Card>
  );
};

export default HackathonPhases;

