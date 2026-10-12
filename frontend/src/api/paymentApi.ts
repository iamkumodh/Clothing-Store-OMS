// payment api client

import { apiClient, executeWithFallback } from './client';
import { mockDb } from './mockDataStore';
import type {
  CourierPartner,
  DeliveryShipment,
  VerifySlipDto,
  DispatchOrderDto,
  UpdateCodStatusDto,
  Invoice,
  CashOnDeliveryPayment,
} from '../types/oms';

export interface CourierOption {
  courierId: number;
  courierName: string;
  contactNumber: string;
  trackingBaseUrl?: string;
  charge: number;
  estimatedDays: string;
}

export interface SubmitBankTransferRequest {
  orderId: number;
  bankName: string;
  depositReference: string;
  slipImageBase64?: string;
  slipImageUrl?: string;
}

export interface BankTransferResponse {
  transferId: number;
  orderId: number;
  bankName: string;
  depositReference: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verifiedAt?: string;
}

export const defaultCouriers: CourierOption[] = [
  {
    courierId: 1,
    courierName: 'Prompt Xpress',
    contactNumber: '+94 11 456 7890',
    charge: 350,
    estimatedDays: '1–2 Business Days (Express)',
  },
  {
    courierId: 2,
    courierName: 'Domex Delivery',
    contactNumber: '+94 11 789 1234',
    charge: 300,
    estimatedDays: '2–3 Business Days (Standard)',
  },
  {
    courierId: 3,
    courierName: 'Pronto Lanka',
    contactNumber: '+94 11 234 5678',
    charge: 280,
    estimatedDays: '3–4 Business Days (Economy)',
  },
];

export async function fetchCouriers(): Promise<CourierOption[]> {
  return executeWithFallback(
    async () => {
      const res = await apiClient.get<CourierPartner[]>('/courier');
      return (res.data || []).map((c) => ({
        courierId: c.courierId,
        courierName: c.courierName,
        contactNumber: c.contactNumber,
        trackingBaseUrl: c.trackingApiUrl,
        charge: c.courierName.includes('Prompt') ? 350 : c.courierName.includes('Domex') ? 300 : 280,
        estimatedDays: c.courierName.includes('Prompt') ? '1–2 Business Days' : '2–3 Business Days',
      }));
    },
    () => {
      const list = mockDb.getCourierPartners();
      return list.map((c) => ({
        courierId: c.courierId,
        courierName: c.courierName,
        contactNumber: c.contactNumber,
        trackingBaseUrl: c.trackingApiUrl,
        charge: c.courierName.includes('Prompt') ? 350 : c.courierName.includes('Domex') ? 300 : 280,
        estimatedDays: c.courierName.includes('Prompt') ? '1–2 Business Days (Express)' : '2–3 Business Days (Standard)',
      }));
    }
  );
}

export async function submitBankTransfer(req: SubmitBankTransferRequest): Promise<BankTransferResponse> {
  return executeWithFallback(
    async () => {
      const res = await apiClient.post<BankTransferResponse>('/bank-transfer', req);
      return res.data;
    },
    () => {
      const img = req.slipImageBase64 || req.slipImageUrl || '/images/dfine-img-001.png';
      const order = mockDb.submitPaymentSlip(
        req.orderId,
        img,
        req.bankName,
        req.depositReference
      );
      const bt = order.payment?.bankTransfer;
      return {
        transferId: order.payment?.paymentId || 1,
        orderId: req.orderId,
        bankName: req.bankName,
        depositReference: req.depositReference,
        verificationStatus: order.payment?.paymentStatus === 'VERIFIED' ? 'VERIFIED' : 'PENDING',
        verifiedAt: bt?.verifiedAt || undefined,
      };
    }
  );
}

export async function verifyBankTransfer(
  paymentId: number,
  staffId = 1,
  approved = true,
  rejectionReason?: string
): Promise<BankTransferResponse> {
  return executeWithFallback(
    async () => {
      const res = await apiClient.put<BankTransferResponse>(`/bank-transfer/${paymentId}/verify`, {
        approved,
        rejectionReason,
      }, {
        params: { staffId },
      });
      return res.data;
    },
    () => {
      const dto: VerifySlipDto = {
        paymentId,
        staffId,
        approved,
        rejectionReason,
      };
      const order = mockDb.verifyPaymentSlip(dto);
      const bt = order.payment?.bankTransfer;
      return {
        transferId: paymentId,
        orderId: order.orderId,
        bankName: bt?.bankName || 'Commercial Bank',
        depositReference: bt?.depositReference || 'DEP-REF',
        verificationStatus: approved ? 'VERIFIED' : 'REJECTED',
        verifiedAt: bt?.verifiedAt || undefined,
      };
    }
  );
}

export async function updateCodSettlement(dto: UpdateCodStatusDto): Promise<CashOnDeliveryPayment> {
  return executeWithFallback(
    async () => {
      const res = await apiClient.put<CashOnDeliveryPayment>(`/payments/cod/${dto.paymentId}`, dto);
      return res.data;
    },
    () => mockDb.updateCodPayment(dto)
  );
}

export async function dispatchShipment(dto: DispatchOrderDto): Promise<DeliveryShipment> {
  return executeWithFallback(
    async () => {
      const res = await apiClient.post<DeliveryShipment>('/shipments/dispatch', dto);
      return res.data;
    },
    () => mockDb.dispatchOrder(dto)
  );
}

export async function updateShipmentLocation(
  deliveryId: number,
  location: string,
  status?: any
): Promise<DeliveryShipment> {
  return executeWithFallback(
    async () => {
      const res = await apiClient.put<DeliveryShipment>(`/shipments/${deliveryId}/location`, { location, status });
      return res.data;
    },
    () => mockDb.updateShipmentCheckpoint(deliveryId, location, status)
  );
}

export async function fetchShipmentByOrderId(orderId: number): Promise<DeliveryShipment | undefined> {
  return executeWithFallback(
    async () => {
      const res = await apiClient.get<DeliveryShipment>(`/shipments/order/${orderId}`);
      return res.data;
    },
    () => mockDb.getShipmentByOrderId(orderId)
  );
}

export async function fetchInvoices(): Promise<Invoice[]> {
  return executeWithFallback(
    async () => {
      const res = await apiClient.get<Invoice[]>('/invoices');
      return res.data;
    },
    () => mockDb.getInvoices()
  );
}

export async function fetchInvoiceByOrderId(orderId: number): Promise<Invoice | undefined> {
  return executeWithFallback(
    async () => {
      const res = await apiClient.get<Invoice>(`/invoices/order/${orderId}`);
      return res.data;
    },
    () => mockDb.getInvoiceByOrderId(orderId)
  );
}
