import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import emilyImg from '../assets/emily.jpg';
import BackgroundPattern from './BackgroundPattern';

const SplashPage = ({ onComplete }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // 1. Fade everything out
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 5500);

    // 2. Complete splash screen sequence (trigger unmount in App.jsx)
    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 6500);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-surface-50 flex flex-col items-center justify-center overflow-hidden transition-opacity duration-1000 ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <BackgroundPattern />
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-accent-300/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-brand-300/30 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-lg px-6 w-full mt-[-10vh]">
        
        {/* Logo Image container with grow-in and float animation */}
        <div className="animate-in fade-in zoom-in duration-1000 ease-out fill-mode-both">
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full p-1.5 bg-gradient-to-tr from-accent-200 via-surface-100 to-brand-200 shadow-2xl shadow-accent-200/40 hover:scale-[1.02] transition-transform duration-700">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-white bg-white flex items-center justify-center">
               <img 
                 src={emilyImg} 
                 alt="Dietitian Profile" 
                 className="w-full h-full object-cover origin-center hover:scale-105 transition-transform duration-700 opacity-90"
               />
            </div>
            {/* Sparkle subtle effect */}
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent-300/40 blur-md pointer-events-none" />
          </div>
        </div>
        
        {/* Luxurious Typography Title Area with Framer Motion */}
        <div className="mt-8 relative w-full flex flex-col items-center min-h-[160px]">
           
           <div className="relative pt-4 pb-2 px-2 mt-4 flex flex-col items-center text-center">
             <motion.h1 
               className="text-brand-800 dark:text-brand-300 text-5xl sm:text-6xl md:text-7xl text-center whitespace-normal sm:whitespace-nowrap leading-tight font-lux tracking-wide font-medium"
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
             >
               Kickoff Chart Converter
             </motion.h1>
           </div>

           {/* AI Subtitle */}
           <motion.p 
             className="text-accent-600 font-medium tracking-[0.2em] text-sm uppercase mt-4"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 1.2, ease: "easeOut", delay: 1.5 }}
           >
             AI CLINICAL ASSISTANT
           </motion.p>

           <motion.p 
             className="text-surface-500 font-medium tracking-[0.3em] text-xs uppercase mt-8"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 2, ease: "easeInOut", delay: 2.2 }}
           >
             Powered by OpenAI
           </motion.p>
        </div>

      </div>
    </div>
  );
};

export default SplashPage;
