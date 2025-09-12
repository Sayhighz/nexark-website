import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Typography } from 'antd';
import { RocketOutlined, DesktopOutlined } from '@ant-design/icons';
import { animate } from 'animejs';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph, Text } = Typography;

const RateCard = ({ title, icon, rates, to, variant = 'x25' }) => {
  const { t } = useTranslation();
  const gradient =
    variant === 'x25'
      ? 'from-blue-900/40 to-blue-800/40 border-blue-500/40 hover:border-blue-400/60'
      : 'from-blue-800/40 to-blue-900/40 border-blue-600/40 hover:border-blue-500/60';

  const btnGradient =
    variant === 'x25'
      ? 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
      : 'from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900';

  return (
    <Card className={`bg-gradient-to-br ${gradient} backdrop-blur-sm rounded-2xl p-8 shadow-xl`}>
      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mb-6 flex items-center justify-center text-3xl">
        {icon}
      </div>
      <Title level={2} className="text-white mb-2 text-3xl">
        {title}
      </Title>
      <div className="grid grid-cols-4 gap-3 mb-6">
        {rates.map((r) => (
          <div key={r.label} className="bg-blue-900/30 rounded-lg p-3 text-center">
            <div className="text-blue-300 text-xs font-medium">{r.label}</div>
            <div className="text-white text-lg font-bold">{r.value}</div>
          </div>
        ))}
      </div>
      <Button
        type="primary"
        size="large"
        icon={<RocketOutlined />}
        className={`w-full bg-gradient-to-r ${btnGradient} border-none py-4 h-auto text-lg font-semibold`}
      >
        <Link to={to}>{t('serverShowcase.enter', { title })}</Link>
      </Button>
    </Card>
  );
};

const ServerShowcase = () => {
  const { t } = useTranslation();
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    animate(containerRef.current, {
      translateY: [60, 0],
      opacity: [0, 1],
      duration: 1000,
      ease: 'outExpo',
      delay: 200,
    });
  }, []);

  const rates25 = [
    { label: t('serverShowcase.rateLabels.taming'), value: '25x' },
    { label: t('serverShowcase.rateLabels.harvest'), value: '25x' },
    { label: t('serverShowcase.rateLabels.breeding'), value: '25x' },
    { label: t('serverShowcase.rateLabels.xp'), value: '25x' },
  ];

  const rates100 = [
    { label: t('serverShowcase.rateLabels.taming'), value: '100x' },
    { label: t('serverShowcase.rateLabels.harvest'), value: '100x' },
    { label: t('serverShowcase.rateLabels.breeding'), value: '100x' },
    { label: t('serverShowcase.rateLabels.xp'), value: '100x' },
  ];

  return (
    <section ref={containerRef} className="relative max-w-6xl mx-auto px-6 py-16 opacity-0">
      <div className="text-center mb-12">
        <Title level={2} className="text-white text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            {t('serverShowcase.title')}
          </span>
        </Title>
        <Paragraph className="text-xl text-gray-300">
          {t('serverShowcase.subtitle')}
        </Paragraph>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <RateCard
          title={t('serverShowcase.x25Title')}
          icon={<span role="img" aria-label="earth">🌍</span>}
          rates={rates25}
          to="/servers/x25"
          variant="x25"
        />
        <RateCard
          title={t('serverShowcase.x100Title')}
          icon={<span role="img" aria-label="nebula">🌌</span>}
          rates={rates100}
          to="/servers/x100"
          variant="x100"
        />
      </div>

      <div className="mt-10 text-center">
        <Button
          size="large"
          icon={<DesktopOutlined />}
          className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-8 py-4 h-auto text-lg font-medium backdrop-blur-sm"
        >
          <Link to="/servers">{t('serverShowcase.exploreAll')}</Link>
        </Button>
      </div>
    </section>
  );
};

export default ServerShowcase;