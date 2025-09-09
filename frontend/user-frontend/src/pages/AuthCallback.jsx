import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin, Alert } from 'antd';
import { useAuthContext } from '../contexts/AuthContext';

function parseQuery(search) {
  const params = new URLSearchParams(search);
  const obj = {};
  for (const [key, value] of params.entries()) {
    obj[key] = value;
  }
  return obj;
}

const AuthCallback = () => {
  const { handleCallback } = useAuthContext();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        const query = parseQuery(window.location.search);
        // Steam returns to our backend, which redirects to this page with the OpenID params.
        // We forward these params to the API to finalize auth, then redirect inside the SPA.
        await handleCallback(query);
        navigate('/servers', { replace: true });
      } catch (err) {
        setError(err?.response?.data?.error?.message || 'Authentication failed');
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md text-center">
        {!error ? (
          <>
            <Spin size="large" />
            <p className="mt-4 text-gray-600">Completing sign-in with Steam...</p>
          </>
        ) : (
          <Alert
            message="Steam sign-in failed"
            description={error}
            type="error"
            showIcon
          />
        )}
      </div>
    </div>
  );
};

export default AuthCallback;