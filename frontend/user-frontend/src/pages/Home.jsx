import React from 'react';
import Marquee from 'react-fast-marquee';
import { Element } from 'react-scroll';
import BackgroundEffects from '../components/site/BackgroundEffects';
import Hero from '../components/site/Hero';
import VideoBackground from '../components/site/VideoBackground';
import StarBackground from '../components/site/StarBackground';
import ServerModesSection from '../components/site/ServerModesSection';
import { Sparkles } from '../components/ui/Sparkles';

const Home = () => {



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

          {/* Sparkle effects at bottom border - Following exact example pattern */}
          <div className="relative -mt-16 h-32 w-full overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,#8350e8,transparent_70%)] before:opacity-40 after:absolute after:-left-1/2 after:top-1/2 after:aspect-[1/0.7] after:w-[200%] after:rounded-[100%] after:border-t after:border-[#7876c566] after:bg-zinc-900 z-10 pointer-events-none">
            <Sparkles
              density={1200}
              className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
            />
          </div>
          
          {/* Subtle seamless transition */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/80 to-transparent z-20 pointer-events-none"></div>
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
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/80 to-transparent z-20 pointer-events-none"></div>
        </section>
      </Element>

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