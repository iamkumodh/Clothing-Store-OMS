// entity types and dtos matching database schema

// enums and union types

export type UserRole = 'CUSTOMER' | 'STORE_STAFF' | 'MANAGER' | 'ADMIN';

export type AccountStatus = 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';

export type StaffClearanceLevel = 'TIER_1' | 'TIER_2' | 'ADMIN_SUPER';

export type LoginAuditStatus =
  | 'SUCCESS'
  | 'FAILED_BAD_CREDENTIALS'
  | 'FAILED_LOCKED'
  | 'LOGOUT';

export type GenderTarget = 'MEN' | 'WOMEN' | 'UNISEX';

export type SizeLabel =
  | 'XS'
  | 'S'
  | 'M'
  | 'L'
  | 'XL'
  | 'XXL'
  | 'ONE_SIZE'
  | string;

export type OrderSource = 'WEB_STOREFRONT' | 'IN_STORE_POS' | 'PHONE_ORDER';

export type OrderStatus =
  | 'PENDING'
  | 'AWAITING_PAYMENT_VERIFICATION'
  | 'PROCESSING'
  | 'DISPATCHED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentMethod = 'BANK_TRANSFER' | 'CASH_ON_DELIVERY';

export type PaymentStatus =
  | 'PENDING'
  | 'VERIFIED'
  | 'FAILED'
  | 'REJECTED'
  | 'REFUNDED';

export type CodCollectionStatus =
  | 'UNCOLLECTED'
  | 'COLLECTED_BY_COURIER'
  | 'REMITTED_TO_STORE';

export type DeliveryStatus =
  | 'PENDING'
  | 'DISPATCHED'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'RETURNED'
  | 'FAILED';

// MODULE 1: IAM, USERS, STAFF, CUSTOMERS & SECURITY

export interface AppUser {
  userId: number;
  email: string;
  passwordHash: string;
  userRole: UserRole;
  accountStatus: AccountStatus;
  createdAt: string;
}

export interface Customer {
  customerId: number;
  userId: number | null;
  email: string;
  firstName: string;
  lastName: string;
  contactNumber: string;
  shippingAddress: string;
  city: string;
  district: string;
  province: string;
  postalCode?: string | null;
}

export interface StoreStaff {
  staffId: number;
  userId: number;
  firstName: string;
  lastName: string;
  designation: string;
  clearanceLevel: StaffClearanceLevel;
}

export interface UserLoginAudit {
  auditId: number;
  userId: number | null;
  attemptedEmail: string | null;
  ipAddress: string;
  loginTime: string;
  loginStatus: LoginAuditStatus;
}

export interface PasswordResetToken {
  resetId: number;
  userId: number;
  tokenHash: string;
  createdAt: string;
  expiresAt: string;
  usedAt: string | null;
}

// MODULE 2: CATALOG, INVENTORY & REVIEWS

export interface Category {
  categoryId: number;
  categoryName: string;
  categoryDescription?: string | null;
}

export interface Product {
  productId: number;
  categoryId: number;
  productName: string;
  productDescription?: string | null;
  genderTarget: GenderTarget;
  basePrice: number;
  mainImageUrl: string;
  isActive: boolean;
  createdAt: string;
}

export interface ProductVariant {
  variantId: number;
  productId: number;
  sku: string;
  sizeLabel: SizeLabel;
  color: string;
  stockQuantity: number;
  lowStockThreshold: number;
  variantImageUrl?: string | null;
  lockVersion: number;
}

export interface RestockLog {
  restockId: number;
  variantId: number;
  receivedByStaffId: number;
  quantityAdded: number;
  restockedAt: string;
  notes?: string | null;
}

export interface ProductReview {
  reviewId: number;
  productId: number;
  customerId: number;
  rating: number; // 1 to 5
  reviewComment?: string | null;
  isApproved: boolean;
  createdAt: string;
}

// MODULE 3: CART & ORDER MANAGEMENT

export interface Cart {
  cartId: number;
  customerId: number | null;
  guestToken: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  cartItemId: number;
  cartId: number;
  variantId: number;
  quantity: number;
  customImageUrl?: string | null;
  addedAt: string;
}

export interface CustomerOrder {
  orderId: number;
  orderNumber: string;
  customerId: number;
  assistedByStaffId: number | null;
  orderDate: string;
  orderSource: OrderSource;
  orderStatus: OrderStatus;
  subtotalAmount: number;
  shippingFee: number;
  totalPayable: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddressSnapshot: string;
  shippingDistrictSnapshot: string;
  shippingProvinceSnapshot: string;
}

export interface OrderItem {
  orderItemId: number;
  orderId: number;
  variantId: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  customImageUrl?: string | null;
  customPrintNotes?: string | null;
}

export interface OrderStatusHistory {
  historyId: number;
  orderId: number;
  changedByUserId: number | null;
  previousStatus: OrderStatus | null;
  newStatus: OrderStatus;
  changedAt: string;
  notes?: string | null;
}

// MODULE 4: INVOICE, PAYMENT & FULFILLMENT

export interface Invoice {
  invoiceId: number;
  orderId: number;
  invoiceNumber: string;
  issuedAt: string;
  pdfStoragePath: string;
}

export interface Payment {
  paymentId: number;
  orderId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export interface BankTransferPayment {
  paymentId: number;
  verifiedByStaffId: number | null;
  bankName: string;
  depositReference?: string | null;
  slipImageUrl: string;
  rejectionReason?: string | null;
  verifiedAt?: string | null;
}

export interface CashOnDeliveryPayment {
  paymentId: number;
  cashCollectionStatus: CodCollectionStatus;
  collectedAmount?: number | null;
  courierRemittanceDate?: string | null;
}

export interface CourierPartner {
  courierId: number;
  courierName: string;
  contactNumber: string;
  trackingApiUrl: string;
  isActive: boolean;
}

export interface DeliveryShipment {
  deliveryId: number;
  orderId: number;
  courierId: number;
  trackingNumber: string;
  courierCharge: number;
  deliveryStatus: DeliveryStatus;
  currentLocation?: string | null;
  dispatchedAt?: string | null;
  deliveredAt?: string | null;
}

// RELATIONAL / COMPOSITE VIEW MODELS

export interface ProductWithVariants extends Product {
  category?: Category;
  variants: ProductVariant[];
  reviews?: ProductReview[];
  averageRating?: number;
  reviewCount?: number;
  totalStock?: number;
  inStock?: boolean;
}

export interface ProductVariantWithDetails extends ProductVariant {
  product: Product;
  category?: Category;
}

export interface CartItemWithDetails extends CartItem {
  variant: ProductVariant;
  product: Product;
}

export interface CartWithDetails extends Cart {
  items: CartItemWithDetails[];
  subtotal: number;
  itemCount: number;
}

export interface OrderItemWithDetails extends OrderItem {
  variant?: ProductVariant;
  product?: Product;
}

export interface PaymentWithDetails extends Payment {
  bankTransfer?: BankTransferPayment;
  cod?: CashOnDeliveryPayment;
}

export interface ShipmentWithCourier extends DeliveryShipment {
  courier?: CourierPartner;
}

export interface CustomerOrderWithDetails extends CustomerOrder {
  items: OrderItemWithDetails[];
  payment?: PaymentWithDetails;
  shipment?: ShipmentWithCourier;
  invoice?: Invoice;
  statusHistory: OrderStatusHistory[];
  customer?: Customer;
  assistedByStaff?: StoreStaff;
}

// DTOs & PAYLOADS

export interface CreateOrderItemInput {
  variantId: number;
  quantity: number;
  customImageUrl?: string | null;
  customPrintNotes?: string | null;
}

export interface CreateOrderDto {
  customerId: number;
  orderSource: OrderSource;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingDistrict: string;
  shippingProvince: string;
  items: CreateOrderItemInput[];
  courierPartnerId?: number;
  shippingFee?: number;
  paymentMethod: PaymentMethod;
  bankName?: string;
  depositReference?: string;
  slipImageUrl?: string;
  assistedByStaffId?: number | null;
  notes?: string;
  cartIdToClear?: number;
}

export interface RestockLogDto {
  variantId: number;
  receivedByStaffId: number;
  quantityAdded: number;
  notes?: string;
}

export interface VerifySlipDto {
  paymentId: number;
  staffId: number;
  approved: boolean;
  rejectionReason?: string;
}

export interface UpdateOrderStatusDto {
  orderId: number;
  newStatus: OrderStatus;
  changedByUserId?: number | null;
  notes?: string;
}

export interface DispatchOrderDto {
  orderId: number;
  courierId: number;
  staffUserId?: number;
  trackingNumber?: string;
  courierCharge?: number;
  initialLocation?: string;
}

export interface CreateReviewDto {
  productId: number;
  customerId: number;
  rating: number;
  reviewComment?: string;
  autoApprove?: boolean;
}

export interface UpdateCodStatusDto {
  paymentId: number;
  cashCollectionStatus: CodCollectionStatus;
  collectedAmount?: number;
  courierRemittanceDate?: string;
}

export interface RecordLoginAuditDto {
  userId?: number | null;
  attemptedEmail: string;
  ipAddress: string;
  loginStatus: LoginAuditStatus;
}

export interface CreateProductDto {
  product: Omit<Product, 'productId' | 'createdAt'>;
  variants?: Omit<ProductVariant, 'variantId' | 'productId' | 'lockVersion'>[];
}
