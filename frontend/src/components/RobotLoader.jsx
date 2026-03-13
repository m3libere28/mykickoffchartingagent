import React from 'react';
import { motion } from 'framer-motion';

const RobotLoader = () => {
  return (
    <div className="relative flex justify-center items-center h-48 w-full select-none my-4">
      {/* Robot Container with floating animation */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        className="relative z-10"
      >
        <svg width="140" height="160" viewBox="0 0 140 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
          {/* Antenna line */}
          <line x1="70" y1="40" x2="70" y2="15" className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="4" strokeLinecap="round" />
          
          {/* Antenna Glowing Bulb */}
          <motion.circle 
            cx="70" cy="12" r="8"
            className="fill-brand-400 dark:fill-brand-500"
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            style={{ filter: "drop-shadow(0 0 8px rgba(16, 185, 129, 0.8))" }}
          />

          {/* Glowing Aura around the Head */}
          <motion.circle
             cx="70" cy="70" r="50"
             className="fill-brand-400/10 dark:fill-brand-500/10"
             animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
             transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
             style={{ filter: "blur(20px)" }}
          />

          {/* Ears / Side Nodes */}
          <rect x="18" y="55" width="8" height="30" rx="4" className="fill-slate-300 dark:fill-slate-700" />
          <rect x="114" y="55" width="8" height="30" rx="4" className="fill-slate-300 dark:fill-slate-700" />

          {/* Head */}
          <rect x="25" y="40" width="90" height="65" rx="20" className="fill-white dark:fill-slate-800 stroke-slate-200 dark:stroke-slate-700" strokeWidth="3" />
          
          {/* Screen / Visor */}
          <rect x="35" y="52" width="70" height="40" rx="12" className="fill-slate-900 dark:fill-black" />
          
          {/* Eyes (Blinking Animation) */}
          <motion.g
            animate={{ scaleY: [1, 0.1, 1, 1, 1] }}
            transition={{ repeat: Infinity, duration: 4.5, times: [0, 0.05, 0.1, 0.15, 1] }}
            style={{ transformOrigin: "70px 72px" }}
          >
             <circle cx="52" cy="72" r="6" className="fill-brand-400 dark:fill-brand-500" style={{ filter: "drop-shadow(0 0 4px rgba(16, 185, 129, 0.8))" }} />
             <circle cx="88" cy="72" r="6" className="fill-brand-400 dark:fill-brand-500" style={{ filter: "drop-shadow(0 0 4px rgba(16, 185, 129, 0.8))" }} />
          </motion.g>

          {/* Happy Eye Arcs (hidden normally, replace eyes if we wanted expression, but let's keep it simple) */}

          {/* Neck */}
          <rect x="60" y="105" width="20" height="15" className="fill-slate-200 dark:fill-slate-700" />

          {/* Body */}
          <path d="M40 120 C 40 110, 100 110, 100 120 L 110 155 C 110 158, 108 160, 105 160 L 35 160 C 32 160, 30 158, 30 155 Z" className="fill-white dark:fill-slate-800 stroke-slate-200 dark:stroke-slate-700" strokeWidth="3" strokeLinejoin="round" />
          
          {/* Processing Screen on Body */}
          <rect x="50" y="130" width="40" height="20" rx="6" className="fill-slate-900 dark:fill-black" />
          
          {/* Scanning Line on Body Screen */}
          <motion.line 
            x1="52" y1="130" x2="88" y2="130" 
            className="stroke-brand-400 dark:stroke-brand-500" 
            strokeWidth="2"
            animate={{ y: [132, 148, 132] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          />

          {/* Arms (Floating slightly offset from body) */}
          <motion.path 
            d="M 25 125 C 10 135, 10 155, 20 155" 
            className="stroke-slate-300 dark:stroke-slate-600" 
            strokeWidth="8" strokeLinecap="round" fill="none"
            animate={{ rotate: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            style={{ transformOrigin: "25px 125px" }}
          />
          <motion.path 
            d="M 115 125 C 130 135, 130 155, 120 155" 
            className="stroke-slate-300 dark:stroke-slate-600" 
            strokeWidth="8" strokeLinecap="round" fill="none"
            animate={{ rotate: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.5 }}
            style={{ transformOrigin: "115px 125px" }}
          />
        </svg>

        {/* Floating Paper 1 */}
        <motion.div
          animate={{ y: [0, -25, 0], x: [0, -10, 0], rotate: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.2 }}
          className="absolute -left-12 top-10 text-brand-400/80 dark:text-brand-500/80 drop-shadow-md z-0"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-md p-1">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </motion.div>

        {/* Floating Paper 2 */}
        <motion.div
          animate={{ y: [0, -30, 0], x: [0, 15, 0], rotate: [0, 20, 0], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
          className="absolute -right-16 top-20 text-accent-400/80 dark:text-accent-500/80 drop-shadow-md z-0"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-md p-1">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </motion.div>

        {/* Floating Sparkles */}
        <motion.div
           animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5], y: [0, -20] }}
           transition={{ repeat: Infinity, duration: 2, ease: "easeOut", delay: 0.8 }}
           className="absolute top-0 right-0 w-3 h-3 rounded-full bg-yellow-300"
           style={{ filter: "blur(1px)" }}
        />
        <motion.div
           animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5], y: [0, -15] }}
           transition={{ repeat: Infinity, duration: 2.5, ease: "easeOut", delay: 1.5 }}
           className="absolute top-12 -left-4 w-2 h-2 rounded-full bg-brand-300"
           style={{ filter: "blur(1px)" }}
        />

      </motion.div>
    </div>
  );
};

export default RobotLoader;
