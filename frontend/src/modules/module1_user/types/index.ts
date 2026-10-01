// Module 1 Domain Types: Identity, Profiles, Staff, Audits & Invoices

export type UserRole = 'CUSTOMER' | 'STORE_STAFF' | 'MANAGER' | 'ADMIN';
export type AccountStatus = 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
export type ClearanceLevel = 'TIER_1' | 'TIER_2' | 'ADMIN_SUPER';
export type AuditStatus = 'SUCCESS' | 'FAILED_BAD_CREDENTIALS' | 'FAILED_LOCKED' | 'LOGOUT';

export interface AppUser {
  userId: number;
  email: string;
  role: UserRole;
  accountStatus: AccountStatus;
  createdAt: string;
}

export interface CustomerProfile {
  customerId: number;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  contactNumber: string;
  shippingAddress: string;
  city: string;
  district: string;
  province: string;
  postalCode?: string;
  totalOrders?: number;
  registeredAt?: string;
}

export interface StoreStaffProfile {
  staffId: number;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  designation: string;
  clearanceLevel: ClearanceLevel;
  accountStatus: AccountStatus;
  createdAt?: string;
}

export interface UserLoginAuditRecord {
  auditId: number;
  userId?: number | null;
  attemptedEmail: string;
  ipAddress: string;
  loginTime: string;
  loginStatus: AuditStatus;
}

export interface InvoiceItemRecord {
  itemId: number;
  variantId?: number;
  productName: string;
  sku: string;
  color?: string;
  size?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface InvoiceRecord {
  invoiceId: number;
  orderId: number;
  invoiceNumber: string;
  issuedAt: string;
  pdfStoragePath: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  city: string;
  district: string;
  province: string;
  postalCode?: string;
  items: InvoiceItemRecord[];
  subtotal: number;
  taxAmount: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponseData {
  token: string;
  email: string;
  role: UserRole;
  accountStatus?: AccountStatus;
  userId?: number;
  user?: AppUser;
  customer?: CustomerProfile;
  staff?: StoreStaffProfile;
  message?: string;
}

export interface CustomerRegistrationPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  contactNumber: string;
  shippingAddress: string;
  city: string;
  district: string;
  province: string;
  postalCode?: string;
}

export interface CustomerUpdatePayload {
  firstName: string;
  lastName: string;
  contactNumber: string;
  shippingAddress: string;
  city: string;
  district: string;
  province: string;
  postalCode?: string;
}

export interface CreateStaffPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  designation: string;
  clearanceLevel: ClearanceLevel;
}

export interface CustomerAnalyticsData {
  totalCustomers: number;
  activeCustomers: number;
  suspendedCustomers: number;
  monthlyGrowthRate: number;
  averageOrderValue: number;
  repeatCustomerRate: number;
  monthlyRegistrations: { month: string; count: number }[];
  districtDistribution: { district: string; count: number; percentage: number }[];
  statusBreakdown: { status: string; count: number }[];
}
