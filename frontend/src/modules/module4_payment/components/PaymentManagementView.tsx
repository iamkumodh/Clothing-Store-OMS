// payment and shipment component

import React, { useState, useEffect } from 'react';
import { mockDb } from '../../../api/mockDataStore';
import type {
  Payment,
  BankTransferPayment,
  CashOnDeliveryPayment,
  CustomerOrderWithDetails,
  CodCollectionStatus,
} from '../../../types/oms';
import { verifyBankTransfer, updateCodSettlement } from '../../../api/paymentApi';
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  FileText,
  AlertCircle,
  Truck,
  ArrowRight,
  ShieldCheck,
  X,
  ZoomIn,
} from 'lucide-react';

export function PaymentManagementView() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [orders, setOrders] = useState<CustomerOrderWithDetails[]>([]);
  const [activeTab, setActiveTab] = useState<'BANK_TRANSFER' | 'COD'>('BANK_TRANSFER');
  const [slipFilter, setSlipFilter] = useState<'ALL' | 'PENDING' | 'VERIFIED' | 'REJECTED'>('ALL');
  const [codFilter, setCodFilter] = useState<'ALL' | CodCollectionStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Slip Inspector Modal state
  const [inspectingPayment, setInspectingPayment] = useState<{
    payment: Payment;
    bankTransfer: BankTransferPayment;
    order?: CustomerOrderWithDetails;
  } | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('Illegible slip reference or mismatched deposit amount');
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadData = () => {
    setPayments(mockDb.getPayments());
    setOrders(mockDb.getOrdersWithDetails());
  };

  useEffect(() => {
    loadData();
    const unsub = mockDb.subscribe(() => {
      loadData();
    });
    return unsub;
  }, []);

  const orderMap = new Map(orders.map(o => [o.orderId, o]));

  // Metrics computation
  const totalSettledVolume = payments
    .filter(p => p.paymentStatus === 'VERIFIED')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const pendingSlipsCount = payments.filter(p => {
    if (p.paymentMethod !== 'BANK_TRANSFER') return false;
    return p.paymentStatus === 'PENDING';
  }).length;

  const verifiedSlipsCount = payments.filter(p => {
    if (p.paymentMethod !== 'BANK_TRANSFER') return false;
    return p.paymentStatus === 'VERIFIED';
  }).length;

  const codPendingRemittance = payments.filter(p => {
    if (p.paymentMethod !== 'CASH_ON_DELIVERY') return false;
    const cod = mockDb.getCashOnDeliveryPayment(p.paymentId);
    return cod?.cashCollectionStatus !== 'REMITTED_TO_STORE';
  }).length;

  // Handle Slip Verification
  const handleVerifySlip = async (approved: boolean) => {
    if (!inspectingPayment) return;
    setLoading(true);
    try {
      await verifyBankTransfer(
        inspectingPayment.payment.paymentId,
        1, // Chaminda Perera / Staff
        approved,
        approved ? undefined : rejectionReason
      );

      setActionNotice(
        approved
          ? `Deposit slip for Order #${inspectingPayment.payment.orderId} verified and marked PAID.`
          : `Deposit slip for Order #${inspectingPayment.payment.orderId} rejected.`
      );
      setInspectingPayment(null);
      loadData();
      setTimeout(() => setActionNotice(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle COD Remittance Update
  const handleMarkCodRemitted = async (paymentId: number, amount: number) => {
    try {
      await updateCodSettlement({
        paymentId,
        cashCollectionStatus: 'REMITTED_TO_STORE',
        collectedAmount: amount,
      });
      setActionNotice(`COD Payment #${paymentId} marked as remitted to store cash reserves.`);
      loadData();
      setTimeout(() => setActionNotice(null), 3500);
    } catch (err: any) {
      alert(err.message || 'COD settlement failed');
    }
  };

  // Bank Transfer Data preparation
  const bankPayments = payments.filter(p => p.paymentMethod === 'BANK_TRANSFER');
  const filteredBankPayments = bankPayments.filter(p => {
    const bt = mockDb.getBankTransferPayment(p.paymentId);
    const ord = orderMap.get(p.orderId);

    const matchesSearch =
      (ord && ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ord && ord.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (bt && bt.bankName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (bt && bt.depositReference?.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (slipFilter === 'PENDING') return p.paymentStatus === 'PENDING';
    if (slipFilter === 'VERIFIED') return p.paymentStatus === 'VERIFIED';
    if (slipFilter === 'REJECTED') return p.paymentStatus === 'REJECTED' || p.paymentStatus === 'FAILED';
    return true;
  });

  // COD Data preparation
  const codPayments = payments.filter(p => p.paymentMethod === 'CASH_ON_DELIVERY');
  const filteredCodPayments = codPayments.filter(p => {
    const cod = mockDb.getCashOnDeliveryPayment(p.paymentId);
    const ord = orderMap.get(p.orderId);

    const matchesSearch =
      (ord && ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ord && ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (codFilter !== 'ALL' && cod?.cashCollectionStatus !== codFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-zinc-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl font-medium text-[#0a0a0a]">
              Payment Settlement &amp; Verification Console
            </h2>
            <span className="text-[10px] bg-black text-white px-2 py-0.5 font-mono tracking-widest uppercase">
              Module 4
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Bank transfer deposit slip audit queue, cash on delivery (COD) courier remittance reconciliation, and financial auditing.
          </p>
        </div>
      </div>

      {actionNotice && (
        <div className="bg-zinc-900 text-white text-xs px-4 py-3 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{actionNotice}</span>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-zinc-200 p-4">
          <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold mb-1">
            Total Settled Volume
          </div>
          <div className="text-2xl font-serif text-[#0a0a0a]">
            LKR {totalSettledVolume.toLocaleString()}
          </div>
          <div className="text-[10px] text-zinc-500 mt-1">Confirmed customer payments</div>
        </div>

        <div className={`p-4 border ${pendingSlipsCount > 0 ? 'bg-amber-50/40 border-amber-300' : 'bg-white border-zinc-200'}`}>
          <div className="text-[11px] uppercase tracking-wider text-amber-700 font-semibold mb-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Pending Slip Audits</span>
          </div>
          <div className="text-2xl font-serif text-amber-900">{pendingSlipsCount}</div>
          <div className="text-[10px] text-amber-700 mt-1">Awaiting cashier review</div>
        </div>

        <div className="bg-white border border-zinc-200 p-4">
          <div className="text-[11px] uppercase tracking-wider text-emerald-700 font-semibold mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified Transfers</span>
          </div>
          <div className="text-2xl font-serif text-[#0a0a0a]">{verifiedSlipsCount}</div>
          <div className="text-[10px] text-zinc-500 mt-1">Slips stamped & approved</div>
        </div>

        <div className={`p-4 border ${codPendingRemittance > 0 ? 'bg-blue-50/40 border-blue-300' : 'bg-white border-zinc-200'}`}>
          <div className="text-[11px] uppercase tracking-wider text-blue-700 font-semibold mb-1 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-blue-600" />
            <span>COD In Courier Custody</span>
          </div>
          <div className="text-2xl font-serif text-blue-900">{codPendingRemittance}</div>
          <div className="text-[10px] text-blue-700 mt-1">Pending store remittance</div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex border-b border-zinc-200 bg-white">
        <button
          onClick={() => setActiveTab('BANK_TRANSFER')}
          className={`flex items-center gap-2 py-3.5 px-6 text-xs uppercase tracking-wider font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'BANK_TRANSFER'
              ? 'border-black text-black'
              : 'border-transparent text-zinc-500 hover:text-black'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Bank Deposit Slips ({bankPayments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('COD')}
          className={`flex items-center gap-2 py-3.5 px-6 text-xs uppercase tracking-wider font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'COD'
              ? 'border-black text-black'
              : 'border-transparent text-zinc-500 hover:text-black'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Cash on Delivery (COD) Remittance ({codPayments.length})</span>
        </button>
      </div>

      {/* Search and Sub-filters */}
      <div className="bg-white border border-zinc-200 p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order ref, bank name, reference..."
            className="w-full h-10 pl-9 pr-3 bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-black text-xs text-[#0a0a0a] outline-none transition-all"
          />
        </div>

        {activeTab === 'BANK_TRANSFER' ? (
          <div className="flex bg-zinc-100 p-0.5 border border-zinc-200 text-xs">
            {(['ALL', 'PENDING', 'VERIFIED', 'REJECTED'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSlipFilter(filter)}
                className={`px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  slipFilter === filter
                    ? 'bg-black text-white shadow-xs'
                    : 'text-zinc-600 hover:text-black'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex bg-zinc-100 p-0.5 border border-zinc-200 text-xs">
            {(['ALL', 'UNCOLLECTED', 'COLLECTED_BY_COURIER', 'REMITTED_TO_STORE'] as const).map(
              (filter) => (
                <button
                  key={filter}
                  onClick={() => setCodFilter(filter)}
                  className={`px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                    codFilter === filter
                      ? 'bg-black text-white shadow-xs'
                      : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  {filter.replace('_', ' ')}
                </button>
              )
            )}
          </div>
        )}
      </div>

      {/* Panels */}
      {activeTab === 'BANK_TRANSFER' ? (
        <div className="bg-white border border-zinc-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] uppercase tracking-wider font-semibold text-zinc-500">
                  <th className="py-3 px-4">Payment ID</th>
                  <th className="py-3 px-4">Order Reference</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Bank &amp; Deposit Ref</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Slip Preview</th>
                  <th className="py-3 px-4">Verification Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredBankPayments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-zinc-500">
                      <CreditCard className="w-8 h-8 mx-auto mb-2 stroke-1" />
                      <p className="text-xs uppercase tracking-wider font-medium">No bank transfer payments found</p>
                    </td>
                  </tr>
                ) : (
                  filteredBankPayments.map((payment) => {
                    const order = orderMap.get(payment.orderId);
                    const bt = mockDb.getBankTransferPayment(payment.paymentId);
                    const isPending = payment.paymentStatus === 'PENDING';
                    const isVerified = payment.paymentStatus === 'VERIFIED';

                    return (
                      <tr key={payment.paymentId} className="hover:bg-zinc-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-zinc-900">
                          #{payment.paymentId}
                        </td>

                        <td className="py-3 px-4 font-mono font-semibold text-zinc-900">
                          {order?.orderNumber || `Order #${payment.orderId}`}
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-medium text-zinc-900">{order?.customerName || 'Customer'}</div>
                          <div className="text-[10px] text-zinc-500 font-mono">{order?.customerPhone}</div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-semibold text-zinc-800">{bt?.bankName || 'Commercial Bank'}</div>
                          <div className="text-[10px] font-mono text-zinc-500">
                            Ref: {bt?.depositReference || 'DEP-REF'}
                          </div>
                        </td>

                        <td className="py-3 px-4 font-mono font-bold text-zinc-900">
                          LKR {Number(payment.amount).toLocaleString()}
                        </td>

                        <td className="py-3 px-4">
                          {bt?.slipImageUrl ? (
                            <button
                              onClick={() =>
                                setInspectingPayment({
                                  payment,
                                  bankTransfer: bt,
                                  order,
                                })
                              }
                              className="group relative w-12 h-14 border border-zinc-200 overflow-hidden bg-zinc-100 cursor-pointer"
                            >
                              <img
                                src={bt.slipImageUrl}
                                alt="Deposit slip thumbnail"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <ZoomIn className="w-4 h-4 text-white" />
                              </div>
                            </button>
                          ) : (
                            <span className="text-zinc-500 italic text-[11px]">No slip uploaded</span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          {isVerified ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              Verified Paid
                            </span>
                          ) : isPending ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                              Pending Audit
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                              Rejected
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() =>
                              setInspectingPayment({
                                payment,
                                bankTransfer: bt || {
                                  paymentId: payment.paymentId,
                                  bankName: 'Commercial Bank',
                                  slipImageUrl: '/images/dfine-img-001.png',
                                  verifiedByStaffId: null,
                                },
                                order,
                              })
                            }
                            className="h-8 px-3 bg-zinc-100 hover:bg-black hover:text-white text-zinc-800 border border-zinc-300 text-[11px] uppercase tracking-wider font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect Slip</span>
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
      ) : (
        /* COD Reconciliation Table */
        <div className="bg-white border border-zinc-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] uppercase tracking-wider font-semibold text-zinc-500">
                  <th className="py-3 px-4">Payment ID</th>
                  <th className="py-3 px-4">Order Reference</th>
                  <th className="py-3 px-4">Customer Destination</th>
                  <th className="py-3 px-4">Payable Amount</th>
                  <th className="py-3 px-4">Courier Collection Status</th>
                  <th className="py-3 px-4">Remitted Date</th>
                  <th className="py-3 px-4 text-right">Settlement Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredCodPayments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-zinc-500">
                      <Truck className="w-8 h-8 mx-auto mb-2 stroke-1" />
                      <p className="text-xs uppercase tracking-wider font-medium">No COD orders found</p>
                    </td>
                  </tr>
                ) : (
                  filteredCodPayments.map((payment) => {
                    const order = orderMap.get(payment.orderId);
                    const cod = mockDb.getCashOnDeliveryPayment(payment.paymentId);
                    const isRemitted = cod?.cashCollectionStatus === 'REMITTED_TO_STORE';

                    return (
                      <tr key={payment.paymentId} className="hover:bg-zinc-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-zinc-900">
                          #{payment.paymentId}
                        </td>

                        <td className="py-3 px-4 font-mono font-semibold text-zinc-900">
                          {order?.orderNumber || `Order #${payment.orderId}`}
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-medium text-zinc-900">{order?.customerName}</div>
                          <div className="text-[10px] text-zinc-500 truncate max-w-xs">
                            {order?.shippingAddressSnapshot}
                          </div>
                        </td>

                        <td className="py-3 px-4 font-mono font-bold text-zinc-900">
                          LKR {Number(payment.amount).toLocaleString()}
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider border ${
                              isRemitted
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : cod?.cashCollectionStatus === 'COLLECTED_BY_COURIER'
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                          >
                            {cod?.cashCollectionStatus?.replace('_', ' ') || 'PENDING COLLECTION'}
                          </span>
                        </td>

                        <td className="py-3 px-4 font-mono text-zinc-500 text-[11px]">
                          {cod?.courierRemittanceDate || '—'}
                        </td>

                        <td className="py-3 px-4 text-right">
                          {!isRemitted ? (
                            <button
                              onClick={() => handleMarkCodRemitted(payment.paymentId, Number(payment.amount))}
                              className="h-8 px-3 bg-black hover:bg-zinc-800 text-white text-[11px] uppercase tracking-wider font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Confirm Remittance</span>
                            </button>
                          ) : (
                            <span className="text-[11px] text-emerald-700 font-semibold font-mono">
                              Settled to Store
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* High-Resolution Deposit Slip Inspector Modal */}
      {inspectingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-zinc-300 w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
              <div>
                <h3 className="font-serif text-xl text-[#0a0a0a]">
                  Bank Transfer Deposit Slip Inspector
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Order {inspectingPayment.order?.orderNumber} &bull; Total Amount: LKR{' '}
                  {Number(inspectingPayment.payment.amount).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setInspectingPayment(null)}
                aria-label="Close dialog"
                className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Slip Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-50 border border-zinc-200 p-3.5">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold block">
                    Bank Account
                  </span>
                  <span className="font-medium text-zinc-900">
                    {inspectingPayment.bankTransfer.bankName}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold block">
                    Deposit Reference
                  </span>
                  <span className="font-mono font-semibold text-zinc-900">
                    {inspectingPayment.bankTransfer.depositReference || 'None'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold block">
                    Order Payable
                  </span>
                  <span className="font-mono font-bold text-zinc-900">
                    LKR {Number(inspectingPayment.payment.amount).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold block">
                    Customer Name
                  </span>
                  <span className="font-medium text-zinc-900">
                    {inspectingPayment.order?.customerName || 'Verified Buyer'}
                  </span>
                </div>
              </div>

              {/* High-Res Image Viewport */}
              <div className="border border-zinc-300 bg-zinc-100 p-2 text-center">
                <div className="max-h-96 overflow-auto">
                  <img
                    src={inspectingPayment.bankTransfer.slipImageUrl}
                    alt="Customer uploaded bank deposit receipt"
                    className="mx-auto object-contain max-h-96 shadow-md"
                  />
                </div>
                <div className="text-[11px] text-zinc-500 mt-2">
                  Verify transaction timestamp, beneficiary account number, and net credited amount.
                </div>
              </div>

              {/* Rejection Remarks input */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-1 font-semibold">
                  Rejection Reason (Used if declining slip)
                </label>
                <input
                  type="text"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full h-9 px-2.5 bg-white border border-zinc-300 text-xs text-zinc-900 outline-none focus:border-black"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-zinc-200">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleVerifySlip(false)}
                  className="w-full sm:w-auto h-10 px-5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject Deposit Slip</span>
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleVerifySlip(true)}
                  className="w-full sm:w-auto h-10 px-6 bg-black hover:bg-zinc-800 text-white text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Approve Slip &amp; Mark Order Paid</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
