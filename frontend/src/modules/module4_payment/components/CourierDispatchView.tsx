// payment and shipment component

import React, { useState, useEffect } from 'react';
import { mockDb } from '../../../api/mockDataStore';
import type {
  DeliveryShipment,
  CourierPartner,
  CustomerOrderWithDetails,
  DeliveryStatus,
  DispatchOrderDto,
} from '../../../types/oms';
import {
  dispatchShipment,
  updateShipmentLocation,
} from '../../../api/paymentApi';
import { LiveTrackingModal } from './LiveTrackingModal';
import {
  Truck,
  Package,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  RotateCcw,
  AlertCircle,
  Eye,
  ShieldCheck,
  X,
} from 'lucide-react';

export function CourierDispatchView() {
  const [shipments, setShipments] = useState<DeliveryShipment[]>([]);
  const [couriers, setCouriers] = useState<CourierPartner[]>([]);
  const [orders, setOrders] = useState<CustomerOrderWithDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | DeliveryStatus>('ALL');

  // Modals state
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [trackingModalNumber, setTrackingModalNumber] = useState<string | null>(null);
  const [editingCheckpointShipment, setEditingCheckpointShipment] = useState<DeliveryShipment | null>(null);

  // Dispatch Form State
  const [selectedOrderId, setSelectedOrderId] = useState<number>(1);
  const [selectedCourierId, setSelectedCourierId] = useState<number>(1);
  const [courierCharge, setCourierCharge] = useState<number>(350);
  const [checkpointLocation, setCheckpointLocation] = useState<string>('D\'fine Central Fulfillment Center (Colombo 05)');
  const [newCheckpointStatus, setNewCheckpointStatus] = useState<DeliveryStatus>('IN_TRANSIT');

  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const loadData = () => {
    setShipments(mockDb.getShipments());
    setCouriers(mockDb.getCourierPartners());
    setOrders(mockDb.getOrdersWithDetails());
  };

  useEffect(() => {
    loadData();
    const unsub = mockDb.subscribe(() => {
      loadData();
    });
    return unsub;
  }, []);

  const courierMap = new Map(couriers.map(c => [c.courierId, c]));
  const orderMap = new Map(orders.map(o => [o.orderId, o]));

  // Eligible orders for dispatch: processing or pending without an active shipment
  const existingShippedOrderIds = new Set(shipments.map(s => s.orderId));
  const dispatchableOrders = orders.filter(
    o => o.orderStatus !== 'CANCELLED' && o.orderStatus !== 'DELIVERED' && !existingShippedOrderIds.has(o.orderId)
  );

  // Compute metrics
  const totalShipments = shipments.length;
  const inTransitCount = shipments.filter(s => s.deliveryStatus === 'IN_TRANSIT').length;
  const outForDeliveryCount = shipments.filter(s => s.deliveryStatus === 'OUT_FOR_DELIVERY').length;
  const deliveredCount = shipments.filter(s => s.deliveryStatus === 'DELIVERED').length;

  const filteredShipments = shipments.filter(s => {
    const courier = courierMap.get(s.courierId);
    const order = orderMap.get(s.orderId);

    const matchesSearch =
      s.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.currentLocation && s.currentLocation.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (courier && courier.courierName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order && order.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order && order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (statusFilter !== 'ALL' && s.deliveryStatus !== statusFilter) return false;
    return true;
  });

  const handleDispatchOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dto: DispatchOrderDto = {
        orderId: selectedOrderId,
        courierId: selectedCourierId,
        courierCharge,
      };

      const result = await dispatchShipment(dto);
      setNotice(`Order #${selectedOrderId} dispatched under consignment ${result.trackingNumber}.`);
      setIsDispatchModalOpen(false);
      loadData();
      setTimeout(() => setNotice(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Dispatch failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCheckpoint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCheckpointShipment) return;

    setLoading(true);
    try {
      await updateShipmentLocation(
        editingCheckpointShipment.deliveryId,
        checkpointLocation,
        newCheckpointStatus
      );

      setNotice(`Shipment ${editingCheckpointShipment.trackingNumber} checkpoint updated to "${checkpointLocation}".`);
      setEditingCheckpointShipment(null);
      loadData();
      setTimeout(() => setNotice(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Checkpoint update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkDelivered = async (shipment: DeliveryShipment) => {
    if (!window.confirm(`Mark consignment ${shipment.trackingNumber} as DELIVERED to recipient?`)) {
      return;
    }

    try {
      await updateShipmentLocation(
        shipment.deliveryId,
        'Recipient Handover Completed (Signature Verified)',
        'DELIVERED'
      );
      setNotice(`Consignment ${shipment.trackingNumber} marked as DELIVERED.`);
      loadData();
      setTimeout(() => setNotice(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Failed to update delivery');
    }
  };

  const getDeliveryStatusBadge = (status: DeliveryStatus) => {
    switch (status) {
      case 'PENDING':
      case 'DISPATCHED':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'IN_TRANSIT':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'OUT_FOR_DELIVERY':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'DELIVERED':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'RETURNED':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-zinc-100 text-zinc-800 border-zinc-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-zinc-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl font-medium text-[#0a0a0a]">
              Courier Logistics &amp; Parcel Dispatch Console
            </h2>
            <span className="text-[10px] bg-black text-white px-2 py-0.5 font-mono tracking-widest uppercase">
              Module 4
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Carrier partner coordination, parcel consignment tracking, checkpoint updates, and proof-of-delivery signoffs.
          </p>
        </div>
        <button
          onClick={() => {
            if (dispatchableOrders.length > 0) {
              setSelectedOrderId(dispatchableOrders[0].orderId);
            }
            setIsDispatchModalOpen(true);
          }}
          className="h-10 px-5 bg-black hover:bg-zinc-800 text-white text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-colors cursor-pointer self-start md:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Dispatch Order to Courier</span>
        </button>
      </div>

      {notice && (
        <div className="bg-zinc-900 text-white text-xs px-4 py-3 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{notice}</span>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-zinc-200 p-4">
          <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold mb-1">
            Total Consignments
          </div>
          <div className="text-2xl font-serif text-[#0a0a0a]">{totalShipments}</div>
          <div className="text-[10px] text-zinc-500 mt-1">Generated dispatch consignments</div>
        </div>

        <div className="bg-white border border-zinc-200 p-4">
          <div className="text-[11px] uppercase tracking-wider text-purple-700 font-semibold mb-1 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-purple-600" />
            <span>In Transit</span>
          </div>
          <div className="text-2xl font-serif text-zinc-900">{inTransitCount}</div>
          <div className="text-[10px] text-purple-700 mt-1">Between sorting hubs</div>
        </div>

        <div className="bg-white border border-zinc-200 p-4">
          <div className="text-[11px] uppercase tracking-wider text-blue-700 font-semibold mb-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Out for Delivery</span>
          </div>
          <div className="text-2xl font-serif text-blue-900">{outForDeliveryCount}</div>
          <div className="text-[10px] text-blue-700 mt-1">With dispatch rider</div>
        </div>

        <div className="bg-white border border-zinc-200 p-4">
          <div className="text-[11px] uppercase tracking-wider text-emerald-700 font-semibold mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Fulfilled &amp; Signed</span>
          </div>
          <div className="text-2xl font-serif text-[#0a0a0a]">{deliveredCount}</div>
          <div className="text-[10px] text-zinc-500 mt-1">Handed to customer</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-zinc-200 p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tracking #, location, courier, customer..."
            className="w-full h-10 pl-9 pr-3 bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-black text-xs text-[#0a0a0a] outline-none transition-all"
          />
        </div>

        <div className="flex bg-zinc-100 p-0.5 border border-zinc-200 text-xs">
          {(['ALL', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                statusFilter === filter
                  ? 'bg-black text-white shadow-xs'
                  : 'text-zinc-600 hover:text-black'
              }`}
            >
              {filter === 'ALL' ? 'All' : filter.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Shipments Datatable */}
      <div className="bg-white border border-zinc-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] uppercase tracking-wider font-semibold text-zinc-500">
                <th className="py-3 px-4">Tracking Consignment</th>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Carrier Partner</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Current Hub Checkpoint</th>
                <th className="py-3 px-4">Delivery Status</th>
                <th className="py-3 px-4 text-right">Logistics Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredShipments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    <Truck className="w-8 h-8 mx-auto mb-2 stroke-1" />
                    <p className="text-xs uppercase tracking-wider font-medium">No parcel shipments found</p>
                  </td>
                </tr>
              ) : (
                filteredShipments.map((shipment) => {
                  const courier = courierMap.get(shipment.courierId);
                  const order = orderMap.get(shipment.orderId);
                  const isDelivered = shipment.deliveryStatus === 'DELIVERED';

                  return (
                    <tr key={shipment.deliveryId} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <button
                          onClick={() => setTrackingModalNumber(shipment.trackingNumber)}
                          className="font-mono font-bold text-zinc-900 hover:text-purple-700 underline text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <span>{shipment.trackingNumber}</span>
                          <Eye className="w-3 h-3 text-zinc-500" />
                        </button>
                        <div className="text-[10px] text-zinc-500 font-mono">ID #{shipment.deliveryId}</div>
                      </td>

                      <td className="py-3 px-4 font-mono font-semibold text-zinc-900">
                        {order?.orderNumber || `Order #${shipment.orderId}`}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-zinc-900">{courier?.courierName || 'Courier Partner'}</div>
                        <div className="text-[10px] text-zinc-500 font-mono">{courier?.contactNumber}</div>
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-medium text-zinc-900">{order?.customerName}</div>
                        <div className="text-[10px] text-zinc-500 truncate">{order?.shippingAddressSnapshot}</div>
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        <div className="flex items-center gap-1.5 font-medium text-zinc-800">
                          <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <span className="truncate">{shipment.currentLocation || 'In Transit'}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider border ${getDeliveryStatusBadge(
                            shipment.deliveryStatus
                          )}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {shipment.deliveryStatus.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isDelivered ? (
                            <>
                              <button
                                onClick={() => {
                                  setEditingCheckpointShipment(shipment);
                                  setCheckpointLocation(shipment.currentLocation || '');
                                  setNewCheckpointStatus(shipment.deliveryStatus);
                                }}
                                className="min-h-[36px] sm:min-h-[30px] px-3 py-1.5 bg-zinc-100 hover:bg-black hover:text-white text-zinc-800 border border-zinc-300 text-[10px] uppercase tracking-wider font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5 touch-manipulation relative before:absolute before:-inset-1 before:content-['']"
                              >
                                <MapPin className="w-3 h-3" />
                                <span>Update Hub</span>
                              </button>
                              <button
                                onClick={() => handleMarkDelivered(shipment)}
                                className="min-h-[36px] sm:min-h-[30px] px-3 py-1.5 bg-black hover:bg-zinc-800 text-white text-[10px] uppercase tracking-wider font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5 touch-manipulation relative before:absolute before:-inset-1 before:content-['']"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Delivered</span>
                              </button>
                            </>
                          ) : (
                            <span className="text-[11px] text-emerald-700 font-semibold font-mono">
                              Signed &bull; {shipment.deliveredAt?.substring(0, 10)}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Courier Partners Registry Section */}
      <div className="bg-white border border-zinc-200 p-6 space-y-4">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500">
          Integrated Courier Logistics Providers
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {couriers.map((c) => (
            <div key={c.courierId} className="border border-zinc-200 p-4 bg-zinc-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-[#0a0a0a]">{c.courierName}</span>
                <span
                  className={`text-[9px] uppercase px-1.5 py-0.5 border font-semibold ${
                    c.isActive
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                  }`}
                >
                  {c.isActive ? 'Active Carrier' : 'Disabled'}
                </span>
              </div>
              <div className="text-zinc-500 text-xs font-mono">{c.contactNumber}</div>
              <div className="text-[10px] text-zinc-500 truncate">API: {c.trackingApiUrl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Dispatch New Parcel Modal */}
      {isDispatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-zinc-300 w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
              <h3 className="font-serif text-xl text-[#0a0a0a]">
                Dispatch Order to Courier Partner
              </h3>
              <button
                onClick={() => setIsDispatchModalOpen(false)}
                aria-label="Close dialog"
                className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDispatchOrder} className="p-6 space-y-4 text-xs">
              {dispatchableOrders.length === 0 ? (
                <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                  All active orders have already been dispatched or fulfilled. No new packages are awaiting dispatch pickup.
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-zinc-600 mb-1">
                      Select Order to Dispatch
                    </label>
                    <select
                      value={selectedOrderId}
                      onChange={(e) => setSelectedOrderId(Number(e.target.value))}
                      className="w-full h-9 px-2.5 bg-white border border-zinc-300 text-xs font-semibold text-zinc-900 outline-none focus:border-black cursor-pointer"
                    >
                      {dispatchableOrders.map((ord) => (
                        <option key={ord.orderId} value={ord.orderId}>
                          {ord.orderNumber} &bull; {ord.customerName} ({ord.shippingDistrictSnapshot}) — LKR {Number(ord.totalPayable).toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-zinc-600 mb-1">
                      Designated Courier Partner
                    </label>
                    <select
                      value={selectedCourierId}
                      onChange={(e) => {
                        const cid = Number(e.target.value);
                        setSelectedCourierId(cid);
                        setCourierCharge(cid === 1 ? 350 : cid === 2 ? 300 : 280);
                      }}
                      className="w-full h-9 px-2.5 bg-white border border-zinc-300 text-xs font-semibold text-zinc-900 outline-none focus:border-black cursor-pointer"
                    >
                      {couriers.map((c) => (
                        <option key={c.courierId} value={c.courierId}>
                          {c.courierName} ({c.contactNumber})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-zinc-600 mb-1">
                      Courier Logistics Fee (LKR)
                    </label>
                    <input
                      type="number"
                      value={courierCharge}
                      onChange={(e) => setCourierCharge(Number(e.target.value))}
                      className="w-full h-9 px-2.5 bg-white border border-zinc-300 text-xs font-mono text-zinc-900 outline-none focus:border-black"
                    />
                  </div>

                  <div className="bg-zinc-50 border border-zinc-200 p-3 text-[11px] text-zinc-600 space-y-1">
                    <div>
                      &bull; A unique consignment tracking code (e.g. <code>TRK-202610-{selectedOrderId}</code>) will be generated.
                    </div>
                    <div>
                      &bull; Order lifecycle status will automatically advance to <strong className="text-zinc-900">DISPATCHED</strong>.
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsDispatchModalOpen(false)}
                      className="h-9 px-4 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="h-9 px-5 bg-black hover:bg-zinc-800 text-white text-xs uppercase tracking-wider font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? 'Dispatching...' : 'Confirm Dispatch & Generate Code'}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Update Checkpoint Location Modal */}
      {editingCheckpointShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-zinc-300 w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
              <h3 className="font-serif text-xl text-[#0a0a0a]">
                Update Hub Checkpoint Location
              </h3>
              <button
                onClick={() => setEditingCheckpointShipment(null)}
                aria-label="Close dialog"
                className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateCheckpoint} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-zinc-600 mb-1">
                  Tracking Consignment
                </label>
                <div className="font-mono font-bold text-sm text-zinc-900 bg-zinc-100 p-2 border border-zinc-200">
                  {editingCheckpointShipment.trackingNumber}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-zinc-600 mb-1">
                  Updated Location / Logistics Checkpoint
                </label>
                <input
                  type="text"
                  required
                  value={checkpointLocation}
                  onChange={(e) => setCheckpointLocation(e.target.value)}
                  placeholder="E.g. Kandy Central Sorting Bay, Transit Van 12..."
                  className="w-full h-9 px-2.5 bg-white border border-zinc-300 text-xs text-zinc-900 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-zinc-600 mb-1">
                  Delivery Status
                </label>
                <select
                  value={newCheckpointStatus}
                  onChange={(e) => setNewCheckpointStatus(e.target.value as DeliveryStatus)}
                  className="w-full h-9 px-2.5 bg-white border border-zinc-300 text-xs font-semibold text-zinc-900 outline-none focus:border-black cursor-pointer"
                >
                  <option value="IN_TRANSIT">IN_TRANSIT (Between sorting bays)</option>
                  <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY (With final mile courier rider)</option>
                  <option value="DELIVERED">DELIVERED (Signed by recipient)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCheckpointShipment(null)}
                  className="h-9 px-4 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="h-9 px-5 bg-black hover:bg-zinc-800 text-white text-xs uppercase tracking-wider font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Saving...' : 'Save Checkpoint'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer / Staff Live Tracking Modal */}
      <LiveTrackingModal
        trackingNumber={trackingModalNumber}
        isOpen={!!trackingModalNumber}
        onClose={() => setTrackingModalNumber(null)}
      />
    </div>
  );
}
