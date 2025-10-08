import React, { useState } from 'react';
import {
  Input,
  Button,
  Steps,
  DatePicker,
  Select,
  InputNumber,
  Switch,
  Card,
  Space,
  Typography,
  Divider,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  FileTextOutlined,
  TeamOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import 'antd/dist/reset.css';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;
const { Title, Text } = Typography;

export default function HackathonForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [prizes, setPrizes] = useState([
    {
      id: 1,
      rank: '1st Place',
      value: '10.000.000 VND',
      description: 'Tiền mặt + Cơ hội thực tập tại FPT',
    },
    {
      id: 2,
      rank: '2nd Place',
      value: '10.000.000 VND',
      description: 'Tiền mặt + Cơ hội thực tập tại FPT',
    },
  ]);
  const [stages, setStages] = useState([
    { id: 1, name: 'Đăng ký' },
    { id: 2, name: 'Đánh giá' },
  ]);

  const steps = [
    { title: 'Thông tin cơ bản', icon: <FileTextOutlined /> },
    { title: 'Cấu hình tham gia', icon: <TeamOutlined /> },
    { title: 'Giải thưởng & Giai đoạn', icon: <TrophyOutlined /> },
    { title: 'Quy định & Xác nhận', icon: <TrophyOutlined /> },
  ];

  const addPrize = () => {
    setPrizes([
      ...prizes,
      { id: Date.now(), rank: '', value: '', description: '' },
    ]);
  };

  const removePrize = (id) => {
    setPrizes(prizes.filter((p) => p.id !== id));
  };

  const addStage = () => {
    setStages([...stages, { id: Date.now(), name: '' }]);
  };

  const removeStage = (id) => {
    setStages(stages.filter((s) => s.id !== id));
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card
            className="bg-white border border-gray-200 rounded-xl shadow-sm mt-6"
            title={
              <Space>
                <FileTextOutlined className="text-orange-500 text-lg" />
                <span className="text-gray-900 font-semibold">
                  Thông tin cơ bản
                </span>
              </Space>
            }
          >
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Tên Hackathon *
              </label>
              <Input
                placeholder="VD: SEAL Hackathon 2024"
                className="h-10 text-base"
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Tagline
              </label>
              <Input
                placeholder="Một câu mô tả ngắn gọn về hackathon"
                className="h-10 text-base"
                onChange={(e) => handleInputChange('tagline', e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Mô tả chi tiết *
              </label>
              <TextArea
                rows={6}
                placeholder="Mô tả chi tiết về hackathon, mục tiêu, chủ đề..."
                className="text-base"
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Ngày bắt đầu *
                </label>
                <DatePicker
                  showTime
                  className="w-full h-10"
                  placeholder="mm/dd/yyyy --:-- --"
                  onChange={(date) => handleInputChange('startDate', date)}
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Ngày kết thúc *
                </label>
                <DatePicker
                  showTime
                  className="w-full h-10"
                  placeholder="mm/dd/yyyy --:-- --"
                  onChange={(date) => handleInputChange('endDate', date)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Hạn đăng ký *
                </label>
                <DatePicker
                  showTime
                  className="w-full h-10"
                  placeholder="mm/dd/yyyy --:-- --"
                  onChange={(date) =>
                    handleInputChange('registrationDeadline', date)
                  }
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Hình thức *
                </label>
                <Select
                  defaultValue="online"
                  className="w-full h-10"
                  onChange={(value) => handleInputChange('format', value)}
                >
                  <Select.Option value="online">Online</Select.Option>
                  <Select.Option value="offline">Offline</Select.Option>
                  <Select.Option value="hybrid">Hybrid</Select.Option>
                </Select>
              </div>
            </div>
          </Card>
        );

      case 1:
        return (
          <Card
            className="bg-white border border-gray-200 rounded-xl shadow-sm mt-6"
            title={
              <Space>
                <TeamOutlined className="text-orange-500 text-lg" />
                <span className="text-gray-900 font-semibold">
                  Cấu hình tham gia
                </span>
              </Space>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Số thành viên tối thiểu/nhóm *
                </label>
                <InputNumber
                  min={1}
                  defaultValue={1}
                  className="w-full py-1"
                  onChange={(value) => handleInputChange('minTeamSize', value)}
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Số thành viên tối đa/nhóm *
                </label>
                <InputNumber
                  min={1}
                  defaultValue={4}
                  className="w-full py-1"
                  onChange={(value) => handleInputChange('maxTeamSize', value)}
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Số lượng người tham gia tối đa
              </label>
              <InputNumber
                placeholder="Để trống nếu không giới hạn"
                className="py-1 w-full"
                onChange={(e) =>
                  handleInputChange('maxParticipants', e.target.value)
                }
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Cho phép tham gia cá nhân
              </label>
              <Switch
                defaultChecked
                onChange={(checked) =>
                  handleInputChange('allowIndividual', checked)
                }
              />
              <div className="mt-2">
                <Text className="text-gray-500">
                  Người dùng có thể đăng ký mà không cần tạo nhóm
                </Text>
              </div>
            </div>

            <Divider className="border-gray-200" />

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Yêu cầu xác minh tài khoản
              </label>
              <Switch
                onChange={(checked) =>
                  handleInputChange('requireVerification', checked)
                }
              />
              <div className="mt-2">
                <Text className="text-gray-500">
                  Người tham gia phải xác minh email/số điện thoại trước khi
                  đăng ký
                </Text>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-6">
              <Text className="text-blue-600">
                💡 Số thành viên tối thiểu phải nhỏ hơn hoặc bằng số thành viên
                tối đa. Nếu cho phép tham gia cá nhân, số thành viên tối thiểu
                nên là 1.
              </Text>
            </div>
          </Card>
        );

      case 2:
        return (
          <div className="mt-6">
            <Card
              className="bg-white border border-gray-200 rounded-xl shadow-sm mb-6"
              title={
                <div className="flex justify-between items-center">
                  <Space>
                    <TrophyOutlined className="text-yellow-400 text-lg" />
                    <span className="text-gray-900 font-semibold">
                      Giải thưởng
                    </span>
                  </Space>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={addPrize}
                  >
                    Thêm giải
                  </Button>
                </div>
              }
            >
              {prizes.map((prize, index) => (
                <Card
                  key={prize.id}
                  className="bg-gray-50 mb-4 border border-gray-200"
                  title={
                    <div className="flex justify-between items-center">
                      <span className="text-primary text-sm font-medium">
                        {prize.rank || `${index + 1}st Place`}
                      </span>
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => removePrize(prize.id)}
                      />
                    </div>
                  }
                >
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Hạng
                    </label>
                    <Input
                      placeholder="1st Place"
                      defaultValue={prize.rank}
                      className="h-10"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Giá trị
                    </label>
                    <Input
                      placeholder="VD: 10.000.000 VND"
                      defaultValue={prize.value}
                      className="h-10"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Mô tả
                    </label>
                    <Input
                      placeholder="VD: Tiền mặt + Cơ hội thực tập tại FPT"
                      defaultValue={prize.description}
                      className="h-10"
                    />
                  </div>
                </Card>
              ))}
            </Card>

            <Card
              className="bg-white border border-gray-200 rounded-xl shadow-sm"
              title={
                <div className="flex justify-between items-center">
                  <Space>
                    <TrophyOutlined className="text-yellow-400 text-lg" />
                    <span className="text-gray-900 font-semibold">
                      Các giai đoạn
                    </span>
                  </Space>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={addStage}
                  >
                    Thêm giai đoạn
                  </Button>
                </div>
              }
            >
              {stages.map((stage, index) => (
                <Card
                  key={stage.id}
                  className="bg-gray-50 mb-4 border border-gray-200"
                  title={
                    <div className="flex justify-between items-center">
                      <span className="text-blue-500 text-sm font-medium">
                        Giai đoạn {index + 1}
                      </span>
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => removeStage(stage.id)}
                      />
                    </div>
                  }
                >
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Tên giai đoạn
                    </label>
                    <Input
                      placeholder="Đăng ký"
                      defaultValue={stage.name}
                      className="h-10"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Ngày bắt đầu
                      </label>
                      <DatePicker
                        showTime
                        className="w-full h-10"
                        placeholder="mm/dd/yyyy --:-- --"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Ngày kết thúc
                      </label>
                      <DatePicker
                        showTime
                        className="w-full h-10"
                        placeholder="mm/dd/yyyy --:-- --"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Mô tả
                    </label>
                    <TextArea
                      rows={3}
                      placeholder="Mô tả về giai đoạn này..."
                      className="text-base"
                    />
                  </div>
                </Card>
              ))}
            </Card>
          </div>
        );

      case 3:
        return (
          <Card
            className="bg-white border border-gray-200 rounded-xl shadow-sm mt-6"
            title={
              <Space>
                <TrophyOutlined className="text-yellow-500 text-lg" />
                <span className="text-gray-900 font-semibold">
                  Quy định & Tiêu chí
                </span>
              </Space>
            }
          >
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Quy định & Luật lệ *
              </label>
              <TextArea
                rows={6}
                placeholder="Nhập các quy định, luật lệ mà người tham gia cần tuân thủ..."
                className="text-base"
                onChange={(e) => handleInputChange('rules', e.target.value)}
              />
              <Text className="text-gray-500 mt-2">
                VD: Không sử dụng code có sẵn, không vi phạm bản quyền, v.v.
              </Text>
            </div>

            <Divider className="border-gray-200" />

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Yêu cầu kỹ thuật
              </label>
              <TextArea
                rows={6}
                placeholder="Các yêu cầu về công nghệ, kỹ năng cần thiết..."
                className="text-base"
                onChange={(e) =>
                  handleInputChange('techRequirements', e.target.value)
                }
              />
              <Text className="text-gray-500 mt-2">
                VD: Sử dụng React, Node.js, có kinh nghiệm với AI/ML, v.v.
              </Text>
            </div>

            <Divider className="border-gray-200" />

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Tiêu chí đánh giá
              </label>
              <TextArea
                rows={6}
                placeholder="Các tiêu chí đánh giá dự án..."
                className="text-base"
                onChange={(e) => handleInputChange('criteria', e.target.value)}
              />
              <Text className="text-gray-500 mt-2">
                VD: Tính sáng tạo (30%), Kỹ thuật (30%), Khả năng ứng dụng (40%)
              </Text>
            </div>

            <Divider className="border-gray-200" />

            <Card
              className="bg-orange-50 border border-orange-200 mt-6"
              title={
                <span className="text-gray-900 font-medium">
                  Tóm tắt - Xem lại thông tin trước khi tạo hackathon
                </span>
              }
            >
              <Space direction="vertical" className="w-full">
                <div className="flex justify-between">
                  <Text className="text-gray-600">Tên hackathon:</Text>
                  <Text strong className="text-gray-900">
                    {formData.name || 'Chưa nhập'}
                  </Text>
                </div>
                <div className="flex justify-between">
                  <Text className="text-gray-600">Danh mục:</Text>
                  <Text strong className="text-gray-900">
                    {formData.category || 'Chưa chọn'}
                  </Text>
                </div>
                <div className="flex justify-between">
                  <Text className="text-gray-600">Hình thức:</Text>
                  <Text strong className="text-gray-900">
                    {formData.format || 'online'}
                  </Text>
                </div>
                <div className="flex justify-between">
                  <Text className="text-gray-600">Số thành viên/nhóm:</Text>
                  <Text strong className="text-gray-900">
                    {formData.minTeamSize || 1} - {formData.maxTeamSize || 4}{' '}
                    người
                  </Text>
                </div>
                <div className="flex justify-between">
                  <Text className="text-gray-600">Số giải thưởng:</Text>
                  <Text strong className="text-gray-900">
                    {prizes.length} giải
                  </Text>
                </div>
                <div className="flex justify-between">
                  <Text className="text-gray-600">Số giai đoạn:</Text>
                  <Text strong className="text-gray-900">
                    {stages.length} giai đoạn
                  </Text>
                </div>
                <div className="flex justify-between">
                  <Text className="text-gray-600">Tham gia cá nhân:</Text>
                  <Text strong className="text-gray-900">
                    {formData.allowIndividual !== false ? 'Có' : 'Không'}
                  </Text>
                </div>
                <div className="flex justify-between">
                  <Text className="text-gray-600">Yêu cầu xác minh:</Text>
                  <Text strong className="text-gray-900">
                    {formData.requireVerification ? 'Có' : 'Không'}
                  </Text>
                </div>
              </Space>
            </Card>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className=" mx-auto">
        <div className="mb-8">
          <Button
            onClick={() => navigate(-1)}
            type="text"
            icon={<ArrowLeftOutlined />}
            className="mb-4 text-gray-600"
          >
            Quay lại Admin Dashboard
          </Button>

          <div className="flex justify-between items-center">
            <div>
              <Title level={3} className="text-gray-900 m-0">
                Tạo Hackathon Mới
              </Title>
              <Text className="text-gray-500">
                Thiết lập và cấu hình hackathon mới cho sinh viên FPT
              </Text>
            </div>
            <div className="bg-blue-50 text-blue-600 px-4 py-1 rounded-lg border border-blue-200">
              Bước {currentStep + 1}/4
            </div>
          </div>
        </div>

        <Steps
          current={currentStep}
          className="mb-8"
          items={steps.map((step) => ({
            title: <span className="text-gray-600">{step.title}</span>,
            icon: step.icon,
          }))}
        />

        {renderStepContent()}

        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={prevStep}
            disabled={currentStep === 0}
            className="text-gray-600"
          >
            Quay lại
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button
              type="primary"
              icon={<ArrowRightOutlined />}
              onClick={nextStep}
            >
              Tiếp theo
            </Button>
          ) : (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                console.log('Form submitted', formData);
                alert('Tạo hackathon thành công!');
              }}
            >
              Tạo Hackathon
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
