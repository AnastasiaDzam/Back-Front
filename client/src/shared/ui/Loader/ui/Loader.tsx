import React, { type ReactNode } from 'react';
import { Spin } from 'antd';

type LoaderProps = {
  loading: boolean;
  children?: ReactNode;
};

const contentStyle: React.CSSProperties = {
  padding: 50,
  background: 'rgba(0, 0, 0, 0.05)',
  borderRadius: 4,
};

export const Loader: React.FC<LoaderProps> = ({ loading, children }) => {
  if (!loading) {
    return <>{children}</>;
  }

  return (
    <Spin tip="Loading" size="large">
      <div style={contentStyle} />
    </Spin>
  );
};
