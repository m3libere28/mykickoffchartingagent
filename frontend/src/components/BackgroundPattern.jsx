import React from 'react';
import { Apple, Carrot, Cherry, Citrus, Grape, LeafyGreen } from 'lucide-react';

const icons = [Apple, Carrot, Cherry, Citrus, Grape, LeafyGreen];

const BackgroundPattern = () => {
  // Generate a stable grid map for scattering the icons
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.04]">
      {/* Pattern container */}
      <div className="flex flex-wrap items-center justify-around w-[150%] h-[150%] -ml-[25%] -mt-[25%]">
        {Array.from({ length: 40 }).map((_, i) => {
           const Icon = icons[i % icons.length];
           // Alternate sizing and rotation slightly for organic feel
           const sizeCls = i % 3 === 0 ? 'w-16 h-16' : (i % 2 === 0 ? 'w-12 h-12' : 'w-20 h-20');
           const rotateCls = i % 2 === 0 ? 'rotate-12' : '-rotate-12';
           
           return (
             <div key={i} className={`m-8 sm:m-16 text-brand-700 ${sizeCls} ${rotateCls}`}>
               <Icon className="w-full h-full" strokeWidth={1.5} />
             </div>
           );
        })}
      </div>
    </div>
  );
};

export default BackgroundPattern;
