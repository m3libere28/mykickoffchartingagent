import React, { useState, useEffect } from 'react';
import emilyImg from '../assets/emily.jpg';
import BackgroundPattern from './BackgroundPattern';

const SplashPage = ({ onComplete }) => {
  const [showSignature, setShowSignature] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // 1. Show image immediately (via CSS animation)
    // 2. Start signature reveal after 1.2s
    const sigTimer = setTimeout(() => {
      setShowSignature(true);
    }, 1200);

    // 3. Fade in credentials right after signature finishes drawing (approx 3.5s after sig starts)
    const subTimer = setTimeout(() => {
      setShowSubtitle(true);
    }, 4200);

    // 4. Fade everything out
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 6500);

    // 5. Complete splash screen sequence (trigger unmount in App.jsx)
    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 7500);

    return () => {
      clearTimeout(sigTimer);
      clearTimeout(subTimer);
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
        
        {/* Signature Area */}
        <div className="mt-8 relative w-full flex flex-col items-center h-40">
           
           {/* Main Title instead of Signature */}
           <div className="relative overflow-hidden pt-4 pb-2 px-2 mt-4">
             <h1 
               className="text-brand-600 text-4xl sm:text-5xl md:text-6xl text-center whitespace-normal sm:whitespace-nowrap leading-tight will-change-transform font-medium tracking-wide font-heading"
               style={{ 
                  clipPath: showSignature ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' : 'polygon(0 0, 0 0, 0 100%, 0 100%)',
                  transition: 'clip-path 2s cubic-bezier(0.4, 0, 0.2, 1)',
                  WebkitClipPath: showSignature ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' : 'polygon(0 0, 0 0, 0 100%, 0 100%)'
               }}
             >
               Kickoff Chart Converter
             </h1>
           </div>

           {/* AI Subtitle */}
           <p 
             className={`text-accent-600 font-medium tracking-[0.2em] text-sm uppercase mt-2 transform transition-all duration-700 ${
               showSubtitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
             }`}
           >
             AI CLINICAL ASSISTANT
           </p>

           <p className={`text-surface-400 font-medium tracking-widest text-xs uppercase mt-8 transform transition-all duration-1000 ${
               showSubtitle ? 'opacity-100' : 'opacity-0'
             }`}>
             Powered by OpenAI
           </p>
        </div>

      </div>
    </div>
  );
};

export default SplashPage;
