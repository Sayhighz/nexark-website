import React from 'react';
import Navbar from '../components/site/Navbar';
import BackgroundEffects from '../components/site/BackgroundEffects';
import Hero from '../components/site/Hero';
import ServerShowcase from '../components/site/ServerShowcase';
import Features from '../components/site/Features';
import CallToAction from '../components/site/CallToAction';
import Footer from '../components/site/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-900 to-blue-800 relative overflow-hidden">
      {/* Global background visuals */}
      <BackgroundEffects />

      {/* Site navigation */}
      <Navbar />

      {/* Hero section */}
      <Hero />

      {/* Server selection / overview */}
      <ServerShowcase />

      {/* Platform features */}
      <Features />

      {/* Call to action */}
      <CallToAction />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;