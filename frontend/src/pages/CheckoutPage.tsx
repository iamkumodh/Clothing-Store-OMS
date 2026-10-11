// checkout page

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDfineStore } from '../context/store-context';
import { submitCheckout, CheckoutRequest } from '../api/orderApi';
import { fetchCouriers, CourierOption, defaultCouriers } from '../api/paymentApi';
import { Truck, CreditCard, ShieldCheck, ChevronRight, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, subtotal, clearCart } = useDfineStore();

  // Courier state (Module 4)
  const [couriers, setCouriers] = useState<CourierOption[]>(defaultCouriers);
  const [selectedCourierId, setSelectedCourierId] = useState<number>(1);

  // Payment method (Module 4)
  const [paymentMethod, setPaymentMethod] = useState<'BANK_TRANSFER' | 'CASH_ON_DELIVERY'>('BANK_TRANSFER');

  // Customer & Shipping form (Module 3)
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    shippingCity: 'Colombo',
    shippingDistrict: 'Colombo',
    shippingProvince: 'Western Province',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Autofill demo data if user is already logged in or has registered
  useEffect(() => {
    try {
      const stored = localStorage.getItem('dfine_registered_customer');
      if (stored) {
        const u = JSON.parse(stored);
        setFormData(prev => ({
          ...prev,
          customerName: prev.customerName || `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Kasun Perera',
          customerEmail: prev.customerEmail || u.email || 'customer@dfine.lk',
          customerPhone: prev.customerPhone || u.contactNumber || '+94 77 123 4567',
          shippingAddress: prev.shippingAddress || u.shippingAddress || 'No. 45/2, Galle Road',
          shippingCity: prev.shippingCity || u.city || 'Colombo 03',
          shippingDistrict: prev.shippingDistrict || u.district || 'Colombo',
          shippingProvince: prev.shippingProvince || u.province || 'Western Province',
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          shippingCity: prev.shippingCity || 'Colombo',
          shippingDistrict: prev.shippingDistrict || 'Colombo',
          shippingProvince: prev.shippingProvince || 'Western Province',
        }));
      }
    } catch {
      // fallback
    }

    fetchCouriers().then(res => {
      if (res && res.length > 0) {
        setCouriers(res);
        setSelectedCourierId(res[0].courierId);
      }
    });
  }, []);

  const selectedCourier = couriers.find(c => c.courierId === selectedCourierId) || couriers[0];
  const shippingCharge = selectedCourier ? selectedCourier.charge : 350;
  const totalPayable = subtotal + shippingCharge;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.customerName || !formData.customerPhone || !formData.shippingAddress || !formData.shippingCity) {
      setErrorMessage('Please fill in all required recipient and delivery address fields.');
      return;
    }

    if (cart.length === 0) {
      setErrorMessage('Your cart is empty. Please add garments before checking out.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderReq: CheckoutRequest = {
        cartId: 1,
        customerId: 1,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        shippingAddress: formData.shippingAddress,
        shippingCity: formData.shippingCity,
        shippingDistrict: formData.shippingDistrict,
        shippingProvince: formData.shippingProvince,
        courierPartnerId: selectedCourierId,
        paymentMethod: paymentMethod,
        notes: formData.notes,
        items: cart.map(item => ({
          productId: item.product.id,
          productTitle: item.product.title,
          size: item.selectedSize,
          color: item.selectedColor,
          quantity: item.quantity,
          unitPrice: item.product.price,
          image: item.product.image,
          variantId: item.product.variants?.[0]?.variantId || 1,
        })),
      };

      const result = await submitCheckout(orderReq);
      clearCart();
      navigate(`/order-success/${result.orderId}`, { state: { order: result } });
    } catch (err: any) {
      console.error('Checkout failed', err);
      setErrorMessage(err?.response?.data?.message || 'Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-100 flex items-center justify-center text-[#0a0a0a]">
          <Truck className="w-8 h-8 opacity-60" />
        </div>
        <h2 className="text-2xl font-bold text-[#0a0a0a]">Your cart is empty</h2>
        <p className="text-sm text-zinc-500 mt-2 mb-8">
          Add some curated pieces to your bag before heading to checkout.
        </p>
        <Link
          to="/collections/all"
          className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white text-xs uppercase tracking-wider font-semibold hover:bg-zinc-800 transition-colors rounded-[2px]"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-zinc-50 min-h-[calc(100vh-80px)] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-zinc-500 uppercase tracking-wider mb-8">
          <Link to="/" className="hover:text-black transition-colors">Store</Link>
          <ChevronRight className="w-3 h-3 opacity-50" />
          <span className="text-zinc-500">Cart</span>
          <ChevronRight className="w-3 h-3 opacity-50" />
          <span className="font-semibold text-[#0a0a0a]">Checkout</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Checkout & Logistics Inputs */}
          <div className="lg:col-span-7 space-y-8">
            <form onSubmit={handleSubmitOrder} id="checkout-form" className="space-y-8">
              {/* Shipping & Contact Information */}
              <div className="bg-white border border-zinc-200 rounded-[2px] p-6 sm:p-8 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-[#0a0a0a]">1. Recipient & Delivery Address</h2>
                    <p className="text-xs text-zinc-500 mt-0.5">Please provide recipient shipping and contact details.</p>
                  </div>
                  <span className="text-[11px] font-mono bg-zinc-100 text-[#0a0a0a] border border-zinc-200 px-2.5 py-1 rounded-[2px] font-semibold">
                    Step 1 of 3
                  </span>
                </div>

                {errorMessage && (
                  <div className="mb-6 p-4 bg-red-50/80 border border-red-200 text-xs text-red-700">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#0a0a0a] mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      required
                      value={formData.customerName}
                      onChange={handleInputChange}
                      placeholder="e.g. Kasun Perera"
                      className="w-full px-3.5 py-2.5 border border-zinc-300 rounded-[2px] text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#0a0a0a] mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="customerEmail"
                      required
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      placeholder="kasun.p@example.com"
                      className="w-full px-3.5 py-2.5 border border-zinc-300 rounded-[2px] text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#0a0a0a] mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="customerPhone"
                      required
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      placeholder="+94 77 123 4567"
                      className="w-full px-3.5 py-2.5 border border-zinc-300 rounded-[2px] text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#0a0a0a] mb-1.5">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="shippingAddress"
                      required
                      value={formData.shippingAddress}
                      onChange={handleInputChange}
                      placeholder="e.g. No. 45/2, Galle Road"
                      className="w-full px-3.5 py-2.5 border border-zinc-300 rounded-[2px] text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#0a0a0a] mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      name="shippingCity"
                      required
                      value={formData.shippingCity}
                      onChange={handleInputChange}
                      placeholder="Colombo 03"
                      className="w-full px-3.5 py-2.5 border border-zinc-300 rounded-[2px] text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#0a0a0a] mb-1.5">
                      District *
                    </label>
                    <select
                      name="shippingDistrict"
                      value={formData.shippingDistrict}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 border border-zinc-300 rounded-[2px] text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black bg-white transition-colors cursor-pointer"
                    >
                      <option value="Colombo">Colombo</option>
                      <option value="Gampaha">Gampaha</option>
                      <option value="Kalutara">Kalutara</option>
                      <option value="Kandy">Kandy</option>
                      <option value="Galle">Galle</option>
                      <option value="Matara">Matara</option>
                      <option value="Kurunegala">Kurunegala</option>
                      <option value="Other">Other District</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#0a0a0a] mb-1.5">
                      Order / Delivery Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      rows={2}
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Special instructions for delivery rider..."
                      className="w-full px-3.5 py-2 border border-zinc-300 rounded-[2px] text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Courier Partner Selection */}
              <div className="bg-white border border-zinc-200 rounded-[2px] p-6 sm:p-8 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-[#0a0a0a]">2. Courier & Shipping Method</h2>
                    <p className="text-xs text-zinc-500 mt-0.5">Choose your preferred courier delivery partner and transit speed.</p>
                  </div>
                  <span className="text-[11px] font-mono bg-zinc-100 text-[#0a0a0a] border border-zinc-200 px-2.5 py-1 rounded-[2px] font-semibold">
                    Step 2 of 3
                  </span>
                </div>

                <div className="space-y-3">
                  {couriers.map(courier => {
                    const isSelected = courier.courierId === selectedCourierId;
                    return (
                      <label
                        key={courier.courierId}
                        onClick={() => setSelectedCourierId(courier.courierId)}
                        className={`flex items-center justify-between p-4 border rounded-[2px] cursor-pointer transition-all ${
                          isSelected
                            ? 'border-black bg-zinc-50 shadow-xs ring-1 ring-black'
                            : 'border-zinc-200 hover:border-zinc-400'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="courier"
                            checked={isSelected}
                            onChange={() => setSelectedCourierId(courier.courierId)}
                            className="w-4 h-4 text-black focus:ring-black accent-black"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-[#0a0a0a]">
                                {courier.courierName}
                              </span>
                              {isSelected && (
                                <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-900 bg-zinc-200 px-2 py-0.5 rounded-[2px]">
                                  Selected
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-zinc-500 mt-0.5">{courier.estimatedDays}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-sm font-bold text-[#0a0a0a]">
                            LKR {courier.charge}.00
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="bg-white border border-zinc-200 rounded-[2px] p-6 sm:p-8 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-[#0a0a0a]">3. Payment Method</h2>
                    <p className="text-xs text-zinc-500 mt-0.5">Select a payment gateway or payment method for this order.</p>
                  </div>
                  <span className="text-[11px] font-mono bg-zinc-100 text-[#0a0a0a] border border-zinc-200 px-2.5 py-1 rounded-[2px] font-semibold">
                    Step 3 of 3
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label
                    onClick={() => setPaymentMethod('BANK_TRANSFER')}
                    className={`p-4 border rounded-[2px] cursor-pointer transition-all flex flex-col justify-between ${
                      paymentMethod === 'BANK_TRANSFER'
                        ? 'border-black bg-zinc-50 ring-1 ring-black'
                        : 'border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#0a0a0a]" />
                        <span className="text-sm font-semibold text-[#0a0a0a]">Bank Transfer</span>
                      </div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'BANK_TRANSFER'}
                        onChange={() => setPaymentMethod('BANK_TRANSFER')}
                        className="text-black accent-black"
                      />
                    </div>
                    <p className="text-xs text-zinc-500 mt-3">
                      Deposit directly to D'fine Commercial Bank account and upload your deposit slip.
                    </p>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('CASH_ON_DELIVERY')}
                    className={`p-4 border rounded-[2px] cursor-pointer transition-all flex flex-col justify-between ${
                      paymentMethod === 'CASH_ON_DELIVERY'
                        ? 'border-black bg-zinc-50 ring-1 ring-black'
                        : 'border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-[#0a0a0a]" />
                        <span className="text-sm font-semibold text-[#0a0a0a]">Cash on Delivery</span>
                      </div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'CASH_ON_DELIVERY'}
                        onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
                        className="text-black accent-black"
                      />
                    </div>
                    <p className="text-xs text-zinc-500 mt-3">
                      Pay cash to the courier representative when your parcel is delivered to your door.
                    </p>
                  </label>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column: Sticky Order Summary (Member 3) */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-zinc-200 rounded-[2px] p-6 sticky top-24 shadow-xs space-y-6">
              <div className="border-b border-zinc-200 pb-4">
                <h3 className="text-base font-bold text-[#0a0a0a]">Order Summary</h3>
                <p className="text-xs text-zinc-500 mt-0.5">{cart.length} item(s) in order</p>
              </div>

              {/* Items List */}
              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {cart.map(item => (
                  <div key={item.product.id} className="flex gap-3 items-center">
                    <div className="w-14 h-16 bg-zinc-100 rounded-[2px] overflow-hidden shrink-0 border border-zinc-200">
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-[#0a0a0a] truncate">
                        {item.product.title}
                      </h4>
                      <p className="text-[11px] text-zinc-500">
                        {item.selectedSize && `Size: ${item.selectedSize}`} • Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs font-semibold text-[#0a0a0a]">
                        LKR {(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Calculation Breakdown */}
              <div className="border-t border-zinc-200 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-500">
                  <span>Garments Subtotal</span>
                  <span className="font-mono font-medium text-[#0a0a0a]">
                    LKR {subtotal.toLocaleString()}.00
                  </span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Shipping ({selectedCourier?.courierName || 'Courier'})</span>
                  <span className="font-mono font-medium text-[#0a0a0a]">
                    LKR {shippingCharge}.00
                  </span>
                </div>
                <div className="border-t border-zinc-200 pt-3 flex justify-between text-sm font-bold text-[#0a0a0a]">
                  <span>Total Payable</span>
                  <span className="font-mono text-base text-[#0a0a0a]">
                    LKR {totalPayable.toLocaleString()}.00
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full py-4 bg-black hover:bg-zinc-800 disabled:bg-zinc-400 text-white font-semibold text-xs tracking-wider uppercase rounded-[2px] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing Order...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Place Order • LKR {totalPayable.toLocaleString()}
                  </>
                )}
              </button>

              <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-zinc-500">
                <ShieldCheck className="w-4 h-4 text-black" />
                <span>SSL Encrypted • 100% Genuine D'fine Retail Garments</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
