import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Alert, Avatar, Button, Card, Empty, Form, Input, Select, Spin, Table, Tag } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_NAME } from '../../constants';
import { useGetMyHackathonRegistrations } from '../../hooks/student/hackathon-registration';
import { useGetAvailableMentors, useGetTeamMentor, useRegisterMentor } from '../../hooks/student/mentor-registration';
import { useGetTeams } from '../../hooks/student/team';
import { useUserData } from '../../hooks/useUserData';

const { Option } = Select;
const { TextArea } = Input;

const MentorRegistration = () => {
  const navigate = useNavigate();
  const { hackathonId } = useParams();
  const { userInfo } = useUserData();
  const { data: teamsData } = useGetTeams();
  
  // Get user's team (assuming user is leader)
  const userTeam = teamsData && Array.isArray(teamsData) 
    ? teamsData.find(t => t.leaderId === (userInfo?.id || userInfo?.userId))
    : null;
  const teamId = userTeam?.id || 'team-1';
  
  const { data: myRegistrations } = useGetMyHackathonRegistrations();
  
  // Tìm registration của user cho hackathon hiện tại
  const registration = useMemo(() => {
    if (!myRegistrations || !Array.isArray(myRegistrations)) return null;
    return myRegistrations.find(reg => reg.hackathonId === parseInt(hackathonId)) || null;
  }, [myRegistrations, hackathonId]);
  const { data: teamMentor } = useGetTeamMentor(teamId, hackathonId);
  const { data: availableMentors = [], isLoading: mentorsLoading } = useGetAvailableMentors(hackathonId);
  const registerMentorMutation = useRegisterMentor();
  
  const [form] = Form.useForm();
  const [selectedMentor, setSelectedMentor] = useState(null);

  const handleBack = () => {
    navigate(PATH_NAME.STUDENT_HACKATHONS);
  };

  const handleRegisterMentor = async (values) => {
    try {
      await registerMentorMutation.mutateAsync({
        teamId,
        hackathonId,
        mentorId: values.mentorId,
        message: values.message,
      });
      form.resetFields();
      setSelectedMentor(null);
    } catch (error) {
      console.error('Register mentor error:', error);
    }
  };

  // Check if team has registered for hackathon
  if (!registration || registration.status !== 'approved') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Alert
          message="Chưa đăng ký hackathon"
          description="Team chưa đăng ký hackathon, vui lòng đăng ký hackathon trước."
          type="warning"
          showIcon
          action={
            <Button onClick={() => navigate(`/student/hackathons/${hackathonId}`)}>
              Đăng ký hackathon
            </Button>
          }
        />
        <div className="mt-4">
          <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  const getMentorStatusTag = () => {
    if (!teamMentor) return null;
    
    switch (teamMentor.status) {
      case 'pending':
        return (
          <Tag icon={<ClockCircleOutlined />} color="orange">
            Đang chờ duyệt
          </Tag>
        );
      case 'approved':
        return (
          <Tag icon={<CheckCircleOutlined />} color="green">
            Đã được duyệt
          </Tag>
        );
      case 'rejected':
        return (
          <Tag icon={<CloseCircleOutlined />} color="red">
            Bị từ chối
          </Tag>
        );
      default:
        return null;
    }
  };

  const mentorColumns = [
    {
      title: 'Mentor',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div className="flex items-center space-x-3">
          <Avatar icon={<UserOutlined />} />
          <div>
            <div className="font-medium text-white">{name}</div>
            <div className="text-sm text-gray-400">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Chuyên môn',
      dataIndex: 'expertise',
      key: 'expertise',
      render: (expertise) => (
        <div className="flex flex-wrap gap-1">
          {expertise?.map((skill, idx) => (
            <Tag key={idx} className="bg-white/5 border-white/10 text-gray-300">
              {skill}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'Kinh nghiệm',
      dataIndex: 'experience',
      key: 'experience',
    },
    {
      title: 'Slot còn lại',
      dataIndex: 'availableSlots',
      key: 'availableSlots',
      render: (slots) => (
        <Tag color={slots > 0 ? 'green' : 'red'}>
          {slots} slot
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => {
            setSelectedMentor(record);
            form.setFieldsValue({ mentorId: record.id });
          }}
          disabled={record.availableSlots === 0}
          className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 border-0"
        >
          Chọn
        </Button>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
            Đăng ký Mentor
          </h1>
          <p className="text-gray-400 mt-2">
            Đăng ký mentor cho đội của bạn trong hackathon này
          </p>
        </div>
        <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
          Quay lại
        </Button>
      </div>

      {/* Current Mentor Status */}
      {teamMentor && teamMentor.status !== 'not_registered' && (
        <Card className="backdrop-blur-xl bg-white/5 border-white/10 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg text-white mb-2">Trạng thái đăng ký mentor</h3>
              <div className="flex items-center space-x-2 mb-2">
                {getMentorStatusTag()}
              </div>
              {teamMentor.mentorName && (
                <p className="text-gray-300">
                  Mentor: <span className="font-medium">{teamMentor.mentorName}</span>
                </p>
              )}
              {teamMentor.message && (
                <p className="text-gray-400 text-sm mt-2">{teamMentor.message}</p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Registration Form */}
      {(!teamMentor || teamMentor.status === 'not_registered' || teamMentor.status === 'rejected') && (
        <Card className="backdrop-blur-xl bg-white/5 border-white/10 mb-6">
          <h3 className="text-xl text-white mb-4">Chọn Mentor</h3>
          
          {selectedMentor && (
            <Alert
              message={`Đã chọn: ${selectedMentor.name}`}
              description={selectedMentor.expertise?.join(', ')}
              type="info"
              showIcon
              className="mb-4"
            />
          )}

          <Form form={form} onFinish={handleRegisterMentor} layout="vertical">
            <Form.Item
              label={<span className="text-white">Chọn Mentor</span>}
              name="mentorId"
              rules={[{ required: true, message: 'Vui lòng chọn mentor!' }]}
            >
              <Select
                placeholder="Chọn mentor từ danh sách bên dưới"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                onChange={(value) => {
                  const mentor = availableMentors.find(m => m.id === value);
                  setSelectedMentor(mentor);
                }}
              >
                {availableMentors.map((mentor) => (
                  <Option key={mentor.id} value={mentor.id} disabled={mentor.availableSlots === 0}>
                    {mentor.name} - {mentor.expertise?.join(', ')} ({mentor.availableSlots} slot)
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={<span className="text-white">Lời nhắn (tùy chọn)</span>}
              name="message"
            >
              <TextArea
                rows={3}
                placeholder="Gửi lời nhắn đến mentor..."
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={registerMentorMutation.isPending}
                className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 border-0"
                disabled={!selectedMentor}
              >
                {registerMentorMutation.isPending ? 'Đang đăng ký...' : 'Đăng ký Mentor'}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}

      {/* Available Mentors List */}
      <Card className="backdrop-blur-xl bg-white/5 border-white/10">
        <h3 className="text-xl text-white mb-4">Danh sách Mentor có sẵn</h3>
        {mentorsLoading ? (
          <div className="flex justify-center py-8">
            <Spin size="large" />
          </div>
        ) : availableMentors.length > 0 ? (
          <Table
            columns={mentorColumns}
            dataSource={availableMentors}
            pagination={false}
            rowKey="id"
            className="[&_.ant-table]:bg-transparent [&_th]:!bg-card-background [&_th]:!text-text-primary [&_td]:!text-text-secondary [&_td]:border-card-border [&_th]:border-card-border [&_tr:hover_td]:!bg-card-background/50"
          />
        ) : (
          <Empty description="Không có mentor nào có sẵn" />
        )}
      </Card>
    </div>
  );
};

export default MentorRegistration;

