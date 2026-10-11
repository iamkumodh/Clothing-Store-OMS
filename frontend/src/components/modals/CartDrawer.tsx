/**
 * Shopping Cart Slide-out Drawer
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDfineStore } from '../../context/store-context';
import { CloseIcon, PlusIcon, MinusIcon, BagIcon } from '../common/icons';

export function CartDrawer() {
  const navigate = useNavigate();
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalItems, subtotal } =
    useDfineStore();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white text-[#0a0a0a] flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
          <div className="p-6 border-b border-zinc-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BagIcon className="w-5 h-5 text-black" />
              <h3 className="text-base font-semibold tracking-wide">Cart ({totalItems})</h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 hover:opacity-60 cursor-pointer"
              aria-label="Close cart"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 space-y-3">
                <BagIcon className="w-12 h-12 opacity-30" />
                <p className="text-sm font-medium">Your cart is currently empty.</p>
              </div>
            ) : (
              cart.map(item => (
                <div
                  key={item.product.id}
                  className="flex gap-4 pb-6 border-b border-zinc-100 last:border-b-0"
                >
                  <div className="relative w-20 h-24 bg-zinc-100 rounded-[2px] overflow-hidden shrink-0 border border-zinc-200">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="text-[14px] font-medium text-[#0a0a0a] pr-2">
                          {item.product.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-zinc-500 hover:text-black cursor-pointer"
                          aria-label="Remove item from cart"
                        >
                          <CloseIcon className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-[12px] text-zinc-500 mt-1">
                        {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-zinc-300 rounded-[2px] h-8">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="px-2.5 h-full text-zinc-500 hover:text-black cursor-pointer focus-visible:ring-1 focus-visible:ring-zinc-950 focus-visible:outline-none"
                        >
                          <MinusIcon className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-mono text-[12px] font-semibold text-[#0a0a0a]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="px-2.5 h-full text-zinc-500 hover:text-black cursor-pointer focus-visible:ring-1 focus-visible:ring-zinc-950 focus-visible:outline-none"
                        >
                          <PlusIcon className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-[14px] font-semibold font-mono text-[#0a0a0a]">
                        LKR {(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 border-t border-zinc-200 bg-zinc-50 space-y-4">
              <div className="flex items-center justify-between text-base font-semibold text-[#0a0a0a]">
                <span>Subtotal</span>
                <span className="font-mono text-lg">LKR {subtotal.toLocaleString()}</span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Shipping, taxes, and discounts calculated at checkout.
              </p>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
                className="w-full py-4 bg-black text-white hover:bg-zinc-800 transition-colors font-semibold text-[13px] tracking-wider uppercase rounded-[2px] shadow-sm cursor-pointer"
              >
                Check out • LKR {subtotal.toLocaleString()}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
