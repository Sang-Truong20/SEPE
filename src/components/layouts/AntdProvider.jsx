import { ConfigProvider, theme } from 'antd';
import React from 'react';

const { darkAlgorithm } = theme;

const AntdProvider = ({ children }) => {
  return (
    <ConfigProvider
      theme={{
        algorithm: darkAlgorithm,
        token: {
          // Primary colors matching the green theme
          colorPrimary: '#22c55e', // green-500
          colorPrimaryHover: '#16a34a', // green-600

          // Background colors
          colorBgContainer: 'rgba(17, 24, 39, 0.6)', // gray-800 with opacity
          colorBgLayout: '#0a0f1a', // very dark blue
          colorBgSpotlight: 'rgba(17, 24, 39, 0.8)',

          // Text colors
          colorText: '#ffffff',
          colorTextSecondary: '#9ca3af', // gray-400
          colorTextTertiary: '#6b7280', // gray-500
          colorTextQuaternary: '#4b5563', // gray-600

          // Border colors
          colorBorder: 'rgba(255, 255, 255, 0.08)',
          colorBorderSecondary: 'rgba(255, 255, 255, 0.05)',

          // Component specific colors
          colorBgElevated: 'rgba(17, 24, 39, 0.8)',
          colorFill: 'rgba(255, 255, 255, 0.05)',
          colorFillSecondary: 'rgba(255, 255, 255, 0.03)',
          colorFillTertiary: 'rgba(255, 255, 255, 0.02)',
          colorFillQuaternary: 'rgba(255, 255, 255, 0.01)',

          // Button colors
          colorBgTextHover: 'rgba(34, 197, 94, 0.1)',
          colorBgTextActive: 'rgba(34, 197, 94, 0.15)',

          // Table colors
          colorBgContainerSecondary: 'rgba(17, 24, 39, 0.4)',

          // Input colors
          colorBgInput: 'rgba(17, 24, 39, 0.6)',

          // Shadow
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
          boxShadowSecondary: '0 1px 3px 0 rgba(0, 0, 0, 0.2)',

          // Border radius
          borderRadius: 8,
          borderRadiusLG: 12,
          borderRadiusSM: 6,

          // Font
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        components: {
          Card: {
            colorBgContainer: 'rgba(17, 24, 39, 0.6)',
            colorBorderSecondary: 'rgba(255, 255, 255, 0.08)',
          },
          Button: {
            colorBgContainer: 'rgba(17, 24, 39, 0.6)',
            colorBorder: 'rgba(255, 255, 255, 0.08)',
            colorBgTextHover: 'rgba(34, 197, 94, 0.1)',
            colorBgTextActive: 'rgba(34, 197, 94, 0.15)',
            colorText: '#ffffff',
            borderRadius: 8,
          },
          Table: {
            colorBgContainer: 'transparent',
            colorBorderSecondary: 'rgba(255, 255, 255, 0.05)',
            colorFillAlter: 'rgba(255, 255, 255, 0.02)',
          },
          Progress: {
            colorBgContainer: 'rgba(255, 255, 255, 0.1)',
          },
          Badge: {
            colorBgContainer: 'rgba(17, 24, 39, 0.8)',
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default AntdProvider;
