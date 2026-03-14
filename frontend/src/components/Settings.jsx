import React, { useState, useEffect } from 'react';
import { X, Settings as SettingsIcon, Save, Type, CheckSquare, AlignLeft } from 'lucide-react';

const defaultPreferences = {
  useBulletPoints: false,
  focusAbnormal: false,
  concisePlan: false,
  professionalTone: true
};

const Settings = ({ isOpen, onClose }) => {
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Load from local storage on mount
    const saved = localStorage.getItem('kickoff_preferences');
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, [isOpen]);

  const handleToggle = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    setIsSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem('kickoff_preferences', JSON.stringify(preferences));
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300"
        onClick={onClose}
      />
      
      <div className="fixed top-0 sm:top-4 right-0 bottom-0 sm:bottom-4 w-full sm:w-[450px] bg-white dark:bg-darkSurface border-l sm:border sm:rounded-l-2xl border-slate-200 dark:border-darkSurface-border shadow-2xl z-[70] transform transition-transform duration-500 ease-out flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-darkSurface-border/50 flex justify-between items-center bg-slate-50/50 dark:bg-darkSurface/50">
          <div className="flex items-center">
            <div className="p-2 bg-brand-100 dark:bg-brand-900/30 rounded-xl mr-3">
              <SettingsIcon className="text-brand-600 dark:text-brand-400" size={20} />
            </div>
            <h2 className="text-xl font-bold font-heading text-slate-800 dark:text-white tracking-tight">Charting Styles</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-darkSurface-card rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          <div>
            <h3 className="text-sm font-bold tracking-widest text-slate-400 dark:text-darkSurface-muted font-heading uppercase mb-4">AI Output Formatting</h3>
            <div className="space-y-3">
              
              <label className={`flex items-start p-4 rounded-xl cursor-pointer border transition-colors ${preferences.useBulletPoints ? 'bg-brand-50 border-brand-200 dark:bg-brand-900/10 dark:border-brand-800' : 'bg-white dark:bg-darkSurface-card border-slate-200 dark:border-darkSurface-border hover:bg-slate-50 dark:hover:bg-darkSurface-elevated'}`}>
                <div className="relative flex items-center justify-center mt-0.5">
                  <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-slate-300 dark:border-slate-600 rounded checked:bg-brand-500 checked:border-brand-500 transition-all" checked={preferences.useBulletPoints} onChange={() => handleToggle('useBulletPoints')} />
                  <CheckSquare size={14} strokeWidth={3} className="text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                </div>
                <div className="ml-3">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center">
                    <AlignLeft size={14} className="mr-2 text-slate-400" /> Use Bullet Points
                  </span>
                  <p className="text-xs text-slate-500 dark:text-darkSurface-muted mt-1 leading-relaxed">Format all Assessment and Intervention sections as concise bulleted lists rather than narrative paragraphs.</p>
                </div>
              </label>

              <label className={`flex items-start p-4 rounded-xl cursor-pointer border transition-colors ${preferences.focusAbnormal ? 'bg-brand-50 border-brand-200 dark:bg-brand-900/10 dark:border-brand-800' : 'bg-white dark:bg-darkSurface-card border-slate-200 dark:border-darkSurface-border hover:bg-slate-50 dark:hover:bg-darkSurface-elevated'}`}>
                <div className="relative flex items-center justify-center mt-0.5">
                  <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-slate-300 dark:border-slate-600 rounded checked:bg-brand-500 checked:border-brand-500 transition-all" checked={preferences.focusAbnormal} onChange={() => handleToggle('focusAbnormal')} />
                  <CheckSquare size={14} strokeWidth={3} className="text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                </div>
                <div className="ml-3">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Focus on Abnormalities</span>
                  <p className="text-xs text-slate-500 dark:text-darkSurface-muted mt-1 leading-relaxed">Chart by exception. Ignore standard/normal healthy findings and only highlight clinically significant or abnormal data.</p>
                </div>
              </label>

              <label className={`flex items-start p-4 rounded-xl cursor-pointer border transition-colors ${preferences.concisePlan ? 'bg-brand-50 border-brand-200 dark:bg-brand-900/10 dark:border-brand-800' : 'bg-white dark:bg-darkSurface-card border-slate-200 dark:border-darkSurface-border hover:bg-slate-50 dark:hover:bg-darkSurface-elevated'}`}>
                <div className="relative flex items-center justify-center mt-0.5">
                  <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-slate-300 dark:border-slate-600 rounded checked:bg-brand-500 checked:border-brand-500 transition-all" checked={preferences.concisePlan} onChange={() => handleToggle('concisePlan')} />
                  <CheckSquare size={14} strokeWidth={3} className="text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                </div>
                <div className="ml-3">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center">
                    <Type size={14} className="mr-2 text-slate-400" /> Concise Goals & Plan
                  </span>
                  <p className="text-xs text-slate-500 dark:text-darkSurface-muted mt-1 leading-relaxed">Keep the Plan section extremely brief and direct. Minimal fluff, relying strictly on core action items.</p>
                </div>
              </label>

            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-darkSurface-border/50 bg-white dark:bg-darkSurface">
          <button
            onClick={handleSave}
            className={`w-full py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center shadow-lg hover:-translate-y-0.5 ${
              isSaved 
                ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/30' 
                : 'bg-slate-800 dark:bg-darkSurface-elevated hover:bg-slate-700 dark:hover:bg-darkSurface-card border dark:border-darkSurface-border text-white'
            }`}
          >
            <Save size={18} className="mr-2" />
            {isSaved ? 'Preferences Saved' : 'Save Preferences'}
          </button>
        </div>

      </div>
    </>
  );
};

export default Settings;
