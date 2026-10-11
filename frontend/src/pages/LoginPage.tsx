// customer login and register page

import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../modules/module1_user/context/AuthContext';
import { ChevronDownIcon } from '../components/common/icons';
import { ForgotPasswordModal } from '../modules/module1_user/components/ForgotPasswordModal';

export default function LoginPage({
  initialMode = 'login',
}: {
  initialMode?: 'login' | 'register' | 'recover';
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, register } = useAuth();

  const [mode, setMode] = useState<'login' | 'recover' | 'register'>(initialMode);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Recover form state
  const [recoverEmail, setRecoverEmail] = useState('');

  // Register form state (mapping to app_user & customer backend schema)
  const [regData, setRegData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    password: '',
    confirmPassword: '',
    shippingAddress: '',
    city: '',
    district: 'Colombo',
    province: 'Western',
    postalCode: '',
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setLoading(true);

    try {
      const res = await login({ email, password });
      setFeedback({
        type: 'success',
        message: `Signed in successfully as ${res.email || email}`,
      });

      // Role-based smart redirection
      if (res.role === 'ADMIN' || res.role === 'STORE_STAFF' || res.role === 'MANAGER') {
        navigate('/admin');
      } else {
        const redirect = searchParams.get('redirect') || '/account';
        navigate(redirect);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Invalid email or password. Please try again.';
      setFeedback({
        type: 'error',
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecoverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback({
      type: 'success',
      message: `If an account exists for ${recoverEmail}, a password reset link has been dispatched.`,
    });
    setMode('login');
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    // Validation
    if (regData.password !== regData.confirmPassword) {
      setFeedback({ type: 'error', message: 'Passwords do not match.' });
      return;
    }
    if (regData.password.length < 6) {
      setFeedback({ type: 'error', message: 'Password must be at least 6 characters long.' });
      return;
    }
    if (!regData.contactNumber.trim()) {
      setFeedback({ type: 'error', message: 'Please provide a valid contact number.' });
      return;
    }
    if (!regData.shippingAddress.trim() || !regData.city.trim()) {
      setFeedback({ type: 'error', message: 'Please provide complete shipping address details.' });
      return;
    }

    setLoading(true);
    try {
      await register({
        email: regData.email,
        password: regData.password,
        firstName: regData.firstName,
        lastName: regData.lastName,
        contactNumber: regData.contactNumber,
        shippingAddress: regData.shippingAddress,
        city: regData.city,
        district: regData.district,
        province: regData.province,
        postalCode: regData.postalCode || undefined,
      });

      navigate('/account');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to create account. Please try again.';
      setFeedback({ type: 'error', message });
    } finally {
      setLoading(false);
    }
  };

  const districts = [
    'Colombo',
    'Gampaha',
    'Kalutara',
    'Kandy',
    'Matale',
    'Nuwara Eliya',
    'Galle',
    'Matara',
    'Hambantota',
    'Jaffna',
    'Kilinochchi',
    'Mannar',
    'Vavuniya',
    'Mullaitivu',
    'Batticaloa',
    'Ampara',
    'Trincomalee',
    'Kurunegala',
    'Puttalam',
    'Anuradhapura',
    'Polonnaruwa',
    'Badulla',
    'Monaragala',
    'Ratnapura',
    'Kegalle',
  ];

  const provinces = [
    'Western',
    'Central',
    'Southern',
    'Northern',
    'Eastern',
    'North Western',
    'North Central',
    'Uva',
    'Sabaragamuwa',
  ];

  return (
    <div className="w-full flex items-center justify-center py-16 px-4 sm:px-6">
      <div
        className={`w-full ${mode === 'register' ? 'max-w-[620px]' : 'max-w-[460px]'} mx-auto transition-all duration-300`}
      >
        {/* Status Notification */}
        {feedback && (
          <div
            className={`mb-8 p-4 text-xs leading-relaxed text-center font-medium border rounded-[2px] ${
              feedback.type === 'success'
                ? 'bg-zinc-50 border-zinc-300 text-zinc-900'
                : 'bg-zinc-50 border-rose-300 text-rose-700'
            }`}
          >
            {feedback.message}
          </div>
        )}

        {/* 1. LOGIN MODE */}
        {mode === 'login' && (
          <div id="CustomerLoginForm" className="space-y-6">
            <header className="text-center mb-8">
              <h1 className="font-serif text-3xl md:text-4xl font-normal text-[#0a0a0a] tracking-tight">
                Sign In
              </h1>
              <p className="text-xs text-zinc-500 mt-2">
                Access your D&apos;fine shopping bag, saved addresses, and orders.
              </p>
            </header>

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="CustomerEmail"
                  className="block text-[11px] uppercase tracking-[0.15em] font-semibold text-[#0a0a0a] mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="CustomerEmail"
                  name="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-11 px-3.5 bg-white border border-zinc-300 focus:border-black focus:ring-1 focus:ring-black text-sm text-[#0a0a0a] outline-none transition-colors placeholder:text-zinc-400"
                  autoComplete="email"
                  autoFocus
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="CustomerPassword"
                    className="text-[11px] uppercase tracking-[0.15em] font-semibold text-[#0a0a0a]"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setFeedback(null);
                      setIsForgotModalOpen(true);
                    }}
                    className="text-xs text-zinc-500 hover:text-black underline transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  id="CustomerPassword"
                  name="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 px-3.5 bg-white border border-zinc-300 focus:border-black focus:ring-1 focus:ring-black text-sm text-[#0a0a0a] outline-none transition-colors placeholder:text-zinc-400"
                  autoComplete="current-password"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-black hover:bg-zinc-800 text-white text-[12px] uppercase tracking-[0.2em] font-semibold transition-colors duration-200 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </div>

              <div className="flex flex-col items-center gap-3 pt-4 border-t border-zinc-200 text-center">
                <p className="text-xs text-zinc-500">
                  Don&apos;t have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setFeedback(null);
                      setMode('register');
                    }}
                    className="text-[#0a0a0a] font-semibold hover:underline cursor-pointer"
                  >
                    Create account
                  </button>
                </p>
                <Link
                  to="/"
                  className="text-xs text-zinc-500 hover:text-black underline transition-colors"
                >
                  Return to Store
                </Link>
              </div>
            </form>
          </div>
        )}

        {/* 2. REGISTER ACCOUNT MODE (Customer Schema) */}
        {mode === 'register' && (
          <div id="CustomerRegisterForm" className="space-y-6">
            <header className="text-center mb-8">
              <h1 className="font-serif text-3xl md:text-4xl font-normal text-[#0a0a0a] tracking-tight">
                Create Account
              </h1>
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                Join D&apos;fine to track purchases, save delivery addresses, and enjoy faster
                checkout.
              </p>
            </header>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Name Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.15em] font-semibold text-[#0a0a0a] mb-1.5">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={regData.firstName}
                    onChange={e => setRegData({ ...regData, firstName: e.target.value })}
                    placeholder="e.g. Maya"
                    className="w-full h-11 px-3.5 bg-white border border-zinc-300 focus:border-black focus:ring-1 focus:ring-black text-sm text-[#0a0a0a] outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.15em] font-semibold text-[#0a0a0a] mb-1.5">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={regData.lastName}
                    onChange={e => setRegData({ ...regData, lastName: e.target.value })}
                    placeholder="e.g. Fernando"
                    className="w-full h-11 px-3.5 bg-white border border-zinc-300 focus:border-black focus:ring-1 focus:ring-black text-sm text-[#0a0a0a] outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.15em] font-semibold text-[#0a0a0a] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={regData.email}
                    onChange={e => setRegData({ ...regData, email: e.target.value })}
                    placeholder="maya@example.com"
                    className="w-full h-11 px-3.5 bg-white border border-zinc-300 focus:border-black focus:ring-1 focus:ring-black text-sm text-[#0a0a0a] outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.15em] font-semibold text-[#0a0a0a] mb-1.5">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={regData.contactNumber}
                    onChange={e => setRegData({ ...regData, contactNumber: e.target.value })}
                    placeholder="077 123 4567"
                    className="w-full h-11 px-3.5 bg-white border border-zinc-300 focus:border-black focus:ring-1 focus:ring-black text-sm text-[#0a0a0a] outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.15em] font-semibold text-[#0a0a0a] mb-1.5">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={regData.password}
                    onChange={e => setRegData({ ...regData, password: e.target.value })}
                    placeholder="Min. 6 characters"
                    className="w-full h-11 px-3.5 bg-white border border-zinc-300 focus:border-black focus:ring-1 focus:ring-black text-sm text-[#0a0a0a] outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.15em] font-semibold text-[#0a0a0a] mb-1.5">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={regData.confirmPassword}
                    onChange={e => setRegData({ ...regData, confirmPassword: e.target.value })}
                    placeholder="Re-enter password"
                    className="w-full h-11 px-3.5 bg-white border border-zinc-300 focus:border-black focus:ring-1 focus:ring-black text-sm text-[#0a0a0a] outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Shipping Address (Customer Table Requirement) */}
              <div className="pt-2">
                <label className="block text-[11px] uppercase tracking-[0.15em] font-semibold text-[#0a0a0a] mb-1.5">
                  Shipping Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={regData.shippingAddress}
                  onChange={e => setRegData({ ...regData, shippingAddress: e.target.value })}
                  placeholder="Street address, building, apartment/suite"
                  className="w-full h-11 px-3.5 bg-white border border-zinc-300 focus:border-black focus:ring-1 focus:ring-black text-sm text-[#0a0a0a] outline-none transition-colors"
                />
              </div>

              {/* City, District, Province */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.15em] font-semibold text-[#0a0a0a] mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={regData.city}
                    onChange={e => setRegData({ ...regData, city: e.target.value })}
                    placeholder="e.g. Colombo 03"
                    className="w-full h-11 px-3.5 bg-white border border-zinc-300 focus:border-black focus:ring-1 focus:ring-black text-sm text-[#0a0a0a] outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.15em] font-semibold text-[#0a0a0a] mb-1.5">
                    District *
                  </label>
                  <div className="relative">
                    <select
                      value={regData.district}
                      onChange={e => setRegData({ ...regData, district: e.target.value })}
                      className="w-full h-11 pl-3.5 pr-10 bg-white border border-zinc-300 focus:border-black focus:ring-1 focus:ring-black text-sm text-[#0a0a0a] outline-none transition-colors appearance-none cursor-pointer"
                    >
                      {districts.map(d => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-500">
                      <ChevronDownIcon className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.15em] font-semibold text-[#0a0a0a] mb-1.5">
                    Province *
                  </label>
                  <div className="relative">
                    <select
                      value={regData.province}
                      onChange={e => setRegData({ ...regData, province: e.target.value })}
                      className="w-full h-11 pl-3.5 pr-10 bg-white border border-zinc-300 focus:border-black focus:ring-1 focus:ring-black text-sm text-[#0a0a0a] outline-none transition-colors appearance-none cursor-pointer"
                    >
                      {provinces.map(p => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-500">
                      <ChevronDownIcon className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Postal Code */}
              <div>
                <label className="block text-[11px] uppercase tracking-[0.15em] font-semibold text-[#0a0a0a] mb-1.5">
                  Postal Code (Optional)
                </label>
                <input
                  type="text"
                  value={regData.postalCode}
                  onChange={e => setRegData({ ...regData, postalCode: e.target.value })}
                  placeholder="e.g. 00300"
                  className="w-full h-11 px-3.5 bg-white border border-zinc-300 focus:border-black focus:ring-1 focus:ring-black text-sm text-[#0a0a0a] outline-none transition-colors"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-black hover:bg-zinc-800 text-white text-[12px] uppercase tracking-[0.2em] font-semibold transition-colors duration-200 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>

              <div className="flex flex-col items-center gap-3 pt-4 border-t border-zinc-200 text-center">
                <p className="text-xs text-zinc-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setFeedback(null);
                      setMode('login');
                    }}
                    className="text-[#0a0a0a] font-semibold hover:underline cursor-pointer"
                  >
                    Sign in
                  </button>
                </p>
                <Link
                  to="/"
                  className="text-xs text-zinc-500 hover:text-black underline transition-colors"
                >
                  Return to Store
                </Link>
              </div>
            </form>
          </div>
        )}

        {/* 3. RECOVER PASSWORD MODE */}
        {mode === 'recover' && (
          <div id="RecoverPasswordForm" className="space-y-6">
            <header className="text-center mb-6">
              <h2 className="font-serif text-3xl font-normal text-[#0a0a0a] tracking-tight mb-2">
                Reset your password
              </h2>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Enter your account email and we will send you instructions to reset your password.
              </p>
            </header>

            <form onSubmit={handleRecoverSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="RecoverEmail"
                  className="block text-[11px] uppercase tracking-[0.15em] font-semibold text-[#0a0a0a] mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="RecoverEmail"
                  name="email"
                  required
                  value={recoverEmail}
                  onChange={e => setRecoverEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-11 px-3.5 bg-white border border-zinc-300 focus:border-black focus:ring-1 focus:ring-black text-sm text-[#0a0a0a] outline-none transition-colors"
                  autoComplete="email"
                  autoFocus
                />
              </div>

              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  className="w-full h-12 bg-black hover:bg-zinc-800 text-white text-[12px] uppercase tracking-[0.2em] font-semibold transition-colors duration-200 cursor-pointer"
                >
                  Send Reset Link
                </button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setFeedback(null);
                      setMode('login');
                    }}
                    className="text-xs text-zinc-500 hover:underline transition-colors pt-2 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>

      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        initialEmail={email}
      />
    </div>
  );
}
