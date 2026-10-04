// product and inventory component

import React, { useState, useEffect } from 'react';
import { mockDb } from '../../../api/mockDataStore';
import type { Product, Category, ProductWithVariants } from '../../../types/oms';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Check,
  X,
  Package,
  Layers,
  Sparkles,
} from 'lucide-react';

export function ProductCatalogView() {
  const [products, setProducts] = useState<ProductWithVariants[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'ARCHIVED'>('ALL');

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    productName: '',
    categoryId: 1,
    genderTarget: 'UNISEX' as 'MEN' | 'WOMEN' | 'UNISEX',
    basePrice: 4500,
    mainImageUrl: '/images/ceru-knit-1.png',
    productDescription: '',
    isActive: true,
  });

  const loadData = () => {
    setProducts(mockDb.getProductsWithVariants());
    setCategories(mockDb.getCategories());
  };

  useEffect(() => {
    loadData();
    const unsubscribe = mockDb.subscribe(() => {
      loadData();
    });
    return unsubscribe;
  }, []);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mockDb.createProduct(
      {
        productName: formData.productName,
        categoryId: Number(formData.categoryId),
        genderTarget: formData.genderTarget,
        basePrice: Number(formData.basePrice),
        mainImageUrl: formData.mainImageUrl,
        productDescription: formData.productDescription,
        isActive: formData.isActive,
      },
      [
        {
          sku: `${formData.productName.substring(0, 3).toUpperCase()}-BLK-M`,
          sizeLabel: 'M',
          color: 'Jet Black',
          stockQuantity: 20,
          lowStockThreshold: 5,
          variantImageUrl: formData.mainImageUrl,
        },
        {
          sku: `${formData.productName.substring(0, 3).toUpperCase()}-BLK-L`,
          sizeLabel: 'L',
          color: 'Jet Black',
          stockQuantity: 15,
          lowStockThreshold: 5,
          variantImageUrl: formData.mainImageUrl,
        },
      ]
    );

    setIsCreateModalOpen(false);
    setFormData({
      productName: '',
      categoryId: 1,
      genderTarget: 'UNISEX',
      basePrice: 4500,
      mainImageUrl: '/images/ceru-knit-1.png',
      productDescription: '',
      isActive: true,
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    mockDb.updateProduct(editingProduct.productId, {
      productName: editingProduct.productName,
      basePrice: Number(editingProduct.basePrice),
      genderTarget: editingProduct.genderTarget,
      mainImageUrl: editingProduct.mainImageUrl,
      productDescription: editingProduct.productDescription,
      isActive: editingProduct.isActive,
    });

    setEditingProduct(null);
  };

  const toggleProductStatus = (product: Product) => {
    mockDb.updateProduct(product.productId, {
      isActive: !product.isActive,
    });
  };

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category?.categoryName || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'ALL' || p.categoryId === selectedCategory;

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && p.isActive) ||
      (statusFilter === 'ARCHIVED' && !p.isActive);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-zinc-200 p-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl font-medium text-[#0a0a0a]">
              Product Catalog Console
            </h2>
            <span className="text-[10px] bg-black text-white px-2 py-0.5 font-mono tracking-widest uppercase">
              Module 2
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Manage retail garments, pricing, and active status.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-black hover:bg-zinc-800 text-white text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Garment</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-zinc-200 p-4 flex flex-col md:flex-row items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by garment title or category..."
            className="w-full h-10 pl-10 pr-4 bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-black text-xs text-[#0a0a0a] outline-none transition-colors"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-zinc-500 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(
                e.target.value === 'ALL' ? 'ALL' : Number(e.target.value)
              )
            }
            className="h-10 px-3 bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 outline-none focus:border-black cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.categoryId} value={cat.categoryId}>
                {cat.categoryName}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as 'ALL' | 'ACTIVE' | 'ARCHIVED')
            }
            className="h-10 px-3 bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 outline-none focus:border-black cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active Only</option>
            <option value="ARCHIVED">Archived Only</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-zinc-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] uppercase tracking-wider font-semibold text-zinc-500">
                <th className="py-3 px-4">Garment</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Target</th>
                <th className="py-3 px-4">Base Price</th>
                <th className="py-3 px-4">Variants</th>
                <th className="py-3 px-4">Stock Status</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-500">
                    <Package className="w-8 h-8 mx-auto mb-2 stroke-1" />
                    <p className="text-xs uppercase tracking-wider font-medium">No garments match your filters</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const totalStock = p.variants.reduce((sum, v) => sum + v.stockQuantity, 0);
                  const isLowStock = p.variants.some((v) => v.stockQuantity <= v.lowStockThreshold);

                  return (
                    <tr key={p.productId} className="hover:bg-zinc-50/80 transition-colors">
                      {/* Image & Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.mainImageUrl}
                            alt={p.productName}
                            className="w-10 h-12 object-cover bg-zinc-100 border border-zinc-200 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/dfine-img-001.png';
                            }}
                          />
                          <div>
                            <div className="font-semibold text-zinc-900">{p.productName}</div>
                            <div className="text-[10px] text-zinc-500 font-mono">ID: #{p.productId}</div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="inline-block bg-zinc-100 border border-zinc-200 text-zinc-700 px-2 py-0.5 text-[10px] font-medium tracking-wider">
                          {p.category?.categoryName || 'Tops'}
                        </span>
                      </td>

                      {/* Gender Target */}
                      <td className="py-3 px-4 font-mono text-zinc-600">
                        {p.genderTarget || 'UNISEX'}
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-medium text-zinc-900">
                        LKR {Number(p.basePrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>

                      {/* Variants count */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-zinc-600">
                          <Layers className="w-3.5 h-3.5 text-zinc-500" />
                          <span>{p.variants.length} SKUs</span>
                        </div>
                      </td>

                      {/* Stock Level */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              totalStock === 0
                                ? 'bg-rose-500'
                                : isLowStock
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                          />
                          <span className="font-mono text-zinc-700">
                            {totalStock} units
                          </span>
                        </div>
                      </td>

                      {/* Active Status */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleProductStatus(p)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider border cursor-pointer transition-colors ${
                            p.isActive
                              ? 'bg-zinc-100 text-zinc-900 border-zinc-300 hover:bg-zinc-200'
                              : 'bg-zinc-50 text-zinc-500 border-zinc-200 hover:text-black'
                          }`}
                        >
                          {p.isActive ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <X className="w-3 h-3 text-zinc-500" />
                              <span>Archived</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => setEditingProduct(p)}
                            className="p-1.5 text-zinc-500 hover:text-black hover:bg-zinc-100 border border-transparent hover:border-zinc-200 transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
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

      {/* Modal: Create Garment */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white border border-zinc-200 shadow-2xl p-6 sm:p-8 text-[#0a0a0a]">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              aria-label="Close dialog"
              className="absolute top-4 right-4 p-1.5 text-zinc-500 hover:text-black transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-black text-white flex items-center justify-center shrink-0">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest font-mono text-zinc-500">
                  Module 2 • Catalog Management
                </div>
                <h3 className="font-serif text-xl font-medium tracking-tight text-[#0a0a0a]">
                  Add New Retail Garment
                </h3>
              </div>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  placeholder="e.g. Minimalist Linen Resort Shirt"
                  className="w-full h-10 px-3.5 bg-white border border-zinc-300 focus:border-black text-xs text-[#0a0a0a] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                    className="w-full h-10 px-3 bg-white border border-zinc-300 focus:border-black text-xs text-[#0a0a0a] outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.categoryId} value={c.categoryId}>
                        {c.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                    Gender Target *
                  </label>
                  <select
                    value={formData.genderTarget}
                    onChange={(e) => setFormData({ ...formData, genderTarget: e.target.value as any })}
                    className="w-full h-10 px-3 bg-white border border-zinc-300 focus:border-black text-xs text-[#0a0a0a] outline-none"
                  >
                    <option value="UNISEX">UNISEX</option>
                    <option value="MEN">MEN</option>
                    <option value="WOMEN">WOMEN</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                    Base Price (LKR) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={50}
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                    className="w-full h-10 px-3.5 bg-white border border-zinc-300 focus:border-black text-xs text-[#0a0a0a] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                    Active on Storefront
                  </label>
                  <div className="h-10 flex items-center">
                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="rounded-none border-zinc-300 text-black focus:ring-black"
                      />
                      <span>Live immediately</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                  Main Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.mainImageUrl}
                  onChange={(e) => setFormData({ ...formData, mainImageUrl: e.target.value })}
                  className="w-full h-10 px-3.5 bg-white border border-zinc-300 focus:border-black text-xs text-[#0a0a0a] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                  Product Description
                </label>
                <textarea
                  rows={2}
                  value={formData.productDescription}
                  onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                  placeholder="Fabric composition, fit details, and styling notes..."
                  className="w-full p-3 bg-white border border-zinc-300 focus:border-black text-xs text-[#0a0a0a] outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-11 bg-black hover:bg-zinc-800 text-white text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
                >
                  Save Garment & Generate SKUs
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Garment */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white border border-zinc-200 shadow-2xl p-6 sm:p-8 text-[#0a0a0a]">
            <button
              onClick={() => setEditingProduct(null)}
              aria-label="Close dialog"
              className="absolute top-4 right-4 p-1.5 text-zinc-500 hover:text-black transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-black text-white flex items-center justify-center shrink-0">
                <Edit2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest font-mono text-zinc-500">
                  Editing Product #{editingProduct.productId}
                </div>
                <h3 className="font-serif text-xl font-medium tracking-tight text-[#0a0a0a]">
                  Modify Product Details
                </h3>
              </div>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.productName}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, productName: e.target.value })
                  }
                  className="w-full h-10 px-3.5 bg-white border border-zinc-300 focus:border-black text-xs text-[#0a0a0a] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                    Base Price (LKR) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={50}
                    value={editingProduct.basePrice}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        basePrice: Number(e.target.value),
                      })
                    }
                    className="w-full h-10 px-3.5 bg-white border border-zinc-300 focus:border-black text-xs text-[#0a0a0a] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                    Gender Target
                  </label>
                  <select
                    value={editingProduct.genderTarget || 'UNISEX'}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        genderTarget: e.target.value as any,
                      })
                    }
                    className="w-full h-10 px-3 bg-white border border-zinc-300 focus:border-black text-xs text-[#0a0a0a] outline-none"
                  >
                    <option value="UNISEX">UNISEX</option>
                    <option value="MEN">MEN</option>
                    <option value="WOMEN">WOMEN</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                  Main Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={editingProduct.mainImageUrl}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, mainImageUrl: e.target.value })
                  }
                  className="w-full h-10 px-3.5 bg-white border border-zinc-300 focus:border-black text-xs text-[#0a0a0a] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                  Product Description
                </label>
                <textarea
                  rows={2}
                  value={editingProduct.productDescription || ''}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      productDescription: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-white border border-zinc-300 focus:border-black text-xs text-[#0a0a0a] outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-11 bg-black hover:bg-zinc-800 text-white text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
                >
                  Save Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
