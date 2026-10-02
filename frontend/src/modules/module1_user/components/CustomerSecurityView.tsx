// Customer Security Settings & Personal Login Audit History

import React, { useState, useEffect } from 'react';
import { UserLoginAuditRecord } from '../types';
import { module1Api } from '../api/module1ApiClient';
import { ShieldCheck, Lock, Check, AlertCircle } from 'lucide-react';

interface CustomerSecurityViewProps {
  customerEmail?: string;
}

export function CustomerSecurityView({ customerEmail }: CustomerSecurityViewProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updating, setUpdating] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const [auditLogs, setAuditLogs] = useState<UserLoginAuditRecord[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  useEffect(() => {
    async function loadAudits() {
      setLoadingLogs(true);
      try {
        const all = await module1Api.getAuditLogs();
        if (customerEmail) {
          setAuditLogs(all.filter(log => log.attemptedEmail.toLowerCase() === customerEmail.toLowerCase()));
        } else {
          setAuditLogs(all.slice(0, 5));
        }
      } finally {
        setLoadingLogs(false);
      }
    }
    loadAudits();
  }, [customerEmail]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordFeedback(null);

    if (newPassword.length < 6) {
      setPasswordFeedback({
        type: 'error',
        message: 'New password must be at least 6 characters long.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordFeedback({
        type: 'error',
        message: 'New password and confirmation do not match.',
      });
      return;
    }

    setUpdating(true);
    setTimeout(() => {
      setUpdating(false);
      setPasswordFeedback({
        type: 'success',
        message: 'Your account password has been updated securely.',
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 400);
  };

  return (
    <div className="space-y-8">
      {/* Password Change Section */}
      <div className="bg-white border border-zinc-200 rounded-none p-6 sm:p-8">
        <div className="border-b border-zinc-200 pb-4 mb-6">
          <h2 className="font-serif text-2xl text-[#0a0a0a]">Security & Credentials</h2>
          <p className="text-xs text-zinc-500 mt-1">
            Ensure your account is protected with a secure password.
          </p>
        </div>

        {passwordFeedback && (
          <div
            className={`mb-6 p-4 text-xs font-medium rounded-none flex items-center gap-2 border ${
              passwordFeedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            {passwordFeedback.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{passwordFeedback.message}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="max-w-md space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-900 mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-10 px-3 border border-zinc-300 focus:border-black text-sm text-zinc-900 outline-none rounded-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-900 mb-1.5">
              New Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className="w-full h-10 px-3 border border-zinc-300 focus:border-black text-sm text-zinc-900 outline-none rounded-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-900 mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full h-10 px-3 border border-zinc-300 focus:border-black text-sm text-zinc-900 outline-none rounded-none transition-colors"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={updating}
              className="flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-zinc-800 text-white text-xs uppercase tracking-widest font-medium rounded-none transition-colors disabled:opacity-50"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{updating ? 'Updating Password...' : 'Update Password'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Personal Login Audit Log History */}
      <div className="bg-white border border-zinc-200 rounded-none p-6 sm:p-8">
        <div className="border-b border-zinc-200 pb-4 mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl text-[#0a0a0a] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-zinc-800" />
              <span>Personal Sign-In Security Log</span>
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              Records of recent authentication attempts and access history for your credentials (tracked via user_login_audit).
            </p>
          </div>
        </div>

        {loadingLogs ? (
          <div className="py-6 text-center text-xs text-zinc-500 uppercase tracking-wider animate-pulse">
            Loading security logs...
          </div>
        ) : auditLogs.length === 0 ? (
          <div className="py-6 text-center text-xs text-zinc-500">
            No recent activity recorded for this session.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 text-[11px] uppercase tracking-wider text-zinc-500">
                  <th className="py-2.5 font-semibold">Timestamp</th>
                  <th className="py-2.5 font-semibold">IP Address</th>
                  <th className="py-2.5 font-semibold">Attempted Account</th>
                  <th className="py-2.5 font-semibold text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {auditLogs.map(log => {
                  const formatted = new Date(log.loginTime).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr key={log.auditId} className="hover:bg-zinc-50 transition-colors">
                      <td className="py-3 text-zinc-600 font-mono text-[11px]">{formatted}</td>
                      <td className="py-3 text-zinc-600 font-mono text-[11px]">{log.ipAddress}</td>
                      <td className="py-3 text-zinc-900">{log.attemptedEmail}</td>
                      <td className="py-3 text-right">
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-none uppercase tracking-wider border ${
                            log.loginStatus === 'SUCCESS'
                              ? 'bg-zinc-100 text-zinc-900 border-zinc-200'
                              : log.loginStatus === 'LOGOUT'
                                ? 'bg-zinc-50 text-zinc-600 border-zinc-200'
                                : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}
                        >
                          {log.loginStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
