import React from 'react';
import { Alert, Button } from 'antd';

const ErrorMessage = ({ error, onRetry }) => {
  if (!error) return null;

  const errorMessage = typeof error === 'string' ? error : error.message || 'An error occurred';

  return (
    <Alert
      message="Error"
      description={errorMessage}
      type="error"
      showIcon
      action={
        onRetry && (
          <Button size="small" danger onClick={onRetry}>
            Try Again
          </Button>
        )
      }
      className="mb-4"
    />
  );
};

export default ErrorMessage;