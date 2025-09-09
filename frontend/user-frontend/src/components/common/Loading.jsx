import React from 'react';
import { Spin, Typography } from 'antd';

const { Text } = Typography;

const Loading = ({ size = 'default', message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Spin size={size} />
      {message && (
        <Text className="mt-4 text-gray-600">{message}</Text>
      )}
    </div>
  );
};

export default Loading;