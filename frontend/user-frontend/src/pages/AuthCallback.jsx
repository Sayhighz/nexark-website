import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'antd';
import { useAuthContext } from '../contexts/AuthContext';
import Loading from '../components/common/Loading';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.2),rgba(255,255,255,0))]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.2),rgba(255,255,255,0))]"></div>
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-twinkle opacity-60"></div>
        <div className="absolute top-3/4 left-3/4 w-1 h-1 bg-purple-400 rounded-full animate-twinkle opacity-60" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/6 w-1.5 h-1.5 bg-blue-300 rounded-full animate-twinkle opacity-60" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/6 left-5/6 w-1 h-1 bg-purple-300 rounded-full animate-twinkle opacity-60" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md text-center">
        {!error ? (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
            <Loading size="lg" message="กำลังเข้าสู่ระบบด้วย Steam..." />
          </div>
        ) : (
          <div className="bg-red-900/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-6">
            <div className="text-red-400 mb-4">
              <svg className="w-12 h-12 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-300 mb-2" style={{ fontFamily: 'SukhumvitSet' }}>
              การเข้าสู่ระบบล้มเหลว
            </h3>
            <p className="text-red-200 text-sm" style={{ fontFamily: 'SukhumvitSet' }}>
              {error}
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
              style={{ fontFamily: 'SukhumvitSet' }}
            >
              กลับหน้าหลัก
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;