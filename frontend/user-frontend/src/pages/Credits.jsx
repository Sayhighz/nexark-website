import React, { useEffect, useState } from 'react';
import { useCredits } from '../hooks/useCredits';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import SpotlightButton from '../components/ui/SpotlightButton';
import { Sparkles } from '../components/ui/Sparkles';
import { useTranslation } from 'react-i18next';

const Credits = () => {
  const { t } = useTranslation();
  const {
    getBalance,
    topUp,
    loading,
    error
  } = useCredits();

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const packages = [
    {
      amount: 100,
      bonus: 0,
      display: "100 บาท"
    },
    {
      amount: 200,
      bonus: 5,
      display: "200 บาท (+5 บาทโบนัส)"
    },
    {
      amount: 500,
      bonus: 50,
      display: "500 บาท (+50 บาทโบนัส)"
    },
    {
      amount: 1000,
      bonus: 300,
      display: "1,000 บาท (+300 บาทโบนัส)"
    }
  ];

  useEffect(() => {
    getBalance();
    
    // Check for payment status from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const sessionId = urlParams.get('session_id');
    
    if (status === 'success' && sessionId) {
      setShowSuccess(true);
      // Refresh balance after successful payment
      setTimeout(() => {
        getBalance();
        setShowSuccess(false);
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }, 3000);
    } else if (status === 'cancelled') {
      // Handle cancelled payment
      console.log('Payment was cancelled');
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [getBalance]);

  const handleTopUp = async (pkg) => {
    if (!acceptTerms) {
      alert(t('credits.acceptTermsLabel'));
      return;
    }

    try {
      const result = await topUp({
        amount: pkg.amount, // Don't include bonus in the payment amount
        currency: 'thb',
        payment_method: 'promptpay'
      });

      // Redirect to Stripe Checkout
      if (result && result.checkout_url) {
        window.location.href = result.checkout_url;
      } else {
        alert('เกิดข้อผิดพลาด: ไม่สามารถเปิดหน้าชำระเงินได้');
      }
    } catch (err) {
      console.error('Payment error:', err);
      
      // Better error handling with Thai messages
      let errorMessage = 'เกิดข้อผิดพลาดในการเติมเงิน';
      
      if (err.response?.data?.error?.message) {
        const backendError = err.response.data.error.message;
        if (backendError.includes('pending payment')) {
          errorMessage = 'คุณมีการชำระเงินที่รอดำเนินการอยู่ กรุณารอสักครู่แล้วลองใหม่อีกครั้ง';
        } else if (backendError.includes('amount')) {
          errorMessage = 'จำนวนเงินไม่ถูกต้อง (ขั้นต่ำ 100 บาท สูงสุด 50,000 บาท)';
        } else if (backendError.includes('user account is banned')) {
          errorMessage = 'บัญชีของคุณถูกระงับ ไม่สามารถเติมเงินได้';
        } else if (backendError.includes('Invalid or expired token')) {
          errorMessage = 'กรุณาเข้าสู่ระบบใหม่';
          window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        } else {
          errorMessage = `เกิดข้อผิดพลาด: ${backendError}`;
        }
      } else if (err.response?.status === 401) {
        errorMessage = 'กรุณาเข้าสู่ระบบก่อนเติมเงิน';
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      } else if (err.response?.status === 429) {
        errorMessage = 'มีการร้องขอมากเกินไป กรุณารอสักครู่แล้วลองใหม่';
      } else if (!navigator.onLine) {
        errorMessage = 'ไม่มีการเชื่อมต่ออินเทอร์เน็ต กรุณาตรวจสอบการเชื่อมต่อ';
      }
      
      alert(errorMessage);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* ServerHero Style Header */}
      <>
        {/* Text header */}
        <div className="relative pt-20 pb-8">
          <div className="relative z-20 text-center px-4">
            <h1 className="text-5xl font-bold mb-4 text-white" style={{ fontFamily: 'SukhumvitSet' }}>
              {t('credits.title')}
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'SukhumvitSet' }}>
              {t('credits.subtitle')}
            </p>
          </div>
        </div>

        {/* Background band with sparkles */}
        <div className="relative mb-8">
          <div className="relative h-32 overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,#8350e8,transparent_70%)] before:opacity-40 after:absolute after:-left-1/2 after:top-1/2 after:aspect-[1/0.7] after:w-[200%] after:rounded-[100%] after:border-t after:border-[#7876c566] after:bg-zinc-900">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
              style={{
                backgroundImage: `url('https://cdn.discordapp.com/attachments/820713052684419082/1002956012493471884/Server_Banner.png')`
              }}
            ></div>

            <Sparkles
              density={800}
              className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
              color="#8350e8"
              size={1.5}
              speed={0.3}
            />
          </div>
        </div>
      </>

      {/* Content */}
      <div className="relative z-20">
        <div className="container mx-auto px-4 max-w-6xl py-8">
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 rounded-lg backdrop-blur-sm">
              <p className="text-red-300" style={{ fontFamily: 'SukhumvitSet' }}>{error}</p>
            </div>
          )}

          {/* Package Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-6" style={{ fontFamily: 'SukhumvitSet' }}>{t('credits.selectPackage')}</h2>
            <div className="grid grid-cols-4 gap-4">
              {packages.map((pkg, index) => (
                <div
                  key={pkg.amount}
                  className={`relative p-6 rounded-lg border-2 transition-all cursor-pointer backdrop-blur-sm flex flex-col justify-between min-h-[180px] ${
                    selectedPackage === index
                      ? 'border-blue-500 bg-blue-600/20'
                      : 'border-white/20 bg-white/10 hover:border-white/30 hover:bg-white/15'
                  }`}
                  onClick={() => setSelectedPackage(index)}
                >
                  {/* Bonus Badge */}
                  {pkg.bonus > 0 && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full" style={{ fontFamily: 'SukhumvitSet' }}>
                      {t('credits.bonus', { currency: t('common.currencySymbol'), amount: pkg.bonus })}
                    </div>
                  )}
                  
                  {/* Package Content */}
                  <div className="text-center flex-1 flex flex-col justify-center">
                    <div className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'SukhumvitSet' }}>
                      {t('common.currencySymbol')}{pkg.amount.toLocaleString()}
                    </div>
                    
                    <div className="h-6 mb-2">
                      {pkg.bonus > 0 ? (
                        <div className="text-green-400 text-sm" style={{ fontFamily: 'SukhumvitSet' }}>
                          {t('credits.bonus', { currency: t('common.currencySymbol'), amount: pkg.bonus })}
                        </div>
                      ) : (
                        <div className="text-sm text-transparent">-</div>
                      )}
                    </div>
                    
                    <div className="text-gray-300 text-sm mb-4" style={{ fontFamily: 'SukhumvitSet' }}>
                      {t('common.currencySymbol')}{(pkg.amount + pkg.bonus).toLocaleString()}
                    </div>
                  </div>
                  
                  {/* Button at bottom */}
                  <div className="mt-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTopUp(pkg);
                      }}
                      disabled={loading}
                      className="w-full py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      style={{ fontFamily: 'SukhumvitSet' }}
                    >
                      {t('credits.topUpButton')}
                    </button>
                  </div>
                  
                  {/* Popular Badge for best value */}
                  {pkg.amount === 1000 && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full" style={{ fontFamily: 'SukhumvitSet' }}>
                      {t('credits.bestValue')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="mb-8 p-4 bg-green-900/50 border border-green-500/50 rounded-lg backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="text-green-300 font-medium" style={{ fontFamily: 'SukhumvitSet' }}>{t('credits.successTitle')}</div>
                  <div className="text-green-400 text-sm" style={{ fontFamily: 'SukhumvitSet' }}>{t('credits.successDesc')}</div>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="mb-8 p-4 bg-blue-900/50 border border-blue-500/50 rounded-lg backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                <div>
                  <div className="text-blue-300 font-medium" style={{ fontFamily: 'SukhumvitSet' }}>{t('credits.processing')}</div>
                  <div className="text-blue-400 text-sm" style={{ fontFamily: 'SukhumvitSet' }}>{t('credits.pleaseWait')}</div>
                </div>
              </div>
            </div>
          )}

          {/* Terms and Conditions */}
          <div className="space-y-4 mb-8">
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 rounded border-gray-600 bg-white/10 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-300" style={{ fontFamily: 'SukhumvitSet' }}>
                {t('credits.acceptTermsLabel')}{' '}
                <button className="text-blue-400 hover:text-blue-300 hover:underline">{t('credits.terms')}</button> {' '}
                {t('common.and') ? t('common.and') : ''} {' '}
                <button className="text-blue-400 hover:text-blue-300 hover:underline">{t('credits.conditions')}</button>
              </span>
            </label>
            
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                className="mt-1 rounded border-gray-600 bg-white/10 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-300" style={{ fontFamily: 'SukhumvitSet' }}>
                {t('credits.avoidTransferWindow')}
              </span>
            </label>
          </div>

          {/* Warnings */}
          <div className="bg-blue-900/30 border border-blue-500/30 p-6 rounded-lg backdrop-blur-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-white" style={{ fontFamily: 'SukhumvitSet' }}>{t('credits.warnings.title')}</h3>
              <button className="text-blue-400 hover:text-blue-300 text-sm hover:underline" style={{ fontFamily: 'SukhumvitSet' }}>{t('credits.warnings.contactAdmin')}</button>
            </div>
            <ul className="text-sm text-gray-300 space-y-2" style={{ fontFamily: 'SukhumvitSet' }}>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                {t('credits.warnings.w1')}
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                {t('credits.warnings.w2')}
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                {t('credits.warnings.w3')}
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom gradient transition */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none"></div>
    </div>
  );
};

export default Credits;