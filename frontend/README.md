# D'fine Retail Clothing Store — OMS Storefront & Admin Portal

Modern, responsive web application for the D'fine Retail Order Management System (OMS). Built with React 18, TypeScript, Tailwind CSS, and Vite.

---

## 1. Quick Start

### Prerequisites
- Node.js 18+ or 20+
- npm 9+

### Installation & Development
```bash
# Install dependencies
npm install

# Start Vite local development server
npm run dev
```
The application will launch at `http://localhost:5173`.

### Production Build
```bash
# Typecheck and build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 2. Architecture & Dual-Mode API

The frontend is architected with a **Dual-Mode API Layer** (`src/api/client.ts`):

1. **Reactive Mock Mode (Default)**:
   - When the Spring Boot backend is offline or during frontend prototyping, the client seamlessly falls back to an in-memory reactive data store (`src/api/mockDataStore.ts`).
   - All catalog searches, customer authentications, checkout flows, and admin actions function with 100% fidelity.

2. **Live Backend Mode**:
   - To connect the frontend to the live Spring Boot 3 REST API running on port `8080`, create a `.env` file in the `frontend/` root:
   ```env
   VITE_LIVE_BACKEND=true
   VITE_API_BASE_URL=http://localhost:8080/api
   ```
   - When `VITE_LIVE_BACKEND=true`, the API client transmits live HTTP requests via Axios and automatically attaches the JWT bearer token from `localStorage`.

---

## 3. Spring Boot Backend Configuration (CORS & Ports)

To allow the frontend to communicate with your Spring Boot service, ensure your Spring Boot controllers or security configuration permit CORS requests from the Vite dev server:

```java
@CrossOrigin(origins = "http://localhost:5173")
```

Or via global `WebMvcConfigurer`:
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

- **Currency Invariant**: All amounts are formatted in **Sri Lankan Rupees (LKR)** and mapped as `BigDecimal(10, 2)`.

---

## 4. REST API Contract & Endpoint Reference

### Module 1: User Identity, Access Control & Password Recovery

| Method | Endpoint | Description | Request Body / Params | Expected Response |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | User authentication | `{"email": "...", "password": "..."}` | `{"token": "...", "user": {...}}` |
| `POST` | `/api/auth/register` | Customer self-registration | `{"email": "...", "password": "...", "firstName": "...", "lastName": "...", "phoneNumber": "...", "shippingAddress": "...", "city": "...", "district": "..."}` | `{"token": "...", "user": {...}}` (HTTP 201) |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Bearer JWT Header | User profile DTO |
| `POST` | `/api/auth/forgot-password` | Request password reset token | `{"email": "..."}` | Success acknowledgment (HTTP 200) |
| `POST` | `/api/auth/reset-password` | Reset password with token | `{"token": "...", "newPassword": "..."}` | Success acknowledgment (HTTP 200) |
| `GET` | `/api/admin/analytics/dashboard` | Executive KPI analytics | None | Revenue summary, orders count |

### Module 2: Products, Variants, Restock & Reviews

| Method | Endpoint | Description | Request Body / Params | Expected Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Browse catalog products | `?categoryId=1&gender=MEN` (optional) | List of `ProductResponse` |
| `GET` | `/api/products/{id}` | Get product details & variants | Path variable `id` | Product detail with variant list |
| `POST` | `/api/products` | Create catalog garment | `CreateProductRequest` JSON | Created `ProductResponse` (HTTP 201) |
| `PUT` | `/api/products/{id}` | Update catalog garment | `UpdateProductRequest` JSON | Updated `ProductResponse` |
| `GET` | `/api/variants` | Get all inventory SKUs | None | List of `VariantDto` |
| `POST` | `/api/variants/{id}/restock` | Intake inventory restock batch | `{"staffId": 1, "quantityAdded": 50, "notes": "..."}` | Updated variant record (HTTP 200) |
| `GET` | `/api/categories` | Get active product categories | None | List of active categories |
| `POST` | `/api/products/{id}/reviews` | Submit product review | `{"customerId": 1, "rating": 5, "comment": "..."}` | Created review DTO (HTTP 201) |

### Module 3: Cart, Checkout & Orders

| Method | Endpoint | Description | Request Body / Params | Expected Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/cart` | Get customer active shopping cart | None (reads user token / session) | Cart items list with subtotal |
| `POST` | `/api/cart/items` | Add item to cart | `{"variantId": 12, "quantity": 1}` | Updated cart record |
| `DELETE` | `/api/cart/items/{id}` | Remove cart line item | Path variable `id` | HTTP 204 No Content |
| `POST` | `/api/orders/checkout` | Submit order & decrement stock | `CheckoutRequest` (shipping address, courier ID, payment method, items) | Created `CustomerOrder` (HTTP 201) |
| `GET` | `/api/orders/my-orders` | Fetch customer order history | None | List of customer orders |
| `PATCH` | `/api/orders/{id}/status` | Transition order status | `{"newStatus": "PROCESSING", "remarks": "..."}` | Updated order record |

### Module 4: Invoices, Payments & Courier Logistics

| Method | Endpoint | Description | Request Body / Params | Expected Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/invoices` | List all tax invoices | None | List of `Invoice` records |
| `GET` | `/api/invoices/order/{orderId}` | Fetch tax invoice by order ID | Path variable `orderId` | Official invoice DTO with LKR totals |
| `POST` | `/api/payments` | Initialize payment record | `{"orderId": 101, "paymentMethod": "BANK_TRANSFER", "amount": 4500.00}` | Created payment DTO (HTTP 201) |
| `POST` | `/api/payments/{id}/upload-slip` | Upload bank deposit slip | `MultipartFile` or image base64 URL | Updated payment record |
| `PATCH` | `/api/payments/{id}/verify-slip` | Staff bank slip verification | `{"staffId": 2, "isVerified": true}` | Updated payment record |
| `PATCH` | `/api/payments/{id}/cod-settle` | Settle cash-on-delivery collection | `{"collectedAmount": 4500.00}` | Updated payment record |
| `GET` | `/api/couriers` | Fetch active courier partners | None | List of courier options & rates |
| `POST` | `/api/shipments/dispatch` | Dispatch package with courier | `{"orderId": 101, "courierId": 1, "trackingNumber": "TRK-..."}` | Created shipment DTO (HTTP 201) |

---

## 5. Project Directory Structure

```text
frontend/
├── public/                 # Static assets and public images
├── src/
│   ├── api/                # Central API client, mock data store, and domain adapters
│   │   ├── client.ts       # Axios instance with dual-mode fallback
│   │   ├── mockDataStore.ts# Reactive in-memory mock store
│   │   ├── authApi.ts      # Authentication & user API calls
│   │   ├── productApi.ts   # Catalog & variant API calls
│   │   ├── orderApi.ts     # Cart & order API calls
│   │   └── paymentApi.ts   # Payment & courier API calls
│   ├── components/         # Shared storefront components (Header, Footer, CartDrawer, Modals)
│   ├── context/            # Store state context (cart, quick view, notifications)
│   ├── modules/            # Domain module feature packages
│   │   ├── module1_user/   # Customer profile, login audits, admin user views
│   │   ├── module2_product/# Product catalog manager, variant SKU matrix, reviews
│   │   ├── module3_order/  # Order operations console, assisted order modals
│   │   └── module4_payment/# Payment settlement, courier dispatch console
│   ├── pages/              # Primary route pages (Home, Collection, ProductDetail, Search, Checkout, Admin)
│   ├── types/              # Comprehensive TypeScript OMS domain interfaces
│   ├── App.tsx             # Main routing table and application shell
│   ├── main.tsx            # React application entrypoint
│   └── index.css           # Global Tailwind CSS styles
├── package.json            # Node project configuration and dependencies
├── tsconfig.json           # TypeScript compiler configuration
└── vite.config.ts          # Vite configuration and build optimizations
```
