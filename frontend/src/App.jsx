import React, { useState, useEffect } from 'react';
import { LogOut, HeartPulse, Calculator, Moon, Sun } from 'lucide-react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ResultsView from './components/ResultsView';
import Calculators from './components/Calculators';
import SplashPage from './components/SplashPage';
import { checkAuthStatus, logout } from './services/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [resultsData, setResultsData] = useState(null);
  const [isCalculatorsOpen, setIsCalculatorsOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDarkMode(true);
    }
  };

  useEffect(() => {
    const verifyUser = async () => {
      const isAuth = await checkAuthStatus();
      setIsAuthenticated(isAuth);
      setLoading(false);
    };
    verifyUser();
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
    setResultsData(null);
  };

  // Wait for splash to finish AND auth check to finish before showing main content
  if (showSplash) {
    return <SplashPage onComplete={() => setShowSplash(false)} />;
  }

  // Once splash is false, we can either Show Login (if not auth) or Auth Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative flex flex-col items-center">
            <HeartPulse className="text-emerald-500 animate-pulse mb-4" size={40} />
            <p className="text-emerald-700 dark:text-emerald-400 font-medium tracking-wide">Initializing environment...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-900 dark:selection:text-emerald-100 transition-colors duration-300">
      
      {/* Premium Glass Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 shadow-[0_4px_30px_rgba(0,0,0,0.02)] transition-all">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="flex justify-between items-center h-20">
            <div 
              className="flex flex-col items-center justify-center cursor-pointer group" 
              onClick={() => setResultsData(null)}
            >
              <div className="mr-3 sm:mr-4 bg-transparent p-1 rounded-xl shadow-[0_4px_12px_rgba(16,185,129,0.3)] group-hover:scale-105 group-active:scale-95 transition-transform duration-300">
                <img src="/mykickoffchartingagent/logo.png" alt="Kickoff Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded-lg" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-heading text-slate-800 dark:text-white tracking-tight flex items-center">
                Kickoff <span className="text-emerald-600 dark:text-emerald-400 ml-1.5 font-black hidden sm:inline">V2</span>
              </h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 sm:px-4 sm:py-2.5 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button
                onClick={() => setIsCalculatorsOpen(true)}
                className="flex items-center px-3 py-2 sm:px-4 sm:py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-xl transition-all duration-200 border border-transparent hover:border-emerald-100/50 dark:hover:border-emerald-800 group"
              >
                <Calculator size={18} className="sm:mr-2 group-hover:scale-110 transition-transform duration-200" />
                <span className="hidden sm:inline">Calculators</span>
              </button>
              
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 hidden sm:block mx-1"></div>
              
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 sm:px-4 sm:py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-900/20 rounded-xl transition-all duration-200 border border-transparent hover:border-rose-100 dark:hover:border-rose-900/50 group"
              >
                <LogOut size={18} className="sm:mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow pt-24 sm:pt-32 pb-16 px-4 sm:px-6 relative flex flex-col items-center">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-0 w-full h-64 sm:h-96 bg-gradient-to-b from-slate-100 dark:from-slate-800/50 to-transparent pointer-events-none -z-10" />
        
        <div className="w-full max-w-5xl relative z-10 transition-all duration-500 ease-in-out">
            {!resultsData ? (
            <Dashboard onUploadSuccess={(data) => setResultsData(data)} />
            ) : (
            <ResultsView 
              data={resultsData} 
              onUpdateData={setResultsData} 
              onReset={() => setResultsData(null)} 
            />
            )}
        </div>
      </main>

      {/* Calculators Slide-Over Overlay */}
      <Calculators 
        isOpen={isCalculatorsOpen} 
        onClose={() => setIsCalculatorsOpen(false)} 
        onInsertToDraft={(text) => {
           if (!resultsData) return;
           // Default append to assessment, or wherever makes sense
           setResultsData(prev => ({
              ...prev,
              assessment: prev.assessment ? `${prev.assessment}\n\n[Calc result: ${text}]` : `[Calc result: ${text}]`
           }));
           setIsCalculatorsOpen(false); // Auto-close to show the result in the draft
        }}
        hasActiveDraft={!!resultsData}
      />

      {/* Footer */}
      <footer className="mt-auto py-8 text-center relative z-10">
        <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
          Local Draft-Assist Tool • Always review output before final charting
        </p>
      </footer>
    </div>
  );
}

export default App;
