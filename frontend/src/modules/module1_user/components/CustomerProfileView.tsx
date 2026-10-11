// Customer Profile View & Edit Form with Sri Lankan Address Hierarchy

import React, { useState, useEffect } from 'react';
import { CustomerProfile, CustomerUpdatePayload } from '../types';
import { SRI_LANKA_DISTRICTS, SRI_LANKA_PROVINCES } from '../data/initialFixtures';
import { Save, Check, AlertCircle } from 'lucide-react';

interface CustomerProfileViewProps {
  profile: CustomerProfile | null;
  onUpdate: (payload: CustomerUpdatePayload) => Promise<void>;
}

export function CustomerProfileView({ profile, onUpdate }: CustomerProfileViewProps) {
  const [formData, setFormData] = useState<CustomerUpdatePayload>({
    firstName: '',
    lastName: '',
    contactNumber: '',
    shippingAddress: '',
    city: '',
    district: 'Colombo',
    province: 'Western',
    postalCode: '',
  });

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        contactNumber: profile.contactNumber || '',
        shippingAddress: profile.shippingAddress || '',
        city: profile.city || '',
        district: profile.district || 'Colombo',
        province: profile.province || 'Western',
        postalCode: profile.postalCode || '',
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setSaving(true);
    try {
      await onUpdate(formData);
      setFeedback({
        type: 'success',
        message: 'Your personal details and delivery address have been updated successfully.',
      });
    } catch {
      setFeedback({
        type: 'error',
        message: 'Failed to update profile. Please verify your details and try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-none p-6 sm:p-8">
      <div className="border-b border-zinc-200 pb-4 mb-6">
        <h2 className="font-serif text-2xl text-[#0a0a0a]">Personal Details & Shipping Address</h2>
        <p className="text-xs text-zinc-500 mt-1">
          Manage your contact credentials and default shipping destination for orders across Sri Lanka.
        </p>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-900 mb-1.5">
              First Name *
            </label>
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={e => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full h-10 px-3 border border-zinc-300 focus:border-black text-sm text-zinc-900 outline-none rounded-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-900 mb-1.5">
              Last Name *
            </label>
            <input
              type="text"
              required
              value={formData.lastName}
              onChange={e => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full h-10 px-3 border border-zinc-300 focus:border-black text-sm text-zinc-900 outline-none rounded-none transition-colors"
            />
          </div>
        </div>

        {/* Contact and Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-900 mb-1.5">
              Email Address (Linked Account)
            </label>
            <input
              type="email"
              disabled
              value={profile?.email || ''}
              className="w-full h-10 px-3 border border-zinc-200 bg-zinc-50 text-zinc-400 text-sm cursor-not-allowed outline-none rounded-none"
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-900 mb-1.5">
              Contact Phone Number *
            </label>
            <input
              type="tel"
              required
              value={formData.contactNumber}
              onChange={e => setFormData({ ...formData, contactNumber: e.target.value })}
              placeholder="e.g. 077 123 4567"
              className="w-full h-10 px-3 border border-zinc-300 focus:border-black text-sm text-zinc-900 outline-none rounded-none transition-colors"
            />
          </div>
        </div>

        {/* Street Address */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-900 mb-1.5">
            Default Shipping Street Address *
          </label>
          <input
            type="text"
            required
            value={formData.shippingAddress}
            onChange={e => setFormData({ ...formData, shippingAddress: e.target.value })}
            placeholder="Street address, building, apartment/suite"
            className="w-full h-10 px-3 border border-zinc-300 focus:border-black text-sm text-zinc-900 outline-none rounded-none transition-colors"
          />
        </div>

        {/* Regional Breakdown: City, District, Province */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-900 mb-1.5">
              City / Town *
            </label>
            <input
              type="text"
              required
              value={formData.city}
              onChange={e => setFormData({ ...formData, city: e.target.value })}
              placeholder="e.g. Colombo 03"
              className="w-full h-10 px-3 border border-zinc-300 focus:border-black text-sm text-zinc-900 outline-none rounded-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-900 mb-1.5">
              District *
            </label>
            <select
              value={formData.district}
              onChange={e => setFormData({ ...formData, district: e.target.value })}
              className="w-full h-10 px-3 border border-zinc-300 focus:border-black text-sm text-zinc-900 outline-none bg-white cursor-pointer rounded-none"
            >
              {SRI_LANKA_DISTRICTS.map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-900 mb-1.5">
              Province *
            </label>
            <select
              value={formData.province}
              onChange={e => setFormData({ ...formData, province: e.target.value })}
              className="w-full h-10 px-3 border border-zinc-300 focus:border-black text-sm text-zinc-900 outline-none bg-white cursor-pointer rounded-none"
            >
              {SRI_LANKA_PROVINCES.map(p => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Postal Code */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-900 mb-1.5">
            Postal Code (Optional)
          </label>
          <input
            type="text"
            value={formData.postalCode}
            onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
            placeholder="e.g. 00300"
            className="w-full sm:w-48 h-10 px-3 border border-zinc-300 focus:border-black text-sm text-zinc-900 outline-none rounded-none transition-colors"
          />
        </div>

        <div className="pt-4 border-t border-zinc-200 flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-black hover:bg-zinc-800 text-white text-xs uppercase tracking-widest font-semibold rounded-none transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving Changes...' : 'Save Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
