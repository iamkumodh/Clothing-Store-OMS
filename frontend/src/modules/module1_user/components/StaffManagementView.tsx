// Store Staff Administration View with Role Clearance Provisioning

import React, { useState, useEffect } from 'react';
import { StoreStaffProfile, CreateStaffPayload, ClearanceLevel, AccountStatus } from '../types';
import { module1Api } from '../api/module1ApiClient';
import { UserPlus, Shield, X, Check, AlertCircle } from 'lucide-react';

export function StaffManagementView() {
  const [staffList, setStaffList] = useState<StoreStaffProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [newStaff, setNewStaff] = useState<CreateStaffPayload>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    designation: 'Floor Sales Supervisor',
    clearanceLevel: 'TIER_1',
  });

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const data = await module1Api.getAllStaff();
      setStaffList(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setSubmitting(true);
    try {
      await module1Api.createStaff(newStaff);
      setFeedback({
        type: 'success',
        message: `Staff account provisioned successfully for ${newStaff.firstName} ${newStaff.lastName}.`,
      });
      setIsModalOpen(false);
      setNewStaff({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        designation: 'Floor Sales Supervisor',
        clearanceLevel: 'TIER_1',
      });
      await fetchStaff();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create staff member.';
      setFeedback({ type: 'error', message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (staffId: number, currentStatus: AccountStatus) => {
    const newStatus: AccountStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await module1Api.toggleStaffStatus(staffId, newStatus);
      setStaffList(prev =>
        prev.map(s => (s.staffId === staffId ? { ...s, accountStatus: newStatus } : s))
      );
    } catch {
      alert('Could not update staff status.');
    }
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-none p-6 sm:p-8">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6 mb-6">
        <div>
          <h2 className="font-serif text-2xl text-[#0a0a0a]">Store Staff Administration</h2>
          <p className="text-xs text-zinc-500 mt-1">
            Manage operational store staff accounts, designation assignments, and administrative clearance tiers (store_staff).
          </p>
        </div>

        <button
          onClick={() => {
            setFeedback(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-black hover:bg-zinc-800 text-white text-xs uppercase tracking-wider font-medium rounded-none transition-colors self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Provision New Staff</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`mb-6 p-4 text-xs font-medium rounded-none flex items-center gap-2 border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Staff Table */}
      {loading ? (
        <div className="py-12 text-center text-xs text-zinc-500 uppercase tracking-wider animate-pulse">
          Loading staff registry...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 text-[11px] uppercase tracking-wider text-zinc-500">
                <th className="py-3 font-semibold">Staff Member</th>
                <th className="py-3 font-semibold">Staff ID</th>
                <th className="py-3 font-semibold">Designation</th>
                <th className="py-3 font-semibold">Clearance Tier</th>
                <th className="py-3 font-semibold">Status</th>
                <th className="py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {staffList.map(staff => (
                <tr key={staff.staffId} className="hover:bg-zinc-50 transition-colors">
                  <td className="py-3.5 pr-2">
                    <div className="font-semibold text-sm text-zinc-900">
                      {staff.firstName} {staff.lastName}
                    </div>
                    <div className="text-[11px] text-zinc-500 font-mono">{staff.email}</div>
                  </td>
                  <td className="py-3.5 font-mono text-xs text-zinc-600">
                    #STF-{staff.staffId.toString().padStart(3, '0')}
                  </td>
                  <td className="py-3.5 text-zinc-600 font-medium">{staff.designation}</td>
                  <td className="py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-none uppercase tracking-wider border ${
                        staff.clearanceLevel === 'ADMIN_SUPER'
                          ? 'bg-zinc-900 text-white border-zinc-900'
                          : staff.clearanceLevel === 'TIER_2'
                            ? 'bg-zinc-200 text-zinc-900 border-zinc-300'
                            : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                      }`}
                    >
                      <Shield className="w-3 h-3" />
                      <span>{staff.clearanceLevel}</span>
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-none uppercase tracking-wider border ${
                        staff.accountStatus === 'ACTIVE'
                          ? 'bg-zinc-100 text-zinc-900 border-zinc-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      {staff.accountStatus}
                    </span>
                  </td>
                  <td className="py-3.5 text-right space-x-2">
                    <button
                      onClick={() => handleToggleStatus(staff.staffId, staff.accountStatus)}
                      className={`px-2.5 py-1 text-[11px] font-medium border rounded-none transition-colors ${
                        staff.accountStatus === 'ACTIVE'
                          ? 'border-zinc-300 text-zinc-700 hover:bg-zinc-100'
                          : 'border-zinc-900 text-zinc-900 hover:bg-zinc-100'
                      }`}
                    >
                      {staff.accountStatus === 'ACTIVE' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Provision Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-none border border-zinc-200 shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-6">
              <h3 className="font-serif text-xl text-[#0a0a0a]">Provision New Staff Account</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                aria-label="Close dialog"
                className="text-zinc-500 hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-900 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newStaff.firstName}
                    onChange={e => setNewStaff({ ...newStaff, firstName: e.target.value })}
                    className="w-full h-9 px-3 border border-zinc-300 focus:border-black rounded-none text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-900 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newStaff.lastName}
                    onChange={e => setNewStaff({ ...newStaff, lastName: e.target.value })}
                    className="w-full h-9 px-3 border border-zinc-300 focus:border-black rounded-none text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-900 mb-1">
                  Corporate Staff Email *
                </label>
                <input
                  type="email"
                  required
                  value={newStaff.email}
                  onChange={e => setNewStaff({ ...newStaff, email: e.target.value })}
                  placeholder="name@dfine.lk"
                  className="w-full h-9 px-3 border border-zinc-300 focus:border-black rounded-none text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-900 mb-1">
                  Temporary Access Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newStaff.password}
                  onChange={e => setNewStaff({ ...newStaff, password: e.target.value })}
                  placeholder="Min. 6 characters"
                  className="w-full h-9 px-3 border border-zinc-300 focus:border-black rounded-none text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-900 mb-1">
                    Designation *
                  </label>
                  <input
                    type="text"
                    required
                    value={newStaff.designation}
                    onChange={e => setNewStaff({ ...newStaff, designation: e.target.value })}
                    className="w-full h-9 px-3 border border-zinc-300 focus:border-black rounded-none text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-900 mb-1">
                    Clearance Level *
                  </label>
                  <select
                    value={newStaff.clearanceLevel}
                    onChange={e =>
                      setNewStaff({ ...newStaff, clearanceLevel: e.target.value as ClearanceLevel })
                    }
                    className="w-full h-9 px-2 border border-zinc-300 focus:border-black rounded-none text-xs outline-none bg-white"
                  >
                    <option value="TIER_1">TIER_1 (Floor Supervisor / Cashier)</option>
                    <option value="TIER_2">TIER_2 (Store Operations Manager)</option>
                    <option value="ADMIN_SUPER">ADMIN_SUPER (Full Systems Admin)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-zinc-300 text-xs text-zinc-600 rounded-none hover:bg-zinc-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-black hover:bg-zinc-800 text-white text-xs uppercase tracking-wider font-medium rounded-none transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Provision Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
