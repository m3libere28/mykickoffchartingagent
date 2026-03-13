import React, { useState, useEffect } from 'react';
import { LogOut, HeartPulse, Calculator } from 'lucide-react';
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

  if (showSplash) {
    return <SplashPage onComplete={() => setShowSplash(false)} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative flex flex-col items-center">
            <HeartPulse className="text-emerald-500 animate-pulse mb-4" size={40} />
            <p className="text-emerald-700 font-medium tracking-wide">Initializing environment...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-900">
      
      {/* Premium Glass Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_4px_30px_rgba(0,0,0,0.02)] transition-all">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="flex justify-between items-center h-20">
            <div 
              className="flex items-center cursor-pointer group" 
              onClick={() => setResultsData(null)}
            >
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5 rounded-xl mr-4 text-white shadow-[0_4px_12px_rgba(16,185,129,0.3)] group-hover:scale-105 group-active:scale-95 transition-transform duration-300">
                <HeartPulse size={22} strokeWidth={2.5} />
              </div>
              <h1 className="text-2xl font-bold font-heading text-slate-800 tracking-tight flex items-center">
                Kickoff <span className="text-emerald-600 ml-1.5 font-black">V2</span>
              </h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => setIsCalculatorsOpen(true)}
                className="flex items-center px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all duration-200 border border-transparent hover:border-emerald-100/50 group"
              >
                <Calculator size={18} className="mr-2 group-hover:scale-110 transition-transform duration-200" />
                <span className="hidden sm:inline">Calculators</span>
              </button>
              
              <div className="w-px h-8 bg-slate-200 hidden sm:block mx-2"></div>
              
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50/50 rounded-xl transition-all duration-200 border border-transparent hover:border-rose-100 group"
              >
                <LogOut size={18} className="mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow pt-32 pb-16 px-4 sm:px-6 relative flex flex-col items-center">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-slate-100 to-transparent pointer-events-none -z-10" />
        
        <div className="w-full max-w-5xl relative z-10 transition-all duration-500 ease-in-out">
            {!resultsData ? (
            <Dashboard onUploadSuccess={(data) => setResultsData(data)} />
            ) : (
            <ResultsView data={resultsData} onReset={() => setResultsData(null)} />
            )}
        </div>
      </main>

      {/* Calculators Slide-Over Overlay */}
      <Calculators isOpen={isCalculatorsOpen} onClose={() => setIsCalculatorsOpen(false)} />

      {/* Footer */}
      <footer className="mt-auto py-8 text-center relative z-10">
        <p className="text-sm font-medium text-slate-400">
          Local Draft-Assist Tool • Always review output before final charting
        </p>
      </footer>
    </div>
  );
}

export default App;
