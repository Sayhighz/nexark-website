"use client"

import React from 'react'
import { SpotlightCard } from '../ui/SpotlightCard'
import { GridPattern } from '../ui/GridPattern'

export default function ServerModesSection() {
  const gridBlocks = [
    [2, 5],
    [3, 1],
    [4, 3],
  ]

  return (
    <div className="min-h-screen w-screen px-8 py-12 md:px-0 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Choose Your Server
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Select the server that matches your playstyle and join the ultimate gaming experience
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* X25 Card */}
          <SpotlightCard
            from="#3b82f6"
            via="#1e40af"
            size={400}
            className="relative mx-auto w-full max-w-2xl rounded-[--radius] bg-white/10 p-8 [--radius:theme(borderRadius.2xl)] group hover:scale-105 transition-transform duration-300"
          >
            <div className="absolute inset-px rounded-[calc(var(--radius)-1px)] bg-gradient-to-br from-blue-900/20 to-blue-800/20"></div>

            <GridPattern
              size={64}
              offsetX={0}
              offsetY={0}
              className="absolute -top-1/2 right-0 h-[200%] w-2/3 skew-y-12 stroke-blue-500/20 stroke-[2] [mask-image:linear-gradient(-85deg,black,transparent)]"
            >
              {gridBlocks.map(([row, column], index) => (
                <GridPattern.Block
                  key={index}
                  row={row}
                  column={column}
                  className="fill-blue-500/2.5 transition duration-500 hover:fill-blue-500/5"
                />
              ))}
            </GridPattern>

            <div className="relative z-10">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">⚖️</div>
                <h3 className="text-3xl font-bold text-white mb-2">X25 Server</h3>
                <p className="text-blue-200 font-semibold mb-4">ถ้าคุณเป็นคนแบบนี้ต้องเล่น X25 นะ!</p>
                <p className="text-white/80 text-lg">
                  เหมาะสำหรับผู้เล่นที่ชอบความสมดุล ไม่รีบร้อน และต้องการเพลิดเพลินกับเกมในแบบของตัวเอง พร้อมสร้างเพื่อนใหม่ในชุมชน
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">👥</span>
                  <div>
                    <h4 className="text-white font-semibold">Balanced Gameplay</h4>
                    <p className="text-white/70 text-sm">เหมาะสำหรับผู้เล่นที่ต้องการสมดุลระหว่างการเล่นและชีวิตจริง</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <h4 className="text-white font-semibold">Community Focus</h4>
                    <p className="text-white/70 text-sm">เน้นการเล่นเป็นกลุ่มและสร้างชุมชนที่แข็งแกร่ง</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <h4 className="text-white font-semibold">Steady Progress</h4>
                    <p className="text-white/70 text-sm">ความก้าวหน้าที่มั่นคงและไม่เครียด</p>
                  </div>
                </div>
              </div>

              <a
                href="/servers?type=x25"
                className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-display text-lg font-medium tracking-wide text-white transition hover:from-blue-700 hover:to-blue-800 hover:scale-105 transform duration-200 shadow-lg hover:shadow-xl"
              >
                <span className="relative">Join X25 Server</span>
                <span className="relative h-6 w-px bg-white/20"></span>
                <span className="group-hover relative mt-px font-display font-medium text-white/80 transition duration-300 group-hover:text-white/100">
                  →
                </span>
              </a>
            </div>
          </SpotlightCard>

          {/* X100 Card */}
          <SpotlightCard
            from="#dc2626"
            via="#991b1b"
            size={400}
            className="relative mx-auto w-full max-w-2xl rounded-[--radius] bg-white/10 p-8 [--radius:theme(borderRadius.2xl)] group hover:scale-105 transition-transform duration-300"
          >
            <div className="absolute inset-px rounded-[calc(var(--radius)-1px)] bg-gradient-to-br from-red-900/20 to-red-800/20"></div>

            <GridPattern
              size={64}
              offsetX={0}
              offsetY={0}
              className="absolute -top-1/2 right-0 h-[200%] w-2/3 skew-y-12 stroke-red-500/20 stroke-[2] [mask-image:linear-gradient(-85deg,black,transparent)]"
            >
              {gridBlocks.map(([row, column], index) => (
                <GridPattern.Block
                  key={index}
                  row={row}
                  column={column}
                  className="fill-red-500/2.5 transition duration-500 hover:fill-red-500/5"
                />
              ))}
            </GridPattern>

            <div className="relative z-10">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">⚔️</div>
                <h3 className="text-3xl font-bold text-white mb-2">X100 Server</h3>
                <p className="text-red-200 font-semibold mb-4">ถ้าเป็นคนแบบนี้ให้เล่น X100!</p>
                <p className="text-white/80 text-lg">
                  สำหรับผู้เล่นที่ชอบความเร็ว ความท้าทาย และการแข่งขันสูง พร้อมที่จะใช้เวลาและทักษะเพื่อเป็นที่สุดของเซิร์ฟเวอร์
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <h4 className="text-white font-semibold">Hardcore Experience</h4>
                    <p className="text-white/70 text-sm">สำหรับผู้เล่นที่ต้องการความท้าทายสูงสุด</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <h4 className="text-white font-semibold">Competitive Edge</h4>
                    <p className="text-white/70 text-sm">การแข่งขันที่รุนแรงและรางวัลที่คุ้มค่า</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🔥</span>
                  <div>
                    <h4 className="text-white font-semibold">Fast-Paced Action</h4>
                    <p className="text-white/70 text-sm">ความเร็วในการเล่นและการตัดสินใจที่รวดเร็ว</p>
                  </div>
                </div>
              </div>

              <a
                href="/servers?type=x100"
                className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 font-display text-lg font-medium tracking-wide text-white transition hover:from-red-700 hover:to-red-800 hover:scale-105 transform duration-200 shadow-lg hover:shadow-xl"
              >
                <span className="relative">Join X100 Server</span>
                <span className="relative h-6 w-px bg-white/20"></span>
                <span className="group-hover relative mt-px font-display font-medium text-white/80 transition duration-300 group-hover:text-white/100">
                  →
                </span>
              </a>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </div>
  )
}