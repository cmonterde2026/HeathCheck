import { useState } from 'react';
import {
  AlertCircle,
  Eye,
  EyeOff,
  LogIn,
  Mail,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthFormCardProps {
  onSuccess?: () => void;
}

export function AuthFormCard({ onSuccess }: AuthFormCardProps) {
  const {
    authBusy,
    authError,
    clearAuthError,
    registerWithEmail,
    loginWithEmail,
    signInWithGoogle,
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const switchMode = (nextMode: 'login' | 'register') => {
    setMode(nextMode);
    setLocalError(null);
    clearAuthError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearAuthError();

    if (!email.trim() || !password) {
      setLocalError('Please enter both your email address and password.');
      return;
    }

    if (mode === 'register') {
      if (!fullName.trim()) {
        setLocalError('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setLocalError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setLocalError('Passwords do not match.');
        return;
      }
      const res = await registerWithEmail(fullName, email, password);
      if (res.ok && onSuccess) {
        onSuccess();
      }
    } else {
      const res = await loginWithEmail(email, password);
      if (res.ok && onSuccess) {
        onSuccess();
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setLocalError(null);
    clearAuthError();
    const res = await signInWithGoogle();
    if (res.ok && onSuccess) {
      onSuccess();
    }
  };

  const activeError = localError || authError;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-1 rounded-lg bg-[#EFF6F2] p-1">
        <button
          type="button"
          onClick={() => switchMode('login')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-semibold transition-colors ${
            mode === 'login'
              ? 'bg-white text-[#0D3B2B] shadow-xs'
              : 'text-[#4A6559] hover:text-[#0D3B2B]'
          }`}
        >
          <LogIn className="h-4 w-4" aria-hidden="true" />
          <span>Sign In</span>
        </button>
        <button
          type="button"
          onClick={() => switchMode('register')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-semibold transition-colors ${
            mode === 'register'
              ? 'bg-white text-[#0D3B2B] shadow-xs'
              : 'text-[#4A6559] hover:text-[#0D3B2B]'
          }`}
        >
          <UserPlus className="h-4 w-4" aria-hidden="true" />
          <span>Create Account</span>
        </button>
      </div>

      <div>
        <h2 className="font-display text-xl font-bold text-[#0D3B2B]">
          {mode === 'login'
            ? 'Sign in to HealthCheck'
            : 'Register a HealthCheck Account'}
        </h2>
        <p className="mt-1 text-sm text-[#4A6559]">
          {mode === 'login'
            ? 'Sign in with your email and password or continue with Google.'
            : 'Create an account with email and password or sign up with Google.'}
        </p>
      </div>

      <button
        type="button"
        disabled={authBusy}
        onClick={() => void handleGoogleSignIn()}
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#C6DAD0] bg-white px-4 py-2.5 text-sm font-semibold text-[#0D3B2B] transition-colors hover:bg-[#F3F8F5] disabled:opacity-60"
      >
        <Mail className="h-4 w-4 text-[#188055]" aria-hidden="true" />
        <span>
          {mode === 'register' ? 'Sign up with Google' : 'Continue with Google'}
        </span>
      </button>

      <div className="relative flex items-center py-1">
        <div className="flex-grow border-t border-[#E4EDE8]" />
        <span className="mx-3 shrink-0 text-xs font-medium text-[#5B776A]">
          or use email and password
        </span>
        <div className="flex-grow border-t border-[#E4EDE8]" />
      </div>

      {activeError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-900"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-700" aria-hidden="true" />
          <span>{activeError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <div>
            <label
              htmlFor="auth-fullname"
              className="block text-sm font-semibold text-[#0D3B2B]"
            >
              Full Name
            </label>
            <input
              id="auth-fullname"
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="mt-1.5 w-full rounded-lg border border-[#CFE0D6] bg-white px-3.5 py-2.5 text-sm text-[#10261D] focus:border-[#188055] focus:outline-none focus:ring-2 focus:ring-[#188055]/20"
            />
          </div>
        )}

        <div>
          <label htmlFor="auth-email" className="block text-sm font-semibold text-[#0D3B2B]">
            Email Address
          </label>
          <input
            id="auth-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1.5 w-full rounded-lg border border-[#CFE0D6] bg-white px-3.5 py-2.5 text-sm text-[#10261D] focus:border-[#188055] focus:outline-none focus:ring-2 focus:ring-[#188055]/20"
          />
        </div>

        <div>
          <label
            htmlFor="auth-password"
            className="block text-sm font-semibold text-[#0D3B2B]"
          >
            Password
          </label>
          <div className="relative mt-1.5">
            <input
              id="auth-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'register' ? 'Minimum 6 characters' : 'Enter your password'}
              className="w-full rounded-lg border border-[#CFE0D6] bg-white py-2.5 pl-3.5 pr-10 text-sm text-[#10261D] focus:border-[#188055] focus:outline-none focus:ring-2 focus:ring-[#188055]/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-[#5B776A] hover:text-[#0D3B2B]"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {mode === 'register' && (
          <div>
            <label
              htmlFor="auth-confirm-password"
              className="block text-sm font-semibold text-[#0D3B2B]"
            >
              Confirm Password
            </label>
            <input
              id="auth-confirm-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className="mt-1.5 w-full rounded-lg border border-[#CFE0D6] bg-white px-3.5 py-2.5 text-sm text-[#10261D] focus:border-[#188055] focus:outline-none focus:ring-2 focus:ring-[#188055]/20"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={authBusy}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0D3B2B] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#14533C] disabled:opacity-60"
        >
          {mode === 'login' ? (
            <LogIn className="h-4 w-4" aria-hidden="true" />
          ) : (
            <UserPlus className="h-4 w-4" aria-hidden="true" />
          )}
          <span>
            {authBusy
              ? 'Please wait...'
              : mode === 'login'
              ? 'Sign In'
              : 'Create Account'}
          </span>
        </button>
      </form>
    </div>
  );
}
