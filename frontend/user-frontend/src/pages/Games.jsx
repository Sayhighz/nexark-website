import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import SpotlightButton from '../components/ui/SpotlightButton';
import { useTranslation } from 'react-i18next';

const Games = () => {
  const { isAuthenticated, login } = useAuthContext();
  const { t } = useTranslation();

  const [spinWheelData, setSpinWheelData] = useState(null);
  const [dailyRewardData, setDailyRewardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API calls
    setSpinWheelData({
      can_spin: true,
      next_spin_time: null,
      prizes: [
        { name: '100 Credits', chance: 10 },
        { name: '50 Credits', chance: 20 },
        { name: '25 Credits', chance: 30 },
        { name: '10 Credits', chance: 40 }
      ]
    });

    setDailyRewardData({
      can_claim: true,
      streak: 5,
      reward: { amount: 10, type: 'credits' }
    });
  }, []);

  const handleSpin = async () => {
    if (!spinWheelData?.can_spin) return;

    // Require login to perform spin (gacha action)
    if (!isAuthenticated) {
      login();
      return;
    }

    setIsSpinning(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock result
      const prizes = spinWheelData.prizes;
      const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];

      alert(`Congratulations! You won ${randomPrize.name}!`);

      // Update spin data
      setSpinWheelData(prev => ({
        ...prev,
        can_spin: false,
        next_spin_time: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
      }));
    } catch (error) {
      console.error('Spin wheel error:', error);
      setError('Failed to spin the wheel');
    } finally {
      setIsSpinning(false);
    }
  };

  const handleClaimDaily = async () => {
    if (!dailyRewardData?.can_claim) return;

    // Require login to claim daily rewards
    if (!isAuthenticated) {
      login();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      alert(`Daily reward claimed! You received ${dailyRewardData.reward.amount} ${dailyRewardData.reward.type}!`);

      // Update daily reward data
      setDailyRewardData(prev => ({
        ...prev,
        can_claim: false,
        streak: prev.streak + 1
      }));
    } catch (error) {
      console.error('Daily reward error:', error);
      setError('Failed to claim daily reward');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('games.title')}</h1>
        <p className="text-gray-600">{t('games.subtitle')}</p>
      </div>

      {/* Error Message */}
      {error && (
        <ErrorMessage error={error} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spin Wheel */}
        <div className="card">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">{t('games.spinWheel')}</h2>
            <p className="text-gray-600 mb-6">
              {t('games.spinDesc')}
            </p>

            {/* Wheel Visualization */}
            <div className="relative w-64 h-64 mx-auto mb-6">
              <div className={`w-full h-full rounded-full border-8 border-blue-200 flex items-center justify-center ${
                isSpinning ? 'animate-spin' : ''
              }`}>
                <div className="text-center">
                  <div className="text-4xl mb-2">🎯</div>
                  <div className="text-sm text-gray-600">{t('games.spinCenter')}</div>
                </div>
              </div>
            </div>

            {/* Prize List */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              {spinWheelData?.prizes.map((prize, index) => (
                <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                  {prize.name}
                </div>
              ))}
            </div>

            {/* Spin Button */}
            <SpotlightButton
              onClick={handleSpin}
              disabled={!spinWheelData?.can_spin || isSpinning}
              variant={spinWheelData?.can_spin && !isSpinning ? 'accent' : 'primary'}
              size="lg"
              className="w-full"
            >
              {isSpinning ? t('games.spinning') : spinWheelData?.can_spin ? t('games.spin') : t('games.comeBackTomorrow')}
            </SpotlightButton>

            {!spinWheelData?.can_spin && spinWheelData?.next_spin_time && (
              <p className="text-sm text-gray-500 mt-2">
                {t('games.nextSpin', { time: new Date(spinWheelData.next_spin_time).toLocaleString() })}
              </p>
            )}
          </div>
        </div>

        {/* Daily Rewards */}
        <div className="card">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">{t('games.dailyRewards')}</h2>
            <p className="text-gray-600 mb-6">
              {t('games.dailyDesc')}
            </p>

            {/* Streak Display */}
            <div className="bg-yellow-50 p-4 rounded-lg mb-6">
              <div className="text-2xl mb-2">🔥</div>
              <div className="text-xl font-bold text-yellow-700">
                {t('games.streak', { count: dailyRewardData?.streak || 0 })}
              </div>
              <div className="text-sm text-yellow-600">
                {t('games.keepItUp')}
              </div>
            </div>

            {/* Reward Display */}
            {dailyRewardData?.reward && (
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <div className="text-lg font-semibold text-green-700 mb-2">
                  {t('games.todaysReward')}
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {dailyRewardData.reward.amount} {dailyRewardData.reward.type}
                </div>
              </div>
            )}

            {/* Claim Button */}
            <SpotlightButton
              onClick={handleClaimDaily}
              disabled={!dailyRewardData?.can_claim || loading}
              variant={dailyRewardData?.can_claim && !loading ? 'accent' : 'primary'}
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700 border-green-600"
            >
              {loading ? t('games.claiming') : dailyRewardData?.can_claim ? t('games.claim') : t('games.alreadyClaimed')}
            </SpotlightButton>

            {!dailyRewardData?.can_claim && (
              <p className="text-sm text-gray-500 mt-2">
                {t('games.comeBackTomorrow')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Game Rules */}
      <div className="card bg-blue-50">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          {t('games.rules.title')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h4 className="font-medium">{t('games.rules.spinWheel')}</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>{t('games.rules.spinRules.0')}</li>
              <li>{t('games.rules.spinRules.1')}</li>
              <li>{t('games.rules.spinRules.2')}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium">{t('games.rules.dailyRewards')}</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>{t('games.rules.dailyRules.0')}</li>
              <li>{t('games.rules.dailyRules.1')}</li>
              <li>{t('games.rules.dailyRules.2')}</li>
            </ul>
    </div>
  </div>
      </div>
    </div>
  );
};

export default Games;