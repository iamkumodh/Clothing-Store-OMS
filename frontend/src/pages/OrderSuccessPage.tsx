// order confirmation page

import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { fetchOrderById, CustomerOrderResponse } from '../api/orderApi';
import { submitBankTransfer, verifyBankTransfer, BankTransferResponse } from '../api/paymentApi';
import { LiveTrackingModal } from '../modules/module4_payment/components/LiveTrackingModal';
import {
  CheckCircle,
  Clock,
  UploadCloud,
  FileCheck,
  ShieldAlert,
  ArrowRight,
  Printer,
  ShoppingBag,
  ExternalLink,
  Building,
  CheckCircle2,
  AlertCircle,
  Truck,
  Loader2,
} from 'lucide-react';

export default function OrderSuccessPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();

  const [order, setOrder] = useState<CustomerOrderResponse | null>(
    (location.state as any)?.order || null
  );
  const [loading, setLoading] = useState(!order);

  // Live Tracking Modal state (Module 4)
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  // Bank Slip Upload state (Module 4)
  const [bankName, setBankName] = useState('Commercial Bank of Ceylon');
  const [depositReference, setDepositReference] = useState(`REF-${Date.now().toString().slice(-6)}`);
  const [slipImage, setSlipImage] = useState<string | null>(null);
  const [slipFileName, setSlipFileName] = useState<string | null>(null);

  // Transfer & Verification Status (Module 4)
  const [transfer, setTransfer] = useState<BankTransferResponse | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!order && orderId) {
      fetchOrderById(orderId).then(res => {
        setOrder(res);
        setLoading(false);
      });
    }

    // Check if transfer was previously uploaded
    if (orderId) {
      const cached = localStorage.getItem(`dfine_transfer_${orderId}`);
      if (cached) {
        try {
          setTransfer(JSON.parse(cached));
        } catch {
          // ignore
        }
      }
    }
  }, [orderId, order]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSlipFileName(file.name);
      const reader = new FileReader();
      reader.onload = event => {
        setSlipImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSlip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    setIsUploading(true);
    setActionNotice(null);

    try {
      const res = await submitBankTransfer({
        orderId: order.orderId,
        bankName,
        depositReference,
        slipImageBase64: slipImage || 'data:image/png;base64,mockSlipReceiptPreview',
      });
      setTransfer(res);
      setActionNotice('Payment slip successfully uploaded! Awaiting store staff verification.');
    } catch (err) {
      console.error('Slip upload error', err);
      setActionNotice('Failed to upload payment slip. Please check details.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleVerifyPayment = async () => {
    if (!order) return;
    setIsVerifying(true);
    setActionNotice(null);

    const targetTransferId = transfer?.transferId || order.orderId;

    try {
      const res = await verifyBankTransfer(targetTransferId, 1);
      setTransfer(res);

      // Advance Order Status from PENDING to PROCESSING (Member 3 & 4 Integration)
      setOrder(prev => (prev ? { ...prev, orderStatus: 'PROCESSING' } : prev));
      setActionNotice('Verified! Payment confirmed by Store Staff. Order status updated to PROCESSING.');
    } catch (err) {
      console.error('Verification error', err);
      setActionNotice('Verification failed.');
    } finally {
      setIsVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
        <p className="text-xs uppercase tracking-wider text-zinc-500 mt-3">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <AlertCircle className="w-12 h-12 mx-auto text-zinc-700 mb-3" />
        <h2 className="text-xl font-bold text-[#0a0a0a]">Order Not Found</h2>
        <p className="text-xs text-zinc-500 mt-1 mb-6">
          Could not locate the requested order reference.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-2.5 bg-black hover:bg-zinc-800 text-white text-xs uppercase tracking-wider font-semibold rounded-[2px] transition-colors"
        >
          Return to Storefront
        </Link>
      </div>
    );
  }

  const subtotal = Number(order.subtotalAmount ?? 0);
  const courierCharge = Number(order.courierCharge ?? (order as any).shippingFee ?? 350);
  const totalAmount = Number(order.totalAmount ?? (order as any).totalPayable ?? (subtotal + courierCharge));
  const recipientName = order.recipientName || (order as any).customerName || 'Customer';
  const recipientPhone = order.recipientPhone || (order as any).customerPhone || '';
  const shippingAddress = order.shippingAddress || (order as any).shippingAddressSnapshot || 'Colombo';
  const paymentMethod = order.paymentMethod || 'BANK_TRANSFER';
  const isBankTransfer = paymentMethod === 'BANK_TRANSFER';
  const isVerified = transfer?.verificationStatus === 'VERIFIED';

  return (
    <div className="bg-zinc-50 min-h-[calc(100vh-80px)] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Success Header Banner */}
        <div className="bg-white border border-zinc-200 rounded-[2px] p-6 sm:p-8 text-center shadow-xs">
          <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-black font-bold bg-zinc-100 border border-zinc-200 px-3 py-1 rounded-[2px]">
            Order #{order.orderNumber || order.orderId}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0a0a0a] mt-3">
            Thank You! Your Order has been Placed.
          </h1>
          <p className="text-xs text-zinc-500 max-w-lg mx-auto mt-2">
            A confirmation has been recorded in the D'fine Order Management System. Please review the payment and delivery instructions below.
          </p>

          {actionNotice && (
            <div className="mt-4 max-w-lg mx-auto p-3 bg-zinc-100 border border-zinc-300 text-xs text-black rounded-[2px] flex items-center gap-2 text-left">
              <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
              <span>{actionNotice}</span>
            </div>
          )}
        </div>

        {/* 2-Column Split: Member 3 Order Status & Member 4 Payment Verification */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Member 3 Order Summary & Status */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white border border-zinc-200 rounded-[2px] p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
                <div>
                  <h2 className="text-base font-bold text-[#0a0a0a]">Order Information</h2>
                  <p className="text-xs text-zinc-500 mt-0.5">Order summary and current delivery status.</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">Order Status</span>
                  <span
                    className={`inline-block px-2.5 py-0.5 text-xs font-bold rounded-[2px] uppercase tracking-wider ${
                      order.orderStatus === 'PROCESSING'
                        ? 'bg-zinc-900 text-white'
                        : 'bg-zinc-100 text-zinc-900 border border-zinc-200'
                    }`}
                  >
                    {order.orderStatus || 'PENDING'}
                  </span>
                </div>
              </div>

              {/* Delivery Details */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-zinc-500 block uppercase tracking-wider text-[10px]">Recipient</span>
                  <span className="font-semibold text-[#0a0a0a] mt-0.5 block">{recipientName}</span>
                  <span className="text-zinc-500">{recipientPhone}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block uppercase tracking-wider text-[10px]">Shipping Destination</span>
                  <span className="font-medium text-[#0a0a0a] mt-0.5 block leading-relaxed">
                    {shippingAddress}
                  </span>
                </div>
              </div>

              {/* Ordered Items */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0a0a0a] mb-3">
                  Purchased Items ({order.items?.length || 1})
                </h3>
                <div className="divide-y divide-zinc-100 border-t border-b border-zinc-200">
                  {(order.items || []).map(item => (
                    <div key={item.orderItemId} className="py-3 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        {item.customImageUrl && (
                          <div className="w-10 h-12 bg-zinc-100 rounded-[2px] overflow-hidden shrink-0 border border-zinc-200">
                            <img src={item.customImageUrl} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="truncate">
                          <p className="font-semibold text-[#0a0a0a] truncate">{item.productTitle}</p>
                          <p className="text-[11px] text-zinc-500">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono font-semibold text-[#0a0a0a]">
                          LKR {Number(item.subtotal || 0).toLocaleString()}.00
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Totals */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-zinc-500">
                  <span>Items Subtotal</span>
                  <span className="font-mono text-[#0a0a0a]">LKR {subtotal.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Courier Shipping Fee</span>
                  <span className="font-mono text-[#0a0a0a]">LKR {courierCharge}.00</span>
                </div>
                <div className="border-t border-zinc-200 pt-3 flex justify-between text-sm font-bold text-[#0a0a0a]">
                  <span>Total Amount</span>
                  <span className="font-mono text-base text-[#0a0a0a]">
                    LKR {totalAmount.toLocaleString()}.00
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Member 4 Payment Handling & Verification */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white border border-zinc-200 rounded-[2px] p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
                <div>
                  <h2 className="text-base font-bold text-[#0a0a0a]">Payment & Verification</h2>
                  <p className="text-xs text-zinc-500 mt-0.5">Bank deposit instructions and payment clearance.</p>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-mono font-semibold bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-[2px]">
                  {order.paymentMethod === 'BANK_TRANSFER' ? 'Bank Transfer' : 'Cash on Delivery'}
                </span>
              </div>

              {isBankTransfer ? (
                <>
                  {/* D'fine Official Bank Details */}
                  <div className="bg-zinc-50 border border-zinc-200 rounded-[2px] p-4 text-xs space-y-2">
                    <div className="flex items-center gap-2 text-[#0a0a0a] font-bold">
                      <Building className="w-4 h-4 text-black" />
                      <span>D'fine Bank Account Credentials</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-zinc-500 pt-1">
                      <div>
                        <span className="block text-[10px] uppercase">Bank</span>
                        <span className="font-semibold text-[#0a0a0a]">Commercial Bank</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase">Account Number</span>
                        <span className="font-mono font-semibold text-[#0a0a0a]">8001234567</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase">Account Name</span>
                        <span className="text-[#0a0a0a]">D'fine Clothing Retail Ltd</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase">Branch</span>
                        <span className="text-[#0a0a0a]">Colombo 03 (Kollupitiya)</span>
                      </div>
                    </div>
                  </div>

                  {/* Bank Slip Upload Form */}
                  <form onSubmit={handleUploadSlip} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#0a0a0a] mb-1">
                        Depositing Bank Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={bankName}
                        onChange={e => setBankName(e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-[2px] text-xs focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#0a0a0a] mb-1">
                        Deposit Slip / Transaction Reference *
                      </label>
                      <input
                        type="text"
                        required
                        value={depositReference}
                        onChange={e => setDepositReference(e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-[2px] text-xs font-mono focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                      />
                    </div>

                    {/* File Attachment & Preview */}
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#0a0a0a] mb-1">
                        Bank Deposit Receipt / Slip Image
                      </label>
                      <div className="border border-dashed border-zinc-300 rounded-[2px] p-4 text-center hover:bg-zinc-50 transition-colors relative cursor-pointer">
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <UploadCloud className="w-6 h-6 mx-auto text-zinc-500 mb-1" />
                        <span className="text-xs text-[#0a0a0a] font-medium block">
                          {slipFileName ? slipFileName : 'Click or drag bank slip image to upload'}
                        </span>
                        <span className="text-[10px] text-zinc-500 block mt-0.5">PNG, JPG, or PDF (Max 5MB)</span>
                      </div>

                      {slipImage && (
                        <div className="mt-3 p-2 bg-zinc-100 rounded-[2px] flex items-center justify-between text-xs border border-zinc-200">
                          <span className="text-[#0a0a0a] font-medium truncate max-w-xs">{slipFileName}</span>
                          <span className="text-[10px] text-black font-semibold bg-zinc-200 px-2 py-0.5 rounded">Attached</span>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isUploading || isVerified}
                      className="w-full py-3 bg-black hover:bg-zinc-800 disabled:bg-zinc-300 text-white font-semibold text-xs uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer"
                    >
                      {isUploading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting Slip...
                        </span>
                      ) : isVerified ? (
                        'Slip Uploaded & Verified'
                      ) : (
                        'Submit Payment Slip'
                      )}
                    </button>
                  </form>

                  {/* Store Operations / Payment Clearance Panel */}
                  <div className="mt-6 pt-5 border-t border-zinc-200">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-[2px] p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[#0a0a0a] font-bold text-xs uppercase tracking-wider">
                          <FileCheck className="w-4 h-4 text-black" />
                          <span>Store Operations • Payment Clearance</span>
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[2px] ${
                            isVerified ? 'bg-black text-white' : 'bg-zinc-200 text-zinc-800'
                          }`}
                        >
                          {isVerified ? 'Payment Cleared' : 'Pending Audit'}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 leading-relaxed">
                        {isVerified
                          ? 'Customer bank deposit receipt has been validated against store accounts. Order is approved and queued for warehouse packaging.'
                          : 'Customer bank deposit receipt has been received. Authorized staff may verify transaction credentials to authorize and release order fulfillment.'}
                      </p>
                      <button
                        onClick={handleVerifyPayment}
                        disabled={isVerifying || isVerified}
                        className={`w-full py-2.5 text-xs font-semibold uppercase tracking-wider rounded-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          isVerified
                            ? 'bg-zinc-800 text-white cursor-default'
                            : 'bg-black hover:bg-zinc-800 text-white shadow-xs'
                        }`}
                      >
                        {isVerifying ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : isVerified ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" /> Payment Cleared • Processing Order
                          </>
                        ) : (
                          <>
                            <FileCheck className="w-3.5 h-3.5" /> Authorize & Clear Payment
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Cash On Delivery View */
                <div className="space-y-4">
                  <div className="bg-zinc-100 border border-zinc-300 rounded-[2px] p-5 text-black space-y-2">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <Truck className="w-5 h-5 text-black" />
                      <span>Cash on Delivery Selected</span>
                    </div>
                    <p className="text-xs text-zinc-700 leading-relaxed">
                      Your order has been queued for warehouse packing. Please prepare exact cash of{' '}
                      <strong>LKR {totalAmount.toLocaleString()}.00</strong> for the delivery courier upon arrival.
                    </p>
                  </div>

                  <div className="bg-zinc-50 border border-zinc-200 rounded-[2px] p-4 text-xs text-zinc-500 space-y-1">
                    <span className="font-semibold text-[#0a0a0a] block">Next Steps:</span>
                    <p>1. Our logistics partner will contact you via {recipientPhone || 'your contact number'} before dispatch.</p>
                    <p>2. Keep exact change ready to speed up delivery confirmation.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Back to Shopping Action & Live Tracking */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <Link to="/collections/all" className="text-zinc-500 hover:text-black flex items-center gap-1 font-medium transition-colors">
                Continue Shopping
              </Link>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsTrackingOpen(true)}
                  className="px-3 py-1.5 bg-black hover:bg-zinc-800 text-white text-[11px] uppercase tracking-wider font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Track Package Live</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="text-zinc-500 hover:text-black flex items-center gap-1.5 font-medium cursor-pointer transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Summary
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Tracking Modal */}
      <LiveTrackingModal
        trackingNumber={order.orderNumber || `TRK-202610-${order.orderId}`}
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
      />
    </div>
  );
}
