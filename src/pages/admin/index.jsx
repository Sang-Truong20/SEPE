import { Card, Row, Col, Statistic, Progress, Breadcrumb } from 'antd';
import {
  TrophyOutlined,
  UserOutlined,
  TeamOutlined,
  FileOutlined,
  HomeOutlined
} from '@ant-design/icons';

const AdminHome = () => {
  return (
    <div>
      <div className="mb-6">
        <Breadcrumb
          items={[
            {
              href: '/admin',
              title: <HomeOutlined />,
            },
            {
              title: 'Dashboard',
            },
          ]}
          style={{ marginBottom: '16px' }}
        />
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to the admin panel</p>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Challenges"
              value={42}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Users"
              value={128}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Teams"
              value={16}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Files"
              value={89}
              prefix={<FileOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} lg={12}>
          <Card title="Recent Activity" size="small">
            <p className="text-sm text-gray-600">No recent activity to display</p>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="System Status" size="small">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Server Load</span>
                  <span>65%</span>
                </div>
                <Progress percent={65} size="small" status="active" />
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>Storage Used</span>
                  <span>82%</span>
                </div>
                <Progress percent={82} size="small" status="active" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminHome;
