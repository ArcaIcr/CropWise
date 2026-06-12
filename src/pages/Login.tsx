import React, { useState } from 'react';
import { db } from '../db/db';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  ArrowLeft, 
  AlertTriangle, 
  CloudLightning,
  Sparkles
} from 'lucide-react';
import type { IUser } from '../types/database';

interface ILoginProps {
  onLoginSuccess: (user: IUser) => void;
  onBackToHome: () => void;
}

/**
 * Login Component. Displays the secure technician authentication form.
 * Handles validation against seeded local database accounts for offline grids.
 * 
 * @param props Props containing success and back-navigation callbacks.
 */
export const Login: React.FC<ILoginProps> = ({ onLoginSuccess, onBackToHome }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Validates credentials and logs the user in.
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all credential fields.');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate network authentication speed
    await new Promise(resolve => setTimeout(resolve, 1200));

    try {
      const users = await db.users.toArray();
      const matchedUser = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && !u.isDeleted
      );

      // Offline credentials check (Gabriel Agila / password123)
      if (matchedUser && password === 'password123') {
        onLoginSuccess(matchedUser);
      } else {
        setError('Invalid officer email or password. Use demo credentials below.');
      }
    } catch (err) {
      console.error(err);
      setError('Local authentication engine error. Verification aborted.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Helper utility to quickly autofill demo credentials.
   */
  const handleAutoFillDemo = () => {
    setEmail('gabriel.agila@cropwise.org');
    setPassword('password123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950/20 text-zinc-100 flex flex-col items-center justify-center p-4 font-sans relative">
      {/* Background glow spotlights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-emerald-500/5 blur-[90px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-zinc-950/55 backdrop-blur-xl border border-zinc-800/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative z-10">
        
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-emerald-600/10 border border-emerald-500/25 rounded-2xl text-emerald-400 mb-1">
            <CloudLightning className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Officer Authentication</h2>
          <p className="text-xs text-zinc-400">Log in to sync regional diagnostic rules and plots.</p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/25 text-red-400 p-3.5 rounded-xl text-xs animate-shake">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-4">
  <label className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Email Address</label>
  <div className="relative">
    <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
    <input
      type="email"
      required
      value={email}
      onChange={e => setEmail(e.target.value)}
      placeholder="Juan.delacruz@cropwise.org"
      className="w-full bg-zinc-950 border border-zinc-800/40 focus:border-emerald-500/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-650 outline-none transition-all"
    />
  </div>

  <label className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Security Password</label>
  <div className="relative">
    <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
    <input
      type="password"
      required
      value={password}
      onChange={e => setPassword(e.target.value)}
      placeholder="••••••••"
      className="w-full bg-zinc-950 border border-zinc-800/40 focus:border-emerald-500/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-650 outline-none transition-all"
    />
  </div>

  <button
    type="submit"
    disabled={isLoading}
    className="w-full flex items-center justify-center space-x-2 bg-emerald-950/30 border border-emerald-900/30 text-emerald-400 hover:bg-emerald-800/30 disabled:bg-zinc-800 disabled:text-zinc-500 rounded-xl text-xs font-semibold py-3 transition shadow-lg hover:scale-[1.02] active:scale-95 cursor-pointer"
  >
    <span>{isLoading ? 'Verifying Credentials...' : 'Authenticate'}</span>
    {!isLoading && <ArrowRight className="w-4 h-4" />}
  </button>
</form>

        {/* Demo Account Box */}
        <div className="bg-zinc-950/50 border border-zinc-800/40 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 flex items-center">
              <Sparkles className="w-3 h-3 text-emerald-400 mr-1" /> Demonstration Credentials
            </span>
            <button
              onClick={handleAutoFillDemo}
              className="text-[9px] font-bold uppercase text-emerald-450 hover:text-emerald-350 cursor-pointer"
            >
              Autofill
            </button>
          </div>
          <div className="text-[10px] text-zinc-450 space-y-1 font-mono">
            <p>Email: <span className="text-zinc-300 font-semibold select-all">gabriel.agila@cropwise.org</span></p>
            <p>Password: <span className="text-zinc-300 font-semibold select-all">password123</span></p>
          </div>
        </div>

        {/* Back navigation */}
        <div className="text-center no-print">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center space-x-1.5 text-zinc-500 hover:text-zinc-300 text-xs font-semibold cursor-pointer transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel & Go Back</span>
          </button>
        </div>

      </div>
    </div>
  );
};
