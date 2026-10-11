// initial seed data for testing

import {
  CustomerProfile,
  StoreStaffProfile,
  UserLoginAuditRecord,
  InvoiceRecord,
  AppUser,
} from '../types';

export const INITIAL_USERS: AppUser[] = [
  {
    userId: 1,
    email: 'admin.yapa@dfine.lk',
    role: 'ADMIN',
    accountStatus: 'ACTIVE',
    createdAt: '2026-01-10T08:30:00Z',
  },
  {
    userId: 2,
    email: 'sandaru@dfine.lk',
    role: 'STORE_STAFF',
    accountStatus: 'ACTIVE',
    createdAt: '2026-01-15T09:00:00Z',
  },
  {
    userId: 3,
    email: 'niluka.mgr@dfine.lk',
    role: 'MANAGER',
    accountStatus: 'ACTIVE',
    createdAt: '2026-02-01T10:15:00Z',
  },
  {
    userId: 4,
    email: 'maya.fernando@example.com',
    role: 'CUSTOMER',
    accountStatus: 'ACTIVE',
    createdAt: '2026-02-14T11:45:00Z',
  },
  {
    userId: 5,
    email: 'kasun.bandara@example.com',
    role: 'CUSTOMER',
    accountStatus: 'ACTIVE',
    createdAt: '2026-03-01T14:20:00Z',
  },
  {
    userId: 6,
    email: 'dilshan.silva@example.com',
    role: 'CUSTOMER',
    accountStatus: 'ACTIVE',
    createdAt: '2026-03-12T16:10:00Z',
  },
  {
    userId: 7,
    email: 'ananya.perera@example.com',
    role: 'CUSTOMER',
    accountStatus: 'ACTIVE',
    createdAt: '2026-04-05T09:30:00Z',
  },
  {
    userId: 8,
    email: 'roshan.wickrama@example.com',
    role: 'CUSTOMER',
    accountStatus: 'SUSPENDED',
    createdAt: '2026-04-18T13:40:00Z',
  },
];

export const INITIAL_CUSTOMERS: CustomerProfile[] = [
  {
    customerId: 1,
    userId: 4,
    email: 'maya.fernando@example.com',
    firstName: 'Maya',
    lastName: 'Fernando',
    contactNumber: '0771234567',
    shippingAddress: '42/A Galle Road, Kollupitiya',
    city: 'Colombo 03',
    district: 'Colombo',
    province: 'Western',
    postalCode: '00300',
    totalOrders: 3,
    registeredAt: '2026-02-14',
  },
  {
    customerId: 2,
    userId: 5,
    email: 'kasun.bandara@example.com',
    firstName: 'Kasun',
    lastName: 'Bandara',
    contactNumber: '0719876543',
    shippingAddress: '15 Peradeniya Road',
    city: 'Kandy',
    district: 'Kandy',
    province: 'Central',
    postalCode: '20000',
    totalOrders: 2,
    registeredAt: '2026-03-01',
  },
  {
    customerId: 3,
    userId: 6,
    email: 'dilshan.silva@example.com',
    firstName: 'Dilshan',
    lastName: 'Silva',
    contactNumber: '0765554321',
    shippingAddress: '88 Negombo Road',
    city: 'Wattala',
    district: 'Gampaha',
    province: 'Western',
    postalCode: '11300',
    totalOrders: 4,
    registeredAt: '2026-03-12',
  },
  {
    customerId: 4,
    userId: 7,
    email: 'ananya.perera@example.com',
    firstName: 'Ananya',
    lastName: 'Perera',
    contactNumber: '0703332211',
    shippingAddress: '24 Beach Road',
    city: 'Galle Fort',
    district: 'Galle',
    province: 'Southern',
    postalCode: '80000',
    totalOrders: 1,
    registeredAt: '2026-04-05',
  },
  {
    customerId: 5,
    userId: 8,
    email: 'roshan.wickrama@example.com',
    firstName: 'Roshan',
    lastName: 'Wickrama',
    contactNumber: '0784449988',
    shippingAddress: '10 Kandy Road',
    city: 'Kurunegala',
    district: 'Kurunegala',
    province: 'North Western',
    postalCode: '60000',
    totalOrders: 1,
    registeredAt: '2026-04-18',
  },
];

export const INITIAL_STAFF: StoreStaffProfile[] = [
  {
    staffId: 1,
    userId: 1,
    email: 'admin.yapa@dfine.lk',
    firstName: 'YAPA',
    lastName: 'R.M.J.O',
    designation: 'Lead Systems Administrator',
    clearanceLevel: 'ADMIN_SUPER',
    accountStatus: 'ACTIVE',
    createdAt: '2026-01-10',
  },
  {
    staffId: 2,
    userId: 2,
    email: 'sandaru@dfine.lk',
    firstName: 'Sandaru',
    lastName: 'Perera',
    designation: 'Floor Inventory Supervisor',
    clearanceLevel: 'TIER_1',
    accountStatus: 'ACTIVE',
    createdAt: '2026-01-15',
  },
  {
    staffId: 3,
    userId: 3,
    email: 'niluka.mgr@dfine.lk',
    firstName: 'Niluka',
    lastName: 'Jayawardena',
    designation: 'Retail Store General Manager',
    clearanceLevel: 'TIER_2',
    accountStatus: 'ACTIVE',
    createdAt: '2026-02-01',
  },
];

export const INITIAL_AUDIT_LOGS: UserLoginAuditRecord[] = [
  {
    auditId: 101,
    userId: 1,
    attemptedEmail: 'admin.yapa@dfine.lk',
    ipAddress: '192.168.1.10',
    loginTime: '2026-10-02T08:15:20Z',
    loginStatus: 'SUCCESS',
  },
  {
    auditId: 102,
    userId: 2,
    attemptedEmail: 'sandaru@dfine.lk',
    ipAddress: '192.168.1.15',
    loginTime: '2026-10-02T08:45:11Z',
    loginStatus: 'SUCCESS',
  },
  {
    auditId: 103,
    userId: null,
    attemptedEmail: 'unknown.user@gmail.com',
    ipAddress: '112.134.120.44',
    loginTime: '2026-10-02T09:02:40Z',
    loginStatus: 'FAILED_BAD_CREDENTIALS',
  },
  {
    auditId: 104,
    userId: 4,
    attemptedEmail: 'maya.fernando@example.com',
    ipAddress: '124.43.90.18',
    loginTime: '2026-10-02T09:10:05Z',
    loginStatus: 'SUCCESS',
  },
  {
    auditId: 105,
    userId: 8,
    attemptedEmail: 'roshan.wickrama@example.com',
    ipAddress: '175.157.88.22',
    loginTime: '2026-10-02T09:12:30Z',
    loginStatus: 'FAILED_LOCKED',
  },
];

export const INITIAL_INVOICES: InvoiceRecord[] = [
  {
    invoiceId: 1,
    orderId: 1001,
    invoiceNumber: 'INV-2026-00481',
    issuedAt: '2026-09-28T14:32:00Z',
    pdfStoragePath: '/invoices/INV-2026-00481.pdf',
    customerName: 'Maya Fernando',
    customerEmail: 'maya.fernando@example.com',
    shippingAddress: '42/A Galle Road, Kollupitiya',
    city: 'Colombo 03',
    district: 'Colombo',
    province: 'Western',
    postalCode: '00300',
    items: [
      {
        itemId: 1,
        variantId: 101,
        productName: 'Signature Linen Resort Shirt',
        sku: 'DF-LRS-WHT-M',
        color: 'Ivory White',
        size: 'M',
        quantity: 1,
        unitPrice: 8500,
        subtotal: 8500,
      },
      {
        itemId: 2,
        variantId: 104,
        productName: 'Pleated Minimalist Chino Trouser',
        sku: 'DF-PMT-NAV-32',
        color: 'Midnight Navy',
        size: '32',
        quantity: 1,
        unitPrice: 10200,
        subtotal: 10200,
      },
    ],
    subtotal: 18700,
    taxAmount: 0,
    shippingFee: 450,
    totalAmount: 19150,
    paymentMethod: 'Bank Transfer (Slip Verified)',
    paymentStatus: 'PAID',
  },
  {
    invoiceId: 2,
    orderId: 1002,
    invoiceNumber: 'INV-2026-00482',
    issuedAt: '2026-09-29T16:15:00Z',
    pdfStoragePath: '/invoices/INV-2026-00482.pdf',
    customerName: 'Maya Fernando',
    customerEmail: 'maya.fernando@example.com',
    shippingAddress: '42/A Galle Road, Kollupitiya',
    city: 'Colombo 03',
    district: 'Colombo',
    province: 'Western',
    postalCode: '00300',
    items: [
      {
        itemId: 3,
        variantId: 108,
        productName: 'Tailored Heavyweight Oversized Tee',
        sku: 'DF-HOT-BLK-L',
        color: 'Obsidian Black',
        size: 'L',
        quantity: 2,
        unitPrice: 4800,
        subtotal: 9600,
      },
    ],
    subtotal: 9600,
    taxAmount: 0,
    shippingFee: 450,
    totalAmount: 10050,
    paymentMethod: 'Cash On Delivery (COD)',
    paymentStatus: 'PAID',
  },
  {
    invoiceId: 3,
    orderId: 1003,
    invoiceNumber: 'INV-2026-00483',
    issuedAt: '2026-10-01T11:00:00Z',
    pdfStoragePath: '/invoices/INV-2026-00483.pdf',
    customerName: 'Kasun Bandara',
    customerEmail: 'kasun.bandara@example.com',
    shippingAddress: '15 Peradeniya Road',
    city: 'Kandy',
    district: 'Kandy',
    province: 'Central',
    postalCode: '20000',
    items: [
      {
        itemId: 4,
        variantId: 112,
        productName: 'Brushed Cotton Overshirt',
        sku: 'DF-BCO-OLV-L',
        color: 'Olive Sage',
        size: 'L',
        quantity: 1,
        unitPrice: 12500,
        subtotal: 12500,
      },
    ],
    subtotal: 12500,
    taxAmount: 0,
    shippingFee: 550,
    totalAmount: 13050,
    paymentMethod: 'Bank Transfer (Slip Verified)',
    paymentStatus: 'PAID',
  },
];

export const SRI_LANKA_DISTRICTS = [
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

export const SRI_LANKA_PROVINCES = [
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

export function initializeModule1Storage(): void {
  // Sync admin profile to YAPA R.M.J.O
  const existingStaffStr = localStorage.getItem('dfine_staff');
  if (existingStaffStr) {
    try {
      const staffList: StoreStaffProfile[] = JSON.parse(existingStaffStr);
      const adminStaff = staffList.find(s => s.staffId === 1 || s.email === 'admin.yapa@dfine.lk');
      if (adminStaff) {
        adminStaff.firstName = 'YAPA';
        adminStaff.lastName = 'R.M.J.O';
        localStorage.setItem('dfine_staff', JSON.stringify(staffList));
      }
    } catch {
      // Ignore parse errors
    }
  }

  const sessionStr = localStorage.getItem('dfine_active_session');
  if (sessionStr) {
    try {
      const sess = JSON.parse(sessionStr);
      if (sess?.staffProfile?.email === 'admin.yapa@dfine.lk') {
        sess.staffProfile.firstName = 'YAPA';
        sess.staffProfile.lastName = 'R.M.J.O';
        localStorage.setItem('dfine_active_session', JSON.stringify(sess));
      }
    } catch {
      // Ignore parse errors
    }
  }

  if (!localStorage.getItem('dfine_mod1_initialized_v2')) {
    localStorage.setItem('dfine_users', JSON.stringify(INITIAL_USERS));
    localStorage.setItem('dfine_customers', JSON.stringify(INITIAL_CUSTOMERS));
    localStorage.setItem('dfine_staff', JSON.stringify(INITIAL_STAFF));
    localStorage.setItem('dfine_audit_logs', JSON.stringify(INITIAL_AUDIT_LOGS));
    localStorage.setItem('dfine_invoices', JSON.stringify(INITIAL_INVOICES));
    localStorage.setItem('dfine_mod1_initialized_v2', 'true');
  }
}
