// payment and shipment component

import React, { useState } from 'react';
import { mockDb } from '../../../api/mockDataStore';
import {
  X,
  Truck,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';

interface LiveTrackingModalProps {
  trackingNumber: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LiveTrackingModal({
  trackingNumber,
  isOpen,
  onClose,
}: LiveTrackingModalProps) {
  if (!isOpen || !trackingNumber) return null;

  const [copied, setCopied] = useState(false);

  // Look up shipment in mockDb
  const shipments = mockDb.getShipments();
  const shipment = shipments.find(s => s.trackingNumber === trackingNumber) || shipments[0];
  const courier = shipment ? mockDb.getCourierPartnerById(shipment.courierId) : null;
  const order = shipment ? mockDb.getOrderDetails(shipment.orderId) : null;

  const handleCopy = () => {
    navigator.clipboard.writeText(trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDelivered = shipment?.deliveryStatus === 'DELIVERED';
  const isOutForDelivery = shipment?.deliveryStatus === 'OUT_FOR_DELIVERY';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white border border-zinc-300 w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div>
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-black" />
              <h3 className="font-serif text-2xl font-medium text-[#0a0a0a]">
                Live Parcel Dispatch Tracking
              </h3>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Real-time delivery progress provided by {courier?.courierName || 'D\'fine Express Logistics'}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-black cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs">
          {/* Tracking Number Bar */}
          <div className="bg-zinc-50 border border-zinc-200 p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold block">
                Official Consignment Tracking Number
              </span>
              <span className="font-mono font-bold text-sm text-[#0a0a0a]">
                {trackingNumber}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="h-8 px-3 bg-white border border-zinc-300 hover:border-black text-xs font-semibold text-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Courier Details & Destination */}
          <div className="grid grid-cols-2 gap-4 bg-zinc-50 border border-zinc-200 p-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold block">
                Courier Carrier
              </span>
              <span className="font-medium text-zinc-900 block">
                {courier?.courierName || 'Prompt Xpress'}
              </span>
              <span className="text-[11px] text-zinc-500 font-mono">
                {courier?.contactNumber || '+94 11 456 7890'}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold block">
                Destination Address
              </span>
              <span className="text-zinc-800 line-clamp-2">
                {order?.shippingAddressSnapshot || 'Colombo 05, Western Province'}
              </span>
            </div>
          </div>

          {/* Live Checkpoints Stepper */}
          <div className="space-y-4 pt-2">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500">
              Checkpoint Status Trail
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200">
              {/* Checkpoint 1: Dispatched */}
              <div className="relative">
                <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-black border-2 border-white flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                </div>
                <div className="font-semibold text-zinc-900 text-xs">
                  Package Dispatched &amp; Scanned at Warehouse
                </div>
                <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
                  D&apos;fine Central Fulfillment Center (Colombo 05) &bull; {shipment?.dispatchedAt || '2026-10-01 14:30:00'}
                </div>
              </div>

              {/* Checkpoint 2: In-Transit Current Location */}
              <div className="relative">
                <div
                  className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full flex items-center justify-center ${
                    isDelivered || isOutForDelivery ? 'bg-black border-2 border-white' : 'bg-purple-600 animate-pulse'
                  }`}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                </div>
                <div className="font-semibold text-zinc-900 text-xs flex items-center gap-2">
                  <span>Current Hub Location: {shipment?.currentLocation || 'In Transit via Regional Sorting Bay'}</span>
                  {!isDelivered && (
                    <span className="text-[9px] bg-purple-100 text-purple-800 px-1.5 py-0.5 uppercase font-mono font-bold">
                      Live
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5">
                  Package in custody of courier transport network.
                </div>
              </div>

              {/* Checkpoint 3: Out For Delivery */}
              <div className="relative">
                <div
                  className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full flex items-center justify-center ${
                    isDelivered
                      ? 'bg-black border-2 border-white'
                      : isOutForDelivery
                      ? 'bg-amber-600 animate-pulse'
                      : 'bg-zinc-200'
                  }`}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                </div>
                <div
                  className={`font-semibold text-xs ${
                    isOutForDelivery || isDelivered ? 'text-zinc-900' : 'text-zinc-500'
                  }`}
                >
                  Out for Final Mile Delivery
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5">
                  Assigned to local courier dispatch rider.
                </div>
              </div>

              {/* Checkpoint 4: Delivered */}
              <div className="relative">
                <div
                  className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full flex items-center justify-center ${
                    isDelivered ? 'bg-emerald-600' : 'bg-zinc-200'
                  }`}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                </div>
                <div
                  className={`font-semibold text-xs ${
                    isDelivered ? 'text-emerald-700' : 'text-zinc-500'
                  }`}
                >
                  Delivered &amp; Signed
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5 font-mono">
                  {shipment?.deliveredAt ? `Completed on ${shipment.deliveredAt}` : 'Pending final recipient handover'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between">
          {courier?.trackingApiUrl && (
            <a
              href={courier.trackingApiUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-zinc-600 hover:text-black flex items-center gap-1 underline"
            >
              <span>Carrier Tracking Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <button
            onClick={onClose}
            className="h-9 px-5 bg-black hover:bg-zinc-800 text-white text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer ml-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
