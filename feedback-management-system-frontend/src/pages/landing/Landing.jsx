// src/components/landing/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MarketingHeader from '../../components/landing/MarketingHeader';
import HeroSection from '../../components/landing/HeroSection';
import ProblemSolution from '../../components/landing/ProblemSolution';
import Features from '../../components/landing/Features';
import HowItWorks from '../../components/landing/HowItWorks';
import Integrations from '../../components/landing/Integrations';
import Testimonials from '../../components/landing/Testimonials';
import FAQ from '../../components/landing/FAQ';
import FinalCTA from '../../components/landing/FinalCTA';
import Footer from '../../components/landing/Footer';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <MarketingHeader isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      
      <main className="overflow-hidden">
        <HeroSection />
        <ProblemSolution />
        <Features />
        {/* <Integrations /> */}
        <Testimonials />
        <FAQ />
        {/* <FinalCTA /> */}
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;