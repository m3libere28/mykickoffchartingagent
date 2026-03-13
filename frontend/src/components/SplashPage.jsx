import React, { useState, useEffect } from 'react';
import emilyImg from '../assets/emily.jpg';

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

    // 3. Fade in credentials right after signature finishes drawing (approx 2s after sig starts)
    const subTimer = setTimeout(() => {
      setShowSubtitle(true);
    }, 2800);

    // 4. Fade everything out
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 4500);

    // 5. Complete splash screen sequence (trigger unmount in App.jsx)
    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 5500);

    return () => {
      clearTimeout(sigTimer);
      clearTimeout(subTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center overflow-hidden transition-opacity duration-1000 ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-50/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-teal-50/40 blur-3xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center max-w-lg px-6 w-full mt-[-10vh]">
        
        {/* Avatar Image container with grow-in and float animation */}
        <div className="animate-in fade-in zoom-in duration-1000 ease-out fill-mode-both">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full p-1.5 bg-gradient-to-tr from-emerald-400 via-emerald-300 to-teal-500 shadow-2xl shadow-emerald-500/20 hover:scale-105 transition-transform duration-500">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-white bg-white">
               <img 
                 src={emilyImg} 
                 alt="Emily Torres-Medaglia" 
                 className="w-full h-full object-cover origin-top hover:scale-110 transition-transform duration-700"
               />
            </div>
            {/* Sparkle subtle effect */}
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-100/30 blur-sm pointer-events-none" />
          </div>
        </div>
        
        {/* Signature Area */}
        <div className="mt-8 relative w-full flex flex-col items-center h-40">
           
           {/* The name in signature font */}
           <div 
             className="relative overflow-hidden pt-4 pb-2 px-2"
           >
             <h1 
               className="text-slate-800 text-5xl sm:text-6xl text-center whitespace-nowrap will-change-transform"
               style={{ 
                  fontFamily: "'Caveat', cursive",
                  clipPath: showSignature ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' : 'polygon(0 0, 0 0, 0 100%, 0 100%)',
                  transition: 'clip-path 1.5s cubic-bezier(0.5, 0, 0.2, 1)',
                  WebkitClipPath: showSignature ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' : 'polygon(0 0, 0 0, 0 100%, 0 100%)'
               }}
             >
               Emily Torres-Medaglia
             </h1>
           </div>

           {/* RD / LDN Subtitle */}
           <p 
             className={`text-emerald-600 font-bold tracking-[0.2em] text-sm uppercase mt-1 transform transition-all duration-700 ${
               showSubtitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
             }`}
           >
             RDN / LDN
           </p>

           <p className={`text-slate-400 font-medium tracking-widest text-xs uppercase mt-8 transform transition-all duration-1000 ${
               showSubtitle ? 'opacity-100' : 'opacity-0'
             }`}>
             Kickoff Charting Agent
           </p>
        </div>

      </div>
    </div>
  );
};

export default SplashPage;
