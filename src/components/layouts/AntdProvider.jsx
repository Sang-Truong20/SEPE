import { ConfigProvider } from 'antd';
import React from 'react';

const AntdProvider = ({ children }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#01bd30',
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default AntdProvider;
