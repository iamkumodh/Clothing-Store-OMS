// order management component

import React, { useState, useEffect } from 'react';
import { mockDb } from '../../../api/mockDataStore';
import type { CustomerOrderWithDetails, OrderStatus } from '../../../types/oms';
import { cancelCustomerOrder } from '../../../api/orderApi';
import {
  Package,
  Truck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface CustomerOrderHistoryViewProps {
  customerId?: number;
  onTrackShipment?: (trackingNumber: string) => void;
}

export function CustomerOrderHistoryView({
  customerId = 1, // Default customer Kavindu Bandara
  onTrackShipment,
}: CustomerOrderHistoryViewProps) {
  const [orders, setOrders] = useState<CustomerOrderWithDetails[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);
  const [cancellationReason, setCancellationReason] = useState<string>('Customer changed delivery preferences');
  const [loading, setLoading] = useState<boolean>(false);
  const [notice, setNotice] = useState<string | null>(null);

  const loadCustomerOrders = () => {
    const list = mockDb.getOrdersWithDetails({ customerId });
    setOrders(list);
    if (list.length > 0 && expandedOrderId === null) {
      setExpandedOrderId(list[0].orderId);
    }
  };

  useEffect(() => {
    loadCustomerOrders();
    const unsub = mockDb.subscribe(() => {
      loadCustomerOrders();
    });
    return unsub;
  }, [customerId]);

  const handleCancel = async (orderId: number) => {
    if (!window.confirm('Are you sure you want to cancel this order? Garment stock will be returned to store inventory.')) {
      return;
    }

    setLoading(true);
    try {
      await cancelCustomerOrder(orderId, undefined, cancellationReason);
      setNotice(`Order #${orderId} has been successfully cancelled and garment stock has been returned to inventory.`);
      setCancellingOrderId(null);
      loadCustomerOrders();
      setTimeout(() => setNotice(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to cancel order');
    } finally {
      setLoading(false);
    }
  };

  const getStepState = (currentStatus: OrderStatus, step: 'PENDING' | 'PROCESSING' | 'DISPATCHED' | 'DELIVERED') => {
    if (currentStatus === 'CANCELLED') return 'cancelled';

    const orderStages = ['PENDING', 'PROCESSING', 'DISPATCHED', 'DELIVERED'];
    const currentIndex = orderStages.indexOf(currentStatus);
    const stepIndex = orderStages.indexOf(step);

    if (currentIndex > stepIndex) return 'completed';
    if (currentIndex === stepIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-zinc-200 p-6">
        <div className="flex items-center gap-2">
          <h2 className="font-serif text-2xl font-medium text-[#0a0a0a]">
            My Orders &amp; Delivery Tracking
          </h2>
          <span className="text-[10px] bg-black text-white px-2 py-0.5 font-mono tracking-widest uppercase">
            Module 3
          </span>
        </div>
        <p className="text-xs text-zinc-500 mt-1">
          Review your previous purchases, monitor real-time fulfillment status, or cancel pending orders.
        </p>
      </div>

      {notice && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white border border-zinc-200 p-12 text-center text-zinc-500">
          <Package className="w-10 h-10 mx-auto mb-3 stroke-1" />
          <h3 className="font-serif text-lg text-zinc-700">No Orders Placed Yet</h3>
          <p className="text-xs text-zinc-500 mt-1">
            Explore our latest 2026 collection to place your first D&apos;fine bespoke garment order.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.orderId;
            const isPending = order.orderStatus === 'PENDING';
            const isCancelled = order.orderStatus === 'CANCELLED';

            return (
              <div
                key={order.orderId}
                className="bg-white border border-zinc-200 overflow-hidden transition-all shadow-xs"
              >
                {/* Order Summary Bar */}
                <div
                  onClick={() => setExpandedOrderId(isExpanded ? null : order.orderId)}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-zinc-50/50 transition-colors"
                >
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold">
                        Order Reference
                      </div>
                      <div className="font-mono font-bold text-sm text-[#0a0a0a]">
                        {order.orderNumber}
                      </div>
                    </div>

                    <div className="border-l border-zinc-200 pl-4">
                      <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold">
                        Order Date
                      </div>
                      <div className="font-mono text-xs text-zinc-700">
                        {order.orderDate}
                      </div>
                    </div>

                    <div className="border-l border-zinc-200 pl-4">
                      <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold">
                        Total Amount
                      </div>
                      <div className="font-mono font-bold text-xs text-[#0a0a0a]">
                        LKR {Number(order.totalPayable).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 text-[11px] uppercase tracking-wider font-semibold border ${
                        isCancelled
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : order.orderStatus === 'DELIVERED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : order.orderStatus === 'DISPATCHED'
                          ? 'bg-purple-50 text-purple-800 border-purple-200'
                          : order.orderStatus === 'PROCESSING'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-zinc-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-500" />
                    )}
                  </div>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="border-t border-zinc-200 p-6 space-y-6 bg-zinc-50/40 text-xs">
                    {/* Visual Fulfillment Timeline */}
                    {!isCancelled ? (
                      <div className="bg-white border border-zinc-200 p-6">
                        <div className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500 mb-6">
                          Fulfillment &amp; Dispatch Timeline
                        </div>
                        <div className="grid grid-cols-4 gap-2 relative">
                          {/* Step 1: Placed */}
                          <div className="text-center relative">
                            <div
                              className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center font-bold text-xs ${
                                getStepState(order.orderStatus, 'PENDING') === 'completed' ||
                                getStepState(order.orderStatus, 'PENDING') === 'current'
                                  ? 'bg-black text-white'
                                  : 'bg-zinc-200 text-zinc-500'
                              }`}
                            >
                              ✓
                            </div>
                            <div className="text-[11px] font-semibold text-zinc-900 mt-2">
                              Order Placed
                            </div>
                            <div className="text-[10px] text-zinc-500 font-mono">
                              Awaiting Verification
                            </div>
                          </div>

                          {/* Step 2: Processing */}
                          <div className="text-center relative">
                            <div
                              className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center font-bold text-xs ${
                                getStepState(order.orderStatus, 'PROCESSING') === 'completed' ||
                                getStepState(order.orderStatus, 'PROCESSING') === 'current'
                                  ? 'bg-black text-white'
                                  : 'bg-zinc-200 text-zinc-500'
                              }`}
                            >
                              {getStepState(order.orderStatus, 'PROCESSING') === 'completed'
                                ? '✓'
                                : '2'}
                            </div>
                            <div className="text-[11px] font-semibold text-zinc-900 mt-2">
                              Packaging
                            </div>
                            <div className="text-[10px] text-zinc-500 font-mono">
                              At Warehouse
                            </div>
                          </div>

                          {/* Step 3: Dispatched */}
                          <div className="text-center relative">
                            <div
                              className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center font-bold text-xs ${
                                getStepState(order.orderStatus, 'DISPATCHED') === 'completed' ||
                                getStepState(order.orderStatus, 'DISPATCHED') === 'current'
                                  ? 'bg-black text-white'
                                  : 'bg-zinc-200 text-zinc-500'
                              }`}
                            >
                              {getStepState(order.orderStatus, 'DISPATCHED') === 'completed'
                                ? '✓'
                                : '3'}
                            </div>
                            <div className="text-[11px] font-semibold text-zinc-900 mt-2">
                              In Transit
                            </div>
                            <div className="text-[10px] text-zinc-500 font-mono">
                              Courier Handover
                            </div>
                          </div>

                          {/* Step 4: Delivered */}
                          <div className="text-center relative">
                            <div
                              className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center font-bold text-xs ${
                                getStepState(order.orderStatus, 'DELIVERED') === 'completed' ||
                                getStepState(order.orderStatus, 'DELIVERED') === 'current'
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-zinc-200 text-zinc-500'
                              }`}
                            >
                              {getStepState(order.orderStatus, 'DELIVERED') === 'completed'
                                ? '✓'
                                : '4'}
                            </div>
                            <div className="text-[11px] font-semibold text-zinc-900 mt-2">
                              Delivered
                            </div>
                            <div className="text-[10px] text-zinc-500 font-mono">
                              Signed & Received
                            </div>
                          </div>
                        </div>

                        {/* Shipment Info Banner */}
                        {order.shipment && (
                          <div className="mt-6 pt-4 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-zinc-50 p-3">
                            <div className="flex items-center gap-2">
                              <Truck className="w-4 h-4 text-purple-600" />
                              <span>
                                Handed to{' '}
                                <strong className="text-zinc-900">
                                  {order.shipment.courier?.courierName || 'Courier Partner'}
                                </strong>{' '}
                                &bull; Tracking No:{' '}
                                <code className="font-mono font-bold text-zinc-900">
                                  {order.shipment.trackingNumber}
                                </code>
                              </span>
                            </div>
                            {onTrackShipment && (
                              <button
                                onClick={() =>
                                  onTrackShipment(order.shipment?.trackingNumber || '')
                                }
                                className="min-h-[36px] sm:min-h-[30px] px-3.5 py-1.5 bg-black hover:bg-zinc-800 text-white text-[10px] uppercase tracking-wider font-semibold transition-colors cursor-pointer self-start sm:self-auto touch-manipulation relative before:absolute before:-inset-1 before:content-['']"
                              >
                                View Live Checkpoints
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-rose-50 border border-rose-200 p-4 text-xs text-rose-800 flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                        <div>
                          <div className="font-semibold">Order Was Cancelled</div>
                          <div className="text-[11px] mt-0.5 text-rose-700">
                            All reserved garment stocks have been returned to inventory.
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Line Items List */}
                    <div className="bg-white border border-zinc-200 p-6 space-y-4">
                      <div className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500">
                        Order Items Breakdown
                      </div>
                      <div className="divide-y divide-zinc-100">
                        {order.items?.map((item) => (
                          <div
                            key={item.orderItemId}
                            className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  item.customImageUrl ||
                                  item.variant?.variantImageUrl ||
                                  item.product?.mainImageUrl ||
                                  '/images/ceru-knit-1.png'
                                }
                                alt={item.product?.productName}
                                className="w-12 h-14 object-cover bg-zinc-100 border border-zinc-200 shrink-0"
                              />
                              <div>
                                <div className="font-medium text-sm text-[#0a0a0a]">
                                  {item.product?.productName || 'D\'fine Garment'}
                                </div>
                                <div className="text-zinc-500 text-[11px] font-mono mt-0.5">
                                  SKU: {item.variant?.sku} &bull; Size: {item.variant?.sizeLabel} &bull; Color: {item.variant?.color}
                                </div>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="font-mono font-semibold text-sm text-zinc-900">
                                LKR {item.subtotal.toLocaleString()}
                              </div>
                              <div className="text-[10px] text-zinc-500 font-mono">
                                {item.quantity} &times; LKR {item.unitPrice.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-zinc-200 pt-3 flex justify-between font-semibold text-sm text-[#0a0a0a]">
                        <span>Grand Total (Including Delivery):</span>
                        <span className="font-mono">LKR {order.totalPayable.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Customer Actions */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="text-zinc-500 text-[11px]">
                        Shipping to: <span className="text-zinc-800">{order.shippingAddressSnapshot}</span>
                      </div>

                      {isPending && (
                        <div className="flex items-center gap-2">
                          {cancellingOrderId === order.orderId ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={cancellationReason}
                                onChange={(e) => setCancellationReason(e.target.value)}
                                placeholder="Reason for cancellation..."
                                className="h-8 px-2 bg-white border border-zinc-300 text-xs text-zinc-900 outline-none"
                              />
                              <button
                                onClick={() => handleCancel(order.orderId)}
                                disabled={loading}
                                className="h-8 px-3 bg-rose-600 hover:bg-rose-700 text-white text-[10px] uppercase tracking-wider font-semibold transition-colors cursor-pointer"
                              >
                                {loading ? 'Cancelling...' : 'Confirm Cancel'}
                              </button>
                              <button
                                onClick={() => setCancellingOrderId(null)}
                                className="h-8 px-2 text-xs text-zinc-500 hover:text-black cursor-pointer"
                              >
                                Back
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setCancellingOrderId(order.orderId)}
                              className="h-8 px-3 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-[10px] uppercase tracking-wider font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Cancel Order</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
