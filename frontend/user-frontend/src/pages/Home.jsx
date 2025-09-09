import React from 'react';
import Navbar from '../components/site/Navbar';
import BackgroundEffects from '../components/site/BackgroundEffects';
import Hero from '../components/site/Hero';
import VideoBackground from '../components/site/VideoBackground';
import StarBackground from '../components/site/StarBackground';
import GameModeSection from '../components/site/GameModeSection';

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
    <div className="bg-black relative">
      {/* Fixed Social Media Buttons */}
      <div className="pointer-events-auto fixed right-4 top-1/2 transform -translate-y-1/2 flex flex-col items-center gap-4 z-50">
        {/* Discord */}
        <a
          href="https://discord.gg/nexark"
          target="_blank"
          rel="noopener noreferrer"
          className="social-button relative group flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,1) 0%, rgba(147,51,234,1) 100%)'
          }}
        >
          <span className="absolute inset-0 rounded-full bg-indigo-400/25 blur-sm animate-ping" aria-hidden="true"></span>
          <span className="absolute inset-0 rounded-full ring-1 ring-indigo-300/30 group-hover:ring-indigo-200/50 transition-all"></span>
          <svg
            className="relative z-10 w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.174.372.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418Z"/>
          </svg>
        </a>

        {/* Facebook */}
        <a
          href="https://facebook.com/nexark"
          target="_blank"
          rel="noopener noreferrer"
          className="social-button relative group flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,1) 0%, rgba(29,78,216,1) 100%)'
          }}
        >
          <span className="absolute inset-0 rounded-full bg-blue-400/25 blur-sm animate-ping" aria-hidden="true"></span>
          <span className="absolute inset-0 rounded-full ring-1 ring-blue-300/30 group-hover:ring-blue-200/50 transition-all"></span>
          <svg
            className="relative z-10 w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>

        {/* YouTube */}
        <a
          href="https://youtube.com/@nexark"
          target="_blank"
          rel="noopener noreferrer"
          className="social-button relative group flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(239,68,68,1) 0%, rgba(185,28,28,1) 100%)'
          }}
        >
          <span className="absolute inset-0 rounded-full bg-red-500/25 blur-sm animate-ping" aria-hidden="true"></span>
          <span className="absolute inset-0 rounded-full ring-1 ring-red-300/30 group-hover:ring-red-200/50 transition-all"></span>
          <svg
            className="relative z-10 w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </a>
      </div>

      {/* Hero Section with Video Background */}
      <section className="min-h-screen relative overflow-hidden bg-black smooth-scroll-section scroll-optimized">
        <VideoBackground />
        <BackgroundEffects />
        
        <div className="relative z-20">
          <Navbar />
          <Hero />
        </div>
        
        {/* Subtle seamless transition */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none"></div>
      </section>

      {/* X25 Section */}
      <section id="x25-section" className="relative min-h-screen overflow-hidden transform-gpu bg-black smooth-scroll-section scroll-optimized">
        <StarBackground enableShootingStars={false} />
        
        {/* Subtle seamless transition from top */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/80 to-transparent z-5 pointer-events-none"></div>
        
        <div className="relative z-10 transform transition-all duration-1000 ease-out">
          <GameModeSection
            mode="x25"
            title={<span className="font-english-bold">X25 Server</span>}
            playerType={<span className="font-thai-semibold">ถ้าคุณเป็นคนแบบนี้ต้องเล่น X25 นะ!</span>}
            description={<span className="font-thai-normal">เหมาะสำหรับผู้เล่นที่ชอบความสมดุล ไม่รีบร้อน และต้องการเพลิดเพลินกับเกมในแบบของตัวเอง พร้อมสร้างเพื่อนใหม่ในชุมชน</span>}
            features={x25Features}
            bgGradient="transparent"
          />
        </div>
        
        {/* Subtle seamless transition to bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/80 to-transparent z-5 pointer-events-none"></div>
      </section>

      {/* X100 Section */}
      <section id="x100-section" className="relative min-h-screen overflow-hidden transform-gpu bg-black smooth-scroll-section scroll-optimized">
        <StarBackground enableShootingStars={false} />
        
        {/* Subtle seamless transition from top */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/80 to-transparent z-5 pointer-events-none"></div>
        
        <div className="relative z-10 transform transition-all duration-1000 ease-out">
          <GameModeSection
            mode="x100"
            title={<span className="font-english-bold">X100 Server</span>}
            playerType={<span className="font-thai-semibold">ถ้าเป็นคนแบบนี้ให้เล่น X100!</span>}
            description={<span className="font-thai-normal">สำหรับผู้เล่นที่ชอบความเร็ว ความท้าทาย และการแข่งขันสูง พร้อมที่จะใช้เวลาและทักษะเพื่อเป็นที่สุดของเซิร์ฟเวอร์</span>}
            features={x100Features}
            bgGradient="transparent"
          />
        </div>
        
        {/* Subtle seamless transition to bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/80 to-transparent z-5 pointer-events-none"></div>
      </section>
    </div>
  );
};

export default Home;