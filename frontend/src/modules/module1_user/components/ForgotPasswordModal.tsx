// forgot password and reset token modal

import React, { useState } from 'react';
import { requestPasswordReset, resetPasswordWithToken } from '../../../api/authApi';
import { X, KeyRound, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
}

export function ForgotPasswordModal({ isOpen, onClose, initialEmail = '' }: ForgotPasswordModalProps) {
  const [step, setStep] = useState<'request' | 'reset' | 'success'>('request');
  const [email, setEmail] = useState(initialEmail);
  const [tokenHash, setTokenHash] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRequestToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await requestPasswordReset(email);
      if (res.tokenHash) {
        setTokenHash(res.tokenHash);
      }
      setStep('reset');
    } catch (err: any) {
      setError(err.message || 'Failed to generate password reset request.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await resetPasswordWithToken(tokenHash, newPassword);
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. The token may be expired.');
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setStep('request');
    setError(null);
    setTokenHash('');
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border border-zinc-200 shadow-2xl p-6 sm:p-8 text-[#0a0a0a]">
        {/* Close Button */}
        <button
          onClick={resetAll}
          className="absolute top-4 right-4 p-1.5 text-zinc-500 hover:text-black transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-black text-white flex items-center justify-center shrink-0">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest font-mono text-zinc-500">
              Module 1 • Security Recovery
            </div>
            <h2 className="font-serif text-xl font-medium tracking-tight text-[#0a0a0a]">
              Password Reset
            </h2>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-zinc-50 border border-zinc-200 flex items-start gap-2.5 text-xs text-zinc-800">
            <AlertCircle className="w-4 h-4 text-black shrink-0 mt-0.5" />
            <div className="leading-relaxed">{error}</div>
          </div>
        )}

        {/* Step 1: Request Email */}
        {step === 'request' && (
          <form onSubmit={handleRequestToken} className="space-y-4">
            <p className="text-xs text-zinc-600 leading-relaxed">
              Enter your registered D&apos;fine account email address. We will generate a secure 64-character verification token matching the database schema.
            </p>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-700 mb-1.5">
                Account Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. kavindu.bandara@gmail.com"
                className="w-full h-11 px-3.5 bg-white border border-zinc-300 focus:border-black focus:ring-1 focus:ring-black text-sm text-[#0a0a0a] outline-none transition-colors"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-black hover:bg-zinc-800 text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Generating Token...</span>
              ) : (
                <>
                  <span>Request Reset Token</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Step 2: Enter New Password */}
        {step === 'reset' && (
          <form onSubmit={handleConfirmReset} className="space-y-4">
            <div className="p-3 bg-zinc-50 border border-zinc-200 text-xs">
              <div className="flex items-center gap-1.5 text-zinc-900 font-semibold mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Simulated Reset Token Generated:</span>
              </div>
              <div className="font-mono text-[10px] text-zinc-600 break-all bg-white p-2 border border-zinc-200">
                {tokenHash || 'SHA-256 token bound to account'}
              </div>
              <div className="text-[10px] text-zinc-500 mt-1">
                Expires in 15 minutes. In live production, this token is dispatched via email.
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-700 mb-1.5">
                New Password *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full h-11 px-3.5 bg-white border border-zinc-300 focus:border-black focus:ring-1 focus:ring-black text-sm text-[#0a0a0a] outline-none transition-colors"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-700 mb-1.5">
                Confirm New Password *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full h-11 px-3.5 bg-white border border-zinc-300 focus:border-black focus:ring-1 focus:ring-black text-sm text-[#0a0a0a] outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-black hover:bg-zinc-800 text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Updating Password...</span>
              ) : (
                <>
                  <span>Save New Password</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Step 3: Success Screen */}
        {step === 'success' && (
          <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 bg-zinc-100 text-black border border-zinc-300 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-[#0a0a0a]">
                Password Successfully Reset
              </h3>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                Your credentials have been securely updated in the database. You can now log into your account with your new password.
              </p>
            </div>
            <button
              onClick={resetAll}
              className="w-full h-11 bg-black hover:bg-zinc-800 text-white text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
            >
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
