"use client"

import React from 'react'
import clsx from "clsx"
import { SpotlightCard } from '../ui/SpotlightCard'
import { ScrollReveal } from '../ScrollReveal'
import { AuditOutlined, TeamOutlined, AimOutlined, TrophyOutlined, ThunderboltOutlined, FireOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

// Import images
import img1 from '../../assets/photos/819947.jpg'
import img2 from '../../assets/photos/819949.jpg'

export default function ServerModesSection() {
  const { t } = useTranslation()
  // GridPattern removed - no longer needed

  return (
    <div className="min-h-screen w-screen px-8 py-12 md:px-0 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal once={true} trigger="visible" offset={100} className="[--duration:1000ms]">
          {(isActive) => (
            <div
              className={clsx(
                { "translate-y-8 opacity-0": !isActive },
                "text-center mb-16 transition-[transform,opacity] duration-[--duration]",
              )}>
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                {t('serverModes.title')}
              </h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                {t('serverModes.subtitle')}
              </p>
            </div>
          )}
        </ScrollReveal>

        <ScrollReveal once={true} trigger="visible" offset={50} className="[--duration:1200ms]">
          {(isActive) => (
            <div
              className={clsx(
                { "translate-y-12 opacity-0": !isActive },
                "grid grid-cols-1 lg:grid-cols-2 gap-8 transition-[transform,opacity] duration-[--duration] delay-300",
              )}>
            {/* X25 Card */}
            <SpotlightCard
              hsl
              from="#1cd1c6"
              via="#407cff"
              hslMin={200}
              hslMax={240}
              size={400}
              className={clsx(
                isActive ? "delay-[250ms]" : "translate-y-8 opacity-0",
                "relative mx-auto w-full max-w-2xl rounded-[--radius] bg-white/10 p-8 shadow-xl shadow-white/2.5 [--radius:theme(borderRadius.2xl)] group hover:scale-105 transition-[transform,opacity,scale] duration-[--duration]"
              )}
            >
            <div className="absolute inset-px rounded-[calc(var(--radius)-1px)] bg-zinc-800"></div>

            <div className="absolute inset-0 bg-[radial-gradient(40%_128px_at_50%_0%,theme(backgroundColor.white/5%),transparent)]"></div>

            <div className="relative z-10">
              <div className="text-center mb-6">
                <AuditOutlined className="text-6xl mb-4 text-white" />
                <h3 className="text-3xl font-bold text-white mb-2">{t('serverModes.x25.title')}</h3>
                <p className="text-white/80 text-lg">
                  {t('serverModes.x25.desc')}
                </p>

              </div>

              <img
                src={img1}
                alt="X25 Server gameplay"
                className="w-full h-48 object-cover rounded-lg mt-6 mb-6"
                loading="lazy"
              />

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <TeamOutlined className="text-2xl text-white" />
                  <div>
                    <h4 className="text-white font-semibold">{t('serverModes.x25.features.balanced.title')}</h4>
                    <p className="text-white/70 text-sm">{t('serverModes.x25.features.balanced.body')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <AimOutlined className="text-2xl text-white" />
                  <div>
                    <h4 className="text-white font-semibold">{t('serverModes.x25.features.community.title')}</h4>
                    <p className="text-white/70 text-sm">{t('serverModes.x25.features.community.body')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <ThunderboltOutlined className="text-2xl text-white" />
                  <div>
                    <h4 className="text-white font-semibold">{t('serverModes.x25.features.steady.title')}</h4>
                    <p className="text-white/70 text-sm">{t('serverModes.x25.features.steady.body')}</p>
                  </div>
                </div>
              </div>

              <a
                href="/servers/x25"
                className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-display text-lg font-medium tracking-wide text-white transition hover:from-blue-700 hover:to-blue-800 hover:scale-105 transform duration-200 shadow-lg hover:shadow-xl"
              >
                <span className="relative">{t('serverModes.cta.joinX25')}</span>
                <span className="relative h-6 w-px bg-white/20"></span>
                <span className="group-hover relative mt-px font-display font-medium text-white/80 transition duration-300 group-hover:text-white/100">
                  →
                </span>
              </a>
            </div>
              </SpotlightCard>

              {/* X100 Card */}
              <SpotlightCard
                hsl
                hslMin={0}
                hslMax={20}
                size={400}
                className={clsx(
                  isActive ? "delay-[500ms]" : "translate-y-8 opacity-0",
                  "relative mx-auto w-full max-w-2xl rounded-[--radius] bg-white/10 p-8 shadow-xl shadow-white/2.5 [--radius:theme(borderRadius.2xl)] group hover:scale-105 transition-[transform,opacity,scale] duration-[--duration]"
                )}
              >
            <div className="absolute inset-px rounded-[calc(var(--radius)-1px)] bg-zinc-800"></div>

            <div className="absolute inset-0 bg-[radial-gradient(40%_128px_at_50%_0%,theme(backgroundColor.white/5%),transparent)]"></div>

            <div className="relative z-10">
              <div className="text-center mb-6">
                <ThunderboltOutlined className="text-6xl mb-4 text-white" />
                <h3 className="text-3xl font-bold text-white mb-2">{t('serverModes.x100.title')}</h3>
                <p className="text-white/80 text-lg">
                  {t('serverModes.x100.desc')}
                </p>

              </div>

              <img
                src={img2}
                alt="X100 Server gameplay"
                className="w-full h-48 object-cover rounded-lg mt-6 mb-6"
                loading="lazy"
              />

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <TrophyOutlined className="text-2xl text-white" />
                  <div>
                    <h4 className="text-white font-semibold">{t('serverModes.x100.features.hardcore.title')}</h4>
                    <p className="text-white/70 text-sm">{t('serverModes.x100.features.hardcore.body')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <ThunderboltOutlined className="text-2xl text-white" />
                  <div>
                    <h4 className="text-white font-semibold">{t('serverModes.x100.features.competitive.title')}</h4>
                    <p className="text-white/70 text-sm">{t('serverModes.x100.features.competitive.body')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FireOutlined className="text-2xl text-white" />
                  <div>
                    <h4 className="text-white font-semibold">{t('serverModes.x100.features.fast.title')}</h4>
                    <p className="text-white/70 text-sm">{t('serverModes.x100.features.fast.body')}</p>
                  </div>
                </div>
              </div>

              <a
                href="/servers/x100"
                className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 font-display text-lg font-medium tracking-wide text-white transition hover:from-red-700 hover:to-red-800 hover:scale-105 transform duration-200 shadow-lg hover:shadow-xl"
              >
                <span className="relative">{t('serverModes.cta.joinX100')}</span>
                <span className="relative h-6 w-px bg-white/20"></span>
                <span className="group-hover relative mt-px font-display font-medium text-white/80 transition duration-300 group-hover:text-white/100">
                  →
                </span>
              </a>
            </div>
              </SpotlightCard>
            </div>
          )}
        </ScrollReveal>
      </div>
    </div>
  )
}