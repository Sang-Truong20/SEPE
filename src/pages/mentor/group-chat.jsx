import {
  MessageOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Card, Input, Spin, Empty } from 'antd';
import { useMemo, useState, useEffect, useRef } from 'react';
import { useUserData } from '../../hooks/useUserData';
import { useMentorChatGroups } from '../../hooks/mentor/chat';
import { useGetChatGroupMessages, useSendChatMessage } from '../../hooks/student/chat';
import dayjs from 'dayjs';

const MentorGroupChat = () => {
  const { userInfo } = useUserData();
  const [chatGroupSearchQuery, setChatGroupSearchQuery] = useState('');
  const [selectedChatGroup, setSelectedChatGroup] = useState(null);
  const [messageContent, setMessageContent] = useState('');
  const messagesEndRef = useRef(null);

  // Try multiple possible fields for mentorId
  const currentMentorId = userInfo?.mentorId || userInfo?.id || userInfo?.userId || null;

  // Get chat groups for mentor using /api/Chat/mentor/{mentorId}/groups
  const {
    data: mentorChatGroupsData,
    isLoading: chatGroupsLoading,
  } = useMentorChatGroups(currentMentorId);

  const sendMessageMutation = useSendChatMessage();

  // Get messages for selected chat group
  const { 
    data: messagesData = [], 
    isLoading: messagesLoading,
    refetch: refetchMessages 
  } = useGetChatGroupMessages(selectedChatGroup?.chatGroupId);

  const messages = Array.isArray(messagesData) 
    ? messagesData 
    : Array.isArray(messagesData?.data) 
      ? messagesData.data 
      : [];

  // Poll messages every 1 second when a chat group is selected
  useEffect(() => {
    if (!selectedChatGroup?.chatGroupId) return;

    const intervalId = setInterval(() => {
      refetchMessages();
    }, 1000); // Poll every 1 second

    return () => {
      clearInterval(intervalId);
    };
  }, [selectedChatGroup?.chatGroupId, refetchMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Extract chat groups from API response
  const chatGroups = useMemo(() => {
    if (!mentorChatGroupsData) return [];

    return Array.isArray(mentorChatGroupsData)
      ? mentorChatGroupsData
      : Array.isArray(mentorChatGroupsData?.data)
        ? mentorChatGroupsData.data
        : [];
  }, [mentorChatGroupsData]);

  // Filter chat groups by search query
  const filteredChatGroups = useMemo(() => {
    if (!chatGroupSearchQuery) return chatGroups;
    const query = chatGroupSearchQuery.toLowerCase();
    return chatGroups.filter(
      (group) =>
        group.teamName?.toLowerCase().includes(query) ||
        group.groupName?.toLowerCase().includes(query) ||
        group.hackathonName?.toLowerCase().includes(query),
    );
  }, [chatGroups, chatGroupSearchQuery]);

  const handleSendMessage = async () => {
    if (!messageContent.trim() || !selectedChatGroup?.chatGroupId) return;
    
    const content = messageContent.trim();
    const chatGroupId = selectedChatGroup.chatGroupId;
    setMessageContent(''); // Clear input immediately for better UX
    
    try {
      await sendMessageMutation.mutateAsync({
        chatGroupId,
        content,
      });
      // Refetch messages immediately after sending
      setTimeout(() => {
        refetchMessages();
      }, 100);
    } catch (error) {
      console.error('Send message error:', error);
      // Restore message content on error
      setMessageContent(content);
    }
  };

  if (!currentMentorId) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-0 bg-white/5 backdrop-blur-xl">
          <div className="p-12 text-center">
            <MessageOutlined className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">
              Không thể xác định mentor ID. Vui lòng đăng nhập lại.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          Group Chat
        </h1>
        <p className="text-gray-400 text-lg mt-2">
          Quản lý và trò chuyện với các teams bạn đang hỗ trợ
        </p>
      </div>

      {/* Search */}
      <Card className="border-0 bg-white/5 backdrop-blur-xl">
        <Input
          placeholder="Tìm kiếm nhóm chat theo tên team, tên nhóm hoặc hackathon..."
          prefix={<SearchOutlined className="text-green-400" />}
          value={chatGroupSearchQuery}
          onChange={(e) => setChatGroupSearchQuery(e.target.value)}
          className="bg-white/10 border-white/20 hover:border-green-400/50 focus:border-green-400 transition-all"
          size="large"
          allowClear
        />
      </Card>

      {/* Chat Groups and Messages */}
      {chatGroupsLoading ? (
        <Card className="border-0 bg-white/5 backdrop-blur-xl">
          <div className="flex justify-center py-8">
            <Spin size="large" />
          </div>
        </Card>
      ) : filteredChatGroups.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Chat Groups List */}
          <div className="lg:col-span-1 space-y-2">
            {filteredChatGroups.map((group) => (
              <Card
                key={group.chatGroupId}
                className={`cursor-pointer transition-all ${
                  selectedChatGroup?.chatGroupId === group.chatGroupId
                    ? 'bg-green-500/10 border-green-500/50'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
                onClick={() => setSelectedChatGroup(group)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                    <MessageOutlined className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">
                      {group.groupName || group.teamName || 'Group Chat'}
                    </h4>
                    {group.hackathonName && (
                      <p className="text-sm text-gray-400 truncate">
                        {group.hackathonName}
                      </p>
                    )}
                    {group.teamName && (
                      <p className="text-xs text-gray-500 truncate">
                        Team: {group.teamName}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="lg:col-span-2">
            {selectedChatGroup ? (
              <Card 
                className="bg-white/5 border-white/10 h-[600px]"
                styles={{ body: { padding: 0, height: '100%', display: 'flex', flexDirection: 'column' } }}
              >
                {/* Chat Header - Fixed at top */}
                <div className="border-b border-white/10 p-4 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">
                        {selectedChatGroup.groupName || selectedChatGroup.teamName || 'Group Chat'}
                      </h4>
                      {selectedChatGroup.hackathonName && (
                        <p className="text-sm text-gray-400">
                          Hackathon: {selectedChatGroup.hackathonName}
                        </p>
                      )}
                      {selectedChatGroup.teamName && (
                        <p className="text-sm text-gray-400">
                          Team: {selectedChatGroup.teamName}
                        </p>
                      )}
                    </div>
                    {/* Connection status indicator */}
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full bg-green-400"
                        title="Đang cập nhật tin nhắn..."
                      />
                      <span className="text-xs text-gray-400">
                        Đang cập nhật
                      </span>
                    </div>
                  </div>
                </div>

                {/* Messages Area - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                  {messagesLoading ? (
                    <div className="text-center py-8">
                      <Spin size="large" />
                    </div>
                  ) : messages.length > 0 ? (
                    messages.map((msg) => (
                      <div
                        key={msg.messageId || msg.id}
                        className={`flex ${msg.senderId === currentMentorId ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            msg.senderId === currentMentorId
                              ? 'bg-green-500/20 border border-green-500/30'
                              : 'bg-white/5 border border-white/10'
                          }`}
                        >
                          <div className="text-xs text-gray-400 mb-1">
                            {msg.senderName || 'Unknown'}
                          </div>
                          <div className="text-white">{msg.content}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {msg.createdAt
                              ? dayjs(msg.createdAt).format('HH:mm DD/MM')
                              : ''}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-400">
                      <MessageOutlined className="text-4xl mb-2 opacity-50" />
                      <p>Chưa có tin nhắn nào</p>
                    </div>
                  )}
                  {/* Scroll anchor */}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input - Fixed at bottom */}
                <div className="border-t border-white/10 p-4 flex-shrink-0 flex gap-2">
                  <Input
                    placeholder="Nhập tin nhắn..."
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    onPressEnter={handleSendMessage}
                    className="bg-white/5 border-white/10 text-white"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageContent.trim() || sendMessageMutation.isPending}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendMessageMutation.isPending ? 'Đang gửi...' : 'Gửi'}
                  </button>
                </div>
              </Card>
            ) : (
              <Card className="bg-white/5 border-white/10 h-[600px] flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <MessageOutlined className="text-4xl mb-2 opacity-50" />
                  <p>Chọn một group chat để xem tin nhắn</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      ) : (
        <Card className="border-0 bg-white/5 backdrop-blur-xl">
          <div className="p-12 text-center">
            <MessageOutlined className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">
              {chatGroupSearchQuery
                ? 'Không tìm thấy nhóm chat nào phù hợp'
                : 'Bạn chưa có nhóm chat nào'}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MentorGroupChat;

