import React from 'react';
import { Alert, Button } from 'antd';
import { useTranslation } from 'react-i18next';

const ErrorMessage = ({ error, onRetry }) => {
  const { t } = useTranslation();

  if (!error) return null;

  const errorMessage = typeof error === 'string' ? error : error.message || t('common.error');

  return (
    <Alert
      message={t('common.error')}
      description={errorMessage}
      type="error"
      showIcon
      action={
        onRetry && (
          <Button size="small" danger onClick={onRetry}>
            {t('common.tryAgain')}
          </Button>
        )
      }
      className="mb-4"
    />
  );
};

export default ErrorMessage;