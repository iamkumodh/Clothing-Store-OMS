/**
 * Floating Academic Viva Demo Persona Switcher & Database Seed Reset Bar
 * Supports all 4 student modules & persona evaluations
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, DemoPersona } from '../context/AuthContext';
import { mockDb } from '../../../api/mockDataStore';
import {
  Shield,
  User,
  Users,
  LogOut,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  CreditCard,
  Package,
} from 'lucide-react';

export function PersonaSwitcherBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, customerProfile, staffProfile, switchPersona } = useAuth();
  const navigate = useNavigate();

  const handleSwitch = async (persona: DemoPersona) => {
    await switchPersona(persona);
    if (persona === 'ADMIN' || persona === 'STAFF') {
      navigate('/admin');
    } else if (persona === 'CUSTOMER') {
      navigate('/account');
    } else {
      navigate('/');
    }
  };

  const handleResetSeeds = () => {
    if (window.confirm('Reset all OMS database records to canonical MySQL 8.0 seeds? All test mutations will be reset.')) {
      mockDb.resetToSeeds();
      window.location.reload();
    }
  };

  const currentRole = user?.role || 'GUEST';

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans print:hidden">
      {/* Expandable Control Panel */}
      {isOpen && (
        <div className="mb-3 w-88 bg-white border border-zinc-300 shadow-2xl rounded-none p-4 text-[#0a0a0a] animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-2 mb-3">
            <div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">
                SLIIT Joint Viva Demo
              </div>
              <div className="text-xs font-semibold text-zinc-900">
                OMS Multi-Persona Evaluator
              </div>
            </div>
            <span className="text-[10px] bg-black text-white px-2 py-0.5 font-mono">
              2026 Batch
            </span>
          </div>

          {/* Active Session Info */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-none p-2.5 mb-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-zinc-500">Active Role:</span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-none uppercase tracking-wider border ${
                  currentRole === 'ADMIN'
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : currentRole === 'STORE_STAFF' || currentRole === 'MANAGER'
                    ? 'bg-zinc-200 text-zinc-900 border-zinc-300'
                    : currentRole === 'CUSTOMER'
                    ? 'bg-zinc-100 text-zinc-900 border-zinc-200'
                    : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                }`}
              >
                {currentRole}
              </span>
            </div>
            <div className="font-medium text-zinc-900 truncate mt-1">
              {currentRole === 'CUSTOMER' && customerProfile
                ? `${customerProfile.firstName} ${customerProfile.lastName} (${customerProfile.city})`
                : (currentRole === 'STORE_STAFF' ||
                    currentRole === 'ADMIN' ||
                    currentRole === 'MANAGER') &&
                  staffProfile
                ? `${staffProfile.firstName} ${staffProfile.lastName} [${staffProfile.clearanceLevel}]`
                : user?.email || 'Guest (Storefront Visitor)'}
            </div>
          </div>

          {/* Quick Persona Action Buttons */}
          <div className="space-y-1.5 mb-3">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">
              Select Persona
            </div>

            {/* Admin Chaminda */}
            <button
              onClick={() => handleSwitch('ADMIN')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs border rounded-none transition-colors text-left cursor-pointer ${
                currentRole === 'ADMIN'
                  ? 'border-black bg-zinc-100 text-black font-semibold'
                  : 'border-zinc-200 hover:bg-zinc-50 text-zinc-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-zinc-900" />
                <span>Chaminda Perera (Admin)</span>
              </div>
              <span className="text-[9px] font-mono bg-zinc-200 px-1 py-0.5">ADMIN_SUPER</span>
            </button>

            {/* Staff Kasun / Dilshan */}
            <button
              onClick={() => handleSwitch('STAFF')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs border rounded-none transition-colors text-left cursor-pointer ${
                currentRole === 'STORE_STAFF'
                  ? 'border-black bg-zinc-100 text-black font-semibold'
                  : 'border-zinc-200 hover:bg-zinc-50 text-zinc-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-zinc-900" />
                <span>Kasun / Dilshan (Warehouse/Cashier)</span>
              </div>
              <span className="text-[9px] font-mono bg-zinc-200 px-1 py-0.5">TIER_1 / TIER_2</span>
            </button>

            {/* Customer Kavindu */}
            <button
              onClick={() => handleSwitch('CUSTOMER')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs border rounded-none transition-colors text-left cursor-pointer ${
                currentRole === 'CUSTOMER'
                  ? 'border-black bg-zinc-100 text-black font-semibold'
                  : 'border-zinc-200 hover:bg-zinc-50 text-zinc-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-zinc-900" />
                <span>Kavindu Bandara (Customer)</span>
              </div>
              <span className="text-[9px] text-zinc-500">Colombo</span>
            </button>

            {/* Guest */}
            <button
              onClick={() => handleSwitch('GUEST')}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-zinc-600 hover:text-black hover:bg-zinc-100 rounded-none transition-colors text-left cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Guest Visitor</span>
            </button>
          </div>

          {/* Quick Database Reset */}
          <div className="pt-2 border-t border-zinc-200 space-y-2">
            <button
              onClick={handleResetSeeds}
              className="w-full h-8 px-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-[11px] font-semibold flex items-center justify-center gap-1.5 border border-zinc-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-zinc-600" />
              <span>Reset Database to Canonical Seeds</span>
            </button>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <button
                onClick={() => navigate('/account')}
                className="text-zinc-900 hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                Customer Portal <ExternalLink className="w-3 h-3" />
              </button>
              <button
                onClick={() => navigate('/admin')}
                className="text-zinc-900 hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                Admin Console <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-black hover:bg-zinc-800 text-white rounded-none border border-zinc-800 shadow-xl text-xs font-medium transition-all cursor-pointer"
        aria-label="Toggle Persona Switcher"
      >
        <span
          className={`w-2 h-2 rounded-full ${
            currentRole === 'ADMIN'
              ? 'bg-white animate-pulse'
              : currentRole === 'STORE_STAFF'
              ? 'bg-zinc-400 animate-pulse'
              : currentRole === 'CUSTOMER'
              ? 'bg-emerald-400'
              : 'bg-zinc-500'
          }`}
        />
        <span>Viva Demo: {currentRole}</span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
