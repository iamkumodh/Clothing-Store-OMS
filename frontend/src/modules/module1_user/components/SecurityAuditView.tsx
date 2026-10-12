// Security Login Audit Log Explorer & Intrusion Tracking View

import { useState, useEffect } from 'react';
import { UserLoginAuditRecord } from '../types';
import { module1Api } from '../api/module1ApiClient';
import { ShieldAlert, Search, RefreshCw } from 'lucide-react';

export function SecurityAuditView() {
  const [logs, setLogs] = useState<UserLoginAuditRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await module1Api.getAuditLogs();
      setLogs(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.attemptedEmail.toLowerCase().includes(search.toLowerCase()) ||
      log.ipAddress.includes(search);
    const matchesStatus = statusFilter === 'ALL' || log.loginStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const successCount = logs.filter(l => l.loginStatus === 'SUCCESS').length;
  const badCredsCount = logs.filter(l => l.loginStatus === 'FAILED_BAD_CREDENTIALS').length;
  const lockedCount = logs.filter(l => l.loginStatus === 'FAILED_LOCKED').length;

  return (
    <div className="bg-white border border-zinc-200 rounded-none p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6 mb-6">
        <div>
          <h2 className="font-serif text-2xl text-[#0a0a0a] flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-zinc-900" />
            <span>Security Login Audit Log</span>
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Real-time authentication activity, IP tracing, and intrusion attempt monitoring (user_login_audit).
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-zinc-300 hover:bg-zinc-100 text-xs font-medium text-zinc-700 rounded-none transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Audit Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-none">
          <div className="text-[10px] uppercase font-semibold text-zinc-500">Total Tracked</div>
          <div className="text-xl font-bold font-mono text-[#0a0a0a] mt-1">{logs.length}</div>
        </div>
        <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-none">
          <div className="text-[10px] uppercase font-semibold text-zinc-500">Successful</div>
          <div className="text-xl font-bold font-mono text-zinc-900 mt-1">{successCount}</div>
        </div>
        <div className="p-3 bg-rose-50/60 border border-rose-200 rounded-none">
          <div className="text-[10px] uppercase font-semibold text-rose-800">Bad Credentials</div>
          <div className="text-xl font-bold font-mono text-rose-700 mt-1">{badCredsCount}</div>
        </div>
        <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-none">
          <div className="text-[10px] uppercase font-semibold text-amber-800">Locked Blocks</div>
          <div className="text-xl font-bold font-mono text-amber-700 mt-1">{lockedCount}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Filter by attempted email or IP address..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 border border-zinc-300 text-xs outline-none focus:border-black rounded-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="h-10 px-3 border border-zinc-300 text-xs outline-none bg-white min-w-[170px] rounded-none focus:border-black"
        >
          <option value="ALL">All Event Types</option>
          <option value="SUCCESS">SUCCESS</option>
          <option value="FAILED_BAD_CREDENTIALS">FAILED_BAD_CREDENTIALS</option>
          <option value="FAILED_LOCKED">FAILED_LOCKED</option>
          <option value="LOGOUT">LOGOUT</option>
        </select>
      </div>

      {/* Log Feed Table */}
      {loading ? (
        <div className="py-12 text-center text-xs text-zinc-500 uppercase tracking-wider animate-pulse">
          Querying security audit logs...
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="py-12 text-center text-xs text-zinc-500">
          No audit entries matching filter criteria.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 text-[11px] uppercase tracking-wider text-zinc-500">
                <th className="py-3 font-semibold">Audit ID</th>
                <th className="py-3 font-semibold">Timestamp</th>
                <th className="py-3 font-semibold">Attempted Account</th>
                <th className="py-3 font-semibold">Source IP</th>
                <th className="py-3 font-semibold text-right">Authentication Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredLogs.map(log => {
                const formattedTime = new Date(log.loginTime).toLocaleString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                });

                return (
                  <tr key={log.auditId} className="hover:bg-zinc-50 transition-colors">
                    <td className="py-3 font-mono text-[11px] text-zinc-500">#{log.auditId}</td>
                    <td className="py-3 text-zinc-600 font-mono text-[11px]">{formattedTime}</td>
                    <td className="py-3 font-medium text-zinc-900">{log.attemptedEmail}</td>
                    <td className="py-3 font-mono text-[11px] text-zinc-500">{log.ipAddress}</td>
                    <td className="py-3 text-right">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-none uppercase tracking-wider border ${
                          log.loginStatus === 'SUCCESS'
                            ? 'bg-zinc-100 text-zinc-900 border-zinc-200'
                            : log.loginStatus === 'LOGOUT'
                              ? 'bg-zinc-50 text-zinc-600 border-zinc-200'
                              : log.loginStatus === 'FAILED_LOCKED'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
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
  );
}
