// Module 1 Authentication Context & Multi-Persona Session Provider

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AppUser,
  CustomerProfile,
  StoreStaffProfile,
  LoginPayload,
  CustomerRegistrationPayload,
  CustomerUpdatePayload,
  AuthResponseData,
} from '../types';
import { module1Api } from '../api/module1ApiClient';
import { INITIAL_USERS, INITIAL_CUSTOMERS, INITIAL_STAFF } from '../data/initialFixtures';

export type DemoPersona = 'CUSTOMER' | 'STAFF' | 'ADMIN' | 'GUEST';

interface AuthContextType {
  user: AppUser | null;
  customerProfile: CustomerProfile | null;
  staffProfile: StoreStaffProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<AuthResponseData>;
  register: (payload: CustomerRegistrationPayload) => Promise<AuthResponseData>;
  logout: () => Promise<void>;
  updateProfile: (payload: CustomerUpdatePayload) => Promise<void>;
  switchPersona: (persona: DemoPersona) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
  const [staffProfile, setStaffProfile] = useState<StoreStaffProfile | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('dfine_jwt_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore session from localStorage on initial load
  const restoreSession = useCallback(() => {
    try {
      const activeSessionStr = localStorage.getItem('dfine_active_session');
      if (activeSessionStr) {
        const session = JSON.parse(activeSessionStr);
        setUser(session.user || null);
        setCustomerProfile(session.customerProfile || null);
        setStaffProfile(session.staffProfile || null);
        setToken(localStorage.getItem('dfine_jwt_token'));
        setIsLoading(false);
        return;
      }

      // If token exists but no active session object, default to Customer demo
      const savedToken = localStorage.getItem('dfine_jwt_token');
      if (savedToken) {
        const defaultCustomer = INITIAL_CUSTOMERS[0];
        const defaultUser = INITIAL_USERS.find(u => u.userId === defaultCustomer.userId) || INITIAL_USERS[3];
        setUser(defaultUser);
        setCustomerProfile(defaultCustomer);
      }
    } catch {
      // Fallback cleanly on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const persistSession = (
    newUser: AppUser | null,
    newCust: CustomerProfile | null,
    newStaff: StoreStaffProfile | null
  ) => {
    if (!newUser) {
      localStorage.removeItem('dfine_active_session');
      return;
    }
    localStorage.setItem(
      'dfine_active_session',
      JSON.stringify({
        user: newUser,
        customerProfile: newCust,
        staffProfile: newStaff,
      })
    );
  };

  const login = async (payload: LoginPayload): Promise<AuthResponseData> => {
    setIsLoading(true);
    try {
      const res = await module1Api.login(payload);
      setToken(res.token);

      const activeUser = res.user || {
        userId: res.userId || Date.now(),
        email: res.email,
        role: res.role,
        accountStatus: res.accountStatus || 'ACTIVE',
        createdAt: new Date().toISOString(),
      };
      setUser(activeUser);

      const activeCustomer = res.customer || null;
      const activeStaff = res.staff || null;

      setCustomerProfile(activeCustomer);
      setStaffProfile(activeStaff);
      persistSession(activeUser, activeCustomer, activeStaff);

      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: CustomerRegistrationPayload): Promise<AuthResponseData> => {
    setIsLoading(true);
    try {
      const res = await module1Api.registerCustomer(payload);
      setToken(res.token);

      const activeUser = res.user || {
        userId: res.userId || Date.now(),
        email: res.email,
        role: 'CUSTOMER',
        accountStatus: 'ACTIVE',
        createdAt: new Date().toISOString(),
      };
      setUser(activeUser);

      const activeCustomer = res.customer || null;
      setCustomerProfile(activeCustomer);
      setStaffProfile(null);
      persistSession(activeUser, activeCustomer, null);

      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    await module1Api.logout();
    setUser(null);
    setCustomerProfile(null);
    setStaffProfile(null);
    setToken(null);
    persistSession(null, null, null);
  };

  const updateProfile = async (payload: CustomerUpdatePayload): Promise<void> => {
    if (!user) return;
    const updated = await module1Api.updateCustomerProfile(user.userId, payload);
    setCustomerProfile(updated);
    persistSession(user, updated, staffProfile);
  };

  const refreshProfile = async (): Promise<void> => {
    if (!user) return;
    if (user.role === 'CUSTOMER') {
      const cust = await module1Api.getCustomerProfile(user.userId);
      if (cust) {
        setCustomerProfile(cust);
        persistSession(user, cust, null);
      }
    }
  };

  const switchPersona = async (persona: DemoPersona): Promise<void> => {
    setIsLoading(true);
    try {
      if (persona === 'GUEST') {
        await logout();
        return;
      }

      let targetUser: AppUser;
      let targetCust: CustomerProfile | null = null;
      let targetStaff: StoreStaffProfile | null = null;

      if (persona === 'CUSTOMER') {
        targetUser = INITIAL_USERS[3]; // Customer user
        targetCust = INITIAL_CUSTOMERS[0];
      } else if (persona === 'STAFF') {
        targetUser = INITIAL_USERS[1]; // Sandaru Perera
        targetStaff = INITIAL_STAFF[1];
      } else {
        targetUser = INITIAL_USERS[0]; // Admin user
        targetStaff = INITIAL_STAFF[0];
      }

      const mockToken = 'mock_jwt_' + btoa(targetUser.email + ':' + Date.now());
      localStorage.setItem('dfine_jwt_token', mockToken);
      setToken(mockToken);
      setUser(targetUser);
      setCustomerProfile(targetCust);
      setStaffProfile(targetStaff);
      persistSession(targetUser, targetCust, targetStaff);
      module1Api.recordAuditLog(targetUser.email, '127.0.0.1', 'SUCCESS');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        customerProfile,
        staffProfile,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        switchPersona,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
