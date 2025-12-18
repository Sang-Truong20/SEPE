import {
  ArrowLeftOutlined,
  CalendarOutlined,
  MessageOutlined,
  SearchOutlined,
  TrophyOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Button, Card, Col, Empty, Input, Modal, Row, Spin, Tag } from 'antd';
import { Calendar as CalendarIcon, Send, Terminal, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_NAME } from '../../constants';
import {
  useGetChatGroupMessages,
  useSendChatMessage,
} from '../../hooks/student/chat';
import { useMentorChatGroups } from '../../hooks/mentor/chat';
import { useGetHackathon } from '../../hooks/student/hackathon';
import { useUserData } from '../../hooks/useUserData';
import { getStatusDisplay } from '../../configs/statusConfig';

const ChatGroupMessagesModal = ({ chatGroupId, open, onClose, group, currentMentorId }) => {
  const { data: messagesData, isLoading: messagesLoading } = useGetChatGroupMessages(chatGroupId);
  const { mutate: sendMessage, isLoading: sending } = useSendChatMessage();
  const [newMessage, setNewMessage] = useState('');

  const messages = Array.isArray(messagesData)
    ? messagesData
    : messagesData?.data || [];

  const handleSend = () => {
    if (!newMessage.trim()) return;
    sendMessage(
      { chatGroupId, content: newMessage },
      {
        onSuccess: () => setNewMessage(''),
      },
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={720}
      title={
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <MessageOutlined />
            <span className="text-white font-semibold">
              Chat với {group?.teamName} ({group?.hackathonName})
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Mentor: {group?.mentorName}
          </p>
        </div>
      }
      className="[&_.ant-modal-content]:bg-dark-secondary [&_.ant-modal-content]:border-white/10 [&_.ant-modal-header]:border-white/10 [&_.ant-modal-body]:text-white [&_.ant-modal-close]:text-white"
    >
      <div className="flex flex-col h-[480px]">
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-white/5 rounded-lg mb-3">
          {messagesLoading ? (
            <div className="flex justify-center items-center h-full">
              <Spin />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex justify-center items-center h-full text-gray-400 text-sm">
              Chưa có tin nhắn nào trong đoạn chat này.
            </div>
          ) : (
            messages.map((msg) => {
              const isMentorMessage =
                msg.isMentor === true ||
                msg.senderRole?.toLowerCase() === 'mentor' ||
                (currentMentorId &&
                  msg.senderId &&
                  String(msg.senderId) === String(currentMentorId));

              return (
                <div
                  key={msg.id || msg.messageId}
                  className={`space-y-1 flex flex-col ${
                    isMentorMessage ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-0.5">
                    <span className="font-semibold text-gray-200">
                      {msg.senderName || msg.sender || (isMentorMessage ? 'Mentor' : 'Thành viên')}
                    </span>
                    {msg.sentAt && (
                      <span className="text-[10px]">
                        {new Date(msg.sentAt).toLocaleString('vi-VN')}
                      </span>
                    )}
                  </div>
                  <div
                    className={`px-3 py-2 rounded-lg text-sm max-w-[80%] ${
                      isMentorMessage ? 'bg-emerald-500 text-white' : 'bg-white/10 text-gray-100'
                    }`}
                  >
                    {msg.content || msg.message}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="flex gap-2">
          <Input.TextArea
            rows={2}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập tin nhắn..."
          />
          <Button
            type="primary"
            loading={sending}
            disabled={!newMessage.trim()}
            onClick={handleSend}
          >
            Gửi
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const MentorHackathonDetail = () => {
  const navigate = useNavigate();
  const { hackathonId } = useParams();
  const [chatGroupSearchQuery, setChatGroupSearchQuery] = useState('');
  const [activeChatGroup, setActiveChatGroup] = useState(null);
  const { userInfo } = useUserData();

  // Try multiple possible fields for mentorId
  const currentMentorId = userInfo?.mentorId || userInfo?.id || userInfo?.userId || null;

  const { data: hackathonData, isLoading: hackathonLoading } = useGetHackathon(hackathonId);

  // Get chat groups for mentor using /api/Chat/mentor/{mentorId}/groups
  const {
    data: mentorChatGroupsData,
    isLoading: hackathonChatGroupsLoading,
  } = useMentorChatGroups(currentMentorId);

  // Filter chat groups by hackathonId
  const hackathonChatGroups = useMemo(() => {
    if (!mentorChatGroupsData) return [];

    const rawGroups = Array.isArray(mentorChatGroupsData)
      ? mentorChatGroupsData
      : Array.isArray(mentorChatGroupsData?.data)
        ? mentorChatGroupsData.data
        : [];

    if (!hackathonId) return rawGroups;

    // Convert hackathonId from URL (string) to number for comparison
    const currentHackathonId = parseInt(hackathonId, 10);

    if (isNaN(currentHackathonId)) return rawGroups;

    // Filter groups that belong to the current hackathon
    return rawGroups.filter((g) => {
      const groupHackathonId = g.hackathonId;
      // Compare as numbers to handle type mismatch
      return Number(groupHackathonId) === currentHackathonId;
    });
  }, [mentorChatGroupsData, hackathonId]);

  const filteredHackathonChatGroups = useMemo(() => {
    if (!chatGroupSearchQuery) return hackathonChatGroups;
    const query = chatGroupSearchQuery.toLowerCase();
    return hackathonChatGroups.filter(
      (group) =>
        group.teamName?.toLowerCase().includes(query) ||
        group.groupName?.toLowerCase().includes(query),
    );
  }, [hackathonChatGroups, chatGroupSearchQuery]);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <Tag color="green">ĐANG DIỄN RA</Tag>;
      case 'pending':
      case 'upcoming':
        return <Tag color="orange">SẮP DIỄN RA</Tag>;
      default:
        return <Tag>{status?.toUpperCase() || 'UNKNOWN'}</Tag>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (hackathonLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (!hackathonData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-0 bg-white/5 backdrop-blur-xl">
          <Empty description="Không tìm thấy hackathon" />
        </Card>
      </div>
    );
  }

  const hackathon = Array.isArray(hackathonData)
    ? hackathonData[0]
    : hackathonData?.data || hackathonData;

  const ChatGroupCard = ({ group, onJoin }) => {
    return (
      <div className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden   hover:shadow-[0_0_25px_rgba(16,185,129,0.18)] transition-all duration-300 flex flex-col relative backdrop-blur-xl">
        {/* HEADER: Context Info */}
        <div className="px-5 py-3 border-b border-white/10 bg-zinc-900/60 flex justify-between items-center z-10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-500">
              <Terminal size={14} />
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wider">
                Hackathon
              </p>
              <p className="text-xs font-bold text-zinc-200">{group.hackathonName}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-zinc-300 bg-white/10 px-2 py-1 rounded border border-white/10">
            <CalendarIcon size={10} />
            <span>{formatDate(group.createdAt)}</span>
          </div>
        </div>

        {/* BODY: Team Main Focus */}
        <div className="p-6 flex flex-col items-center justify-center relative min-h-[160px]">
          {/* Background Gradient Effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent opacity-50 pointer-events-none"></div>

          {/* Mentor Badge (Floating Top Right) */}
          <div className="absolute top-4 right-4 z-20">
            <div className="flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full bg-zinc-900/70 border border-violet-500/40 hover:bg-violet-900/40 hover:border-violet-400/60 transition-colors group/mentor cursor-default shadow-lg shadow-violet-500/25">
              <div className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center text-[10px] text-white font-bold ring-2 ring-zinc-900">
                {group.mentorName?.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] uppercase text-zinc-500 font-bold leading-none group-hover/mentor:text-violet-400">
                  Mentor
                </span>
                <span className="text-[10px] font-semibold text-zinc-300 leading-none group-hover/mentor:text-violet-200">
                  {group.mentorName}
                </span>
              </div>
            </div>
          </div>

          {/* Team Info (Main Center) */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Team Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-500/30 mb-3 border-4 border-zinc-900 group-hover:scale-105 transition-transform duration-300">
              <span className="text-2xl font-bold text-white">
                {group.teamName?.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Team Name */}
            <h3 className="text-xl font-bold text-white mb-1 tracking-tight text-center px-4">
              {group.teamName}
            </h3>

            {/* Subtext */}
            <div className="flex items-center gap-1.5 text-zinc-200 text-xs bg-zinc-900/60 px-3 py-1 rounded-full border border-white/10">
              <Users size={12} />
              <span>Group Chat</span>
            </div>
          </div>
        </div>

        {/* FOOTER: only join chat CTA */}
        <div className="mt-auto bg-zinc-900/70 border-t border-white/10 p-4">
          <div
            className="flex items-center justify-end cursor-pointer group/cta"
            onClick={() => onJoin && onJoin(group)}
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 group-hover/cta:bg-emerald-500 group-hover/cta:text-white group-hover/cta:border-emerald-400 transition-all">
              <Send size={14} className="-ml-0.5 mt-0.5" />
              <span className="text-xs font-semibold">Tham gia đoạn chat</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back Button */}
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(PATH_NAME.MENTOR_DASHBOARD)}
        className="mb-4"
      >
        Quay lại danh sách Hackathon
      </Button>

      {/* Hackathon Header */}
      <Card className="border-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl border-green-500/30 shadow-lg">
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <TrophyOutlined className="text-3xl text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl text-white font-bold">
                    {hackathon.name || hackathon.title}
                  </h1>
                  {getStatusBadge(hackathon.status)}
                </div>
                {hackathon.description && (
                  <p className="text-gray-300 text-base mt-2">{hackathon.description}</p>
                )}
              </div>
            </div>
          </Col>
          <Col xs={24} lg={8}>
            <div className="space-y-3">
              {hackathon.startDate && (
                <div className="flex items-center gap-2 text-gray-300">
                  <CalendarOutlined className="text-green-400" />
                  <span>Bắt đầu: {formatDate(hackathon.startDate)}</span>
                </div>
              )}
              {hackathon.endDate && (
                <div className="flex items-center gap-2 text-gray-300">
                  <CalendarOutlined className="text-green-400" />
                  <span>Kết thúc: {formatDate(hackathon.endDate)}</span>
                </div>
              )}
              {hackathon.participantCount !== undefined && (
                <div className="flex items-center gap-2 text-gray-300">
                  <UserOutlined className="text-green-400" />
                  <span>{hackathon.participantCount} người tham gia</span>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Card>

      {/* Hackathon Chat Groups Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl text-white font-semibold">Nhóm chat trong hackathon</h2>
            <p className="text-gray-400 mt-1">
              {filteredHackathonChatGroups.length} nhóm chat giữa bạn và các team
            </p>
          </div>
        </div>

        {/* Search chat groups by team name */}
        <Card className="border-0 bg-white/5 backdrop-blur-xl">
          <Input
            placeholder="Tìm kiếm nhóm chat theo tên team hoặc tên nhóm..."
            prefix={<SearchOutlined className="text-green-400" />}
            value={chatGroupSearchQuery}
            onChange={(e) => setChatGroupSearchQuery(e.target.value)}
            className="bg-white/10 border-white/20 hover:border-green-400/50 focus:border-green-400 transition-all"
            size="large"
            allowClear
          />
        </Card>

        {!currentMentorId ? (
          <Card className="border-0 bg-white/5 backdrop-blur-xl">
            <div className="p-12 text-center">
              <MessageOutlined className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">
                Không thể xác định mentor ID. Vui lòng đăng nhập lại.
              </p>
            </div>
          </Card>
        ) : hackathonChatGroupsLoading ? (
          <Card className="border-0 bg-white/5 backdrop-blur-xl">
            <div className="flex justify-center py-8">
              <Spin size="large" />
            </div>
          </Card>
        ) : filteredHackathonChatGroups.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredHackathonChatGroups.map((group) => (
              <ChatGroupCard
                key={group.chatGroupId}
                group={group}
                onJoin={setActiveChatGroup}
              />
            ))}
          </div>
        ) : (
          <Card className="border-0 bg-white/5 backdrop-blur-xl">
            <div className="p-12 text-center">
              <MessageOutlined className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">
                Bạn chưa có nhóm chat nào trong hackathon này
              </p>
            </div>
          </Card>
        )}
      </div>



      {/* Chat Modal for selected group */}
      {activeChatGroup && (
        <ChatGroupMessagesModal
          chatGroupId={activeChatGroup.chatGroupId}
          open={!!activeChatGroup}
          onClose={() => setActiveChatGroup(null)}
          group={activeChatGroup}
          currentMentorId={currentMentorId}
        />
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default MentorHackathonDetail;

