import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { AlienLogo } from './AlienLogo.js';
import { X, Mail, Lock, User as UserIcon, Eye, EyeOff, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
  onSuccess,
}) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Sync mode when defaultMode changes
  React.useEffect(() => {
    setMode(defaultMode);
    setError(null);
  }, [defaultMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'signup') {
      if (!username.trim()) {
        setError('Please enter your username.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (!agreeTerms) {
        setError('Please agree to Alien.ai Terms and Privacy Policy.');
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(username, email, password, confirmPassword);
      }
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const setTestAccount = (type: 'admin' | 'new_user') => {
    if (type === 'admin') {
      setMode('login');
      setEmail('admin@alien.ai');
      setPassword('AlienAdmin2026!');
    } else {
      const randId = Math.floor(Math.random() * 9000) + 1000;
      setMode('signup');
      setUsername(`Creator_${randId}`);
      setEmail(`creator_${randId}@alien.ai`);
      setPassword('Creator123!');
      setConfirmPassword('Creator123!');
    }
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#14111F] border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#A29CB8] hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <AlienLogo size="md" animated showWordmark />
          <h2 className="text-xl font-heading font-bold text-white mt-3">
            {mode === 'login' ? 'Welcome Back to Alien.ai' : 'Create Your Alien.ai Account'}
          </h2>
          <p className="text-xs text-[#A29CB8] mt-1">
            {mode === 'login'
              ? 'Access your saved creations, credits, and video projects'
              : 'Sign up today and get 50 Free Credits automatically'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex p-1 bg-[#07060D] rounded-xl border border-white/5 mb-5">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-[#7C5CFF] text-white shadow-md'
                : 'text-[#A29CB8] hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'signup'
                ? 'bg-[#7C5CFF] text-white shadow-md'
                : 'text-[#A29CB8] hover:text-white'
            }`}
          >
            <span>Create Account</span>
            <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-[#22E6A8] text-[#07060D] font-bold">
              +50 Cr
            </span>
          </button>
        </div>

        {/* Quick Test Credential Chips for seamless instant testing */}
        <div className="mb-4 p-2.5 bg-[#07060D]/80 border border-[#7C5CFF]/20 rounded-xl">
          <div className="flex items-center justify-between text-[11px] text-[#A29CB8] mb-1.5">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#22E6A8]" /> Quick One-Click Credentials:
            </span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTestAccount('new_user')}
              className="flex-1 py-1 px-2 text-[11px] font-medium bg-[#7C5CFF]/15 hover:bg-[#7C5CFF]/30 text-[#7C5CFF] border border-[#7C5CFF]/30 rounded-lg transition-colors cursor-pointer truncate"
            >
              ⚡ New User (+50 Cr)
            </button>
            <button
              type="button"
              onClick={() => setTestAccount('admin')}
              className="flex-1 py-1 px-2 text-[11px] font-medium bg-[#22E6A8]/15 hover:bg-[#22E6A8]/30 text-[#22E6A8] border border-[#22E6A8]/30 rounded-lg transition-colors cursor-pointer truncate"
            >
              👑 Admin (500 Cr)
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2">
            <span className="shrink-0 text-sm">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-[#A29CB8] mb-1">
                Username / Display Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 w-4 h-4 text-[#A29CB8]" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. StarVoyager"
                  className="w-full bg-[#07060D] border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-[#A29CB8]/50 focus:outline-none focus:border-[#7C5CFF] transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#A29CB8] mb-1">
              Email / Gmail Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-[#A29CB8]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#07060D] border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-[#A29CB8]/50 focus:outline-none focus:border-[#7C5CFF] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A29CB8] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-[#A29CB8]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#07060D] border border-white/10 rounded-xl py-2.5 pl-9 pr-10 text-sm text-white placeholder:text-[#A29CB8]/50 focus:outline-none focus:border-[#7C5CFF] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-[#A29CB8] hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-[#A29CB8] mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-[#A29CB8]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#07060D] border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-[#A29CB8]/50 focus:outline-none focus:border-[#7C5CFF] transition-colors"
                />
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="rounded border-white/20 bg-[#07060D] text-[#7C5CFF] focus:ring-0"
              />
              <span className="text-[11px] text-[#A29CB8]">
                I agree to the Terms of Service & Privacy Policy
              </span>
            </label>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-[#7C5CFF] to-[#B05CFF] hover:from-[#8C6DFF] hover:to-[#BD73FF] transition-all duration-200 shadow-lg shadow-[#7C5CFF]/30 flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : mode === 'login' ? (
              <span>Sign In</span>
            ) : (
              <span className="flex items-center gap-1.5">
                <span>Create Account & Claim 50 Credits</span>
              </span>
            )}
          </button>
        </form>

        {/* Footer switch */}
        <div className="mt-5 text-center text-xs text-[#A29CB8]">
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(null); }}
                className="text-[#22E6A8] hover:underline font-semibold cursor-pointer"
              >
                Sign up for 50 free credits
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); }}
                className="text-[#7C5CFF] hover:underline font-semibold cursor-pointer"
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
