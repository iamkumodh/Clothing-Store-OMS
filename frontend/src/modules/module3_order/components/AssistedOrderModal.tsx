// order management component

import React, { useState, useEffect } from 'react';
import { mockDb } from '../../../api/mockDataStore';
import type {
  ProductVariant,
  Product,
  Customer,
  StoreStaff,
  CreateOrderDto,
  OrderSource,
  PaymentMethod,
} from '../../../types/oms';
import { createAssistedOrder } from '../../../api/orderApi';
import {
  X,
  ShoppingBag,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  User,
  CreditCard,
  Truck,
  Sparkles,
} from 'lucide-react';

interface AssistedOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated?: () => void;
}

interface SelectedLineItem {
  variantId: number;
  quantity: number;
  unitPrice: number;
}

export function AssistedOrderModal({
  isOpen,
  onClose,
  onOrderCreated,
}: AssistedOrderModalProps) {
  if (!isOpen) return null;

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [staffList, setStaffList] = useState<StoreStaff[]>([]);

  // Form State
  const [orderSource, setOrderSource] = useState<OrderSource>('IN_STORE_POS');
  const [selectedStaffId, setSelectedStaffId] = useState<number>(3); // Dilshan Jayasinghe (Cashier)
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | 'NEW'>(1);
  const [customerName, setCustomerName] = useState<string>('Kavindu Bandara');
  const [customerEmail, setCustomerEmail] = useState<string>('kavindu.bandara@gmail.com');
  const [customerPhone, setCustomerPhone] = useState<string>('+94771234567');
  const [shippingAddress, setShippingAddress] = useState<string>('D\'fine Store POS Flagship Checkout');
  const [shippingDistrict, setShippingDistrict] = useState<string>('Colombo');
  const [shippingProvince, setShippingProvince] = useState<string>('Western');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH_ON_DELIVERY');
  const [courierPartnerId, setCourierPartnerId] = useState<number>(1);
  const [notes, setNotes] = useState<string>('Walk-in POS purchase settled at cashier terminal');

  // Line items state
  const [lineItems, setLineItems] = useState<SelectedLineItem[]>([
    { variantId: 1, quantity: 1, unitPrice: 4500 },
  ]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<{
    orderNumber: string;
    totalPayable: number;
    invoiceNumber?: string;
  } | null>(null);

  useEffect(() => {
    setCustomers(mockDb.getCustomers());
    setVariants(mockDb.getVariants());
    setProducts(mockDb.getProducts());
    setStaffList(mockDb.getStoreStaff());
  }, [isOpen]);

  const productMap = new Map(products.map(p => [p.productId, p]));
  const variantMap = new Map(variants.map(v => [v.variantId, v]));

  // Auto-fill customer details when customer dropdown changes
  const handleCustomerSelect = (val: string) => {
    if (val === 'NEW') {
      setSelectedCustomerId('NEW');
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
      setShippingAddress('In-Store Pickup / Cashier Bay');
    } else {
      const cId = Number(val);
      setSelectedCustomerId(cId);
      const c = customers.find(item => item.customerId === cId);
      if (c) {
        setCustomerName(`${c.firstName} ${c.lastName}`);
        setCustomerEmail(c.email);
        setCustomerPhone(c.contactNumber);
        setShippingAddress(c.shippingAddress);
        setShippingDistrict(c.district);
        setShippingProvince(c.province);
      }
    }
  };

  const handleAddLineItem = () => {
    const firstInStock = variants.find(v => v.stockQuantity > 0) || variants[0];
    const prod = productMap.get(firstInStock.productId);
    setLineItems(prev => [
      ...prev,
      {
        variantId: firstInStock.variantId,
        quantity: 1,
        unitPrice: prod?.basePrice || 4500,
      },
    ]);
  };

  const handleRemoveLineItem = (index: number) => {
    if (lineItems.length === 1) return;
    setLineItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index: number, newVariantId: number) => {
    const v = variantMap.get(newVariantId);
    const prod = v ? productMap.get(v.productId) : null;
    setLineItems(prev =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              variantId: newVariantId,
              unitPrice: prod?.basePrice || item.unitPrice,
            }
          : item
      )
    );
  };

  const handleQuantityChange = (index: number, qty: number) => {
    setLineItems(prev =>
      prev.map((item, i) => (i === index ? { ...item, quantity: Math.max(1, qty) } : item))
    );
  };

  // Financial calculations
  const subtotal = lineItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const shippingFee = orderSource === 'IN_STORE_POS' ? 0 : 350;
  const totalPayable = subtotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validate quantities against stock
    for (const item of lineItems) {
      const v = variantMap.get(item.variantId);
      if (!v) {
        setErrorMsg(`Variant #${item.variantId} not found.`);
        return;
      }
      if (v.stockQuantity < item.quantity) {
        setErrorMsg(
          `Insufficient stock for SKU ${v.sku}. Available: ${v.stockQuantity}, Requested: ${item.quantity}.`
        );
        return;
      }
    }

    setLoading(true);
    try {
      const dto: CreateOrderDto = {
        customerId: typeof selectedCustomerId === 'number' ? selectedCustomerId : 1,
        orderSource,
        assistedByStaffId: selectedStaffId,
        customerName: customerName.trim() || 'Store Guest',
        customerEmail: customerEmail.trim() || 'pos-guest@dfine.lk',
        customerPhone: customerPhone.trim() || '+94112000000',
        shippingAddress: shippingAddress.trim() || 'Flagship Store Walk-in',
        shippingDistrict,
        shippingProvince,
        courierPartnerId: orderSource === 'IN_STORE_POS' ? 1 : courierPartnerId,
        paymentMethod,
        shippingFee,
        items: lineItems.map(it => ({
          variantId: it.variantId,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
        })),
        notes,
      };

      const result = await createAssistedOrder(dto);
      setSuccessResult({
        orderNumber: result.orderNumber,
        totalPayable: Number(result.totalPayable),
        invoiceNumber: result.invoice?.invoiceNumber,
      });

      if (onOrderCreated) {
        onOrderCreated();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to place assisted order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white border border-zinc-300 w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-2xl font-medium text-[#0a0a0a]">
                New Staff-Assisted / POS Order
              </h2>
              <span className="text-[10px] bg-black text-white px-2 py-0.5 font-mono tracking-widest uppercase">
                Module 3
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Process in-person retail sales, phone bookings, and social media DM orders with staff attribution.
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {successResult ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl text-[#0a0a0a]">
                Assisted Order Successfully Placed!
              </h3>
              <div className="max-w-md mx-auto bg-zinc-50 border border-zinc-200 p-4 space-y-2 text-xs text-left">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Order Reference:</span>
                  <span className="font-mono font-bold text-zinc-900">{successResult.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Tax Invoice No:</span>
                  <span className="font-mono font-semibold text-zinc-900">
                    {successResult.invoiceNumber || 'INV-202610-POS'}
                  </span>
                </div>
                <div className="flex justify-between border-t border-zinc-200 pt-2 font-semibold">
                  <span>Total Amount Paid / Payable:</span>
                  <span className="font-mono text-emerald-700">LKR {successResult.totalPayable.toLocaleString()}</span>
                </div>
              </div>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Garment variants have been decremented from inventory with optimistic lock version incremented.
              </p>
              <button
                onClick={() => {
                  setSuccessResult(null);
                  onClose();
                }}
                className="h-10 px-6 bg-black hover:bg-zinc-800 text-white text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Channel and Staff Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-50 border border-zinc-200 p-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-semibold text-zinc-600 mb-1">
                    Order Sales Channel
                  </label>
                  <select
                    value={orderSource}
                    onChange={(e) => setOrderSource(e.target.value as OrderSource)}
                    className="w-full h-9 px-2.5 bg-white border border-zinc-300 text-xs font-semibold text-zinc-900 outline-none focus:border-black cursor-pointer"
                  >
                    <option value="IN_STORE_POS">In-Store Retail POS (Flagship Store)</option>
                    <option value="PHONE_ORDER">Phone / WhatsApp / Instagram DM Assisted</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-semibold text-zinc-600 mb-1">
                    Assisting Staff Attendant
                  </label>
                  <select
                    value={selectedStaffId}
                    onChange={(e) => setSelectedStaffId(Number(e.target.value))}
                    className="w-full h-9 px-2.5 bg-white border border-zinc-300 text-xs font-semibold text-zinc-900 outline-none focus:border-black cursor-pointer"
                  >
                    {staffList.map((s) => (
                      <option key={s.staffId} value={s.staffId}>
                        {s.firstName} {s.lastName} ({s.designation})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Customer Selector */}
              <div className="space-y-3">
                <div className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>Customer Information</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
                      Choose Customer
                    </label>
                    <select
                      value={selectedCustomerId}
                      onChange={(e) => handleCustomerSelect(e.target.value)}
                      className="w-full h-9 px-2 bg-white border border-zinc-300 text-xs text-zinc-800 outline-none cursor-pointer"
                    >
                      {customers.map((c) => (
                        <option key={c.customerId} value={c.customerId}>
                          {c.firstName} {c.lastName} ({c.city})
                        </option>
                      ))}
                      <option value="NEW">+ Walk-in Guest</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full h-9 px-2.5 bg-white border border-zinc-300 text-xs text-zinc-900 outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full h-9 px-2.5 bg-white border border-zinc-300 text-xs text-zinc-900 outline-none focus:border-black font-mono"
                    />
                  </div>
                </div>

                {orderSource === 'PHONE_ORDER' && (
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
                      Delivery Shipping Address
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="Street address, city, district..."
                      className="w-full h-9 px-2.5 bg-white border border-zinc-300 text-xs text-zinc-900 outline-none focus:border-black"
                    />
                  </div>
                )}
              </div>

              {/* Line Items Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500 flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Garment Line Items</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddLineItem}
                    className="text-xs uppercase font-semibold text-black hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2 border border-zinc-200 p-3 bg-zinc-50">
                  {lineItems.map((item, idx) => {
                    const v = variantMap.get(item.variantId);
                    const prod = v ? productMap.get(v.productId) : null;

                    return (
                      <div
                        key={idx}
                        className="grid grid-cols-12 gap-2 items-center bg-white border border-zinc-200 p-2 text-xs"
                      >
                        <div className="col-span-6 sm:col-span-5">
                          <label className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-0.5">
                            Garment SKU Variant
                          </label>
                          <select
                            value={item.variantId}
                            onChange={(e) => handleVariantChange(idx, Number(e.target.value))}
                            className="w-full h-8 px-2 bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 outline-none cursor-pointer"
                          >
                            {variants.map((variant) => {
                              const p = productMap.get(variant.productId);
                              return (
                                <option key={variant.variantId} value={variant.variantId}>
                                  {variant.sku} &bull; {p?.productName} ({variant.sizeLabel}/{variant.color}) — {variant.stockQuantity} in stock
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        <div className="col-span-3 sm:col-span-2">
                          <label className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-0.5">
                            Qty
                          </label>
                          <input
                            type="number"
                            min={1}
                            max={v?.stockQuantity || 99}
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(idx, Number(e.target.value))}
                            className="w-full h-8 px-2 bg-zinc-50 border border-zinc-300 text-xs text-center font-mono outline-none"
                          />
                        </div>

                        <div className="col-span-3 sm:col-span-3 text-right">
                          <label className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-0.5">
                            Subtotal
                          </label>
                          <span className="font-mono font-semibold text-zinc-900">
                            LKR {(item.unitPrice * item.quantity).toLocaleString()}
                          </span>
                        </div>

                        <div className="col-span-12 sm:col-span-2 flex justify-end">
                          <button
                            type="button"
                            disabled={lineItems.length === 1}
                            onClick={() => handleRemoveLineItem(idx)}
                            className="p-1.5 text-zinc-500 hover:text-rose-600 disabled:opacity-20 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment & Settlement */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-semibold text-zinc-500 mb-1">
                    Settlement Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full h-9 px-2.5 bg-white border border-zinc-300 text-xs font-semibold text-zinc-900 outline-none focus:border-black cursor-pointer"
                  >
                    <option value="CASH_ON_DELIVERY">
                      {orderSource === 'IN_STORE_POS' ? 'Cash at Register / POS Card Terminal' : 'Cash on Delivery (COD)'}
                    </option>
                    <option value="BANK_TRANSFER">Bank Deposit Slip / Direct Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-semibold text-zinc-500 mb-1">
                    Internal Sales Remarks
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="E.g. VIP discount applied, customer picked in store..."
                    className="w-full h-9 px-2.5 bg-white border border-zinc-300 text-xs text-zinc-900 outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Financial Summary */}
              <div className="bg-zinc-50 border border-zinc-200 p-4 space-y-2">
                <div className="flex justify-between text-zinc-600">
                  <span>Garment Subtotal:</span>
                  <span className="font-mono">LKR {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Logistics & Handling:</span>
                  <span className="font-mono">
                    {shippingFee === 0 ? 'FREE (In-Store POS)' : `LKR ${shippingFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="border-t border-zinc-200 pt-2 flex justify-between font-semibold text-sm text-[#0a0a0a]">
                  <span>Total Order Payable:</span>
                  <span className="font-mono text-emerald-800">LKR {totalPayable.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-10 px-5 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="h-10 px-6 bg-black hover:bg-zinc-800 text-white text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{loading ? 'Processing...' : 'Place Assisted Order & Generate Invoice'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
