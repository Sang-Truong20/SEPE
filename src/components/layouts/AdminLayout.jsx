import {
    FileOutlined,
    PieChartOutlined,
    SettingOutlined,
    TeamOutlined,
    TrophyOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Avatar, Dropdown, Layout, Menu, theme } from 'antd';
import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { PATH_NAME } from '../../constants';

const { Header, Content, Sider } = Layout;

function getItem(
  label,
  key,
  icon,
  children,
) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem('Dashboard', '1', <PieChartOutlined />),
  getItem('Challenges', 'sub1', <TrophyOutlined />, [
    getItem(<Link to={PATH_NAME.ADMIN_CHALLENGE_CREATE}>Create Challenge</Link>, '2'),
    getItem('Manage Challenges', '3'),
  ]),
  getItem('Users', '4', <UserOutlined />),
  getItem('Teams', '5', <TeamOutlined />),
  getItem('Files', '6', <FileOutlined />),
  getItem('Settings', '7', <SettingOutlined />),
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const userMenuItems = [
    {
      key: '1',
      label: 'Profile',
    },
    {
      key: '2',
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: '3',
      label: 'Logout',
      danger: true,
    },
  ];

  const handleUserMenuClick = ({ key }) => {
    if (key === '3') {
      // Handle logout
      console.log('Logout clicked');
    }
  };


  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="dark"
        width={280}
      >
        <div className="demo-logo-vertical p-4">
          <div className="flex items-center space-x-3">
            <Avatar size="large" icon={<UserOutlined />} />
            {!collapsed && (
              <div>
                <div className="text-white font-semibold">Admin Panel</div>
                <div className="text-gray-300 text-sm">Administrator</div>
              </div>
            )}
          </div>
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={items}
          selectedKeys={[location.pathname]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            boxShadow: '0 1px 4px rgba(0,21,41,.08)',
            borderBottom: '2px solid #f0f0f0',
          }}
        >
          
          <Dropdown
            menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
            placement="bottomRight"
          >
            <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 px-3 py-2 rounded">
              <Avatar icon={<UserOutlined />} />
              <span className="font-medium">Admin User</span>
            </div>
          </Dropdown>
        </Header>
        <Content style={{  padding: 24, background: colorBgContainer, borderRadius: borderRadiusLG }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
