// Module 1 API Client: Dual-Mode Live Spring Boot & Offline LocalStorage Fallback

import { apiClient } from '../../../api/client';
import {
  AppUser,
  CustomerProfile,
  StoreStaffProfile,
  UserLoginAuditRecord,
  InvoiceRecord,
  LoginPayload,
  CustomerRegistrationPayload,
  CustomerUpdatePayload,
  CreateStaffPayload,
  AuthResponseData,
  AccountStatus,
  AuditStatus,
} from '../types';
import { initializeModule1Storage } from '../data/initialFixtures';

initializeModule1Storage();

function getStored<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setStored<T>(key: string, val: T): void {
  localStorage.setItem(key, JSON.stringify(val));
}

export const module1Api = {
  // Authentication & Session
  async login(payload: LoginPayload): Promise<AuthResponseData> {
    try {
      const res = await apiClient.post<AuthResponseData>('/auth/login', payload);
      if (res.data?.token) {
        localStorage.setItem('dfine_jwt_token', res.data.token);
      }
      return res.data;
    } catch {
      // Local fixture fallback when Spring Boot is offline
      const users = getStored<AppUser[]>('dfine_users', []);
      const customers = getStored<CustomerProfile[]>('dfine_customers', []);
      const staffList = getStored<StoreStaffProfile[]>('dfine_staff', []);

      let user = users.find(u => u.email.toLowerCase() === payload.email.toLowerCase());

      // fallback login for testing
      if (!user) {
        const isStaffEmail =
          payload.email.toLowerCase().endsWith('@dfine.lk') ||
          payload.email.toLowerCase().includes('staff') ||
          payload.email.toLowerCase().includes('admin');

        user = {
          userId: Date.now(),
          email: payload.email,
          role: isStaffEmail ? 'STORE_STAFF' : 'CUSTOMER',
          accountStatus: 'ACTIVE',
          createdAt: new Date().toISOString(),
        };
        users.push(user);
        setStored('dfine_users', users);
      }

      if (user.accountStatus === 'SUSPENDED') {
        module1Api.recordAuditLog(payload.email, '127.0.0.1', 'FAILED_LOCKED');
        throw new Error('Account is suspended. Please contact store management.');
      }

      const token = 'mock_jwt_' + btoa(user.email + ':' + Date.now());
      localStorage.setItem('dfine_jwt_token', token);

      let customer = customers.find(c => c.userId === user?.userId);
      let staff = staffList.find(s => s.userId === user?.userId);

      // Create fallback profile if none exists
      if (user.role === 'CUSTOMER' && !customer) {
        customer = {
          customerId: Date.now(),
          userId: user.userId,
          email: user.email,
          firstName: user.email.split('@')[0],
          lastName: 'Customer',
          contactNumber: '0770000000',
          shippingAddress: '42 Marine Drive',
          city: 'Colombo 03',
          district: 'Colombo',
          province: 'Western',
          totalOrders: 1,
          registeredAt: new Date().toISOString().split('T')[0],
        };
        customers.push(customer);
        setStored('dfine_customers', customers);
      }

      if ((user.role === 'STORE_STAFF' || user.role === 'ADMIN' || user.role === 'MANAGER') && !staff) {
        staff = {
          staffId: Date.now(),
          userId: user.userId,
          email: user.email,
          firstName: user.email.split('@')[0],
          lastName: 'Staff',
          designation: user.role === 'ADMIN' ? 'System Administrator' : 'Floor Supervisor',
          clearanceLevel: user.role === 'ADMIN' ? 'ADMIN_SUPER' : 'TIER_1',
          accountStatus: 'ACTIVE',
        };
        staffList.push(staff);
        setStored('dfine_staff', staffList);
      }

      module1Api.recordAuditLog(payload.email, '127.0.0.1', 'SUCCESS');

      return {
        token,
        email: user.email,
        role: user.role,
        accountStatus: user.accountStatus,
        userId: user.userId,
        user,
        customer,
        staff,
        message: 'Signed in successfully',
      };
    }
  },

  async registerCustomer(payload: CustomerRegistrationPayload): Promise<AuthResponseData> {
    try {
      const res = await apiClient.post<AuthResponseData>('/auth/register/customer', payload);
      return res.data;
    } catch {
      const users = getStored<AppUser[]>('dfine_users', []);
      const customers = getStored<CustomerProfile[]>('dfine_customers', []);

      if (users.some(u => u.email.toLowerCase() === payload.email.toLowerCase())) {
        throw new Error('An account with this email address already exists.');
      }

      const newUserId = Date.now();
      const newUser: AppUser = {
        userId: newUserId,
        email: payload.email,
        role: 'CUSTOMER',
        accountStatus: 'ACTIVE',
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      setStored('dfine_users', users);

      const newCustomer: CustomerProfile = {
        customerId: Date.now() + 1,
        userId: newUserId,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        contactNumber: payload.contactNumber,
        shippingAddress: payload.shippingAddress,
        city: payload.city,
        district: payload.district,
        province: payload.province,
        postalCode: payload.postalCode,
        totalOrders: 0,
        registeredAt: new Date().toISOString().split('T')[0],
      };
      customers.push(newCustomer);
      setStored('dfine_customers', customers);

      module1Api.recordAuditLog(payload.email, '127.0.0.1', 'SUCCESS');

      const token = 'mock_jwt_' + btoa(newUser.email + ':' + Date.now());
      localStorage.setItem('dfine_jwt_token', token);

      return {
        token,
        email: newUser.email,
        role: 'CUSTOMER',
        accountStatus: 'ACTIVE',
        userId: newUserId,
        user: newUser,
        customer: newCustomer,
        message: 'Account created successfully',
      };
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    } finally {
      const token = localStorage.getItem('dfine_jwt_token');
      if (token) {
        module1Api.recordAuditLog('Current Session', '127.0.0.1', 'LOGOUT');
      }
      localStorage.removeItem('dfine_jwt_token');
      localStorage.removeItem('dfine_active_session');
    }
  },

  // Customer Profile Management
  async getCustomerProfile(userId: number): Promise<CustomerProfile | null> {
    try {
      const res = await apiClient.get<CustomerProfile>('/customers/profile');
      return res.data;
    } catch {
      const customers = getStored<CustomerProfile[]>('dfine_customers', []);
      return customers.find(c => c.userId === userId) || null;
    }
  },

  async updateCustomerProfile(userId: number, payload: CustomerUpdatePayload): Promise<CustomerProfile> {
    try {
      const res = await apiClient.put<CustomerProfile>('/customers/profile', payload);
      return res.data;
    } catch {
      const customers = getStored<CustomerProfile[]>('dfine_customers', []);
      const idx = customers.findIndex(c => c.userId === userId);
      if (idx === -1) {
        throw new Error('Customer profile not found');
      }
      customers[idx] = {
        ...customers[idx],
        ...payload,
      };
      setStored('dfine_customers', customers);
      return customers[idx];
    }
  },

  async getAllCustomers(): Promise<CustomerProfile[]> {
    try {
      const res = await apiClient.get<CustomerProfile[]>('/auth/customers');
      return res.data;
    } catch {
      return getStored<CustomerProfile[]>('dfine_customers', []);
    }
  },

  async toggleCustomerStatus(userId: number, status: AccountStatus): Promise<void> {
    try {
      await apiClient.patch(`/customers/${userId}/status`, { accountStatus: status });
    } catch {
      const users = getStored<AppUser[]>('dfine_users', []);
      const idx = users.findIndex(u => u.userId === userId);
      if (idx !== -1) {
        users[idx].accountStatus = status;
        setStored('dfine_users', users);
      }
    }
  },

  // Staff Administration
  async getAllStaff(): Promise<StoreStaffProfile[]> {
    try {
      const res = await apiClient.get<StoreStaffProfile[]>('/staff');
      return res.data;
    } catch {
      return getStored<StoreStaffProfile[]>('dfine_staff', []);
    }
  },

  async createStaff(payload: CreateStaffPayload): Promise<StoreStaffProfile> {
    try {
      const res = await apiClient.post<StoreStaffProfile>('/staff', payload);
      return res.data;
    } catch {
      const users = getStored<AppUser[]>('dfine_users', []);
      const staffList = getStored<StoreStaffProfile[]>('dfine_staff', []);

      if (users.some(u => u.email.toLowerCase() === payload.email.toLowerCase())) {
        throw new Error('An account with this email address already exists.');
      }

      const newUserId = Date.now();
      const newUser: AppUser = {
        userId: newUserId,
        email: payload.email,
        role: payload.clearanceLevel === 'ADMIN_SUPER' ? 'ADMIN' : 'STORE_STAFF',
        accountStatus: 'ACTIVE',
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      setStored('dfine_users', users);

      const newStaff: StoreStaffProfile = {
        staffId: Date.now() + 1,
        userId: newUserId,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        designation: payload.designation,
        clearanceLevel: payload.clearanceLevel,
        accountStatus: 'ACTIVE',
        createdAt: new Date().toISOString().split('T')[0],
      };
      staffList.push(newStaff);
      setStored('dfine_staff', staffList);

      return newStaff;
    }
  },

  async toggleStaffStatus(staffId: number, status: AccountStatus): Promise<void> {
    try {
      await apiClient.patch(`/staff/${staffId}/status`, { accountStatus: status });
    } catch {
      const staffList = getStored<StoreStaffProfile[]>('dfine_staff', []);
      const users = getStored<AppUser[]>('dfine_users', []);

      const idx = staffList.findIndex(s => s.staffId === staffId);
      if (idx !== -1) {
        staffList[idx].accountStatus = status;
        setStored('dfine_staff', staffList);

        const userIdx = users.findIndex(u => u.userId === staffList[idx].userId);
        if (userIdx !== -1) {
          users[userIdx].accountStatus = status;
          setStored('dfine_users', users);
        }
      }
    }
  },

  // Invoices & Billing
  async getMyInvoices(customerEmail?: string): Promise<InvoiceRecord[]> {
    try {
      const res = await apiClient.get<InvoiceRecord[]>('/invoices/my');
      return res.data;
    } catch {
      const invoices = getStored<InvoiceRecord[]>('dfine_invoices', []);
      if (!customerEmail) return invoices;
      return invoices.filter(inv => inv.customerEmail.toLowerCase() === customerEmail.toLowerCase());
    }
  },

  async getInvoiceByNumber(invoiceNumber: string): Promise<InvoiceRecord | null> {
    try {
      const res = await apiClient.get<InvoiceRecord>(`/invoices/${invoiceNumber}`);
      return res.data;
    } catch {
      const invoices = getStored<InvoiceRecord[]>('dfine_invoices', []);
      return invoices.find(inv => inv.invoiceNumber === invoiceNumber) || null;
    }
  },

  async getAllInvoices(): Promise<InvoiceRecord[]> {
    try {
      const res = await apiClient.get<InvoiceRecord[]>('/invoices');
      return res.data;
    } catch {
      return getStored<InvoiceRecord[]>('dfine_invoices', []);
    }
  },

  // Security Login Audit Logs
  async getAuditLogs(): Promise<UserLoginAuditRecord[]> {
    try {
      const res = await apiClient.get<UserLoginAuditRecord[]>('/audit-logs');
      return res.data;
    } catch {
      return getStored<UserLoginAuditRecord[]>('dfine_audit_logs', []);
    }
  },

  recordAuditLog(email: string, ip: string, status: AuditStatus): void {
    const logs = getStored<UserLoginAuditRecord[]>('dfine_audit_logs', []);
    const newLog: UserLoginAuditRecord = {
      auditId: Date.now(),
      attemptedEmail: email,
      ipAddress: ip || '127.0.0.1',
      loginTime: new Date().toISOString(),
      loginStatus: status,
    };
    logs.unshift(newLog);
    // Keep last 100 entries
    if (logs.length > 100) logs.pop();
    setStored('dfine_audit_logs', logs);
  },
};
