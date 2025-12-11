import {
  MessageOutlined,
  SendOutlined,
  UserOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Input, Modal, Spin, Tag, Tooltip } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useRef, useState } from 'react';

dayjs.extend(relativeTime);

const TeamChatModal = ({
  teamId,
  visible,
  onClose,
  teamData: propTeamData,
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const currentUserId = 'mentor-1'; // TODO: Get from auth context

  // Mock team data - in real app, fetch from API
  // Use propTeamData if provided, otherwise use default
  const teamData = propTeamData || {
    id: teamId,
    name: 'Tech Innovators',
    members: [
      {
        id: '1',
        name: 'Nguyễn Văn An',
        fullName: 'Nguyễn Văn An',
        role: 'leader',
      },
      {
        id: '2',
        name: 'Trần Thị Bình',
        fullName: 'Trần Thị Bình',
        role: 'member',
      },
      {
        id: '3',
        name: 'Lê Văn Cường',
        fullName: 'Lê Văn Cường',
        role: 'member',
      },
    ],
  };

  // Mock initial messages - More diverse messages for testing
  useEffect(() => {
    if (visible && teamId) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        // Get team name for context
        const teamName = teamData?.name || teamData?.teamName || 'Team';
        const leader = teamData?.members?.find((m) => m.role === 'leader');
        const leaderName = leader?.name || leader?.fullName || 'Leader';

        // Mock messages based on teamId
        const mockMessagesByTeam = {
          1: [
            // Tech Innovators
            {
              id: '1',
              senderId: '1',
              senderName: leaderName,
              content:
                'Chào mentor! Team chúng em đang làm phần AI model và có một số thắc mắc về cách optimize performance.',
              timestamp: new Date(Date.now() - 2 * 3600000),
              isMentor: false,
            },
            {
              id: '2',
              senderId: currentUserId,
              senderName: 'Mentor',
              content:
                'Chào team! Các em có thể chia sẻ cụ thể hơn về vấn đề performance không? Model đang chạy chậm ở phần nào?',
              timestamp: new Date(Date.now() - 1.8 * 3600000),
              isMentor: true,
            },
            {
              id: '3',
              senderId: '2',
              senderName: 'Trần Thị Bình',
              content:
                'Em thấy model inference mất khoảng 3-4 giây cho mỗi ảnh, có cách nào tối ưu không ạ?',
              timestamp: new Date(Date.now() - 1.5 * 3600000),
              isMentor: false,
            },
            {
              id: '4',
              senderId: currentUserId,
              senderName: 'Mentor',
              content:
                'Các em có thể thử sử dụng model quantization hoặc TensorRT để tăng tốc. Ngoài ra, có thể cache kết quả cho các ảnh tương tự.',
              timestamp: new Date(Date.now() - 1.2 * 3600000),
              isMentor: true,
            },
            {
              id: '5',
              senderId: '3',
              senderName: 'Lê Văn Cường',
              content: 'Cảm ơn mentor! Team sẽ thử implement ngay.',
              timestamp: new Date(Date.now() - 3600000),
              isMentor: false,
            },
          ],
          2: [
            // AI Warriors
            {
              id: '6',
              senderId: '6',
              senderName: 'Trịnh Văn Minh',
              content:
                'Mentor ơi, team em đang gặp vấn đề với recommendation algorithm. Có thể mentor review code giúp không ạ?',
              timestamp: new Date(Date.now() - 1800000),
              isMentor: false,
            },
            {
              id: '7',
              senderId: currentUserId,
              senderName: 'Mentor',
              content:
                'Được rồi, các em có thể share link GitHub hoặc paste code snippet vào đây nhé.',
              timestamp: new Date(Date.now() - 1500000),
              isMentor: true,
            },
          ],
          3: [
            // Data Science Squad
            {
              id: '8',
              senderId: '10',
              senderName: 'Bùi Văn Quang',
              content:
                'Chào mentor! Team em đã hoàn thành data preprocessing, có thể mentor check giúp approach của team không?',
              timestamp: new Date(Date.now() - 900000),
              isMentor: false,
            },
          ],
        };

        // Get messages for this team, or use default
        // Support both string and number teamId
        const teamIdKey = String(teamId);
        const teamIdNum = Number(teamId);
        const messages = mockMessagesByTeam[teamId] ||
          mockMessagesByTeam[teamIdKey] ||
          mockMessagesByTeam[teamIdNum] || [
            {
              id: 'default-1',
              senderId: teamData?.members?.[0]?.id || '1',
              senderName: leaderName,
              content: `Chào mentor! Team ${teamName} đã sẵn sàng nhận feedback và hỗ trợ.`,
              timestamp: new Date(Date.now() - 3600000),
              isMentor: false,
            },
          ];

        setMessages(messages);
        setLoading(false);
      }, 500);
    } else {
      // Clear messages when modal closes
      setMessages([]);
    }
  }, [visible, teamId, currentUserId, teamData]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      senderName: 'Mentor',
      content: newMessage,
      timestamp: new Date(),
      isMentor: true,
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // TODO: Send to API
    // await sendTeamMessage(teamId, newMessage);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Modal
      title={
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <MessageOutlined className="text-green-400" />
            <span className="text-white font-semibold">
              Chat với {teamData.name || teamData.teamName}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <TeamOutlined />
            <span>
              Tất cả thành viên trong team đều có thể xem tin nhắn này (
              {teamData.members?.length || 0} thành viên)
            </span>
          </div>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
      className="[&_.ant-modal-content]:bg-dark-secondary [&_.ant-modal-content]:border-white/10 [&_.ant-modal-header]:border-white/10 [&_.ant-modal-body]:text-white [&_.ant-modal-close]:text-white"
    >
      <div className="flex flex-col h-[550px]">
        {/* Team Members Info */}
        {teamData.members && teamData.members.length > 0 && (
          <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <UserOutlined className="text-green-400" />
              <span className="text-sm text-gray-300 font-medium">
                Thành viên có thể xem chat ({teamData.members.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {teamData.members.map((member) => (
                <Tooltip
                  key={member.id}
                  title={member.email || member.name || member.fullName}
                >
                  <Tag
                    color={member.role === 'leader' ? 'gold' : 'blue'}
                    className="cursor-pointer"
                  >
                    {member.name || member.fullName}
                    {member.role === 'leader' && ' 👑'}
                  </Tag>
                </Tooltip>
              ))}
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/5 rounded-lg mb-4">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Spin />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex justify-center items-center h-full text-gray-400">
              <div className="text-center">
                <MessageOutlined className="text-4xl mb-2 opacity-50" />
                <p>Chưa có tin nhắn nào</p>
                <p className="text-sm mt-1">Bắt đầu cuộc trò chuyện với team</p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.isMentor ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <Tooltip
                  title={message.isMentor ? 'Mentor' : message.senderName}
                >
                  <Avatar
                    className={`${
                      message.isMentor
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : 'bg-blue-500'
                    }`}
                  >
                    {message.isMentor
                      ? 'M'
                      : message.senderName.charAt(0).toUpperCase()}
                  </Avatar>
                </Tooltip>
                <div
                  className={`flex flex-col max-w-[70%] ${
                    message.isMentor ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      message.isMentor
                        ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30'
                        : 'bg-white/10 border border-white/20'
                    }`}
                  >
                    <p className="text-white text-sm">{message.content}</p>
                  </div>
                  <span className="text-xs text-gray-400 mt-1">
                    {dayjs(message.timestamp).fromNow()}
                  </span>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <Input.TextArea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn..."
            rows={2}
            className="bg-white/5 border-white/10 text-white"
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-green-600 to-emerald-600 border-0 h-auto"
          >
            Gửi
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TeamChatModal;
