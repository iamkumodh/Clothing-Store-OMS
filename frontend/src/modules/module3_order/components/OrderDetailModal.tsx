// order management component

import React, { useState } from 'react';
import type {
  CustomerOrderWithDetails,
  OrderStatus,
  UpdateOrderStatusDto,
} from '../../../types/oms';
import { updateOrderStatus } from '../../../api/orderApi';
import {
  X,
  Package,
  Calendar,
  CreditCard,
  Truck,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  User,
  MapPin,
  ExternalLink,
} from 'lucide-react';

interface OrderDetailModalProps {
  order: CustomerOrderWithDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderUpdated?: () => void;
}

export function OrderDetailModal({
  order,
  isOpen,
  onClose,
  onOrderUpdated,
}: OrderDetailModalProps) {
  if (!isOpen || !order) return null;

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.orderStatus);
  const [transitionNotes, setTransitionNotes] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleStatusChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStatus === order.orderStatus) return;

    setIsUpdating(true);
    try {
      const dto: UpdateOrderStatusDto = {
        orderId: order.orderId,
        newStatus: selectedStatus,
        changedByUserId: 1, // Store Manager / Admin Chaminda
        notes: transitionNotes || `Status advanced to ${selectedStatus} via Order Console`,
      };

      await updateOrderStatus(dto);
      setFeedback(`Order #${order.orderId} status successfully transitioned to ${selectedStatus}.`);
      setTransitionNotes('');
      if (onOrderUpdated) {
        onOrderUpdated();
      }
      setTimeout(() => setFeedback(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'PROCESSING':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'DISPATCHED':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'DELIVERED':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-zinc-100 text-zinc-800 border-zinc-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white border border-zinc-300 w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-2xl font-medium text-[#0a0a0a]">
                Order {order.orderNumber}
              </h2>
              <span
                className={`text-[11px] uppercase tracking-wider font-semibold px-2.5 py-0.5 border ${getStatusBadge(
                  order.orderStatus
                )}`}
              >
                {order.orderStatus}
              </span>
              <span className="text-[10px] bg-black text-white px-2 py-0.5 font-mono tracking-widest uppercase">
                Module 3
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-1 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>Placed on {order.orderDate}</span>
              <span>&bull;</span>
              <span className="font-mono uppercase text-zinc-700 font-medium">
                Channel: {order.orderSource.replace('_', ' ')}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-black hover:border-black transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 divide-y divide-zinc-200 text-xs">
          {/* Section 1: Customer & Shipping Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-0">
            <div className="space-y-2">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>Customer Profile</span>
              </div>
              <div className="bg-zinc-50 border border-zinc-200 p-3.5 space-y-1">
                <div className="font-medium text-sm text-[#0a0a0a]">
                  {order.customerName}
                </div>
                <div className="text-zinc-600 font-mono text-[11px]">
                  {order.customerEmail}
                </div>
                <div className="text-zinc-600 font-mono text-[11px]">
                  {order.customerPhone}
                </div>
                {order.assistedByStaff && (
                  <div className="mt-2 pt-2 border-t border-zinc-200 text-[11px] text-zinc-500">
                    <span className="font-semibold text-zinc-700">Staff Assisted by:</span>{' '}
                    {order.assistedByStaff.firstName} {order.assistedByStaff.lastName} ({order.assistedByStaff.designation})
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>Delivery Destination</span>
              </div>
              <div className="bg-zinc-50 border border-zinc-200 p-3.5 space-y-1">
                <div className="text-zinc-800 leading-relaxed font-medium">
                  {order.shippingAddressSnapshot}
                </div>
                <div className="text-zinc-500 text-[11px] pt-1 flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-zinc-500" />
                  <span>
                    Courier: {order.shipment?.courier?.courierName || 'Standard Regional Logistics'}
                  </span>
                </div>
                {order.shipment && (
                  <div className="text-[11px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 border border-purple-200 inline-block mt-1">
                    Tracking: {order.shipment.trackingNumber} ({order.shipment.deliveryStatus})
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Line Items Table */}
          <div className="pt-6 space-y-3">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" />
              <span>Purchased Line Items ({order.items?.length || 0})</span>
            </div>

            <div className="border border-zinc-200 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200 text-[10px] uppercase tracking-wider font-semibold text-zinc-500">
                    <th className="py-2.5 px-3">Item</th>
                    <th className="py-2.5 px-3">SKU</th>
                    <th className="py-2.5 px-3">Size / Color</th>
                    <th className="py-2.5 px-3">Qty</th>
                    <th className="py-2.5 px-3">Unit Price</th>
                    <th className="py-2.5 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {order.items?.map((item) => (
                    <tr key={item.orderItemId} className="hover:bg-zinc-50/50">
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={
                              item.customImageUrl ||
                              item.variant?.variantImageUrl ||
                              item.product?.mainImageUrl ||
                              '/images/ceru-knit-1.png'
                            }
                            alt={item.product?.productName}
                            className="w-8 h-10 object-cover bg-zinc-100 border border-zinc-200 shrink-0"
                          />
                          <div>
                            <div className="font-medium text-zinc-900 line-clamp-1">
                              {item.product?.productName || 'Garment Item'}
                            </div>
                            {item.customPrintNotes && (
                              <div className="text-[10px] text-zinc-500 italic">
                                Note: {item.customPrintNotes}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-700">
                        {item.variant?.sku || `SKU-${item.variantId}`}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-mono font-medium">{item.variant?.sizeLabel || '—'}</span> / {item.variant?.color || '—'}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-zinc-900">
                        {item.quantity}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-zinc-700">
                        LKR {item.unitPrice.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-zinc-900 text-right">
                        LKR {item.subtotal.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Ledger */}
            <div className="flex justify-end">
              <div className="w-72 bg-zinc-50 border border-zinc-200 p-3.5 space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal:</span>
                  <span className="font-mono">LKR {order.subtotalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Shipping Logistics:</span>
                  <span className="font-mono">LKR {order.shippingFee.toLocaleString()}</span>
                </div>
                <div className="border-t border-zinc-200 pt-1.5 flex justify-between font-semibold text-sm text-[#0a0a0a]">
                  <span>Total Payable:</span>
                  <span className="font-mono">LKR {order.totalPayable.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Status Transition Console */}
          <div className="pt-6 space-y-3">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500 flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Update Order Lifecycle Status</span>
            </div>

            <form onSubmit={handleStatusChange} className="bg-zinc-50 border border-zinc-200 p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-1 font-semibold">
                    Target Lifecycle Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                    className="w-full h-9 px-2.5 bg-white border border-zinc-300 text-xs font-semibold text-zinc-900 outline-none focus:border-black cursor-pointer"
                  >
                    <option value="PENDING">PENDING (Awaiting payment/review)</option>
                    <option value="PROCESSING">PROCESSING (Packaging at warehouse)</option>
                    <option value="DISPATCHED">DISPATCHED (Handed to courier)</option>
                    <option value="DELIVERED">DELIVERED (Customer received)</option>
                    <option value="CANCELLED">CANCELLED (Stock automatically restored)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-1 font-semibold">
                    Audit Note / Transition Remarks
                  </label>
                  <input
                    type="text"
                    value={transitionNotes}
                    onChange={(e) => setTransitionNotes(e.target.value)}
                    placeholder="E.g. Package inspected, handed to Domex courier..."
                    className="w-full h-9 px-2.5 bg-white border border-zinc-300 text-xs text-zinc-900 outline-none focus:border-black"
                  />
                </div>
              </div>

              {selectedStatus === 'CANCELLED' && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-[11px] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>
                    Cancelling this order will automatically restore reserved garment variant quantities back into warehouse stock.
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={isUpdating || selectedStatus === order.orderStatus}
                className="h-9 px-4 bg-black hover:bg-zinc-800 text-white text-[11px] uppercase tracking-wider font-semibold transition-colors disabled:opacity-40 cursor-pointer"
              >
                {isUpdating ? 'Saving...' : 'Apply Status Transition'}
              </button>
            </form>
          </div>

          {/* Section 4: Status History Audit Trail */}
          <div className="pt-6 space-y-3">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Status Transition Audit Trail (`order_status_history`)</span>
            </div>

            <div className="border border-zinc-200 overflow-hidden">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200 text-[10px] uppercase tracking-wider font-semibold text-zinc-500">
                    <th className="py-2 px-3">History ID</th>
                    <th className="py-2 px-3">Timestamp</th>
                    <th className="py-2 px-3">Status Recorded</th>
                    <th className="py-2 px-3">Audit Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {order.statusHistory?.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-zinc-500">
                        No historical status changes logged yet
                      </td>
                    </tr>
                  ) : (
                    order.statusHistory?.map((h) => (
                      <tr key={h.historyId} className="hover:bg-zinc-50/50">
                        <td className="py-2 px-3 font-mono font-bold text-zinc-700">
                          #{h.historyId}
                        </td>
                        <td className="py-2 px-3 font-mono text-zinc-500">
                          {h.changedAt}
                        </td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-2 py-0.5 text-[9px] uppercase font-semibold border ${getStatusBadge(
                              h.newStatus
                            )}`}
                          >
                            {h.newStatus}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-zinc-700">
                          {h.notes || 'Status updated'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between">
          <div className="text-xs text-zinc-500">
            {order.invoice && (
              <span className="font-mono text-zinc-700">
                Invoice: #{order.invoice.invoiceNumber} &bull; Generated: {order.invoice.issuedAt}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="h-9 px-5 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
