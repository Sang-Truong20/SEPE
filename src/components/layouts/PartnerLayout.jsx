import {
  FileOutlined,
  PieChartOutlined,
  TrophyOutlined,
  TeamOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import { Avatar, Dropdown, Layout, Menu } from 'antd';
import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { GROUP, PATH_NAME } from '../../constants';
import { useUserData } from '../../hooks/useUserData.js';
import { useLogout } from '../../hooks/useLogout.js';

const { Header, Content, Sider } = Layout;

function getItem(label, key, icon, children) {
  return { key, icon, children, label };
}

// === MENU CHỈ CÓ 3 CHỨC NĂNG ===
const items = [
  getItem(
    <Link to={PATH_NAME.PARTNER_HACKATHONS}>Danh sách Hackathon</Link>,
    PATH_NAME.PARTNER_HACKATHONS,
    <RocketOutlined />,
  ),
  getItem(
    <Link to={PATH_NAME.PARTNER_CHALLENGES}>Thử thách</Link>,
    PATH_NAME.PARTNER_CHALLENGES,
    <TrophyOutlined />,
  ),
  getItem(
    <Link to={`${PATH_NAME.PARTNER_TEAM_SCORES}/hackathon`}>Điểm nhóm</Link>,
    PATH_NAME.PARTNER_TEAM_SCORES,
    <TeamOutlined />,
  ),
];

const PartnerLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { userInfo } = useUserData();
  const mutationLogout = useLogout();

  const userMenuItems = [{ key: 'logout', label: 'Đăng xuất', danger: true }];

  const handleUserMenuClick = ({ key }) => {
    if (key === 'logout') {
      mutationLogout();
    }
  };

  // Tìm key phù hợp nhất (chuỗi PATH_NAME nằm trong location.pathname)
  function getMenuKeys(items) {
    const keys = [];

    function walk(list) {
      list.forEach((item) => {
        if (item.key && !item.children) keys.push(item.key);
        if (item.children) walk(item.children);
      });
    }

    walk(items);
    return keys;
  }

  function findSelectedKey(pathname, items, group) {
    const menuKeys = getMenuKeys(items);

    // 1. Tìm theo key trong menu (ưu tiên)
    const matchMenu =
      menuKeys
        .filter((p) => pathname.startsWith(p))
        .sort((a, b) => b.length - a.length)[0] || null;

    if (matchMenu) return matchMenu;

    // 2. Không có → fallback group
    for (const [groupKey, groupPaths] of Object.entries(group)) {
      if (groupPaths.some((p) => pathname.startsWith(p))) return groupKey;
    }

    // 3. cuối cùng → fallback PATH_NAME
    const allPaths = Object.values(PATH_NAME);
    return (
      allPaths
        .filter((p) => pathname.startsWith(p))
        .sort((a, b) => b.length - a.length)[0] || pathname
    );
  }
  const selectedKey = findSelectedKey(location.pathname, items, GROUP);

  const openKey = items.find((item) =>
    item.children?.some((child) => selectedKey.startsWith(child.key)),
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
            <Avatar size="large" icon={<TrophyOutlined />} />
            {!collapsed && (
              <div>
                <div className="text-white font-semibold">Partner Panel</div>
                <div className="text-gray-400 text-sm">Đối tác tổ chức</div>
              </div>
            )}
          </div>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          items={items}
          selectedKeys={[selectedKey]}
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
          className="bg-dark-secondary border-dark-accent"
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
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            zIndex: 99,
            transition: 'all 0.2s',
          }}
        >
          <Dropdown
            menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
            placement="bottomRight"
          >
            <div className="flex items-center space-x-2 cursor-pointer hover:bg-[#2f2f2f] px-3 py-2 rounded">
              <Avatar icon={<TrophyOutlined />} />
              <span className="font-medium text-white">
                {userInfo?.fullName || 'Partner'}
              </span>
            </div>
          </Dropdown>
        </Header>

        <Content
          style={{
            marginTop: 64,
            minHeight: 'calc(100vh - 64px)',
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

export default PartnerLayout;
