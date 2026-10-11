// product and inventory component

import React, { useState, useEffect } from 'react';
import { mockDb } from '../../../api/mockDataStore';
import type { ProductVariant, StoreStaff, RestockLog } from '../../../types/oms';
import { X, ArrowDownToLine, CheckCircle2, History, AlertCircle } from 'lucide-react';

interface RestockLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialVariantId?: number;
}

export function RestockLogModal({
  isOpen,
  onClose,
  initialVariantId,
}: RestockLogModalProps) {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [staffList, setStaffList] = useState<StoreStaff[]>([]);
  const [selectedVariantId, setSelectedVariantId] = useState<number>(initialVariantId || 1);
  const [selectedStaffId, setSelectedStaffId] = useState<number>(2); // Default to Kasun Perera (Warehouse supervisor)
  const [quantityAdded, setQuantityAdded] = useState<number>(25);
  const [notes, setNotes] = useState<string>('Supplier bulk intake verified at warehouse.');
  const [loading, setLoading] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    setVariants(mockDb.getVariants());
    setStaffList(mockDb.getStoreStaff());
    if (initialVariantId) {
      setSelectedVariantId(initialVariantId);
    }
  }, [initialVariantId, isOpen]);

  if (!isOpen) return null;

  const currentVariant = variants.find((v) => v.variantId === selectedVariantId);
  const product = currentVariant ? mockDb.getProductById(currentVariant.productId) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantityAdded <= 0) return;

    setLoading(true);
    try {
      const res = mockDb.restockVariant({
        variantId: selectedVariantId,
        receivedByStaffId: selectedStaffId,
        quantityAdded: Number(quantityAdded),
        notes,
      });

      setSuccessMsg(
        `Successfully added +${quantityAdded} units to SKU ${res.variant.sku}. New inventory count: ${res.variant.stockQuantity} units.`
      );

      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1500);
    } catch (err: any) {
      alert(err.message || 'Failed to restock variant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-zinc-200 shadow-2xl p-6 sm:p-8 text-[#0a0a0a]">
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-1.5 text-zinc-500 hover:text-black transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-black text-white flex items-center justify-center shrink-0">
            <ArrowDownToLine className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest font-mono text-zinc-500">
              Module 2 • Inventory Inbound Intake
            </div>
            <h3 className="font-serif text-xl font-medium tracking-tight text-[#0a0a0a]">
              Receive Warehouse Restock
            </h3>
          </div>
        </div>

        {successMsg ? (
          <div className="p-6 bg-zinc-50 border border-zinc-200 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="font-serif text-lg font-medium text-zinc-900">Restock Recorded</h4>
            <p className="text-xs text-zinc-600 leading-relaxed">{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Target Variant SKU */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                Target Garment SKU *
              </label>
              <select
                value={selectedVariantId}
                onChange={(e) => setSelectedVariantId(Number(e.target.value))}
                className="w-full h-11 px-3 bg-zinc-50 border border-zinc-300 focus:bg-white focus:border-black text-xs font-mono text-zinc-800 outline-none cursor-pointer"
              >
                {variants.map((v) => {
                  const p = mockDb.getProductById(v.productId);
                  return (
                    <option key={v.variantId} value={v.variantId}>
                      {v.sku} — {p?.productName || 'Garment'} ({v.sizeLabel} / {v.color}) [Stock: {v.stockQuantity}]
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Current Stock Callout */}
            {currentVariant && (
              <div className="p-3 bg-zinc-50 border border-zinc-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-zinc-500">Current Stock: </span>
                  <span className="font-bold text-zinc-900">{currentVariant.stockQuantity} units</span>
                  <span className="text-zinc-500 ml-2">(Threshold: {currentVariant.lowStockThreshold})</span>
                </div>
                <div className="text-[10px] font-mono text-zinc-500">
                  Version: #{currentVariant.lockVersion}
                </div>
              </div>
            )}

            {/* Restock Quantity */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                  Quantity Added *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  step={1}
                  value={quantityAdded}
                  onChange={(e) => setQuantityAdded(Number(e.target.value))}
                  placeholder="e.g. 25"
                  className="w-full h-10 px-3.5 bg-white border border-zinc-300 focus:border-black text-xs text-[#0a0a0a] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                  Receiving Staff *
                </label>
                <select
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(Number(e.target.value))}
                  className="w-full h-10 px-3 bg-white border border-zinc-300 focus:border-black text-xs text-zinc-800 outline-none cursor-pointer"
                >
                  {staffList.map((s) => (
                    <option key={s.staffId} value={s.staffId}>
                      {s.firstName} {s.lastName} ({s.designation})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Inbound Notes */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                Warehouse Intake Notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Intake supplier invoice number, quality inspector sign-off, or delivery bay..."
                className="w-full p-3 bg-white border border-zinc-300 focus:border-black text-xs text-[#0a0a0a] outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-black hover:bg-zinc-800 text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <ArrowDownToLine className="w-4 h-4" />
                <span>Record Stock Inbound & Increment Version</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/**
 * Restock History Audit Table View
 */
export function RestockHistoryView() {
  const [logs, setLogs] = useState<RestockLog[]>([]);

  const loadLogs = () => {
    setLogs(mockDb.getRestockLogs());
  };

  useEffect(() => {
    loadLogs();
    const unsub = mockDb.subscribe(() => loadLogs());
    return unsub;
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-zinc-200 p-6">
        <div className="flex items-center gap-2">
          <h2 className="font-serif text-2xl font-medium text-[#0a0a0a]">
            Warehouse Restock Audit Log
          </h2>
          <span className="text-[10px] bg-black text-white px-2 py-0.5 font-mono tracking-widest uppercase">
            Module 2
          </span>
        </div>
        <p className="text-xs text-zinc-500 mt-1">
          Historical log of all warehouse replenishment batches, receiving staff signatures, and intake quantities.
        </p>
      </div>

      <div className="bg-white border border-zinc-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] uppercase tracking-wider font-semibold text-zinc-500">
                <th className="py-3 px-4">Log ID</th>
                <th className="py-3 px-4">Garment SKU</th>
                <th className="py-3 px-4">Quantity Added</th>
                <th className="py-3 px-4">Received By</th>
                <th className="py-3 px-4">Restocked Date</th>
                <th className="py-3 px-4">Audit Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    <History className="w-8 h-8 mx-auto mb-2 stroke-1" />
                    <p className="text-xs uppercase tracking-wider font-medium">No restock history logs available</p>
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const variant = mockDb.getVariantById(log.variantId);
                  const staff = mockDb.getStaffById(log.receivedByStaffId);
                  const product = variant ? mockDb.getProductById(variant.productId) : null;

                  return (
                    <tr key={log.restockId} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-zinc-900">
                        #{log.restockId}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-mono font-semibold text-zinc-900">{variant?.sku || `Variant #${log.variantId}`}</div>
                        <div className="text-[10px] text-zinc-500">{product?.productName} ({variant?.sizeLabel} / {variant?.color})</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                          +{log.quantityAdded} units
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-zinc-900">
                          {staff ? `${staff.firstName} ${staff.lastName}` : `Staff #${log.receivedByStaffId}`}
                        </div>
                        <div className="text-[10px] text-zinc-500 font-mono">{staff?.designation}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-zinc-600">
                        {log.restockedAt}
                      </td>
                      <td className="py-3 px-4 text-zinc-600 max-w-xs truncate">
                        {log.notes || '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
