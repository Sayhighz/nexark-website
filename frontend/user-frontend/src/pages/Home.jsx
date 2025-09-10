import React, { useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';
import { Element } from 'react-scroll';
import Navbar from '../components/site/Navbar';
import BackgroundEffects from '../components/site/BackgroundEffects';
import Hero from '../components/site/Hero';
import VideoBackground from '../components/site/VideoBackground';
import StarBackground from '../components/site/StarBackground';
import GameModeSection from '../components/site/GameModeSection';
import PVPSection from '../components/site/PVPSection';
import ServerModesSection from '../components/site/ServerModesSection';

const Home = () => {

  const x25Features = [
    {
      icon: '⚖️',
      title: <span className="font-english-semibold">Balanced Gameplay</span>,
      description: <span className="font-thai-normal">เหมาะสำหรับผู้เล่นที่ต้องการสมดุลระหว่างการเล่นและชีวิตจริง</span>
    },
    {
      icon: '👥',
      title: <span className="font-english-semibold">Community Focus</span>,
      description: <span className="font-thai-normal">เน้นการเล่นเป็นกลุ่มและสร้างชุมชนที่แข็งแกร่ง</span>
    },
    {
      icon: '🎯',
      title: <span className="font-english-semibold">Steady Progress</span>,
      description: <span className="font-thai-normal">ความก้าวหน้าที่มั่นคงและไม่เครียด</span>
    }
  ];

  const x100Features = [
    {
      icon: '⚔️',
      title: <span className="font-english-semibold">Hardcore Experience</span>,
      description: <span className="font-thai-normal">สำหรับผู้เล่นที่ต้องการความท้าทายสูงสุด</span>
    },
    {
      icon: '🏆',
      title: <span className="font-english-semibold">Competitive Edge</span>,
      description: <span className="font-thai-normal">การแข่งขันที่รุนแรงและรางวัลที่คุ้มค่า</span>
    },
    {
      icon: '⚡',
      title: <span className="font-english-semibold">Fast-Paced Action</span>,
      description: <span className="font-thai-normal">ความเร็วในการเล่นและการตัดสินใจที่รวดเร็ว</span>
    }
  ];

  return (
    <>
      <div className="bg-black relative">

      {/* Hero Section with Video Background */}
      <Element name="hero" className="element">
        <section className="min-h-screen relative overflow-hidden bg-black smooth-scroll-section scroll-optimized">
          <VideoBackground />
          <BackgroundEffects />

          <div className="relative z-20">
            <Hero />
          </div>

          {/* Subtle seamless transition */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none"></div>
        </section>
      </Element>

      <Element name="marquee" className="element">
        <section className="relative bg-black py-16 overflow-hidden smooth-scroll-section scroll-optimized">
          {/* Subtle seamless transition from top */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/80 to-transparent z-5 pointer-events-none"></div>

          <div className="relative z-10 py-5">
            <Marquee
              speed={40}
              gradient={false}
              pauseOnHover={true}
              className="text-white font-english-bold text-2xl"
            >
              <span className="mx-12">EPIC PVP BATTLES AWAIT - JOIN THE ULTIMATE COMBAT EXPERIENCE</span>
              <span className="mx-12">COMPETE AGAINST THE BEST - CLIMB THE LEADERBOARDS</span>
              <span className="mx-12">MASTER YOUR SKILLS - BECOME A PVP LEGEND</span>
              <span className="mx-12">FAST-PACED ACTION - NON-STOP ADRENALINE RUSH</span>
              <span className="mx-12">DOMINATE THE BATTLEFIELD - PROVE YOUR WORTH</span>
              <span className="mx-12">INTENSE PVP MODES - X25 & X100 SERVERS</span>
            </Marquee>
          </div>

          <div className="relative z-10">
            <Marquee
              speed={35}
              gradient={false}
              pauseOnHover={true}
              direction="right"
              className="text-white font-english-bold text-2xl"
            >
              <span className="mx-12">BUILD YOUR EMPIRE - CRAFT, SURVIVE, CONQUER</span>
              <span className="mx-12">EXPLORE VAST WORLDS - DISCOVER HIDDEN TREASURES</span>
              <span className="mx-12">TEAM UP WITH FRIENDS - CREATE LASTING ALLIANCES</span>
              <span className="mx-12">CUSTOMIZE YOUR BASE - DEFEND YOUR TERRITORY</span>
              <span className="mx-12">EVOLVE YOUR STRATEGY - ADAPT AND OVERCOME</span>
              <span className="mx-12">NEXARK AWAITS - YOUR ADVENTURE BEGINS NOW</span>
            </Marquee>
          </div>

          {/* Subtle seamless transition to bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/80 to-transparent z-5 pointer-events-none"></div>
        </section>
      </Element>
      
      {/* PVP Section */}
      <Element name="pvp" className="element">
        <PVPSection />
      </Element>

      {/* Marquee Section */}

      {/* Server Modes Section */}
      <Element name="servers" className="element">
        <section id="servers-section" className="relative min-h-screen overflow-hidden transform-gpu bg-black smooth-scroll-section scroll-optimized">
          <StarBackground enableShootingStars={false} />

          {/* Subtle seamless transition from top */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/80 to-transparent z-5 pointer-events-none"></div>

          <div className="relative z-10 transform transition-all duration-1000 ease-out">
            <ServerModesSection />
          </div>

          {/* Subtle seamless transition to bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/80 to-transparent z-5 pointer-events-none"></div>
        </section>
      </Element>

      </div>
    </>
  );
};

export default Home;