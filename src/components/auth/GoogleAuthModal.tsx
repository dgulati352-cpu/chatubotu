import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  RefreshCw, 
  ShieldCheck, 
  LogOut, 
  ExternalLink,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { UserProfile } from '../../types/user';

export const GoogleAuthModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { user, credits, loginWithGoogle, logout, refreshCredits } = useWorkspace();
  const [customEmail, setCustomEmail] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async (emailOverride?: string) => {
    setIsSigningIn(true);
    await loginWithGoogle(emailOverride);
    setIsSigningIn(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#0d101b] border border-[#222942] rounded-2xl p-6 shadow-2xl space-y-5 animate-slide-up select-none">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1f253d]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-md">
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                Google Account & Credits
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Antigravity Auth
                </span>
              </h2>
              <p className="text-xs text-slate-400">Auto-sync standard tokens & premium reasoning credits</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#1a2034] text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {user ? (
          /* Signed In User State */
          <div className="space-y-4">
            {/* User Profile Card */}
            <div className="p-4 rounded-xl bg-[#131726] border border-[#20273e] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-12 h-12 rounded-full border-2 border-cyan-400/60 shadow-lg object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{user.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 font-semibold">
                      {user.plan}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">{user.email}</div>
                  <div className="text-[10px] text-cyan-400 font-mono mt-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-cyan-400" />
                    Google ID: {user.googleId.substr(0, 10)}... (Verified)
                  </div>
                </div>
              </div>

              <button
                onClick={logout}
                className="p-2 rounded-lg bg-[#1a2034] hover:bg-rose-950/60 hover:text-rose-400 text-slate-400 transition"
                title="Sign out of Google ID"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Live Credits Meter */}
            <div className="p-4 rounded-xl bg-[#0a0d16] border border-[#1f253d] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white font-mono uppercase">
                    Auto-Fetched Credits Balance
                  </span>
                </div>
                <button
                  onClick={refreshCredits}
                  className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition"
                >
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Auto-Synced</span>
                </button>
              </div>

              {/* Standard Credits Bar */}
              <div className="space-y-1.5 bg-[#121626] p-3 rounded-lg border border-[#1f253d]">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    Standard AI Credits (Gemini Flash & UI Agents)
                  </span>
                  <span className="text-cyan-400 font-bold">
                    {credits.standardCredits.toLocaleString()} / {credits.maxStandardCredits.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#1b2136] overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${(credits.standardCredits / credits.maxStandardCredits) * 100}%` }}
                  />
                </div>
              </div>

              {/* Premium Credits Bar */}
              <div className="space-y-1.5 bg-[#121626] p-3 rounded-lg border border-[#1f253d]">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                    Premium Reasoning Credits (Gemini 2.0 Pro / Ultra Architect)
                  </span>
                  <span className="text-purple-400 font-bold">
                    {credits.premiumCredits.toLocaleString()} / {credits.maxPremiumCredits.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#1b2136] overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                    style={{ width: `${(credits.premiumCredits / credits.maxPremiumCredits) * 100}%` }}
                  />
                </div>
              </div>

              {/* Telemetry info */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 pt-1">
                <div className="bg-[#121626] p-2 rounded">
                  <span className="text-slate-500 block text-[10px]">DAILY QUOTA RESET</span>
                  <span className="text-white font-semibold">{credits.renewalDate}</span>
                </div>
                <div className="bg-[#121626] p-2 rounded">
                  <span className="text-slate-500 block text-[10px]">CONCURRENT AGENTS</span>
                  <span className="text-emerald-400 font-semibold">{credits.concurrentAgentSlots} Parallel Slots</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition shadow-lg shadow-cyan-600/20"
              >
                Close & Continue Coding
              </button>
            </div>
          </div>
        ) : (
          /* Logged Out / Sign In with Google */
          <div className="space-y-4 py-2">
            <div className="text-center space-y-2 py-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-purple-600 p-[2px] mx-auto shadow-xl shadow-cyan-500/20">
                <div className="w-full h-full bg-[#0d101b] rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
              <h3 className="text-base font-bold text-white">Sign In with Google Account</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Connect your Google ID to instantly load your allocated Standard and Premium AI credits for the Antigravity Swarm.
              </p>
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={() => handleGoogleSignIn()}
              disabled={isSigningIn}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-sans font-semibold text-sm flex items-center justify-center gap-3 transition shadow-lg active:scale-98 disabled:opacity-50"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{isSigningIn ? 'Connecting to Google ID...' : 'Continue with Google'}</span>
            </button>

            {/* Custom Google ID / Email Switcher Option */}
            <div className="pt-2">
              <button
                onClick={() => setShowCustomInput(!showCustomInput)}
                className="text-[11px] text-slate-500 hover:text-cyan-400 transition font-mono block mx-auto"
              >
                {showCustomInput ? 'Hide custom Google ID' : 'Or sign in with custom Google / Workspace email →'}
              </button>

              {showCustomInput && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="your.name@gmail.com"
                    className="flex-1 px-3 py-2 text-xs rounded-lg bg-[#0a0d16] border border-[#20273e] text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                  <button
                    onClick={() => handleGoogleSignIn(customEmail)}
                    disabled={!customEmail.trim() || isSigningIn}
                    className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition"
                  >
                    Authenticate
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
