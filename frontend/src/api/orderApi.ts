// order api client

import { apiClient, executeWithFallback } from './client';
import { mockDb } from './mockDataStore';
import type {
  CustomerOrderWithDetails,
  CreateOrderDto,
  UpdateOrderStatusDto,
  OrderStatus,
} from '../types/oms';

export interface CheckoutRequest {
  cartId?: number;
  customerId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingDistrict: string;
  shippingProvince: string;
  courierPartnerId: number;
  paymentMethod: 'BANK_TRANSFER' | 'CASH_ON_DELIVERY';
  notes?: string;
  items?: Array<{
    productId: string;
    productTitle: string;
    variantId?: number;
    size?: string;
    color?: string;
    quantity: number;
    unitPrice: number;
    image?: string;
  }>;
}

export interface CustomerOrderResponse {
  orderId: number;
  orderNumber: string;
  customerId: number;
  orderDate: string;
  orderStatus: string;
  subtotalAmount: number;
  courierCharge: number;
  totalAmount: number;
  totalPayable?: number;
  shippingFee?: number;
  paymentMethod: string;
  shippingAddress: string;
  shippingAddressSnapshot?: string;
  recipientName: string;
  customerName?: string;
  recipientPhone: string;
  customerPhone?: string;
  items?: Array<{
    orderItemId: number;
    productTitle: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    customImageUrl?: string;
  }>;
}

function canonicalToCustomerOrderResponse(
  order: CustomerOrderWithDetails
): CustomerOrderResponse {
  return {
    orderId: order.orderId,
    orderNumber: order.orderNumber,
    customerId: order.customerId,
    orderDate: order.orderDate,
    orderStatus: order.orderStatus,
    subtotalAmount: Number(order.subtotalAmount),
    courierCharge: Number(order.shippingFee),
    totalAmount: Number(order.totalPayable),
    totalPayable: Number(order.totalPayable),
    shippingFee: Number(order.shippingFee),
    paymentMethod: order.payment?.paymentMethod || 'BANK_TRANSFER',
    shippingAddress: order.shippingAddressSnapshot,
    shippingAddressSnapshot: order.shippingAddressSnapshot,
    recipientName: order.customerName,
    customerName: order.customerName,
    recipientPhone: order.customerPhone,
    customerPhone: order.customerPhone,
    items: (order.items || []).map((oi, idx) => ({
      orderItemId: oi.orderItemId || idx + 1,
      productTitle: oi.product?.productName || 'D\'fine Garment',
      quantity: oi.quantity,
      unitPrice: Number(oi.unitPrice),
      subtotal: Number(oi.subtotal),
      customImageUrl: oi.customImageUrl || oi.variant?.variantImageUrl || '/images/dfine-img-001.png',
    })),
  };
}

export async function submitCheckout(req: CheckoutRequest): Promise<CustomerOrderResponse> {
  return executeWithFallback(
    async () => {
      const res = await apiClient.post<any>('/orders/checkout', req);
      return res.data;
    },
    () => {
      // Build canonical line items
      const orderLines = (req.items || []).map(it => {
        let variantId = it.variantId;
        if (!variantId) {
          const variants = mockDb.getVariants();
          variantId = variants[0]?.variantId || 1;
        }
        return {
          variantId,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          customImageUrl: it.image || null,
        };
      });

      if (orderLines.length === 0) {
        orderLines.push({
          variantId: 1,
          quantity: 1,
          unitPrice: 4500,
          customImageUrl: null,
        });
      }

      const dto: CreateOrderDto = {
        customerId: req.customerId || 1,
        orderSource: 'WEB_STOREFRONT',
        customerName: req.customerName,
        customerEmail: req.customerEmail,
        customerPhone: req.customerPhone,
        shippingAddress: `${req.shippingAddress}, ${req.shippingCity}`,
        shippingDistrict: req.shippingDistrict || 'Colombo',
        shippingProvince: req.shippingProvince || 'Western',
        courierPartnerId: req.courierPartnerId || 1,
        paymentMethod: req.paymentMethod || 'BANK_TRANSFER',
        items: orderLines,
        notes: req.notes,
        cartIdToClear: req.cartId,
      };

      const placed = mockDb.placeOrder(dto);
      return canonicalToCustomerOrderResponse(placed);
    }
  );
}

export async function fetchOrderById(orderId: number | string): Promise<CustomerOrderResponse | null> {
  const numId = Number(orderId);
  return executeWithFallback(
    async () => {
      const res = await apiClient.get<any>(`/orders/${orderId}`);
      return res.data;
    },
    () => {
      let order = !isNaN(numId) ? mockDb.getOrderDetails(numId) : undefined;
      if (!order) {
        order = mockDb.getOrdersWithDetails().find(o => o.orderNumber === String(orderId));
      }
      if (!order) {
        // Fallback to first seed order if demoing non-existent id
        order = mockDb.getOrdersWithDetails()[0];
      }
      return order ? canonicalToCustomerOrderResponse(order) : null;
    }
  );
}

export async function fetchAllOrders(filter?: {
  status?: OrderStatus;
  customerId?: number;
}): Promise<CustomerOrderWithDetails[]> {
  return executeWithFallback(
    async () => {
      const res = await apiClient.get<CustomerOrderWithDetails[]>('/orders', { params: filter });
      return res.data;
    },
    () => mockDb.getOrdersWithDetails(filter)
  );
}

export async function updateOrderStatus(dto: UpdateOrderStatusDto): Promise<CustomerOrderWithDetails> {
  return executeWithFallback(
    async () => {
      const res = await apiClient.put<CustomerOrderWithDetails>(`/orders/${dto.orderId}/status`, dto);
      return res.data;
    },
    () => mockDb.updateOrderStatus(dto)
  );
}

export async function cancelCustomerOrder(
  orderId: number,
  userId?: number,
  reason?: string
): Promise<CustomerOrderWithDetails> {
  return executeWithFallback(
    async () => {
      const res = await apiClient.post<CustomerOrderWithDetails>(`/orders/${orderId}/cancel`, { userId, reason });
      return res.data;
    },
    () => mockDb.cancelOrder(orderId, userId, reason)
  );
}

export async function createAssistedOrder(dto: CreateOrderDto): Promise<CustomerOrderWithDetails> {
  return executeWithFallback(
    async () => {
      const res = await apiClient.post<CustomerOrderWithDetails>('/orders/assisted', dto);
      return res.data;
    },
    () => mockDb.placeOrder(dto)
  );
}
