// order management component

import React, { useState, useEffect } from 'react';
import { mockDb } from '../../../api/mockDataStore';
import type {
  CustomerOrderWithDetails,
  OrderStatus,
  OrderSource,
} from '../../../types/oms';
import { fetchAllOrders } from '../../../api/orderApi';
import { OrderDetailModal } from './OrderDetailModal';
import { AssistedOrderModal } from './AssistedOrderModal';
import {
  Search,
  Filter,
  Package,
  Plus,
  Eye,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export function OrderManagementView() {
  const [orders, setOrders] = useState<CustomerOrderWithDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [sourceFilter, setSourceFilter] = useState<OrderSource | 'ALL'>('ALL');

  // Modals state
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrderWithDetails | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [assistedModalOpen, setAssistedModalOpen] = useState(false);

  const loadOrders = async () => {
    const list = await fetchAllOrders();
    setOrders(list);
  };

  useEffect(() => {
    loadOrders();
    const unsub = mockDb.subscribe(() => {
      loadOrders();
    });
    return unsub;
  }, []);

  // Compute metrics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.orderStatus === 'PENDING').length;
  const processingOrders = orders.filter(o => o.orderStatus === 'PROCESSING').length;
  const dispatchedOrders = orders.filter(o => o.orderStatus === 'DISPATCHED').length;
  const deliveredOrders = orders.filter(o => o.orderStatus === 'DELIVERED').length;
  const totalGrossRevenue = orders
    .filter(o => o.orderStatus !== 'CANCELLED')
    .reduce((sum, o) => sum + Number(o.totalPayable), 0);

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter !== 'ALL' && o.orderStatus !== statusFilter) return false;
    if (sourceFilter !== 'ALL' && o.orderSource !== sourceFilter) return false;
    return true;
  });

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

  const getSourceBadge = (source: OrderSource) => {
    switch (source) {
      case 'IN_STORE_POS':
        return 'bg-zinc-900 text-white';
      case 'PHONE_ORDER':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'WEB_STOREFRONT':
      default:
        return 'bg-zinc-100 text-zinc-800 border-zinc-200';
    }
  };

  const handleOpenDetails = (order: CustomerOrderWithDetails) => {
    setSelectedOrder(order);
    setDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-zinc-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl font-medium text-[#0a0a0a]">
              Order Operations & Fulfillment Console
            </h2>
            <span className="text-[10px] bg-black text-white px-2 py-0.5 font-mono tracking-widest uppercase">
              Module 3
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Omni-channel order pipeline, status workflows, automated inventory reservation, and assisted customer checkout.
          </p>
        </div>
        <button
          onClick={() => setAssistedModalOpen(true)}
          className="h-10 px-5 bg-black hover:bg-zinc-800 text-white text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-colors cursor-pointer self-start md:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Assisted / POS Order</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-zinc-200 p-4">
          <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold mb-1">
            Total Orders
          </div>
          <div className="text-2xl font-serif text-[#0a0a0a]">{totalOrders}</div>
          <div className="text-[10px] text-zinc-500 mt-1">All sales channels</div>
        </div>

        <div className="bg-white border border-zinc-200 p-4">
          <div className="text-[11px] uppercase tracking-wider text-amber-700 font-semibold mb-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Pending Review</span>
          </div>
          <div className="text-2xl font-serif text-amber-900">{pendingOrders}</div>
          <div className="text-[10px] text-amber-700 mt-1">Awaiting verification</div>
        </div>

        <div className="bg-white border border-zinc-200 p-4">
          <div className="text-[11px] uppercase tracking-wider text-blue-700 font-semibold mb-1 flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-blue-600" />
            <span>In Processing</span>
          </div>
          <div className="text-2xl font-serif text-blue-900">{processingOrders}</div>
          <div className="text-[10px] text-blue-700 mt-1">Warehouse packaging</div>
        </div>

        <div className="bg-white border border-zinc-200 p-4">
          <div className="text-[11px] uppercase tracking-wider text-purple-700 font-semibold mb-1 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-purple-600" />
            <span>Dispatched</span>
          </div>
          <div className="text-2xl font-serif text-zinc-900">{dispatchedOrders}</div>
          <div className="text-[10px] text-purple-700 mt-1">In courier transit</div>
        </div>

        <div className="bg-white border border-zinc-200 p-4 col-span-2 lg:col-span-1">
          <div className="text-[11px] uppercase tracking-wider text-emerald-700 font-semibold mb-1">
            Gross Volume
          </div>
          <div className="text-2xl font-serif text-zinc-900">
            LKR {totalGrossRevenue.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-700 mt-1">{deliveredOrders} orders fulfilled</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-zinc-200 p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order #, customer, phone..."
            className="w-full h-10 pl-9 pr-3 bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-black text-xs text-[#0a0a0a] outline-none transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Tabs */}
          <div className="flex bg-zinc-100 p-0.5 border border-zinc-200 text-xs">
            {(['ALL', 'PENDING', 'PROCESSING', 'DISPATCHED', 'DELIVERED', 'CANCELLED'] as const).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                    statusFilter === status
                      ? 'bg-black text-white shadow-xs'
                      : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  {status}
                </button>
              )
            )}
          </div>

          {/* Sales Channel Filter */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value as OrderSource | 'ALL')}
            className="h-9 px-3 bg-white border border-zinc-200 text-xs text-zinc-700 outline-none cursor-pointer"
          >
            <option value="ALL">All Channels</option>
            <option value="WEB_STOREFRONT">Web Storefront</option>
            <option value="IN_STORE_POS">In-Store POS</option>
            <option value="PHONE_ORDER">Phone / DM Assisted</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-zinc-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] uppercase tracking-wider font-semibold text-zinc-500">
                <th className="py-3 px-4">Order Reference</th>
                <th className="py-3 px-4">Date Placed</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Items Summary</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Order Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-500">
                    <Package className="w-8 h-8 mx-auto mb-2 stroke-1" />
                    <p className="text-xs uppercase tracking-wider font-medium">No orders matched criteria</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const itemCount = order.items?.reduce((s, i) => s + i.quantity, 0) || 0;
                  const itemPreview = order.items?.map(i => i.product?.productName).filter(Boolean).slice(0, 2).join(', ');

                  return (
                    <tr key={order.orderId} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-zinc-900">{order.orderNumber}</div>
                        <div className="text-[10px] text-zinc-500 font-mono">ID #{order.orderId}</div>
                      </td>

                      <td className="py-3 px-4 font-mono text-zinc-600">
                        {order.orderDate}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-zinc-900">{order.customerName}</div>
                        <div className="text-[10px] text-zinc-500 font-mono">{order.customerPhone}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 text-[9px] uppercase font-mono font-semibold border ${getSourceBadge(
                            order.orderSource
                          )}`}
                        >
                          {order.orderSource.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        <span className="font-semibold text-zinc-900 font-mono">{itemCount} units</span>
                        <div className="text-[10px] text-zinc-500 truncate">
                          {itemPreview ? `${itemPreview}...` : 'Garment items'}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-zinc-900">
                          LKR {Number(order.totalPayable).toLocaleString()}
                        </div>
                        <div className="text-[10px] text-zinc-500">
                          {order.payment?.paymentMethod || 'COD'}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider border ${getStatusBadge(
                            order.orderStatus
                          )}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {order.orderStatus}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleOpenDetails(order)}
                          className="h-8 px-3 bg-zinc-100 hover:bg-black hover:text-white text-zinc-800 border border-zinc-300 text-[11px] uppercase tracking-wider font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        onOrderUpdated={() => {
          loadOrders();
          if (selectedOrder) {
            const fresh = mockDb.getOrderDetails(selectedOrder.orderId);
            if (fresh) setSelectedOrder(fresh);
          }
        }}
      />

      {/* Assisted Order / POS Modal */}
      <AssistedOrderModal
        isOpen={assistedModalOpen}
        onClose={() => setAssistedModalOpen(false)}
        onOrderCreated={() => loadOrders()}
      />
    </div>
  );
}
