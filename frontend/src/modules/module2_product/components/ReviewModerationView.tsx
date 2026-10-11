// product and inventory component

import React, { useState, useEffect } from 'react';
import { mockDb } from '../../../api/mockDataStore';
import type { ProductReview, Product, Customer } from '../../../types/oms';
import {
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export function ReviewModerationView() {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const loadData = () => {
    setReviews(mockDb.getReviews());
    setProducts(mockDb.getProducts());
    setCustomers(mockDb.getCustomers());
  };

  useEffect(() => {
    loadData();
    const unsub = mockDb.subscribe(() => {
      loadData();
    });
    return unsub;
  }, []);

  const productMap = new Map(products.map(p => [p.productId, p]));
  const customerMap = new Map(customers.map(c => [c.customerId, c]));

  const handleModerate = (reviewId: number, isApproved: boolean) => {
    try {
      mockDb.moderateReview(reviewId, isApproved);
      setActionFeedback(`Review #${reviewId} ${isApproved ? 'approved' : 'rejected / withheld'}.`);
      setTimeout(() => setActionFeedback(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Failed to update review status');
    }
  };

  const pendingCount = reviews.filter(r => !r.isApproved).length;
  const approvedCount = reviews.filter(r => r.isApproved).length;

  const filteredReviews = reviews.filter(r => {
    const product = productMap.get(r.productId);
    const customer = customerMap.get(r.customerId);

    const matchesSearch =
      (r.reviewComment && r.reviewComment.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product && product.productName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (customer && `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === 'PENDING') return !r.isApproved;
    if (statusFilter === 'APPROVED') return r.isApproved;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-zinc-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl font-medium text-[#0a0a0a]">
              Customer Product Review Moderation
            </h2>
            <span className="text-[10px] bg-black text-white px-2 py-0.5 font-mono tracking-widest uppercase">
              Module 2
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Automated compliance filtering, auto-approval rules (ratings &ge; 3 without spam flags), and administrative manual moderation.
          </p>
        </div>
      </div>

      {/* Action notification toast */}
      {actionFeedback && (
        <div className="bg-zinc-900 text-white text-xs px-4 py-3 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{actionFeedback}</span>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-zinc-200 p-4">
          <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold mb-1">
            Total Submissions
          </div>
          <div className="text-2xl font-serif text-[#0a0a0a]">{reviews.length}</div>
          <div className="text-[10px] text-zinc-500 mt-1">Customer feedback logs</div>
        </div>

        <div className="bg-white border border-zinc-200 p-4">
          <div className="text-[11px] uppercase tracking-wider text-emerald-700 font-semibold mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approved & Live</span>
          </div>
          <div className="text-2xl font-serif text-[#0a0a0a]">{approvedCount}</div>
          <div className="text-[10px] text-zinc-500 mt-1">Visible on storefront catalog</div>
        </div>

        <div className={`p-4 border ${pendingCount > 0 ? 'bg-amber-50/40 border-amber-300' : 'bg-white border-zinc-200'}`}>
          <div className="text-[11px] uppercase tracking-wider text-amber-700 font-semibold mb-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Pending Review</span>
          </div>
          <div className="text-2xl font-serif text-amber-900">{pendingCount}</div>
          <div className="text-[10px] text-amber-700 mt-1">Awaiting staff verification</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-zinc-200 p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search comment, customer, product..."
            className="w-full h-10 pl-9 pr-3 bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-black text-xs text-[#0a0a0a] outline-none transition-all"
          />
        </div>

        <div className="flex bg-zinc-100 p-0.5 border border-zinc-200 text-xs">
          {(['ALL', 'PENDING', 'APPROVED'] as const).map((filter) => (
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
                ? `All (${reviews.length})`
                : filter === 'PENDING'
                ? `Pending (${pendingCount})`
                : `Approved (${approvedCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white border border-zinc-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] uppercase tracking-wider font-semibold text-zinc-500">
                <th className="py-3 px-4">Review ID</th>
                <th className="py-3 px-4">Garment</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Feedback Comment</th>
                <th className="py-3 px-4">Submitted Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Moderation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-500">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 stroke-1" />
                    <p className="text-xs uppercase tracking-wider font-medium">No product reviews match criteria</p>
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review) => {
                  const product = productMap.get(review.productId);
                  const customer = customerMap.get(review.customerId);

                  return (
                    <tr key={review.reviewId} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-zinc-900">
                        #{review.reviewId}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={product?.mainImageUrl || '/images/ceru-knit-1.png'}
                            alt={product?.productName}
                            className="w-8 h-10 object-cover bg-zinc-100 border border-zinc-200 shrink-0"
                          />
                          <div>
                            <div className="font-medium text-zinc-900 line-clamp-1">{product?.productName || `Product #${review.productId}`}</div>
                            <div className="text-[10px] text-zinc-500 font-mono">ID #{review.productId}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-zinc-900">
                          {customer ? `${customer.firstName} ${customer.lastName}` : `Customer #${review.customerId}`}
                        </div>
                        <div className="text-[10px] text-zinc-500 font-mono">{customer?.email}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= review.rating
                                  ? 'text-amber-500 fill-amber-500'
                                  : 'text-zinc-200'
                              }`}
                            />
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-zinc-700 max-w-xs">
                        <p className="line-clamp-2 italic text-[11px] leading-relaxed">
                          &ldquo;{review.reviewComment || 'No written text comment provided.'}&rdquo;
                        </p>
                      </td>

                      <td className="py-3 px-4 font-mono text-zinc-500 text-[11px]">
                        {review.createdAt}
                      </td>

                      <td className="py-3 px-4">
                        {review.isApproved ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Live Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            Awaiting Approval
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        {review.isApproved ? (
                          <button
                            onClick={() => handleModerate(review.reviewId, false)}
                            className="min-h-[36px] sm:min-h-[30px] px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-[10px] uppercase tracking-wider font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5 touch-manipulation relative before:absolute before:-inset-1 before:content-['']"
                          >
                            <XCircle className="w-3 h-3" />
                            <span>Revoke</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleModerate(review.reviewId, true)}
                            className="min-h-[36px] sm:min-h-[30px] px-3 py-1.5 bg-black hover:bg-zinc-800 text-white text-[10px] uppercase tracking-wider font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5 touch-manipulation relative before:absolute before:-inset-1 before:content-['']"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
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
    </div>
  );
}
