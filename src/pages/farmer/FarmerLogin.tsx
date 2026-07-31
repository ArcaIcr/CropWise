import React, { useState } from 'react';
import { db } from '../../db/db';
import { Tractor, ArrowRight, AlertTriangle, Sparkles } from 'lucide-react';

export const FarmerLogin: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password) {
      setError('Please enter phone number and password');
      return;
    }
    setLoading(true);
    setError('');

    try {
      // Find farmer in local DB by phone
      const farmers = await db.farmers.toArray();
      const farmer = farmers.find(f => 
        f.phone.replace(/\D/g, '') === phone.replace(/\D/g, '') && 
        !f.isDeleted
      );

      if (!farmer) {
        setError('Farmer not found. Please check your phone number.');
        return;
      }

      // Verify password (simple base64 compare for demo)
      const passwordHash = btoa(password);
      if (farmer.passwordHash !== passwordHash) {
        setError('Incorrect password. Please try again.');
        return;
      }

      // Create a mock user session for the farmer
      const mockUser = {
        id: farmer.id,
        email: `${farmer.phone.replace(/\D/g, '')}@cropwise.farmer`,
        name: farmer.name,
        phone: farmer.phone,
        cooperativeId: farmer.cooperativeId,
        role: 'farmer' as const,
        cooperative: undefined,
        user_metadata: { role: 'farmer' },
        app_metadata: {},
        aud: '',
        created_at: new Date(farmer.createdAt).toISOString()
      };

      // Store in localStorage for session persistence
      localStorage.setItem('farmer_session', JSON.stringify(mockUser));

      // Redirect to farmer dashboard
      window.location.href = '/farmer';
    } catch (err) {
      console.error(err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-green-50 dark:from-zinc-950 dark:to-zinc-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl text-emerald-600 dark:text-emerald-400 mb-4">
            <Tractor className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">CropWise Farmer Portal</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">View your soil reports & fertilizer plans</p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-zinc-200 dark:border-zinc-800">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-red-700 dark:text-red-400 text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="0917-XXX-XXXX"
                  className="w-full pl-10 pr-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-h-[48px] text-base"
                  inputMode="tel"
                  autoComplete="tel"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-h-[48px] text-base"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 min-h-[52px]"
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          {/* Demo Info */}
          <div className="mt-6 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Demo Access
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">
              Use any registered farmer's phone number from the officer portal.
            </p>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono space-y-1">
              <p>Example: 09172345678</p>
              <p>Password: farmer123</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-zinc-500 dark:text-zinc-400">
          <p>© 2024 CropWise Technologies</p>
          <p className="mt-1">Aligned with DA-BSWM Standards</p>
        </div>
      </div>
    </div>
  );
};

export default FarmerLogin;