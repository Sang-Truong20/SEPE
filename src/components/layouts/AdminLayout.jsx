import {
  FileOutlined,
  PieChartOutlined,
  SettingOutlined,
  TeamOutlined,
  TrophyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Dropdown, Layout, Menu } from 'antd';
import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { PATH_NAME } from '../../constants';

const { Header, Content, Sider } = Layout;

function getItem(label, key, icon, children) {
  return { key, icon, children, label };
}

const items = [
  getItem(
    <Link to={PATH_NAME.ADMIN_DASHBOARD}>Dashboard</Link>,
    PATH_NAME.ADMIN_DASHBOARD,
    <PieChartOutlined />,
  ),
  getItem('Challenges', 'sub1', <TrophyOutlined />, [
    getItem(
      <Link to={PATH_NAME.ADMIN_CHALLENGE_CREATE}>Create Challenge</Link>,
      PATH_NAME.ADMIN_CHALLENGE_CREATE,
    ),
    getItem(
      <Link to={PATH_NAME.ADMIN_CHALLENGE_MANAGE}>Manage Challenges</Link>,
      PATH_NAME.ADMIN_CHALLENGE_MANAGE,
    ),
  ]),
  getItem(
    <Link to={PATH_NAME.ADMIN_USERS}>Users</Link>,
    PATH_NAME.ADMIN_USERS,
    <UserOutlined />,
  ),
  getItem(
    <Link to={PATH_NAME.ADMIN_TEAMS}>Teams</Link>,
    PATH_NAME.ADMIN_TEAMS,
    <TeamOutlined />,
  ),
  getItem(
    <Link to={PATH_NAME.ADMIN_FILES}>Files</Link>,
    PATH_NAME.ADMIN_FILES,
    <FileOutlined />,
  ),
  getItem(
    <Link to={PATH_NAME.ADMIN_SETTINGS}>Settings</Link>,
    PATH_NAME.ADMIN_SETTINGS,
    <SettingOutlined />,
  ),
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const userMenuItems = [
    { key: '1', label: 'Profile' },
    { key: '2', label: 'Settings' },
    { type: 'divider' },
    { key: '3', label: 'Logout', danger: true },
  ];

  const handleUserMenuClick = ({ key }) => {
    if (key === '3') {
      console.log('Logout clicked');
    }
  };

  const openKey = items.find((item) =>
    item.children?.some((child) => child.key === location.pathname),
  )?.key;

  return (
    <Layout style={{ minHeight: '100vh' }} className="bg-dark-primary">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="dark"
        width={265}
        style={{
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          bottom: 0,
          overflow: 'auto',
          boxShadow: '2px 0 6px rgba(0,0,0,0.3)',
          zIndex: 100,
        }}
        className="bg-dark-secondary"
      >
        <style>{`
          .ant-layout-sider-trigger {
            background-color: rgb(23, 32, 30) !important;
            color: #ccc !important;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }
          .ant-layout-sider-trigger:hover {
            background-color: rgb(30, 42, 39) !important;
            color: #fff !important;
          }
        `}</style>
        <div className="demo-logo-vertical p-4">
          <div className="flex items-center space-x-3">
            <Avatar size="large" icon={<UserOutlined />} />
            {!collapsed && (
              <div>
                <div className="text-white font-semibold">Admin Panel</div>
                <div className="text-gray-400 text-sm">Administrator</div>
              </div>
            )}
          </div>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          items={items}
          selectedKeys={[location.pathname]}
          defaultOpenKeys={openKey ? [openKey] : []}
          className="bg-dark-secondary"
        />
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? 80 : 265,
          transition: 'all 0.2s',
        }}
      >
        <Header
          className="bg-dark-secondary border-dark-accent overflow-hidden"
          style={{
            position: 'fixed',
            top: 0,
            left: collapsed ? 80 : 265,
            right: 0,
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 24px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
            borderBottom: '1px solid',
            zIndex: 99,
            transition: 'all 0.2s',
          }}
        >
          <Dropdown
            menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
            placement="bottomRight"
          >
            <div className="flex items-center space-x-2 cursor-pointer hover:bg-[#2f2f2f] px-3 py-2 rounded">
              <Avatar icon={<UserOutlined />} />
              <span className="font-medium text-white">Admin User</span>
            </div>
          </Dropdown>
        </Header>

        <Content
          style={{
            marginTop: 64,
            height: 'calc(100vh - 64px)',
            overflowY: 'auto',
            padding: 16,
            backgroundColor: '#0A1F1C',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
