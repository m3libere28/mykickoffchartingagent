import React, { useState, useEffect } from 'react';
import emilyImg from '../assets/emily.jpg';
import { Apple, Carrot, Cherry, Citrus, Grape, LeafyGreen } from 'lucide-react';

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
      className={`fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center overflow-hidden transition-opacity duration-1000 ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-pink-100/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-teal-50/40 blur-3xl pointer-events-none" />
      
      {/* Subtle fruits & veggies background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden flex flex-wrap justify-around items-center content-around p-12">
         <Apple size={64} className="m-8 rotate-12" />
         <Carrot size={80} className="m-8 -rotate-45" />
         <Cherry size={72} className="m-8 rotate-45" />
         <Citrus size={64} className="m-8 -rotate-12" />
         <Grape size={86} className="m-8 rotate-6" />
         <LeafyGreen size={72} className="m-8 -rotate-12" />
         <Apple size={64} className="m-8 -rotate-45" />
         <Carrot size={80} className="m-8 rotate-90" />
         <Cherry size={72} className="m-8 -rotate-6" />
         <Citrus size={64} className="m-8 rotate-45" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-lg px-6 w-full mt-[-10vh]">
        
        {/* Avatar Image container with grow-in and float animation */}
        <div className="animate-in fade-in zoom-in duration-1000 ease-out fill-mode-both">
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full p-1.5 bg-gradient-to-tr from-pink-400 via-rose-300 to-teal-400 shadow-2xl shadow-pink-500/20 hover:scale-105 transition-transform duration-500">
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
               className="text-pink-500 text-5xl sm:text-6xl text-center whitespace-nowrap will-change-transform"
               style={{ 
                  fontFamily: "'Caveat', cursive",
                  textShadow: showSignature ? "0 0 15px rgba(236,72,153,0.5), 0 0 30px rgba(236,72,153,0.3)" : "none",
                  clipPath: showSignature ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' : 'polygon(0 0, 0 0, 0 100%, 0 100%)',
                  transition: 'clip-path 3s cubic-bezier(0.4, 0, 0.2, 1), text-shadow 2s ease-in 1s',
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
