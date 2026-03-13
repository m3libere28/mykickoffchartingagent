import React, { useState } from 'react';
import { login } from '../services/api';
import { Activity, ShieldCheck, HeartPulse } from 'lucide-react';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      onLoginSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 flex overflow-hidden relative">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent-500/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="flex-1 hidden lg:flex flex-col justify-center items-center relative z-10 px-12">
        <div className="max-w-lg text-left">
          <div className="inline-flex items-center justify-center p-2 bg-surface-900/50 rounded-2xl border border-white/10 mb-8 backdrop-blur-sm shadow-xl shadow-brand-500/10 hover:scale-105 transition-transform">
             <img src="/mykickoffchartingagent/logo.png" alt="Kickoff Logo" className="w-12 h-12 object-contain" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-white mb-6 leading-tight">
            Streamline your <br className="hidden sm:block"/><span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-brand-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">clinical drafting.</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium leading-relaxed mb-10 max-w-md">
            Kickoff Charting V2 uses advanced AI to generate structured ADIME note drafts from your de-identified uploads, letting you spend more time with patients.
          </p>
          <div className="flex items-center space-x-4 text-sm text-slate-400 font-medium">
            <div className="flex items-center bg-surface-900/50 rounded-full px-4 py-2 border border-white/5">
              <ShieldCheck size={16} className="text-brand-400 mr-2" />
              Local Privacy Checks
            </div>
            <div className="flex items-center bg-surface-900/50 rounded-full px-4 py-2 border border-white/5">
              <Activity size={16} className="text-accent-400 mr-2" />
              Data Verified
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex justify-center items-center relative z-10 p-4">
        <div className="w-full max-w-md bg-surface-900/40 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] border border-white/10 p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-500/20 to-transparent blur-2xl rounded-bl-full pointer-events-none"></div>
          
          <div className="lg:hidden flex justify-center mb-8">
            <div className="p-2 bg-surface-900/50 rounded-2xl border border-white/10 shadow-xl">
               <img src="/mykickoffchartingagent/logo.png" alt="Kickoff Logo" className="w-12 h-12 object-contain" />
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white text-center mb-2">
            Welcome Back
          </h2>
          <p className="text-slate-400 text-sm text-center mb-10 font-medium">
            Authorized personnel login required
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm text-center font-medium flex items-center justify-center backdrop-blur-sm">
              <ShieldCheck size={18} className="mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-300 ml-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-5 py-3.5 bg-surface-950/80 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all font-medium"
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-300 ml-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3.5 bg-surface-950/80 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all font-medium"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 rounded-xl text-white font-bold tracking-wide transition-all duration-300 ease-out mt-4 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] ${
                loading ? 'bg-brand-600/50 cursor-not-allowed border-transparent' : 'bg-gradient-to-r from-brand-500 to-accent-600 hover:from-brand-400 hover:to-accent-500 active:scale-[0.98] border border-brand-400/50'
              }`}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;
