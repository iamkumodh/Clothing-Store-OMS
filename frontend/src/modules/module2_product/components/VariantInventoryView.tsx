// product and inventory component

import React, { useState, useEffect } from 'react';
import { mockDb } from '../../../api/mockDataStore';
import type { ProductVariant, Product, Category } from '../../../types/oms';
import { RestockLogModal } from './RestockLogModal';
import {
  Search,
  AlertTriangle,
  ArrowDownToLine,
  CheckCircle2,
  XCircle,
  Package,
} from 'lucide-react';

export function VariantInventoryView() {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'IN_STOCK'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<number | 'ALL'>('ALL');

  // Restock modal
  const [restockModalOpen, setRestockModalOpen] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<number | undefined>(undefined);

  const loadData = () => {
    setVariants(mockDb.getVariants());
    setProducts(mockDb.getProducts());
    setCategories(mockDb.getCategories());
  };

  useEffect(() => {
    loadData();
    const unsub = mockDb.subscribe(() => {
      loadData();
    });
    return unsub;
  }, []);

  // Compute metrics
  const totalVariants = variants.length;
  const lowStockCount = variants.filter(v => v.stockQuantity > 0 && v.stockQuantity <= v.lowStockThreshold).length;
  const outOfStockCount = variants.filter(v => v.stockQuantity === 0).length;
  const inStockCount = variants.filter(v => v.stockQuantity > v.lowStockThreshold).length;

  const productMap = new Map(products.map(p => [p.productId, p]));
  const categoryMap = new Map(categories.map(c => [c.categoryId, c]));

  const filteredVariants = variants.filter(v => {
    const product = productMap.get(v.productId);
    const matchesSearch =
      v.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.sizeLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product && product.productName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (categoryFilter !== 'ALL' && product?.categoryId !== categoryFilter) {
      return false;
    }

    if (statusFilter === 'LOW_STOCK') {
      return v.stockQuantity > 0 && v.stockQuantity <= v.lowStockThreshold;
    }
    if (statusFilter === 'OUT_OF_STOCK') {
      return v.stockQuantity === 0;
    }
    if (statusFilter === 'IN_STOCK') {
      return v.stockQuantity > v.lowStockThreshold;
    }
    return true;
  });

  const handleOpenRestock = (variantId?: number) => {
    setSelectedVariantId(variantId);
    setRestockModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-zinc-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl font-medium text-[#0a0a0a]">
              Garment Variant & SKU Inventory Matrix
            </h2>
            <span className="text-[10px] bg-black text-white px-2 py-0.5 font-mono tracking-widest uppercase">
              Module 2
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Real-time warehouse stock ledger, SKU tracking, automated low-stock warnings, and optimistic lock version control.
          </p>
        </div>
        <button
          onClick={() => handleOpenRestock()}
          className="h-10 px-5 bg-black hover:bg-zinc-800 text-white text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-colors cursor-pointer self-start md:self-auto shrink-0"
        >
          <ArrowDownToLine className="w-4 h-4" />
          <span>Receive Inbound Stock</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-zinc-200 p-4">
          <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold mb-1">
            Total Garment SKUs
          </div>
          <div className="text-2xl font-serif text-[#0a0a0a]">{totalVariants}</div>
          <div className="text-[10px] text-zinc-500 mt-1">Active inventory variants</div>
        </div>

        <div className="bg-white border border-zinc-200 p-4">
          <div className="text-[11px] uppercase tracking-wider text-emerald-700 font-semibold mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Optimal Stock</span>
          </div>
          <div className="text-2xl font-serif text-[#0a0a0a]">{inStockCount}</div>
          <div className="text-[10px] text-zinc-500 mt-1">Above threshold buffer</div>
        </div>

        <div className={`p-4 border ${lowStockCount > 0 ? 'bg-amber-50/40 border-amber-300' : 'bg-white border-zinc-200'}`}>
          <div className="text-[11px] uppercase tracking-wider text-amber-700 font-semibold mb-1 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Low Stock Urgency</span>
          </div>
          <div className="text-2xl font-serif text-amber-900">{lowStockCount}</div>
          <div className="text-[10px] text-amber-700 mt-1">Triggering restock warnings</div>
        </div>

        <div className={`p-4 border ${outOfStockCount > 0 ? 'bg-rose-50/40 border-rose-300' : 'bg-white border-zinc-200'}`}>
          <div className="text-[11px] uppercase tracking-wider text-rose-700 font-semibold mb-1 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Out of Stock</span>
          </div>
          <div className="text-2xl font-serif text-rose-900">{outOfStockCount}</div>
          <div className="text-[10px] text-rose-700 mt-1">Requires immediate supplier order</div>
        </div>
      </div>

      {/* Low-stock urgent alert banner if any items need replenishment */}
      {lowStockCount > 0 && (
        <div className="bg-amber-50 border border-amber-300 p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-900">
              <span className="font-semibold">{lowStockCount} garment SKU(s)</span> have dropped below their designated warehouse low-stock threshold. Warehouse replenishment intake is advised.
            </p>
          </div>
          <button
            onClick={() => setStatusFilter('LOW_STOCK')}
            className="text-xs font-semibold text-amber-900 hover:text-black underline uppercase tracking-wider cursor-pointer shrink-0"
          >
            Filter Low Stock
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white border border-zinc-200 p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search SKU, color, size, product..."
            className="w-full h-10 pl-9 pr-3 bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-black text-xs text-[#0a0a0a] outline-none transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Tabs */}
          <div className="flex bg-zinc-100 p-0.5 border border-zinc-200 text-xs">
            {(['ALL', 'IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  statusFilter === filter
                    ? 'bg-black text-white shadow-xs'
                    : 'text-zinc-600 hover:text-black'
                }`}
              >
                {filter === 'ALL'
                  ? 'All'
                  : filter === 'IN_STOCK'
                  ? 'In Stock'
                  : filter === 'LOW_STOCK'
                  ? 'Low Stock'
                  : 'Sold Out'}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
            className="h-9 px-3 bg-white border border-zinc-200 text-xs text-zinc-700 outline-none cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.categoryId} value={c.categoryId}>
                {c.categoryName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* SKU Table */}
      <div className="bg-white border border-zinc-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] uppercase tracking-wider font-semibold text-zinc-500">
                <th className="py-3 px-4">SKU Code</th>
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4">Size & Color</th>
                <th className="py-3 px-4">Available Stock</th>
                <th className="py-3 px-4">Threshold</th>
                <th className="py-3 px-4">Inventory Status</th>
                <th className="py-3 px-4">Lock Version</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredVariants.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-500">
                    <Package className="w-8 h-8 mx-auto mb-2 stroke-1" />
                    <p className="text-xs uppercase tracking-wider font-medium">No garment variants matched filter</p>
                  </td>
                </tr>
              ) : (
                filteredVariants.map((variant) => {
                  const product = productMap.get(variant.productId);
                  const isLow = variant.stockQuantity > 0 && variant.stockQuantity <= variant.lowStockThreshold;
                  const isOut = variant.stockQuantity === 0;

                  return (
                    <tr key={variant.variantId} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 border border-zinc-200">
                          {variant.sku}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={variant.variantImageUrl || product?.mainImageUrl || '/images/ceru-knit-1.png'}
                            alt={product?.productName}
                            className="w-9 h-12 object-cover bg-zinc-100 border border-zinc-200 shrink-0"
                          />
                          <div>
                            <div className="font-medium text-zinc-900 line-clamp-1">{product?.productName || `Product #${variant.productId}`}</div>
                            <div className="text-[10px] text-zinc-500 font-mono">
                              LKR {product?.basePrice.toLocaleString()} &bull; {categoryMap.get(product?.categoryId || 0)?.categoryName || 'General'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 border border-zinc-300 bg-white font-mono font-semibold text-[11px] flex items-center justify-center text-zinc-900">
                            {variant.sizeLabel}
                          </span>
                          <span className="text-zinc-600 font-medium">{variant.color}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono">
                        <span
                          className={`font-bold text-sm ${
                            isOut
                              ? 'text-rose-600'
                              : isLow
                              ? 'text-amber-600'
                              : 'text-zinc-900'
                          }`}
                        >
                          {variant.stockQuantity}
                        </span>{' '}
                        <span className="text-[11px] text-zinc-500">units</span>
                      </td>

                      <td className="py-3 px-4 font-mono text-zinc-500">
                        {variant.lowStockThreshold} units
                      </td>

                      <td className="py-3 px-4">
                        {isOut ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                            Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            In Stock
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono text-[11px] text-zinc-500 bg-zinc-100 px-1.5 py-0.5 border border-zinc-200">
                          v{variant.lockVersion}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleOpenRestock(variant.variantId)}
                          className="h-8 px-3 bg-zinc-100 hover:bg-black hover:text-white text-zinc-800 border border-zinc-300 text-[11px] uppercase tracking-wider font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <ArrowDownToLine className="w-3.5 h-3.5" />
                          <span>Restock</span>
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

      {/* Restock Intake Modal */}
      <RestockLogModal
        isOpen={restockModalOpen}
        onClose={() => setRestockModalOpen(false)}
        initialVariantId={selectedVariantId}
      />
    </div>
  );
}
