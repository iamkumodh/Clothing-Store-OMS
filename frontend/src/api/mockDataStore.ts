// local reactive store backed by localStorage

import type {
  AppUser,
  Customer,
  StoreStaff,
  UserLoginAudit,
  PasswordResetToken,
  Category,
  Product,
  ProductVariant,
  RestockLog,
  ProductReview,
  Cart,
  CartItem,
  CustomerOrder,
  OrderItem,
  OrderStatusHistory,
  Invoice,
  Payment,
  BankTransferPayment,
  CashOnDeliveryPayment,
  CourierPartner,
  DeliveryShipment,
  ProductWithVariants,
  ProductVariantWithDetails,
  CartWithDetails,
  CustomerOrderWithDetails,
  CreateOrderDto,
  RestockLogDto,
  VerifySlipDto,
  UpdateOrderStatusDto,
  DispatchOrderDto,
  CreateReviewDto,
  UpdateCodStatusDto,
  RecordLoginAuditDto,
  OrderStatus,
  DeliveryStatus,
} from '../types/oms';

// storage key and schema

export const STORAGE_KEY = 'dfine_oms_mock_db_v3';
export const STORE_UPDATE_EVENT = 'dfine_oms_store_update';

export interface MockDatabaseSchema {
  version: number;
  appUsers: AppUser[];
  customers: Customer[];
  storeStaff: StoreStaff[];
  userLoginAudits: UserLoginAudit[];
  passwordResetTokens: PasswordResetToken[];
  categories: Category[];
  products: Product[];
  productVariants: ProductVariant[];
  restockLogs: RestockLog[];
  productReviews: ProductReview[];
  carts: Cart[];
  cartItems: CartItem[];
  customerOrders: CustomerOrder[];
  orderItems: OrderItem[];
  orderStatusHistories: OrderStatusHistory[];
  invoices: Invoice[];
  payments: Payment[];
  bankTransferPayments: BankTransferPayment[];
  cashOnDeliveryPayments: CashOnDeliveryPayment[];
  courierPartners: CourierPartner[];
  deliveryShipments: DeliveryShipment[];
}

export type StoreUpdateListener = (event: {
  type: string;
  payload?: unknown;
  timestamp: number;
}) => void;

// ERROR CLASSES

export class InsufficientStockError extends Error {
  readonly sku: string;
  readonly requested: number;
  readonly available: number;

  constructor(sku: string, requested: number, available: number) {
    super(
      `Insufficient stock for variant SKU ${sku}: requested ${requested}, available ${available}`
    );
    this.name = 'InsufficientStockError';
    this.sku = sku;
    this.requested = requested;
    this.available = available;
  }
}

export class OptimisticLockError extends Error {
  readonly sku: string;
  readonly expectedVersion: number;
  readonly currentVersion: number;

  constructor(sku: string, expectedVersion: number, currentVersion: number) {
    super(
      `Optimistic lock conflict on SKU ${sku}: expected version ${expectedVersion}, but found ${currentVersion}`
    );
    this.name = 'OptimisticLockError';
    this.sku = sku;
    this.expectedVersion = expectedVersion;
    this.currentVersion = currentVersion;
  }
}

// CANONICAL SEED DATA (100% MATCHING database/seeds.sql)

const SEED_APP_USERS: AppUser[] = [
  {
    userId: 1,
    email: 'admin@dfine.store',
    passwordHash: '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    userRole: 'ADMIN',
    accountStatus: 'ACTIVE',
    createdAt: '2026-08-01 08:00:00',
  },
  {
    userId: 2,
    email: 'chaminda.mgr@dfine.store',
    passwordHash: '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    userRole: 'MANAGER',
    accountStatus: 'ACTIVE',
    createdAt: '2026-08-01 08:30:00',
  },
  {
    userId: 3,
    email: 'kasun.perera@dfine.store',
    passwordHash: '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    userRole: 'STORE_STAFF',
    accountStatus: 'ACTIVE',
    createdAt: '2026-08-05 09:00:00',
  },
  {
    userId: 4,
    email: 'nethmi.fernando@dfine.store',
    passwordHash: '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    userRole: 'STORE_STAFF',
    accountStatus: 'ACTIVE',
    createdAt: '2026-08-05 09:15:00',
  },
  {
    userId: 5,
    email: 'dilshan.silva@dfine.store',
    passwordHash: '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    userRole: 'STORE_STAFF',
    accountStatus: 'ACTIVE',
    createdAt: '2026-08-10 10:00:00',
  },
  {
    userId: 6,
    email: 'kavindu.bandara@gmail.com',
    passwordHash: '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    userRole: 'CUSTOMER',
    accountStatus: 'ACTIVE',
    createdAt: '2026-08-15 14:20:00',
  },
  {
    userId: 7,
    email: 'sachini.jayawardena@yahoo.com',
    passwordHash: '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    userRole: 'CUSTOMER',
    accountStatus: 'ACTIVE',
    createdAt: '2026-08-18 16:45:00',
  },
  {
    userId: 8,
    email: 'akila.wickramasinghe@outlook.com',
    passwordHash: '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    userRole: 'CUSTOMER',
    accountStatus: 'ACTIVE',
    createdAt: '2026-08-20 11:10:00',
  },
  {
    userId: 9,
    email: 'tharushi.de.silva@gmail.com',
    passwordHash: '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    userRole: 'CUSTOMER',
    accountStatus: 'ACTIVE',
    createdAt: '2026-08-25 18:00:00',
  },
  {
    userId: 10,
    email: 'roshan.gunasekara@hotmail.com',
    passwordHash: '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    userRole: 'CUSTOMER',
    accountStatus: 'ACTIVE',
    createdAt: '2026-09-01 09:30:00',
  },
  {
    userId: 11,
    email: 'malik.farook@gmail.com',
    passwordHash: '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    userRole: 'CUSTOMER',
    accountStatus: 'SUSPENDED',
    createdAt: '2026-09-05 13:15:00',
  },
  {
    userId: 12,
    email: 'nadeesha.fernando@gmail.com',
    passwordHash: '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    userRole: 'CUSTOMER',
    accountStatus: 'DEACTIVATED',
    createdAt: '2026-09-08 17:50:00',
  },
];

const SEED_CUSTOMERS: Customer[] = [
  {
    customerId: 1,
    userId: 6,
    email: 'kavindu.bandara@gmail.com',
    firstName: 'Kavindu',
    lastName: 'Bandara',
    contactNumber: '+94771234567',
    shippingAddress: 'No. 45/2, Temple Road, Havelock Town',
    city: 'Colombo 05',
    district: 'Colombo',
    province: 'Western',
    postalCode: '00500',
  },
  {
    customerId: 2,
    userId: 7,
    email: 'sachini.jayawardena@yahoo.com',
    firstName: 'Sachini',
    lastName: 'Jayawardena',
    contactNumber: '+94718899001',
    shippingAddress: '124/B, Peradeniya Road',
    city: 'Kandy',
    district: 'Kandy',
    province: 'Central',
    postalCode: '20000',
  },
  {
    customerId: 3,
    userId: 8,
    email: 'akila.wickramasinghe@outlook.com',
    firstName: 'Akila',
    lastName: 'Wickramasinghe',
    contactNumber: '+94762345678',
    shippingAddress: '88, Beach Road, Weligama',
    city: 'Weligama',
    district: 'Matara',
    province: 'Southern',
    postalCode: '81700',
  },
  {
    customerId: 4,
    userId: 9,
    email: 'tharushi.de.silva@gmail.com',
    firstName: 'Tharushi',
    lastName: 'De Silva',
    contactNumber: '+94703344556',
    shippingAddress: '15, Circular Road',
    city: 'Kurunegala',
    district: 'Kurunegala',
    province: 'North Western',
    postalCode: '60000',
  },
  {
    customerId: 5,
    userId: 10,
    email: 'roshan.gunasekara@hotmail.com',
    firstName: 'Roshan',
    lastName: 'Gunasekara',
    contactNumber: '+94785566778',
    shippingAddress: '32/1, Station Road',
    city: 'Wattala',
    district: 'Gampaha',
    province: 'Western',
    postalCode: '11300',
  },
  {
    customerId: 6,
    userId: 11,
    email: 'malik.farook@gmail.com',
    firstName: 'Malik',
    lastName: 'Farook',
    contactNumber: '+94779988776',
    shippingAddress: '73, Ward Place',
    city: 'Colombo 07',
    district: 'Colombo',
    province: 'Western',
    postalCode: '00700',
  },
  {
    customerId: 7,
    userId: 12,
    email: 'nadeesha.fernando@gmail.com',
    firstName: 'Nadeesha',
    lastName: 'Fernando',
    contactNumber: '+94712233445',
    shippingAddress: '18, Galle Road, Mount Lavinia',
    city: 'Dehiwala-Mount Lavinia',
    district: 'Colombo',
    province: 'Western',
    postalCode: '10370',
  },
];

const SEED_STORE_STAFF: StoreStaff[] = [
  {
    staffId: 1,
    userId: 2,
    firstName: 'Chaminda',
    lastName: 'Senanayake',
    designation: 'Store General Manager',
    clearanceLevel: 'ADMIN_SUPER',
  },
  {
    staffId: 2,
    userId: 3,
    firstName: 'Kasun',
    lastName: 'Perera',
    designation: 'Warehouse & Inventory Supervisor',
    clearanceLevel: 'TIER_2',
  },
  {
    staffId: 3,
    userId: 4,
    firstName: 'Nethmi',
    lastName: 'Fernando',
    designation: 'Fulfillment & Payment Verification Officer',
    clearanceLevel: 'TIER_2',
  },
  {
    staffId: 4,
    userId: 5,
    firstName: 'Dilshan',
    lastName: 'Silva',
    designation: 'Retail POS Cashier',
    clearanceLevel: 'TIER_1',
  },
];

const SEED_LOGIN_AUDITS: UserLoginAudit[] = [
  {
    auditId: 1,
    userId: 1,
    attemptedEmail: 'admin@dfine.store',
    ipAddress: '192.168.1.10',
    loginTime: '2026-09-26 08:30:00',
    loginStatus: 'SUCCESS',
  },
  {
    auditId: 2,
    userId: 3,
    attemptedEmail: 'kasun.perera@dfine.store',
    ipAddress: '192.168.1.15',
    loginTime: '2026-09-26 08:45:00',
    loginStatus: 'SUCCESS',
  },
  {
    auditId: 3,
    userId: 6,
    attemptedEmail: 'kavindu.bandara@gmail.com',
    ipAddress: '124.43.98.12',
    loginTime: '2026-09-26 14:10:00',
    loginStatus: 'SUCCESS',
  },
  {
    auditId: 4,
    userId: 7,
    attemptedEmail: 'sachini.jayawardena@yahoo.com',
    ipAddress: '112.134.55.201',
    loginTime: '2026-09-27 09:15:00',
    loginStatus: 'SUCCESS',
  },
  {
    auditId: 5,
    userId: null,
    attemptedEmail: 'admin@dfine.store',
    ipAddress: '45.154.255.80',
    loginTime: '2026-09-27 02:11:00',
    loginStatus: 'FAILED_BAD_CREDENTIALS',
  },
  {
    auditId: 6,
    userId: null,
    attemptedEmail: 'root@dfine.store',
    ipAddress: '45.154.255.80',
    loginTime: '2026-09-27 02:11:45',
    loginStatus: 'FAILED_BAD_CREDENTIALS',
  },
  {
    auditId: 7,
    userId: 11,
    attemptedEmail: 'malik.farook@gmail.com',
    ipAddress: '203.94.10.5',
    loginTime: '2026-09-27 18:22:00',
    loginStatus: 'FAILED_LOCKED',
  },
  {
    auditId: 8,
    userId: 5,
    attemptedEmail: 'dilshan.silva@dfine.store',
    ipAddress: '192.168.1.20',
    loginTime: '2026-09-27 17:05:00',
    loginStatus: 'LOGOUT',
  },
];

const SEED_PASSWORD_RESET_TOKENS: PasswordResetToken[] = [
  {
    resetId: 1,
    userId: 6,
    tokenHash:
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    createdAt: '2026-09-30 10:00:00',
    expiresAt: '2026-09-30 10:15:00',
    usedAt: null,
  },
  {
    resetId: 2,
    userId: 7,
    tokenHash:
      '8799c30f40d89753443a9ccad3cf4cf42ab1d072e293046f4b679b362fb7ec4c',
    createdAt: '2026-09-29 14:00:00',
    expiresAt: '2026-09-29 14:15:00',
    usedAt: '2026-09-29 14:05:00',
  },
  {
    resetId: 3,
    userId: 10,
    tokenHash:
      '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    createdAt: '2026-09-28 08:00:00',
    expiresAt: '2026-09-28 08:15:00',
    usedAt: null,
  },
];

const SEED_CATEGORIES: Category[] = [
  {
    categoryId: 1,
    categoryName: 'Spandex',
    categoryDescription:
      'Heavyweight 240–260 GSM spandex-cotton stretch blend streetwear tees with structured drape',
  },
  {
    categoryId: 2,
    categoryName: 'Terry',
    categoryDescription:
      'Substantial 260 GSM French Terry knit apparel with interior micro-loops and drop shoulders',
  },
  {
    categoryId: 3,
    categoryName: 'Dye',
    categoryDescription:
      'Authentic 240 GSM pigment garment-dyed streetwear tees with individual vintage character',
  },
];

const SEED_PRODUCTS: Product[] = [
  {
    productId: 1,
    categoryId: 1,
    productName: 'SPANDEX - B1',
    productDescription:
      'Signature drop-shoulder heavyweight streetwear tee in deep black. Engineered with a premium spandex-cotton stretch blend.',
    genderTarget: 'UNISEX',
    basePrice: 2900.0,
    mainImageUrl: '/images/products/spx-b1-1.webp',
    isActive: true,
    createdAt: '2026-08-10 10:00:00',
  },
  {
    productId: 2,
    categoryId: 1,
    productName: 'SPANDEX - DB1',
    productDescription:
      'Structured 260 GSM heavy spandex-cotton jersey in washed charcoal black. Features clean geometric drape.',
    genderTarget: 'UNISEX',
    basePrice: 3200.0,
    mainImageUrl: '/images/products/spx-db1-1.webp',
    isActive: true,
    createdAt: '2026-08-12 11:30:00',
  },
  {
    productId: 3,
    categoryId: 1,
    productName: 'SPANDEX - W1',
    productDescription:
      'Crisp white spandex-cotton relaxed streetwear tee with tailored collar and smooth weave surface.',
    genderTarget: 'UNISEX',
    basePrice: 3000.0,
    mainImageUrl: '/images/products/spx-w1-1.webp',
    isActive: true,
    createdAt: '2026-08-15 14:00:00',
  },
  {
    productId: 4,
    categoryId: 1,
    productName: 'SPANDEX - W2 (Off White)',
    productDescription:
      'Muted off-white tone spandex-cotton everyday streetwear essential. Minimalist aesthetic with relaxed fit.',
    genderTarget: 'UNISEX',
    basePrice: 2900.0,
    mainImageUrl: '/images/products/spx-w2-placeholder.webp',
    isActive: true,
    createdAt: '2026-08-18 15:20:00',
  },
  {
    productId: 5,
    categoryId: 2,
    productName: 'TERRY - G1',
    productDescription:
      'Substantial French Terry knit tee in earthy olive green with interior micro-loop comfort construction.',
    genderTarget: 'UNISEX',
    basePrice: 3200.0,
    mainImageUrl: '/images/products/try-g1-1.webp',
    isActive: true,
    createdAt: '2026-08-20 09:00:00',
  },
  {
    productId: 6,
    categoryId: 2,
    productName: 'TERRY - LB1',
    productDescription:
      'Soft French Terry relaxed tee in muted light blue/teal. Designed for all-day comfort with streetwear cut.',
    genderTarget: 'UNISEX',
    basePrice: 3000.0,
    mainImageUrl: '/images/products/try-lb1-1.webp',
    isActive: true,
    createdAt: '2026-08-22 13:40:00',
  },
  {
    productId: 7,
    categoryId: 2,
    productName: 'TERRY - P1',
    productDescription:
      'French Terry drop-shoulder streetwear tee with clean ribbed collar and subtle dusty rose tint.',
    genderTarget: 'UNISEX',
    basePrice: 3000.0,
    mainImageUrl: '/images/products/try-p1-placeholder.webp',
    isActive: true,
    createdAt: '2026-08-25 10:15:00',
  },
  {
    productId: 8,
    categoryId: 3,
    productName: 'DYE - D1',
    productDescription:
      'Authentic pigment garment-dyed streetwear tee with distinctive vintage washed character and ultra-soft handle.',
    genderTarget: 'UNISEX',
    basePrice: 2800.0,
    mainImageUrl: '/images/products/dye-d1-placeholder.webp',
    isActive: true,
    createdAt: '2026-08-25 11:00:00',
  },
];

const SEED_PRODUCT_VARIANTS: ProductVariant[] = [
  // SPANDEX - B1 (Product 1: S, M, L)
  {
    variantId: 1,
    productId: 1,
    sku: 'SPX-B1-S',
    sizeLabel: 'S',
    color: 'Pitch Black',
    stockQuantity: 20,
    lowStockThreshold: 5,
    variantImageUrl: '/images/products/spx-b1-1.webp',
    lockVersion: 1,
  },
  {
    variantId: 2,
    productId: 1,
    sku: 'SPX-B1-M',
    sizeLabel: 'M',
    color: 'Pitch Black',
    stockQuantity: 35,
    lowStockThreshold: 5,
    variantImageUrl: '/images/products/spx-b1-1.webp',
    lockVersion: 1,
  },
  {
    variantId: 3,
    productId: 1,
    sku: 'SPX-B1-L',
    sizeLabel: 'L',
    color: 'Pitch Black',
    stockQuantity: 25,
    lowStockThreshold: 5,
    variantImageUrl: '/images/products/spx-b1-1.webp',
    lockVersion: 1,
  },

  // SPANDEX - DB1 (Product 2: S, M, L)
  {
    variantId: 4,
    productId: 2,
    sku: 'SPX-DB1-S',
    sizeLabel: 'S',
    color: 'Washed Charcoal',
    stockQuantity: 15,
    lowStockThreshold: 5,
    variantImageUrl: '/images/products/spx-db1-1.webp',
    lockVersion: 1,
  },
  {
    variantId: 5,
    productId: 2,
    sku: 'SPX-DB1-M',
    sizeLabel: 'M',
    color: 'Washed Charcoal',
    stockQuantity: 30,
    lowStockThreshold: 5,
    variantImageUrl: '/images/products/spx-db1-1.webp',
    lockVersion: 1,
  },
  {
    variantId: 6,
    productId: 2,
    sku: 'SPX-DB1-L',
    sizeLabel: 'L',
    color: 'Washed Charcoal',
    stockQuantity: 20,
    lowStockThreshold: 5,
    variantImageUrl: '/images/products/spx-db1-1.webp',
    lockVersion: 1,
  },

  // SPANDEX - W1 (Product 3: S, M)
  {
    variantId: 7,
    productId: 3,
    sku: 'SPX-W1-S',
    sizeLabel: 'S',
    color: 'Pure White',
    stockQuantity: 20,
    lowStockThreshold: 5,
    variantImageUrl: '/images/products/spx-w1-1.webp',
    lockVersion: 1,
  },
  {
    variantId: 8,
    productId: 3,
    sku: 'SPX-W1-M',
    sizeLabel: 'M',
    color: 'Pure White',
    stockQuantity: 25,
    lowStockThreshold: 5,
    variantImageUrl: '/images/products/spx-w1-1.webp',
    lockVersion: 1,
  },

  // SPANDEX - W2 (Off White) (Product 4: S, M)
  {
    variantId: 9,
    productId: 4,
    sku: 'SPX-W2-S',
    sizeLabel: 'S',
    color: 'Off White',
    stockQuantity: 18,
    lowStockThreshold: 5,
    variantImageUrl: '/images/products/spx-w2-placeholder.webp',
    lockVersion: 1,
  },
  {
    variantId: 10,
    productId: 4,
    sku: 'SPX-W2-M',
    sizeLabel: 'M',
    color: 'Off White',
    stockQuantity: 22,
    lowStockThreshold: 5,
    variantImageUrl: '/images/products/spx-w2-placeholder.webp',
    lockVersion: 1,
  },

  // TERRY - G1 (Product 5: S, M, L, XL)
  {
    variantId: 11,
    productId: 5,
    sku: 'TRY-G1-S',
    sizeLabel: 'S',
    color: 'Olive Green',
    stockQuantity: 15,
    lowStockThreshold: 5,
    variantImageUrl: '/images/products/try-g1-1.webp',
    lockVersion: 1,
  },
  {
    variantId: 12,
    productId: 5,
    sku: 'TRY-G1-M',
    sizeLabel: 'M',
    color: 'Olive Green',
    stockQuantity: 30,
    lowStockThreshold: 5,
    variantImageUrl: '/images/products/try-g1-1.webp',
    lockVersion: 1,
  },
  {
    variantId: 13,
    productId: 5,
    sku: 'TRY-G1-L',
    sizeLabel: 'L',
    color: 'Olive Green',
    stockQuantity: 25,
    lowStockThreshold: 5,
    variantImageUrl: '/images/products/try-g1-1.webp',
    lockVersion: 1,
  },
  {
    variantId: 14,
    productId: 5,
    sku: 'TRY-G1-XL',
    sizeLabel: 'XL',
    color: 'Olive Green',
    stockQuantity: 12,
    lowStockThreshold: 5,
    variantImageUrl: '/images/products/try-g1-1.webp',
    lockVersion: 1,
  },

  // TERRY - LB1 (Product 6: S, M)
  {
    variantId: 15,
    productId: 6,
    sku: 'TRY-LB1-S',
    sizeLabel: 'S',
    color: 'Light Blue',
    stockQuantity: 20,
    lowStockThreshold: 5,
    variantImageUrl: '/images/products/try-lb1-1.webp',
    lockVersion: 1,
  },
  {
    variantId: 16,
    productId: 6,
    sku: 'TRY-LB1-M',
    sizeLabel: 'M',
    color: 'Light Blue',
    stockQuantity: 25,
    lowStockThreshold: 5,
    variantImageUrl: '/images/products/try-lb1-1.webp',
    lockVersion: 1,
  },

  // TERRY - P1 (Product 7: S, M)
  {
    variantId: 17,
    productId: 7,
    sku: 'TRY-P1-S',
    sizeLabel: 'S',
    color: 'Dusty Pink',
    stockQuantity: 15,
    lowStockThreshold: 5,
    variantImageUrl: '/images/products/try-p1-placeholder.webp',
    lockVersion: 1,
  },
  {
    variantId: 18,
    productId: 7,
    sku: 'TRY-P1-M',
    sizeLabel: 'M',
    color: 'Dusty Pink',
    stockQuantity: 20,
    lowStockThreshold: 5,
    variantImageUrl: '/images/products/try-p1-placeholder.webp',
    lockVersion: 1,
  },

  // DYE - D1 (Product 8: M, L)
  {
    variantId: 19,
    productId: 8,
    sku: 'DYE-D1-M',
    sizeLabel: 'M',
    color: 'Vintage Mineral',
    stockQuantity: 25,
    lowStockThreshold: 5,
    variantImageUrl: '/images/products/dye-d1-placeholder.webp',
    lockVersion: 1,
  },
  {
    variantId: 20,
    productId: 8,
    sku: 'DYE-D1-L',
    sizeLabel: 'L',
    color: 'Vintage Mineral',
    stockQuantity: 20,
    lowStockThreshold: 5,
    variantImageUrl: '/images/products/dye-d1-placeholder.webp',
    lockVersion: 1,
  },
];

const SEED_RESTOCK_LOGS: RestockLog[] = [
  {
    restockId: 1,
    variantId: 1,
    receivedByStaffId: 2,
    quantityAdded: 50,
    restockedAt: '2026-09-01 10:00:00',
    notes:
      'Supplier shipment batch #DF-2026-Q3 received in pristine condition.',
  },
  {
    restockId: 2,
    variantId: 9,
    receivedByStaffId: 2,
    quantityAdded: 25,
    restockedAt: '2026-09-10 14:30:00',
    notes: 'Pre-season winter fleece batch intake.',
  },
  {
    restockId: 3,
    variantId: 5,
    receivedByStaffId: 1,
    quantityAdded: 100,
    restockedAt: '2026-09-15 09:15:00',
    notes: 'Direct mill shipment from Biyagama textile facility.',
  },
];

const SEED_PRODUCT_REVIEWS: ProductReview[] = [
  {
    reviewId: 1,
    productId: 1,
    customerId: 1,
    rating: 5,
    reviewComment:
      'Top-tier heavyweight cotton! The print has stayed sharp after multiple washes. Fits oversized just as described.',
    isApproved: true,
    createdAt: '2026-09-28 10:30:00',
  },
  {
    reviewId: 2,
    productId: 1,
    customerId: 6,
    rating: 4,
    reviewComment:
      'Great oversized fit and thick collar ribbing that does not sag after washing. Print vibrancy is top notch.',
    isApproved: true,
    createdAt: '2026-09-30 14:20:00',
  },
  {
    reviewId: 3,
    productId: 1,
    customerId: 7,
    rating: 5,
    reviewComment:
      'Love the drop-shoulder streetwear cut! Fabric is super breathable for Colombo weather. Highly recommended.',
    isApproved: true,
    createdAt: '2026-09-26 16:45:00',
  },
  {
    reviewId: 4,
    productId: 3,
    customerId: 2,
    rating: 5,
    reviewComment:
      'Extremely warm and the vintage wash looks even better in person. Express delivery to Kandy was prompt!',
    isApproved: true,
    createdAt: '2026-09-29 11:15:00',
  },
  {
    reviewId: 5,
    productId: 5,
    customerId: 3,
    rating: 4,
    reviewComment:
      'Very soft material and luxurious texture. Note that the sleeves fit slightly snug, consider sizing up.',
    isApproved: true,
    createdAt: '2026-09-27 12:00:00',
  },
  {
    reviewId: 6,
    productId: 6,
    customerId: 4,
    rating: 3,
    reviewComment:
      'Pants are sturdy and well constructed, but courier delivery took 4 days to reach Kurunegala.',
    isApproved: true,
    createdAt: '2026-09-27 15:00:00',
  },
  {
    reviewId: 7,
    productId: 7,
    customerId: 5,
    rating: 1,
    reviewComment:
      'Spam test review with unverified external links: http://promo-deal-fake.com',
    isApproved: false,
    createdAt: '2026-09-28 09:00:00',
  },
];

const SEED_CARTS: Cart[] = [
  {
    cartId: 1,
    customerId: 3,
    guestToken: null,
    createdAt: '2026-09-28 10:00:00',
    updatedAt: '2026-09-28 10:30:00',
  },
  {
    cartId: 2,
    customerId: 4,
    guestToken: null,
    createdAt: '2026-09-28 11:15:00',
    updatedAt: '2026-09-28 11:20:00',
  },
  {
    cartId: 3,
    customerId: null,
    guestToken: 'gst_sess_89f02c11e7ba48b9a2',
    createdAt: '2026-09-28 12:00:00',
    updatedAt: '2026-09-28 12:05:00',
  },
];

const SEED_CART_ITEMS: CartItem[] = [
  {
    cartItemId: 1,
    cartId: 1,
    variantId: 1,
    quantity: 1,
    customImageUrl: null,
    addedAt: '2026-09-28 10:05:00',
  },
  {
    cartItemId: 2,
    cartId: 1,
    variantId: 17,
    quantity: 2,
    customImageUrl: null,
    addedAt: '2026-09-28 10:30:00',
  },
  {
    cartItemId: 3,
    cartId: 2,
    variantId: 14,
    quantity: 1,
    customImageUrl: null,
    addedAt: '2026-09-28 11:20:00',
  },
  {
    cartItemId: 4,
    cartId: 3,
    variantId: 6,
    quantity: 2,
    customImageUrl:
      '/images/dfine-img-015.png',
    addedAt: '2026-09-28 12:05:00',
  },
];

const SEED_COURIER_PARTNERS: CourierPartner[] = [
  {
    courierId: 1,
    courierName: 'Domex Express',
    contactNumber: '+94117704704',
    trackingApiUrl: 'https://domex.lk/tracking?ref=',
    isActive: true,
  },
  {
    courierId: 2,
    courierName: 'Pronto Logistics',
    contactNumber: '+94112575575',
    trackingApiUrl: 'https://prontolk.com/track/',
    isActive: true,
  },
  {
    courierId: 3,
    courierName: 'Prompt Xpress',
    contactNumber: '+94114767767',
    trackingApiUrl: 'https://promptxpress.lk/track/',
    isActive: true,
  },
  {
    courierId: 4,
    courierName: 'Fardar Express',
    contactNumber: '+94112699999',
    trackingApiUrl: 'https://fardarexpress.com/track/',
    isActive: true,
  },
];

const SEED_CUSTOMER_ORDERS: CustomerOrder[] = [
  {
    orderId: 1,
    orderNumber: 'ORD-2026-1001',
    customerId: 1,
    assistedByStaffId: null,
    orderDate: '2026-09-25 10:15:00',
    orderSource: 'WEB_STOREFRONT',
    orderStatus: 'DELIVERED',
    subtotalAmount: 8400.0,
    shippingFee: 350.0,
    totalPayable: 8750.0,
    customerName: 'Kavindu Bandara',
    customerEmail: 'kavindu.bandara@gmail.com',
    customerPhone: '+94771234567',
    shippingAddressSnapshot:
      'No. 45/2, Temple Road, Havelock Town, Colombo 05',
    shippingDistrictSnapshot: 'Colombo',
    shippingProvinceSnapshot: 'Western',
  },
  {
    orderId: 2,
    orderNumber: 'ORD-2026-1002',
    customerId: 2,
    assistedByStaffId: null,
    orderDate: '2026-09-26 14:20:00',
    orderSource: 'WEB_STOREFRONT',
    orderStatus: 'PROCESSING',
    subtotalAmount: 10700.0,
    shippingFee: 450.0,
    totalPayable: 11150.0,
    customerName: 'Sachini Jayawardena',
    customerEmail: 'sachini.jayawardena@yahoo.com',
    customerPhone: '+94718899001',
    shippingAddressSnapshot: '124/B, Peradeniya Road, Kandy',
    shippingDistrictSnapshot: 'Kandy',
    shippingProvinceSnapshot: 'Central',
  },
  {
    orderId: 3,
    orderNumber: 'ORD-2026-1003',
    customerId: 3,
    assistedByStaffId: 4,
    orderDate: '2026-09-27 11:30:00',
    orderSource: 'IN_STORE_POS',
    orderStatus: 'DELIVERED',
    subtotalAmount: 10700.0,
    shippingFee: 0.0,
    totalPayable: 10700.0,
    customerName: 'Akila Wickramasinghe',
    customerEmail: 'akila.wickramasinghe@outlook.com',
    customerPhone: '+94762345678',
    shippingAddressSnapshot:
      'Store POS Counter, Flagship Retail Store, Colombo 03',
    shippingDistrictSnapshot: 'Colombo',
    shippingProvinceSnapshot: 'Western',
  },
  {
    orderId: 4,
    orderNumber: 'ORD-2026-1004',
    customerId: 4,
    assistedByStaffId: null,
    orderDate: '2026-09-27 16:40:00',
    orderSource: 'WEB_STOREFRONT',
    orderStatus: 'AWAITING_PAYMENT_VERIFICATION',
    subtotalAmount: 6800.0,
    shippingFee: 400.0,
    totalPayable: 7200.0,
    customerName: 'Tharushi De Silva',
    customerEmail: 'tharushi.de.silva@gmail.com',
    customerPhone: '+94703344556',
    shippingAddressSnapshot: '15, Circular Road, Kurunegala',
    shippingDistrictSnapshot: 'Kurunegala',
    shippingProvinceSnapshot: 'North Western',
  },
  {
    orderId: 5,
    orderNumber: 'ORD-2026-1005',
    customerId: 5,
    assistedByStaffId: 3,
    orderDate: '2026-09-26 10:00:00',
    orderSource: 'PHONE_ORDER',
    orderStatus: 'DISPATCHED',
    subtotalAmount: 8400.0,
    shippingFee: 350.0,
    totalPayable: 8750.0,
    customerName: 'Roshan Gunasekara',
    customerEmail: 'roshan.gunasekara@hotmail.com',
    customerPhone: '+94785566778',
    shippingAddressSnapshot: '32/1, Station Road, Wattala',
    shippingDistrictSnapshot: 'Gampaha',
    shippingProvinceSnapshot: 'Western',
  },
  {
    orderId: 6,
    orderNumber: 'ORD-2026-1006',
    customerId: 6,
    assistedByStaffId: null,
    orderDate: '2026-09-20 13:00:00',
    orderSource: 'WEB_STOREFRONT',
    orderStatus: 'REFUNDED',
    subtotalAmount: 5900.0,
    shippingFee: 400.0,
    totalPayable: 6300.0,
    customerName: 'Malik Farook',
    customerEmail: 'malik.farook@gmail.com',
    customerPhone: '+94779988776',
    shippingAddressSnapshot: '73, Ward Place, Colombo 07',
    shippingDistrictSnapshot: 'Colombo',
    shippingProvinceSnapshot: 'Western',
  },
  {
    orderId: 7,
    orderNumber: 'ORD-2026-1007',
    customerId: 2,
    assistedByStaffId: null,
    orderDate: '2026-09-28 14:00:00',
    orderSource: 'WEB_STOREFRONT',
    orderStatus: 'PENDING',
    subtotalAmount: 4200.0,
    shippingFee: 350.0,
    totalPayable: 4550.0,
    customerName: 'Sachini Jayawardena',
    customerEmail: 'sachini.jayawardena@yahoo.com',
    customerPhone: '+94718899001',
    shippingAddressSnapshot: '124/B, Peradeniya Road, Kandy',
    shippingDistrictSnapshot: 'Kandy',
    shippingProvinceSnapshot: 'Central',
  },
];

const SEED_ORDER_ITEMS: OrderItem[] = [
  // Order 1 (2x Tokyo Drift Black M)
  {
    orderItemId: 1,
    orderId: 1,
    variantId: 1,
    quantity: 2,
    unitPrice: 4200.0,
    subtotal: 8400.0,
    customImageUrl: null,
    customPrintNotes: null,
  },
  // Order 2 (1x Cyberpunk Hoodie M + 1x Custom DTG Tee with print)
  {
    orderItemId: 2,
    orderId: 2,
    variantId: 9,
    quantity: 1,
    unitPrice: 7500.0,
    subtotal: 7500.0,
    customImageUrl: null,
    customPrintNotes: null,
  },
  {
    orderItemId: 3,
    orderId: 2,
    variantId: 5,
    quantity: 1,
    unitPrice: 3200.0,
    subtotal: 3200.0,
    customImageUrl:
      '/images/dfine-img-016.png',
    customPrintNotes: 'Front chest A3 graphic print, neon glow vibrancy',
  },
  // Order 3 (1x Polo Navy L + 1x Cargo Khaki M)
  {
    orderItemId: 4,
    orderId: 3,
    variantId: 16,
    quantity: 1,
    unitPrice: 4800.0,
    subtotal: 4800.0,
    customImageUrl: null,
    customPrintNotes: null,
  },
  {
    orderItemId: 5,
    orderId: 3,
    variantId: 18,
    quantity: 1,
    unitPrice: 5900.0,
    subtotal: 5900.0,
    customImageUrl: null,
    customPrintNotes: null,
  },
  // Order 4 (1x Fleece Hoodie Pink M)
  {
    orderItemId: 6,
    orderId: 4,
    variantId: 13,
    quantity: 1,
    unitPrice: 6800.0,
    subtotal: 6800.0,
    customImageUrl: null,
    customPrintNotes: null,
  },
  // Order 5 (2x Tokyo Drift Black M)
  {
    orderItemId: 7,
    orderId: 5,
    variantId: 1,
    quantity: 2,
    unitPrice: 4200.0,
    subtotal: 8400.0,
    customImageUrl: null,
    customPrintNotes: null,
  },
  // Order 6 (1x Cargo Khaki L)
  {
    orderItemId: 8,
    orderId: 6,
    variantId: 19,
    quantity: 1,
    unitPrice: 5900.0,
    subtotal: 5900.0,
    customImageUrl: null,
    customPrintNotes: null,
  },
  // Order 7 (1x Tokyo Drift Black XXL)
  {
    orderItemId: 9,
    orderId: 7,
    variantId: 3,
    quantity: 1,
    unitPrice: 4200.0,
    subtotal: 4200.0,
    customImageUrl: null,
    customPrintNotes: null,
  },
];

const SEED_INVOICES: Invoice[] = [
  {
    invoiceId: 1,
    orderId: 1,
    invoiceNumber: 'INV-2026-0001',
    issuedAt: '2026-09-25 11:30:00',
    pdfStoragePath: '/storage/invoices/2026/09/INV-2026-0001.pdf',
  },
  {
    invoiceId: 2,
    orderId: 2,
    invoiceNumber: 'INV-2026-0002',
    issuedAt: '2026-09-26 16:00:00',
    pdfStoragePath: '/storage/invoices/2026/10/INV-2026-0002.pdf',
  },
  {
    invoiceId: 3,
    orderId: 3,
    invoiceNumber: 'INV-2026-0003',
    issuedAt: '2026-09-27 11:32:00',
    pdfStoragePath: '/storage/invoices/2026/10/INV-2026-0003.pdf',
  },
  {
    invoiceId: 4,
    orderId: 5,
    invoiceNumber: 'INV-2026-0004',
    issuedAt: '2026-09-26 10:30:00',
    pdfStoragePath: '/storage/invoices/2026/10/INV-2026-0004.pdf',
  },
  {
    invoiceId: 5,
    orderId: 6,
    invoiceNumber: 'INV-2026-0005',
    issuedAt: '2026-09-20 14:00:00',
    pdfStoragePath: '/storage/invoices/2026/09/INV-2026-0005.pdf',
  },
];

const SEED_ORDER_STATUS_HISTORIES: OrderStatusHistory[] = [
  // Order 1 progression
  {
    historyId: 1,
    orderId: 1,
    changedByUserId: 6,
    previousStatus: null,
    newStatus: 'PENDING',
    changedAt: '2026-09-25 10:15:00',
    notes: 'Order placed via online storefront checkout.',
  },
  {
    historyId: 2,
    orderId: 1,
    changedByUserId: 3,
    previousStatus: 'PENDING',
    newStatus: 'PROCESSING',
    changedAt: '2026-09-25 11:30:00',
    notes:
      'Automated sales verification passed; order sent to warehouse picker.',
  },
  {
    historyId: 3,
    orderId: 1,
    changedByUserId: 3,
    previousStatus: 'PROCESSING',
    newStatus: 'DISPATCHED',
    changedAt: '2026-09-26 09:00:00',
    notes: 'Package handed over to Domex Express dispatch courier.',
  },
  {
    historyId: 4,
    orderId: 1,
    changedByUserId: null,
    previousStatus: 'DISPATCHED',
    newStatus: 'DELIVERED',
    changedAt: '2026-09-27 15:45:00',
    notes: 'Delivery confirmation received from Domex courier tracking API.',
  },

  // Order 2 progression (Custom DTG)
  {
    historyId: 5,
    orderId: 2,
    changedByUserId: 7,
    previousStatus: null,
    newStatus: 'PENDING',
    changedAt: '2026-09-26 14:20:00',
    notes: 'Order placed, awaiting customer bank transfer slip.',
  },
  {
    historyId: 6,
    orderId: 2,
    changedByUserId: 7,
    previousStatus: 'PENDING',
    newStatus: 'AWAITING_PAYMENT_VERIFICATION',
    changedAt: '2026-09-26 15:10:00',
    notes: 'Customer uploaded Commercial Bank deposit slip.',
  },
  {
    historyId: 7,
    orderId: 2,
    changedByUserId: 4,
    previousStatus: 'AWAITING_PAYMENT_VERIFICATION',
    newStatus: 'PROCESSING',
    changedAt: '2026-09-26 16:00:00',
    notes:
      'Bank transfer slip verified against statement; order released to DTG print queue.',
  },

  // Order 3 progression (POS)
  {
    historyId: 8,
    orderId: 3,
    changedByUserId: 5,
    previousStatus: null,
    newStatus: 'PROCESSING',
    changedAt: '2026-09-27 11:30:00',
    notes: 'POS Terminal sale initiated by cashier Dilshan.',
  },
  {
    historyId: 9,
    orderId: 3,
    changedByUserId: 5,
    previousStatus: 'PROCESSING',
    newStatus: 'DELIVERED',
    changedAt: '2026-09-27 11:32:00',
    notes:
      'Cash collected at register and goods handed to customer over counter.',
  },

  // Order 4 progression (Rejected slip)
  {
    historyId: 10,
    orderId: 4,
    changedByUserId: 9,
    previousStatus: null,
    newStatus: 'PENDING',
    changedAt: '2026-09-27 16:40:00',
    notes: 'Order placed on web storefront.',
  },
  {
    historyId: 11,
    orderId: 4,
    changedByUserId: 9,
    previousStatus: 'PENDING',
    newStatus: 'AWAITING_PAYMENT_VERIFICATION',
    changedAt: '2026-09-27 17:05:00',
    notes: 'Customer uploaded deposit slip image.',
  },

  // Order 5 progression (Phone Order Dispatched)
  {
    historyId: 12,
    orderId: 5,
    changedByUserId: 4,
    previousStatus: null,
    newStatus: 'PENDING',
    changedAt: '2026-09-26 10:00:00',
    notes: 'Telephone order initiated by staff Nethmi on customer request.',
  },
  {
    historyId: 13,
    orderId: 5,
    changedByUserId: 4,
    previousStatus: 'PENDING',
    newStatus: 'PROCESSING',
    changedAt: '2026-09-26 10:30:00',
    notes: 'Customer confirmed phone order via SMS OTP validation.',
  },
  {
    historyId: 14,
    orderId: 5,
    changedByUserId: 3,
    previousStatus: 'PROCESSING',
    newStatus: 'DISPATCHED',
    changedAt: '2026-09-27 08:30:00',
    notes: 'Handed over to Pronto Logistics courier.',
  },

  // Order 6 progression (Courier Return & Refund)
  {
    historyId: 15,
    orderId: 6,
    changedByUserId: 11,
    previousStatus: null,
    newStatus: 'PENDING',
    changedAt: '2026-09-20 13:00:00',
    notes: 'Web order placed.',
  },
  {
    historyId: 16,
    orderId: 6,
    changedByUserId: 11,
    previousStatus: 'PENDING',
    newStatus: 'AWAITING_PAYMENT_VERIFICATION',
    changedAt: '2026-09-20 13:30:00',
    notes: 'Customer uploaded online bank payment confirmation.',
  },
  {
    historyId: 17,
    orderId: 6,
    changedByUserId: 2,
    previousStatus: 'AWAITING_PAYMENT_VERIFICATION',
    newStatus: 'PROCESSING',
    changedAt: '2026-09-20 14:00:00',
    notes: 'Payment verified by Chaminda.',
  },
  {
    historyId: 18,
    orderId: 6,
    changedByUserId: 3,
    previousStatus: 'PROCESSING',
    newStatus: 'DISPATCHED',
    changedAt: '2026-09-21 09:00:00',
    notes: 'Dispatched with Prompt Xpress.',
  },
  {
    historyId: 19,
    orderId: 6,
    changedByUserId: 2,
    previousStatus: 'DISPATCHED',
    newStatus: 'CANCELLED',
    changedAt: '2026-09-24 16:00:00',
    notes:
      'Courier failed 3 delivery attempts; recipient unreachable; parcel returned to store.',
  },
  {
    historyId: 20,
    orderId: 6,
    changedByUserId: 2,
    previousStatus: 'CANCELLED',
    newStatus: 'REFUNDED',
    changedAt: '2026-09-25 11:00:00',
    notes:
      'Full refund of LKR 6,300.00 remitted back to customer bank account.',
  },
];

const SEED_PAYMENTS: Payment[] = [
  {
    paymentId: 1,
    orderId: 1,
    amount: 8750.0,
    paymentMethod: 'CASH_ON_DELIVERY',
    paymentStatus: 'VERIFIED',
    createdAt: '2026-09-25 10:15:00',
  },
  {
    paymentId: 2,
    orderId: 2,
    amount: 11150.0,
    paymentMethod: 'BANK_TRANSFER',
    paymentStatus: 'VERIFIED',
    createdAt: '2026-09-26 14:20:00',
  },
  {
    paymentId: 3,
    orderId: 3,
    amount: 10700.0,
    paymentMethod: 'CASH_ON_DELIVERY',
    paymentStatus: 'VERIFIED',
    createdAt: '2026-09-27 11:30:00',
  },
  {
    paymentId: 4,
    orderId: 4,
    amount: 7200.0,
    paymentMethod: 'BANK_TRANSFER',
    paymentStatus: 'REJECTED',
    createdAt: '2026-09-27 16:40:00',
  },
  {
    paymentId: 5,
    orderId: 5,
    amount: 8750.0,
    paymentMethod: 'CASH_ON_DELIVERY',
    paymentStatus: 'PENDING',
    createdAt: '2026-09-26 10:00:00',
  },
  {
    paymentId: 6,
    orderId: 6,
    amount: 6300.0,
    paymentMethod: 'BANK_TRANSFER',
    paymentStatus: 'REFUNDED',
    createdAt: '2026-09-20 13:00:00',
  },
  {
    paymentId: 7,
    orderId: 7,
    amount: 4550.0,
    paymentMethod: 'BANK_TRANSFER',
    paymentStatus: 'PENDING',
    createdAt: '2026-09-28 14:00:00',
  },
];

const SEED_BANK_TRANSFER_PAYMENTS: BankTransferPayment[] = [
  {
    paymentId: 2,
    verifiedByStaffId: 3,
    bankName: 'Commercial Bank of Ceylon',
    depositReference: 'COMB-TXN-9948210',
    slipImageUrl: '/images/dfine-img-001.png',
    rejectionReason: null,
    verifiedAt: '2026-09-26 16:00:00',
  },
  {
    paymentId: 4,
    verifiedByStaffId: 3,
    bankName: 'Sampath Bank PLC',
    depositReference: 'SMP-REF-332190',
    slipImageUrl: '/images/dfine-img-002.png',
    rejectionReason:
      'Deposit slip shows LKR 5,000.00 instead of required total LKR 7,200.00; image is blurry and transaction date is cut off.',
    verifiedAt: '2026-09-27 17:30:00',
  },
  {
    paymentId: 6,
    verifiedByStaffId: 1,
    bankName: 'Hatton National Bank',
    depositReference: 'HNB-ONLINE-881203',
    slipImageUrl: '/images/dfine-img-003.jpg',
    rejectionReason: null,
    verifiedAt: '2026-09-20 14:00:00',
  },
  {
    paymentId: 7,
    verifiedByStaffId: null,
    bankName: 'Bank of Ceylon',
    depositReference: null,
    slipImageUrl: '/images/dfine-img-000.png',
    rejectionReason: null,
    verifiedAt: null,
  },
];

const SEED_COD_PAYMENTS: CashOnDeliveryPayment[] = [
  {
    paymentId: 1,
    cashCollectionStatus: 'REMITTED_TO_STORE',
    collectedAmount: 8750.0,
    courierRemittanceDate: '2026-09-29 10:00:00',
  },
  {
    paymentId: 3,
    cashCollectionStatus: 'REMITTED_TO_STORE',
    collectedAmount: 10700.0,
    courierRemittanceDate: '2026-09-27 11:30:00',
  },
  {
    paymentId: 5,
    cashCollectionStatus: 'UNCOLLECTED',
    collectedAmount: null,
    courierRemittanceDate: null,
  },
];

const SEED_DELIVERY_SHIPMENTS: DeliveryShipment[] = [
  {
    deliveryId: 1,
    orderId: 1,
    courierId: 1,
    trackingNumber: 'DMX-902144-LK',
    courierCharge: 350.0,
    deliveryStatus: 'DELIVERED',
    currentLocation: 'Delivered - Signed by K. Bandara',
    dispatchedAt: '2026-09-26 09:00:00',
    deliveredAt: '2026-09-27 15:45:00',
  },
  {
    deliveryId: 2,
    orderId: 5,
    courierId: 2,
    trackingNumber: 'PRN-773120-LK',
    courierCharge: 350.0,
    deliveryStatus: 'IN_TRANSIT',
    currentLocation: 'Gampaha Regional Sorting Hub',
    dispatchedAt: '2026-09-27 08:30:00',
    deliveredAt: null,
  },
  {
    deliveryId: 3,
    orderId: 6,
    courierId: 3,
    trackingNumber: 'PX-449102-LK',
    courierCharge: 400.0,
    deliveryStatus: 'RETURNED',
    currentLocation: 'D-Fine Warehouse Central (Returned)',
    dispatchedAt: '2026-09-21 09:00:00',
    deliveredAt: null,
  },
];

// Helper to deep-clone the canonical fixtures
function createFreshCanonicalSeed(): MockDatabaseSchema {
  return {
    version: 3,
    appUsers: JSON.parse(JSON.stringify(SEED_APP_USERS)),
    customers: JSON.parse(JSON.stringify(SEED_CUSTOMERS)),
    storeStaff: JSON.parse(JSON.stringify(SEED_STORE_STAFF)),
    userLoginAudits: JSON.parse(JSON.stringify(SEED_LOGIN_AUDITS)),
    passwordResetTokens: JSON.parse(JSON.stringify(SEED_PASSWORD_RESET_TOKENS)),
    categories: JSON.parse(JSON.stringify(SEED_CATEGORIES)),
    products: JSON.parse(JSON.stringify(SEED_PRODUCTS)),
    productVariants: JSON.parse(JSON.stringify(SEED_PRODUCT_VARIANTS)),
    restockLogs: JSON.parse(JSON.stringify(SEED_RESTOCK_LOGS)),
    productReviews: JSON.parse(JSON.stringify(SEED_PRODUCT_REVIEWS)),
    carts: JSON.parse(JSON.stringify(SEED_CARTS)),
    cartItems: JSON.parse(JSON.stringify(SEED_CART_ITEMS)),
    customerOrders: JSON.parse(JSON.stringify(SEED_CUSTOMER_ORDERS)),
    orderItems: JSON.parse(JSON.stringify(SEED_ORDER_ITEMS)),
    orderStatusHistories: JSON.parse(
      JSON.stringify(SEED_ORDER_STATUS_HISTORIES)
    ),
    invoices: JSON.parse(JSON.stringify(SEED_INVOICES)),
    payments: JSON.parse(JSON.stringify(SEED_PAYMENTS)),
    bankTransferPayments: JSON.parse(
      JSON.stringify(SEED_BANK_TRANSFER_PAYMENTS)
    ),
    cashOnDeliveryPayments: JSON.parse(JSON.stringify(SEED_COD_PAYMENTS)),
    courierPartners: JSON.parse(JSON.stringify(SEED_COURIER_PARTNERS)),
    deliveryShipments: JSON.parse(JSON.stringify(SEED_DELIVERY_SHIPMENTS)),
  };
}

// store implementation

export class MockDataStore {
  private data: MockDatabaseSchema;
  private subscribers: Set<StoreUpdateListener> = new Set();

  constructor() {
    this.data = this.loadFromStorage();
    this.bindStorageEventListener();
  }

    // Persistence & Lifecycle
  
  private loadFromStorage(): MockDatabaseSchema {
    if (typeof window === 'undefined') {
      return createFreshCanonicalSeed();
    }
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as MockDatabaseSchema;
        if (
          parsed &&
          parsed.version === 3 &&
          Array.isArray(parsed.products) &&
          Array.isArray(parsed.customerOrders)
        ) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[MockDataStore] Failed to read from localStorage, resetting to seeds:', e);
    }
    const fresh = createFreshCanonicalSeed();
    this.saveToStorage(fresh);
    return fresh;
  }

  private saveToStorage(data: MockDatabaseSchema): void {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.error('[MockDataStore] Failed to write to localStorage:', e);
      }
    }
  }

  private save(): void {
    this.saveToStorage(this.data);
  }

  private bindStorageEventListener(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event: StorageEvent) => {
        if (event.key === STORAGE_KEY && event.newValue) {
          try {
            this.data = JSON.parse(event.newValue) as MockDatabaseSchema;
            this.notifySubscribers('CROSS_TAB_STORAGE_SYNC');
          } catch (e) {
            console.error('[MockDataStore] Failed to process storage event:', e);
          }
        }
      });
    }
  }

  public subscribe(listener: StoreUpdateListener): () => void {
    this.subscribers.add(listener);
    return () => {
      this.subscribers.delete(listener);
    };
  }

  private notifySubscribers(type: string, payload?: unknown): void {
    const event = {
      type,
      payload,
      timestamp: Date.now(),
    };
    for (const listener of this.subscribers) {
      try {
        listener(event);
      } catch (err) {
        console.error('[MockDataStore] Error in subscriber listener:', err);
      }
    }
    if (typeof window !== 'undefined') {
      try {
        window.dispatchEvent(
          new CustomEvent(STORE_UPDATE_EVENT, { detail: event })
        );
      } catch (err) {
        console.error('[MockDataStore] Error dispatching custom event:', err);
      }
    }
  }

  public resetDatabase(): void {
    this.data = createFreshCanonicalSeed();
    this.save();
    this.notifySubscribers('DATABASE_RESET');
  }

  public resetToSeeds(): void {
    this.resetDatabase();
  }

  public getRawData(): MockDatabaseSchema {
    return JSON.parse(JSON.stringify(this.data));
  }

    // Module 1: IAM, Users, Customers, Staff, Audits & Reset Tokens
  
  public getUsers(): AppUser[] {
    return [...this.data.appUsers];
  }

  public getUserById(userId: number): AppUser | undefined {
    return this.data.appUsers.find((u) => u.userId === userId);
  }

  public getUserByEmail(email: string): AppUser | undefined {
    return this.data.appUsers.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
  }

  public getCustomers(): Customer[] {
    return [...this.data.customers];
  }

  public getCustomerById(customerId: number): Customer | undefined {
    return this.data.customers.find((c) => c.customerId === customerId);
  }

  public getCustomerByUserId(userId: number): Customer | undefined {
    return this.data.customers.find((c) => c.userId === userId);
  }

  public createCustomer(
    input: Omit<Customer, 'customerId'>
  ): Customer {
    const nextId =
      this.data.customers.reduce((max, c) => Math.max(max, c.customerId), 0) + 1;
    const newCustomer: Customer = {
      customerId: nextId,
      ...input,
    };
    this.data.customers.push(newCustomer);
    this.save();
    this.notifySubscribers('CUSTOMER_CREATED', newCustomer);
    return newCustomer;
  }

  public updateCustomer(
    customerId: number,
    updates: Partial<Customer>
  ): Customer {
    const idx = this.data.customers.findIndex(
      (c) => c.customerId === customerId
    );
    if (idx === -1) {
      throw new Error(`Customer with ID ${customerId} not found.`);
    }
    const updated = {
      ...this.data.customers[idx],
      ...updates,
      customerId, // immutable PK
    };
    this.data.customers[idx] = updated;
    this.save();
    this.notifySubscribers('CUSTOMER_UPDATED', updated);
    return updated;
  }

  public getStoreStaff(): StoreStaff[] {
    return [...this.data.storeStaff];
  }

  public getStaffById(staffId: number): StoreStaff | undefined {
    return this.data.storeStaff.find((s) => s.staffId === staffId);
  }

  public getStaffByUserId(userId: number): StoreStaff | undefined {
    return this.data.storeStaff.find((s) => s.userId === userId);
  }

  public getLoginAudits(): UserLoginAudit[] {
    return [...this.data.userLoginAudits];
  }

  public recordLoginAudit(dto: RecordLoginAuditDto): UserLoginAudit {
    const nextId =
      this.data.userLoginAudits.reduce((max, a) => Math.max(max, a.auditId), 0) +
      1;
    const record: UserLoginAudit = {
      auditId: nextId,
      userId: dto.userId ?? null,
      attemptedEmail: dto.attemptedEmail,
      ipAddress: dto.ipAddress || '127.0.0.1',
      loginTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      loginStatus: dto.loginStatus,
    };
    this.data.userLoginAudits.unshift(record);
    this.save();
    this.notifySubscribers('LOGIN_AUDIT_RECORDED', record);
    return record;
  }

  public getPasswordResetTokens(): PasswordResetToken[] {
    return [...this.data.passwordResetTokens];
  }

  public createPasswordResetToken(userId: number): PasswordResetToken {
    const nextId =
      this.data.passwordResetTokens.reduce(
        (max, t) => Math.max(max, t.resetId),
        0
      ) + 1;
    // hash generator for tokens
    const tokenHash = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    const now = new Date();
    const expires = new Date(now.getTime() + 15 * 60 * 1000); // 15 mins expiry
    const record: PasswordResetToken = {
      resetId: nextId,
      userId,
      tokenHash,
      createdAt: now.toISOString().replace('T', ' ').substring(0, 19),
      expiresAt: expires.toISOString().replace('T', ' ').substring(0, 19),
      usedAt: null,
    };
    this.data.passwordResetTokens.push(record);
    this.save();
    this.notifySubscribers('PASSWORD_RESET_TOKEN_CREATED', record);
    return record;
  }

  public verifyAndConsumeResetToken(tokenHash: string): {
    valid: boolean;
    user?: AppUser;
    message?: string;
  } {
    const token = this.data.passwordResetTokens.find(
      (t) => t.tokenHash === tokenHash
    );
    if (!token) {
      return { valid: false, message: 'Invalid or non-existent token.' };
    }
    if (token.usedAt) {
      return { valid: false, message: 'Token has already been consumed.' };
    }
    const expiry = new Date(token.expiresAt.replace(' ', 'T')).getTime();
    if (Date.now() > expiry) {
      return { valid: false, message: 'Password reset token has expired.' };
    }
    token.usedAt = new Date()
      .toISOString()
      .replace('T', ' ')
      .substring(0, 19);
    this.save();
    const user = this.getUserById(token.userId);
    this.notifySubscribers('PASSWORD_RESET_TOKEN_CONSUMED', { tokenHash });
    return { valid: true, user };
  }

  public authenticate(
    email: string,
    _passwordHashOrPlainText: string,
    ipAddress = '127.0.0.1'
  ): {
    success: boolean;
    message?: string;
    user?: AppUser;
    customer?: Customer;
    staff?: StoreStaff;
  } {
    const user = this.getUserByEmail(email);
    if (!user) {
      this.recordLoginAudit({
        attemptedEmail: email,
        ipAddress,
        loginStatus: 'FAILED_BAD_CREDENTIALS',
      });
      return { success: false, message: 'Invalid credentials provided.' };
    }

    if (user.accountStatus !== 'ACTIVE') {
      this.recordLoginAudit({
        userId: user.userId,
        attemptedEmail: email,
        ipAddress,
        loginStatus: 'FAILED_LOCKED',
      });
      return {
        success: false,
        message: `Account is ${user.accountStatus.toLowerCase()}. Contact store administration.`,
      };
    }

    this.recordLoginAudit({
      userId: user.userId,
      attemptedEmail: email,
      ipAddress,
      loginStatus: 'SUCCESS',
    });

    const customer = this.getCustomerByUserId(user.userId);
    const staff = this.getStaffByUserId(user.userId);

    return {
      success: true,
      user,
      customer,
      staff,
    };
  }

    // Module 2: Categories, Products, Variants, Restock & Reviews
  
  public getCategories(): Category[] {
    return [...this.data.categories];
  }

  public getCategoryById(categoryId: number): Category | undefined {
    return this.data.categories.find((c) => c.categoryId === categoryId);
  }

  public getProducts(): Product[] {
    return [...this.data.products];
  }

  public getProductById(productId: number): Product | undefined {
    return this.data.products.find((p) => p.productId === productId);
  }

  public getVariants(): ProductVariant[] {
    return [...this.data.productVariants];
  }

  public getVariantById(variantId: number): ProductVariant | undefined {
    return this.data.productVariants.find((v) => v.variantId === variantId);
  }

  public getVariantsByProduct(productId: number): ProductVariant[] {
    return this.data.productVariants.filter((v) => v.productId === productId);
  }

  public getVariantWithDetails(
    variantId: number
  ): ProductVariantWithDetails | undefined {
    const variant = this.getVariantById(variantId);
    if (!variant) return undefined;
    const product = this.getProductById(variant.productId);
    if (!product) return undefined;
    const category = this.getCategoryById(product.categoryId);
    return {
      ...variant,
      product,
      category,
    };
  }

  public getProductWithVariants(
    productId: number
  ): ProductWithVariants | undefined {
    const product = this.getProductById(productId);
    if (!product) return undefined;
    const category = this.getCategoryById(product.categoryId);
    const variants = this.getVariantsByProduct(productId);
    const reviews = this.getReviewsByProduct(productId, true);

    const totalStock = variants.reduce((sum, v) => sum + v.stockQuantity, 0);
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return {
      ...product,
      category,
      variants,
      reviews,
      averageRating: Number(avgRating.toFixed(1)),
      reviewCount: reviews.length,
      totalStock,
      inStock: totalStock > 0,
    };
  }

  public getProductsWithVariants(): ProductWithVariants[] {
    return this.data.products.map(
      (p) => this.getProductWithVariants(p.productId)!
    );
  }

  public createProduct(
    productInput: Omit<Product, 'productId' | 'createdAt'>,
    variantsInput: Omit<
      ProductVariant,
      'variantId' | 'productId' | 'lockVersion'
    >[] = []
  ): ProductWithVariants {
    const nextProdId =
      this.data.products.reduce((max, p) => Math.max(max, p.productId), 0) + 1;
    const newProduct: Product = {
      productId: nextProdId,
      ...productInput,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    this.data.products.push(newProduct);

    let nextVarId =
      this.data.productVariants.reduce(
        (max, v) => Math.max(max, v.variantId),
        0
      ) + 1;

    const createdVariants: ProductVariant[] = variantsInput.map((vi) => ({
      variantId: nextVarId++,
      productId: nextProdId,
      lockVersion: 1,
      ...vi,
    }));

    this.data.productVariants.push(...createdVariants);
    this.save();
    this.notifySubscribers('PRODUCT_CREATED', {
      productId: nextProdId,
      variantsCount: createdVariants.length,
    });
    return this.getProductWithVariants(nextProdId)!;
  }

  public updateProduct(
    productId: number,
    updates: Partial<Product>
  ): Product {
    const idx = this.data.products.findIndex((p) => p.productId === productId);
    if (idx === -1) {
      throw new Error(`Product with ID ${productId} not found.`);
    }
    const updated = {
      ...this.data.products[idx],
      ...updates,
      productId, // immutable PK
    };
    this.data.products[idx] = updated;
    this.save();
    this.notifySubscribers('PRODUCT_UPDATED', updated);
    return updated;
  }

  public updateVariant(
    variantId: number,
    updates: Partial<ProductVariant>,
    expectedLockVersion?: number
  ): ProductVariant {
    const idx = this.data.productVariants.findIndex(
      (v) => v.variantId === variantId
    );
    if (idx === -1) {
      throw new Error(`Variant with ID ${variantId} not found.`);
    }
    const current = this.data.productVariants[idx];

    // Optimistic locking verification
    if (
      expectedLockVersion !== undefined &&
      current.lockVersion !== expectedLockVersion
    ) {
      throw new OptimisticLockError(
        current.sku,
        expectedLockVersion,
        current.lockVersion
      );
    }

    if (
      updates.stockQuantity !== undefined &&
      updates.stockQuantity < 0
    ) {
      throw new Error(
        `Negative stock violation on SKU ${current.sku}: cannot set to ${updates.stockQuantity}.`
      );
    }

    const updated: ProductVariant = {
      ...current,
      ...updates,
      variantId, // immutable PK
      productId: current.productId, // immutable FK
      sku: updates.sku || current.sku,
      lockVersion: current.lockVersion + 1, // optimistic version bump
    };

    this.data.productVariants[idx] = updated;
    this.save();
    this.notifySubscribers('VARIANT_UPDATED', updated);
    return updated;
  }

  public restockVariant(dto: RestockLogDto): {
    variant: ProductVariant;
    restockLog: RestockLog;
  } {
    if (dto.quantityAdded <= 0) {
      throw new Error('Quantity added must be strictly positive (> 0).');
    }
    const variant = this.getVariantById(dto.variantId);
    if (!variant) {
      throw new Error(`Variant with ID ${dto.variantId} not found.`);
    }

    // Atomic increment
    const updatedVariant = this.updateVariant(variant.variantId, {
      stockQuantity: variant.stockQuantity + dto.quantityAdded,
    });

    const nextLogId =
      this.data.restockLogs.reduce((max, r) => Math.max(max, r.restockId), 0) +
      1;
    const restockLog: RestockLog = {
      restockId: nextLogId,
      variantId: variant.variantId,
      receivedByStaffId: dto.receivedByStaffId,
      quantityAdded: dto.quantityAdded,
      restockedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      notes: dto.notes || 'Warehouse intake batch completed successfully.',
    };

    this.data.restockLogs.push(restockLog);
    this.save();
    this.notifySubscribers('STOCK_RESTOCKED', {
      variantId: variant.variantId,
      quantityAdded: dto.quantityAdded,
      newStock: updatedVariant.stockQuantity,
    });

    return { variant: updatedVariant, restockLog };
  }

  public getRestockLogs(): RestockLog[] {
    return [...this.data.restockLogs];
  }

  public getRestockLogsByVariant(variantId: number): RestockLog[] {
    return this.data.restockLogs.filter((r) => r.variantId === variantId);
  }

  public getReviews(): ProductReview[] {
    return [...this.data.productReviews];
  }

  public getReviewsByProduct(
    productId: number,
    approvedOnly = true
  ): ProductReview[] {
    return this.data.productReviews.filter((r) => {
      if (r.productId !== productId) return false;
      return approvedOnly ? r.isApproved : true;
    });
  }

  public createReview(dto: CreateReviewDto): ProductReview {
    if (dto.rating < 1 || dto.rating > 5) {
      throw new Error('Rating must be an integer between 1 and 5.');
    }

    // Check duplicate review constraint (product_id, customer_id)
    const existingIdx = this.data.productReviews.findIndex(
      (r) => r.productId === dto.productId && r.customerId === dto.customerId
    );

    const isSpam =
      (dto.reviewComment &&
        (dto.reviewComment.includes('http://') ||
          dto.reviewComment.includes('https://') ||
          dto.reviewComment.toLowerCase().includes('spam'))) ??
      false;

    const isApproved =
      dto.autoApprove !== undefined ? dto.autoApprove : !isSpam;

    if (existingIdx !== -1) {
      const updated: ProductReview = {
        ...this.data.productReviews[existingIdx],
        rating: dto.rating,
        reviewComment: dto.reviewComment || null,
        isApproved,
      };
      this.data.productReviews[existingIdx] = updated;
      this.save();
      this.notifySubscribers('REVIEW_UPDATED', updated);
      return updated;
    }

    const nextId =
      this.data.productReviews.reduce((max, r) => Math.max(max, r.reviewId), 0) +
      1;
    const newReview: ProductReview = {
      reviewId: nextId,
      productId: dto.productId,
      customerId: dto.customerId,
      rating: dto.rating,
      reviewComment: dto.reviewComment || null,
      isApproved,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    this.data.productReviews.push(newReview);
    this.save();
    this.notifySubscribers('REVIEW_CREATED', newReview);
    return newReview;
  }

  public moderateReview(
    reviewId: number,
    isApproved: boolean
  ): ProductReview {
    const idx = this.data.productReviews.findIndex(
      (r) => r.reviewId === reviewId
    );
    if (idx === -1) {
      throw new Error(`Review with ID ${reviewId} not found.`);
    }
    this.data.productReviews[idx].isApproved = isApproved;
    this.save();
    this.notifySubscribers('REVIEW_MODERATED', { reviewId, isApproved });
    return this.data.productReviews[idx];
  }

    // Module 3: Cart & Cart Items
  
  public getCarts(): Cart[] {
    return [...this.data.carts];
  }

  public getCartById(cartId: number): Cart | undefined {
    return this.data.carts.find((c) => c.cartId === cartId);
  }

  public getOrCreateCart(identifier: {
    customerId?: number | null;
    guestToken?: string | null;
  }): CartWithDetails {
    let cart: Cart | undefined;
    if (identifier.customerId) {
      cart = this.data.carts.find(
        (c) => c.customerId === identifier.customerId
      );
    } else if (identifier.guestToken) {
      cart = this.data.carts.find(
        (c) => c.guestToken === identifier.guestToken
      );
    }

    if (!cart) {
      const nextId =
        this.data.carts.reduce((max, c) => Math.max(max, c.cartId), 0) + 1;
      const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
      cart = {
        cartId: nextId,
        customerId: identifier.customerId ?? null,
        guestToken: identifier.guestToken ?? null,
        createdAt: now,
        updatedAt: now,
      };
      this.data.carts.push(cart);
      this.save();
      this.notifySubscribers('CART_CREATED', cart);
    }

    return this.getCartDetails(cart.cartId)!;
  }

  public getCartDetails(cartId: number): CartWithDetails | undefined {
    const cart = this.getCartById(cartId);
    if (!cart) return undefined;

    const rawItems = this.data.cartItems.filter((i) => i.cartId === cartId);
    const items = rawItems
      .map((item) => {
        const variant = this.getVariantById(item.variantId);
        if (!variant) return null;
        const product = this.getProductById(variant.productId);
        if (!product) return null;
        return {
          ...item,
          variant,
          product,
        };
      })
      .filter((i): i is NonNullable<typeof i> => i !== null);

    const subtotal = items.reduce(
      (sum, item) => sum + item.product.basePrice * item.quantity,
      0
    );
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      ...cart,
      items,
      subtotal,
      itemCount,
    };
  }

  public addToCart(
    cartId: number,
    variantId: number,
    quantity: number,
    customImageUrl?: string | null
  ): CartWithDetails {
    if (quantity <= 0) {
      throw new Error('Cart quantity must be greater than zero.');
    }
    const cart = this.getCartById(cartId);
    if (!cart) {
      throw new Error(`Cart with ID ${cartId} not found.`);
    }
    const variant = this.getVariantById(variantId);
    if (!variant) {
      throw new Error(`Variant with ID ${variantId} not found.`);
    }

    const existingIdx = this.data.cartItems.findIndex(
      (i) => i.cartId === cartId && i.variantId === variantId
    );

    const targetQuantity =
      existingIdx !== -1
        ? this.data.cartItems[existingIdx].quantity + quantity
        : quantity;

    if (targetQuantity > variant.stockQuantity) {
      throw new InsufficientStockError(
        variant.sku,
        targetQuantity,
        variant.stockQuantity
      );
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (existingIdx !== -1) {
      this.data.cartItems[existingIdx].quantity = targetQuantity;
      if (customImageUrl) {
        this.data.cartItems[existingIdx].customImageUrl = customImageUrl;
      }
    } else {
      const nextId =
        this.data.cartItems.reduce(
          (max, i) => Math.max(max, i.cartItemId),
          0
        ) + 1;
      this.data.cartItems.push({
        cartItemId: nextId,
        cartId,
        variantId,
        quantity,
        customImageUrl: customImageUrl || null,
        addedAt: now,
      });
    }

    cart.updatedAt = now;
    this.save();
    this.notifySubscribers('CART_UPDATED', { cartId, variantId, quantity });
    return this.getCartDetails(cartId)!;
  }

  public updateCartItemQuantity(
    cartItemId: number,
    quantity: number
  ): CartWithDetails {
    const idx = this.data.cartItems.findIndex(
      (i) => i.cartItemId === cartItemId
    );
    if (idx === -1) {
      throw new Error(`Cart item with ID ${cartItemId} not found.`);
    }
    const item = this.data.cartItems[idx];
    const cartId = item.cartId;

    if (quantity <= 0) {
      this.data.cartItems.splice(idx, 1);
    } else {
      const variant = this.getVariantById(item.variantId);
      if (variant && quantity > variant.stockQuantity) {
        throw new InsufficientStockError(
          variant.sku,
          quantity,
          variant.stockQuantity
        );
      }
      this.data.cartItems[idx].quantity = quantity;
    }

    const cart = this.getCartById(cartId);
    if (cart) {
      cart.updatedAt = new Date()
        .toISOString()
        .replace('T', ' ')
        .substring(0, 19);
    }

    this.save();
    this.notifySubscribers('CART_UPDATED', { cartId, cartItemId, quantity });
    return this.getCartDetails(cartId)!;
  }

  public removeCartItem(cartItemId: number): CartWithDetails {
    return this.updateCartItemQuantity(cartItemId, 0);
  }

  public clearCart(cartId: number): void {
    this.data.cartItems = this.data.cartItems.filter(
      (i) => i.cartId !== cartId
    );
    const cart = this.getCartById(cartId);
    if (cart) {
      cart.updatedAt = new Date()
        .toISOString()
        .replace('T', ' ')
        .substring(0, 19);
    }
    this.save();
    this.notifySubscribers('CART_CLEARED', { cartId });
  }

    // Module 3 & 4: Orders, Line Items, History, Invoices & Payments
  
  public getOrders(): CustomerOrder[] {
    return [...this.data.customerOrders];
  }

  public getOrderById(orderId: number): CustomerOrder | undefined {
    return this.data.customerOrders.find((o) => o.orderId === orderId);
  }

  public getOrderByNumber(orderNumber: string): CustomerOrder | undefined {
    return this.data.customerOrders.find((o) => o.orderNumber === orderNumber);
  }

  public getOrdersByCustomer(customerId: number): CustomerOrder[] {
    return this.data.customerOrders.filter(
      (o) => o.customerId === customerId
    );
  }

  public getOrderDetails(
    orderId: number
  ): CustomerOrderWithDetails | undefined {
    const order = this.getOrderById(orderId);
    if (!order) return undefined;

    const rawItems = this.data.orderItems.filter((i) => i.orderId === orderId);
    const items = rawItems.map((item) => {
      const variant = this.getVariantById(item.variantId);
      const product = variant
        ? this.getProductById(variant.productId)
        : undefined;
      return {
        ...item,
        variant,
        product,
      };
    });

    const payment = this.getPaymentByOrderId(orderId);
    const bankTransfer = payment
      ? this.getBankTransferPayment(payment.paymentId)
      : undefined;
    const cod = payment
      ? this.getCashOnDeliveryPayment(payment.paymentId)
      : undefined;

    const paymentWithDetails = payment
      ? {
          ...payment,
          bankTransfer,
          cod,
        }
      : undefined;

    const shipment = this.getShipmentByOrderId(orderId);
    const courier = shipment
      ? this.getCourierPartnerById(shipment.courierId)
      : undefined;
    const shipmentWithCourier = shipment
      ? {
          ...shipment,
          courier,
        }
      : undefined;

    const invoice = this.getInvoiceByOrderId(orderId);
    const statusHistory = this.data.orderStatusHistories
      .filter((h) => h.orderId === orderId)
      .sort((a, b) => a.historyId - b.historyId);

    const customer = this.getCustomerById(order.customerId);
    const staff = order.assistedByStaffId
      ? this.getStaffById(order.assistedByStaffId)
      : undefined;

    return {
      ...order,
      items,
      payment: paymentWithDetails,
      shipment: shipmentWithCourier,
      invoice,
      statusHistory,
      customer,
      assistedByStaff: staff,
    };
  }

  public getOrdersWithDetails(filter?: {
    customerId?: number;
    status?: OrderStatus;
  }): CustomerOrderWithDetails[] {
    return this.data.customerOrders
      .filter((o) => {
        if (filter?.customerId && o.customerId !== filter.customerId) {
          return false;
        }
        if (filter?.status && o.orderStatus !== filter.status) {
          return false;
        }
        return true;
      })
      .map((o) => this.getOrderDetails(o.orderId)!)
      .sort((a, b) => b.orderId - a.orderId);
  }

  /**
   * ATOMIC ORDER PLACEMENT TRANSACTION
   * 1. Validates all variant stocks.
   * 2. Decrements stocks & bumps lockVersion.
   * 3. Calculates exact subtotal and shipping fees.
   * 4. Creates CustomerOrder & OrderItems.
   * 5. Creates Payment (and BankTransfer/COD subtype).
   * 6. Generates Invoice.
   * 7. Appends OrderStatusHistory audit entry.
   * 8. Clears shopping cart if cartId provided.
   */
  public placeOrder(dto: CreateOrderDto): CustomerOrderWithDetails {
    if (!dto.items || dto.items.length === 0) {
      throw new Error('Order must contain at least one line item.');
    }

    // Step 1: Pre-validation of inventory stocks
    const variantItemPairs: Array<{
      variant: ProductVariant;
      product: Product;
      quantity: number;
      customImageUrl?: string | null;
      customPrintNotes?: string | null;
    }> = [];

    for (const line of dto.items) {
      const variant = this.getVariantById(line.variantId);
      if (!variant) {
        throw new Error(
          `Product variant with ID ${line.variantId} does not exist.`
        );
      }
      if (variant.stockQuantity < line.quantity) {
        throw new InsufficientStockError(
          variant.sku,
          line.quantity,
          variant.stockQuantity
        );
      }
      const product = this.getProductById(variant.productId);
      if (!product) {
        throw new Error(`Product with ID ${variant.productId} not found.`);
      }
      variantItemPairs.push({
        variant,
        product,
        quantity: line.quantity,
        customImageUrl: line.customImageUrl,
        customPrintNotes: line.customPrintNotes,
      });
    }

    // Step 2: Atomic inventory decrement with lock version increment
    for (const pair of variantItemPairs) {
      this.updateVariant(pair.variant.variantId, {
        stockQuantity: pair.variant.stockQuantity - pair.quantity,
      });
    }

    // Step 3: Calculation of financial totals
    const subtotal = variantItemPairs.reduce(
      (sum, p) => sum + p.product.basePrice * p.quantity,
      0
    );
    const shippingFee =
      dto.shippingFee !== undefined
        ? dto.shippingFee
        : dto.orderSource === 'IN_STORE_POS'
        ? 0.0
        : 350.0;
    const totalPayable = subtotal + shippingFee;

    // Step 4: Create CustomerOrder
    const nextOrderId =
      this.data.customerOrders.reduce(
        (max, o) => Math.max(max, o.orderId),
        0
      ) + 1;
    const orderNumber = `ORD-2026-${1000 + nextOrderId}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    let initialStatus: OrderStatus = 'PENDING';
    if (dto.orderSource === 'IN_STORE_POS') {
      initialStatus = 'DELIVERED';
    } else if (dto.paymentMethod === 'BANK_TRANSFER') {
      initialStatus = dto.slipImageUrl
        ? 'AWAITING_PAYMENT_VERIFICATION'
        : 'PENDING';
    }

    const order: CustomerOrder = {
      orderId: nextOrderId,
      orderNumber,
      customerId: dto.customerId,
      assistedByStaffId: dto.assistedByStaffId ?? null,
      orderDate: now,
      orderSource: dto.orderSource,
      orderStatus: initialStatus,
      subtotalAmount: subtotal,
      shippingFee,
      totalPayable,
      customerName: dto.customerName,
      customerEmail: dto.customerEmail,
      customerPhone: dto.customerPhone,
      shippingAddressSnapshot: dto.shippingAddress,
      shippingDistrictSnapshot: dto.shippingDistrict,
      shippingProvinceSnapshot: dto.shippingProvince,
    };
    this.data.customerOrders.push(order);

    // Step 5: Create OrderItems
    let nextItemId =
      this.data.orderItems.reduce(
        (max, i) => Math.max(max, i.orderItemId),
        0
      ) + 1;

    for (const pair of variantItemPairs) {
      const lineSubtotal = pair.product.basePrice * pair.quantity;
      const orderItem: OrderItem = {
        orderItemId: nextItemId++,
        orderId: nextOrderId,
        variantId: pair.variant.variantId,
        quantity: pair.quantity,
        unitPrice: pair.product.basePrice,
        subtotal: lineSubtotal,
        customImageUrl: pair.customImageUrl || null,
        customPrintNotes: pair.customPrintNotes || null,
      };
      this.data.orderItems.push(orderItem);
    }

    // Step 6: Create Payment record
    const nextPaymentId =
      this.data.payments.reduce(
        (max, p) => Math.max(max, p.paymentId),
        0
      ) + 1;

    const isPosInstantPaid = dto.orderSource === 'IN_STORE_POS';
    const payment: Payment = {
      paymentId: nextPaymentId,
      orderId: nextOrderId,
      amount: totalPayable,
      paymentMethod: dto.paymentMethod,
      paymentStatus: isPosInstantPaid ? 'VERIFIED' : 'PENDING',
      createdAt: now,
    };
    this.data.payments.push(payment);

    // Step 7: Create Payment Subtype (Bank Transfer vs COD)
    if (dto.paymentMethod === 'BANK_TRANSFER') {
      const bankTransfer: BankTransferPayment = {
        paymentId: nextPaymentId,
        verifiedByStaffId: null,
        bankName: dto.bankName || 'Commercial Bank of Ceylon',
        depositReference: dto.depositReference || null,
        slipImageUrl:
          dto.slipImageUrl ||
          '/images/dfine-img-000.png',
        rejectionReason: null,
        verifiedAt: null,
      };
      this.data.bankTransferPayments.push(bankTransfer);
    } else {
      const cod: CashOnDeliveryPayment = {
        paymentId: nextPaymentId,
        cashCollectionStatus: isPosInstantPaid
          ? 'REMITTED_TO_STORE'
          : 'UNCOLLECTED',
        collectedAmount: isPosInstantPaid ? totalPayable : null,
        courierRemittanceDate: isPosInstantPaid ? now : null,
      };
      this.data.cashOnDeliveryPayments.push(cod);
    }

    // Step 8: Generate Invoice
    const nextInvoiceId =
      this.data.invoices.reduce(
        (max, inv) => Math.max(max, inv.invoiceId),
        0
      ) + 1;
    const invoiceNumber = `INV-2026-${String(nextInvoiceId).padStart(4, '0')}`;
    const invoice: Invoice = {
      invoiceId: nextInvoiceId,
      orderId: nextOrderId,
      invoiceNumber,
      issuedAt: now,
      pdfStoragePath: `/storage/invoices/2026/10/${invoiceNumber}.pdf`,
    };
    this.data.invoices.push(invoice);

    // Step 9: Order Status History
    const nextHistoryId =
      this.data.orderStatusHistories.reduce(
        (max, h) => Math.max(max, h.historyId),
        0
      ) + 1;
    const initialNote =
      dto.orderSource === 'IN_STORE_POS'
        ? 'In-store POS counter sale completed; inventory handed to customer.'
        : dto.notes || `Order created via ${dto.orderSource} checkout.`;

    this.data.orderStatusHistories.push({
      historyId: nextHistoryId,
      orderId: nextOrderId,
      changedByUserId: dto.assistedByStaffId
        ? this.getStaffById(dto.assistedByStaffId)?.userId ?? null
        : this.getCustomerById(dto.customerId)?.userId ?? null,
      previousStatus: null,
      newStatus: initialStatus,
      changedAt: now,
      notes: initialNote,
    });

    // Step 10: Clear shopping cart if linked
    if (dto.cartIdToClear) {
      this.clearCart(dto.cartIdToClear);
    }

    this.save();
    this.notifySubscribers('ORDER_PLACED', {
      orderId: nextOrderId,
      orderNumber,
      totalPayable,
    });

    return this.getOrderDetails(nextOrderId)!;
  }

  public updateOrderStatus(
    dto: UpdateOrderStatusDto
  ): CustomerOrderWithDetails {
    const order = this.getOrderById(dto.orderId);
    if (!order) {
      throw new Error(`Order with ID ${dto.orderId} not found.`);
    }

    if (dto.newStatus === 'CANCELLED') {
      return this.cancelOrder(dto.orderId, dto.changedByUserId, dto.notes);
    }

    const prevStatus = order.orderStatus;
    if (prevStatus === dto.newStatus) {
      return this.getOrderDetails(dto.orderId)!;
    }

    order.orderStatus = dto.newStatus;

    const nextHistoryId =
      this.data.orderStatusHistories.reduce(
        (max, h) => Math.max(max, h.historyId),
        0
      ) + 1;
    this.data.orderStatusHistories.push({
      historyId: nextHistoryId,
      orderId: dto.orderId,
      changedByUserId: dto.changedByUserId ?? null,
      previousStatus: prevStatus,
      newStatus: dto.newStatus,
      changedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      notes: dto.notes || `Order status shifted to ${dto.newStatus}`,
    });

    this.save();
    this.notifySubscribers('ORDER_STATUS_UPDATED', {
      orderId: dto.orderId,
      previousStatus: prevStatus,
      newStatus: dto.newStatus,
    });

    return this.getOrderDetails(dto.orderId)!;
  }

  /**
   * ATOMIC ORDER CANCELLATION & STOCK RESTORATION
   * Restores items back into product variant stock, increments lockVersion,
   * updates order status to CANCELLED, and appends audit history.
   */
  public cancelOrder(
    orderId: number,
    changedByUserId?: number | null,
    reason?: string
  ): CustomerOrderWithDetails {
    const order = this.getOrderById(orderId);
    if (!order) {
      throw new Error(`Order with ID ${orderId} not found.`);
    }

    if (order.orderStatus === 'CANCELLED' || order.orderStatus === 'REFUNDED') {
      return this.getOrderDetails(orderId)!;
    }

    if (order.orderStatus === 'DELIVERED') {
      throw new Error(
        'Cannot cancel an order that has already been delivered to the customer.'
      );
    }

    // Step 1: Stock restoration
    const items = this.data.orderItems.filter((i) => i.orderId === orderId);
    for (const item of items) {
      const variant = this.getVariantById(item.variantId);
      if (variant) {
        this.updateVariant(variant.variantId, {
          stockQuantity: variant.stockQuantity + item.quantity,
        });
      }
    }

    // Step 2: Order status update
    const prevStatus = order.orderStatus;
    order.orderStatus = 'CANCELLED';

    // Step 3: Payment status update if applicable
    const payment = this.getPaymentByOrderId(orderId);
    if (payment) {
      payment.paymentStatus =
        payment.paymentStatus === 'VERIFIED' ? 'REFUNDED' : 'FAILED';
    }

    // Step 4: Status History Log
    const nextHistoryId =
      this.data.orderStatusHistories.reduce(
        (max, h) => Math.max(max, h.historyId),
        0
      ) + 1;
    this.data.orderStatusHistories.push({
      historyId: nextHistoryId,
      orderId,
      changedByUserId: changedByUserId ?? null,
      previousStatus: prevStatus,
      newStatus: 'CANCELLED',
      changedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      notes:
        reason ||
        'Order cancelled. Stock quantities restored to inventory and lock versions incremented.',
    });

    this.save();
    this.notifySubscribers('ORDER_CANCELLED', { orderId, reason });
    return this.getOrderDetails(orderId)!;
  }

    // Module 4: Payments, Slips, Invoices, Couriers & Shipments
  
  public getInvoices(): Invoice[] {
    return [...this.data.invoices];
  }

  public getInvoiceById(invoiceId: number): Invoice | undefined {
    return this.data.invoices.find((inv) => inv.invoiceId === invoiceId);
  }

  public getInvoiceByOrderId(orderId: number): Invoice | undefined {
    return this.data.invoices.find((inv) => inv.orderId === orderId);
  }

  public getInvoiceByNumber(invoiceNumber: string): Invoice | undefined {
    return this.data.invoices.find(
      (inv) => inv.invoiceNumber === invoiceNumber
    );
  }

  public getPayments(): Payment[] {
    return [...this.data.payments];
  }

  public getPaymentById(paymentId: number): Payment | undefined {
    return this.data.payments.find((p) => p.paymentId === paymentId);
  }

  public getPaymentByOrderId(orderId: number): Payment | undefined {
    return this.data.payments.find((p) => p.orderId === orderId);
  }

  public getBankTransferPayment(
    paymentId: number
  ): BankTransferPayment | undefined {
    return this.data.bankTransferPayments.find(
      (p) => p.paymentId === paymentId
    );
  }

  public getCashOnDeliveryPayment(
    paymentId: number
  ): CashOnDeliveryPayment | undefined {
    return this.data.cashOnDeliveryPayments.find(
      (p) => p.paymentId === paymentId
    );
  }

  public submitPaymentSlip(
    orderId: number,
    slipImageUrl: string,
    bankName?: string,
    depositReference?: string
  ): CustomerOrderWithDetails {
    const payment = this.getPaymentByOrderId(orderId);
    if (!payment) {
      throw new Error(`Payment for order ${orderId} does not exist.`);
    }
    const btPayment = this.getBankTransferPayment(payment.paymentId);
    if (!btPayment) {
      throw new Error(
        `Payment ${payment.paymentId} is not a bank transfer record.`
      );
    }

    btPayment.slipImageUrl = slipImageUrl;
    if (bankName) btPayment.bankName = bankName;
    if (depositReference) btPayment.depositReference = depositReference;
    btPayment.rejectionReason = null;
    if (payment.paymentStatus === 'REJECTED') {
      payment.paymentStatus = 'PENDING';
    }

    const order = this.getOrderById(orderId);
    if (order && (order.orderStatus === 'PENDING' || order.orderStatus === 'AWAITING_PAYMENT_VERIFICATION')) {
      order.orderStatus = 'AWAITING_PAYMENT_VERIFICATION';
      const nextHistoryId =
        this.data.orderStatusHistories.reduce(
          (max, h) => Math.max(max, h.historyId),
          0
        ) + 1;
      this.data.orderStatusHistories.push({
        historyId: nextHistoryId,
        orderId,
        changedByUserId: null,
        previousStatus: 'PENDING',
        newStatus: 'AWAITING_PAYMENT_VERIFICATION',
        changedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        notes: 'Customer submitted bank deposit receipt for verification.',
      });
    }

    this.save();
    this.notifySubscribers('PAYMENT_SLIP_SUBMITTED', { orderId, slipImageUrl });
    return this.getOrderDetails(orderId)!;
  }

  public verifyPaymentSlip(dto: VerifySlipDto): CustomerOrderWithDetails {
    const payment = this.getPaymentById(dto.paymentId);
    if (!payment) {
      throw new Error(`Payment with ID ${dto.paymentId} not found.`);
    }
    const btPayment = this.getBankTransferPayment(dto.paymentId);
    if (!btPayment) {
      throw new Error(
        `Bank transfer record with payment ID ${dto.paymentId} not found.`
      );
    }
    const order = this.getOrderById(payment.orderId);
    if (!order) {
      throw new Error(`Customer order with ID ${payment.orderId} not found.`);
    }

    const staff = this.getStaffById(dto.staffId);
    const staffUserId = staff ? staff.userId : null;
    const staffUser = staffUserId ? this.getUserById(staffUserId) : null;
    const customer = this.getCustomerById(order.customerId);
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // Segregation of Duties (SoD) & Dual-Control Validation
    // A staff member cannot verify or approve a bank deposit slip for an order they placed or assisted.
    const isSelfVerification = Boolean(
      (customer && staff && customer.userId === staff.userId) ||
      (staffUser && customer && customer.email.toLowerCase() === staffUser.email.toLowerCase()) ||
      (staffUser && order.customerEmail && order.customerEmail.toLowerCase() === staffUser.email.toLowerCase()) ||
      (order.assistedByStaffId != null && staff != null && order.assistedByStaffId === staff.staffId)
    );

    if (isSelfVerification) {
      throw new Error(
        'Segregation of Duties Violation: Store staff cannot verify payment slips for their own orders. Another authorized staff member must conduct this verification.'
      );
    }

    btPayment.verifiedByStaffId = dto.staffId;
    btPayment.verifiedAt = now;

    if (dto.approved) {
      btPayment.rejectionReason = null;
      payment.paymentStatus = 'VERIFIED';

      const prevStatus = order.orderStatus;
      order.orderStatus = 'PROCESSING';

      const nextHistoryId =
        this.data.orderStatusHistories.reduce(
          (max, h) => Math.max(max, h.historyId),
          0
        ) + 1;
      this.data.orderStatusHistories.push({
        historyId: nextHistoryId,
        orderId: order.orderId,
        changedByUserId: staffUserId,
        previousStatus: prevStatus,
        newStatus: 'PROCESSING',
        changedAt: now,
        notes: `Bank deposit slip verified by staff #${dto.staffId}; released to order fulfillment.`,
      });
    } else {
      btPayment.rejectionReason =
        dto.rejectionReason || 'Deposit slip image blurry or amount mismatch.';
      payment.paymentStatus = 'REJECTED';

      const nextHistoryId =
        this.data.orderStatusHistories.reduce(
          (max, h) => Math.max(max, h.historyId),
          0
        ) + 1;
      this.data.orderStatusHistories.push({
        historyId: nextHistoryId,
        orderId: order.orderId,
        changedByUserId: staffUserId,
        previousStatus: order.orderStatus,
        newStatus: order.orderStatus,
        changedAt: now,
        notes: `Bank deposit slip rejected: ${btPayment.rejectionReason}`,
      });
    }

    this.save();
    this.notifySubscribers('PAYMENT_SLIP_VERIFIED', {
      paymentId: dto.paymentId,
      approved: dto.approved,
    });
    return this.getOrderDetails(order.orderId)!;
  }

  public updateCodPayment(
    dto: UpdateCodStatusDto
  ): CashOnDeliveryPayment {
    const cod = this.getCashOnDeliveryPayment(dto.paymentId);
    if (!cod) {
      throw new Error(
        `Cash on delivery record with payment ID ${dto.paymentId} not found.`
      );
    }
    const payment = this.getPaymentById(dto.paymentId);

    cod.cashCollectionStatus = dto.cashCollectionStatus;
    if (dto.collectedAmount !== undefined) {
      cod.collectedAmount = dto.collectedAmount;
    }
    if (dto.courierRemittanceDate !== undefined) {
      cod.courierRemittanceDate = dto.courierRemittanceDate;
    }

    if (
      dto.cashCollectionStatus === 'REMITTED_TO_STORE' &&
      payment
    ) {
      payment.paymentStatus = 'VERIFIED';
    }

    this.save();
    this.notifySubscribers('COD_PAYMENT_UPDATED', {
      paymentId: dto.paymentId,
      status: dto.cashCollectionStatus,
    });
    return cod;
  }

  public getCourierPartners(): CourierPartner[] {
    return [...this.data.courierPartners];
  }

  public getCourierPartnerById(courierId: number): CourierPartner | undefined {
    return this.data.courierPartners.find((c) => c.courierId === courierId);
  }

  public getShipments(): DeliveryShipment[] {
    return [...this.data.deliveryShipments];
  }

  public getShipmentById(deliveryId: number): DeliveryShipment | undefined {
    return this.data.deliveryShipments.find(
      (s) => s.deliveryId === deliveryId
    );
  }

  public getShipmentByOrderId(
    orderId: number
  ): DeliveryShipment | undefined {
    return this.data.deliveryShipments.find((s) => s.orderId === orderId);
  }

  public dispatchOrder(dto: DispatchOrderDto): DeliveryShipment {
    const order = this.getOrderById(dto.orderId);
    if (!order) {
      throw new Error(`Order with ID ${dto.orderId} not found.`);
    }
    const courier = this.getCourierPartnerById(dto.courierId);
    if (!courier) {
      throw new Error(`Courier partner with ID ${dto.courierId} not found.`);
    }

    if (order.orderStatus === 'CANCELLED' || order.orderStatus === 'REFUNDED') {
      throw new Error(`Cannot dispatch order #${order.orderNumber} because its status is ${order.orderStatus}.`);
    }

    const existingShipment = this.getShipmentByOrderId(dto.orderId);
    if (existingShipment) {
      return existingShipment;
    }

    const prefix = courier.courierName.substring(0, 3).toUpperCase();
    const trackingNumber =
      dto.trackingNumber ||
      `${prefix}-${Math.floor(100000 + Math.random() * 900000)}-LK`;

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const nextDeliveryId =
      this.data.deliveryShipments.reduce(
        (max, s) => Math.max(max, s.deliveryId),
        0
      ) + 1;

    const shipment: DeliveryShipment = {
      deliveryId: nextDeliveryId,
      orderId: dto.orderId,
      courierId: dto.courierId,
      trackingNumber,
      courierCharge: dto.courierCharge ?? 350.0,
      deliveryStatus: 'DISPATCHED',
      currentLocation:
        dto.initialLocation ||
        `Handed over to ${courier.courierName} central courier sorting facility.`,
      dispatchedAt: now,
      deliveredAt: null,
    };
    this.data.deliveryShipments.push(shipment);

    // Shift order status to DISPATCHED
    const prevStatus = order.orderStatus;
    order.orderStatus = 'DISPATCHED';

    const nextHistoryId =
      this.data.orderStatusHistories.reduce(
        (max, h) => Math.max(max, h.historyId),
        0
      ) + 1;
    this.data.orderStatusHistories.push({
      historyId: nextHistoryId,
      orderId: dto.orderId,
      changedByUserId: dto.staffUserId ?? null,
      previousStatus: prevStatus,
      newStatus: 'DISPATCHED',
      changedAt: now,
      notes: `Dispatched via ${courier.courierName}. Tracking #${trackingNumber}`,
    });

    this.save();
    this.notifySubscribers('ORDER_DISPATCHED', {
      orderId: dto.orderId,
      trackingNumber,
    });
    return shipment;
  }

  public updateShipmentCheckpoint(
    deliveryId: number,
    newLocation: string,
    status?: DeliveryStatus
  ): DeliveryShipment {
    const shipment = this.getShipmentById(deliveryId);
    if (!shipment) {
      throw new Error(`Shipment with ID ${deliveryId} not found.`);
    }

    shipment.currentLocation = newLocation;
    if (status) {
      shipment.deliveryStatus = status;
      if (status === 'DELIVERED') {
        shipment.deliveredAt = new Date()
          .toISOString()
          .replace('T', ' ')
          .substring(0, 19);
        const order = this.getOrderById(shipment.orderId);
        if (order && order.orderStatus !== 'DELIVERED') {
          this.updateOrderStatus({
            orderId: order.orderId,
            newStatus: 'DELIVERED',
            notes: `Shipment confirmed delivered: ${newLocation}`,
          });
        }
      }
    }

    this.save();
    this.notifySubscribers('SHIPMENT_CHECKPOINT_UPDATED', {
      deliveryId,
      newLocation,
      status,
    });
    return shipment;
  }

  public markShipmentDelivered(deliveryId: number): DeliveryShipment {
    return this.updateShipmentCheckpoint(
      deliveryId,
      'Delivered - Recipient signed parcel',
      'DELIVERED'
    );
  }
}

// SINGLETON INSTANCE EXPORT

export const mockDb = new MockDataStore();
