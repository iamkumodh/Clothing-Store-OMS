// Customer Directory Registry & Profile Viewer

import { useState, useEffect } from 'react';
import { CustomerProfile } from '../types';
import { module1Api } from '../api/module1ApiClient';
import { Search, Eye, X } from 'lucide-react';
import { SRI_LANKA_DISTRICTS } from '../data/initialFixtures';

export function CustomerDirectoryView() {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [activeProfile, setActiveProfile] = useState<CustomerProfile | null>(null);

  useEffect(() => {
    async function loadCustomers() {
      setLoading(true);
      try {
        const data = await module1Api.getAllCustomers();
        setCustomers(data);
      } finally {
        setLoading(false);
      }
    }
    loadCustomers();
  }, []);

  const filteredCustomers = customers.filter(c => {
    const matchesSearch =
      c.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDistrict = districtFilter === 'ALL' || c.district === districtFilter;
    return matchesSearch && matchesDistrict;
  });

  return (
    <div className="bg-white border border-zinc-200 rounded-none p-6 sm:p-8">
      <div className="border-b border-zinc-200 pb-4 mb-6">
        <h2 className="font-serif text-2xl text-[#0a0a0a]">Customer Registry & Directory</h2>
        <p className="text-xs text-zinc-500 mt-1">
          Search and examine customer records, linked user credentials, and registered shipping addresses (customer & app_user).
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by customer name, email, or city..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-3 border border-zinc-300 text-xs outline-none focus:border-black rounded-none"
          />
        </div>

        <select
          value={districtFilter}
          onChange={e => setDistrictFilter(e.target.value)}
          className="h-10 px-3 border border-zinc-300 text-xs outline-none bg-white min-w-[160px] rounded-none focus:border-black"
        >
          <option value="ALL">All Districts ({customers.length})</option>
          {SRI_LANKA_DISTRICTS.map(d => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Directory Table */}
      {loading ? (
        <div className="py-12 text-center text-xs text-zinc-500 uppercase tracking-wider animate-pulse">
          Loading customer directory...
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="py-12 text-center text-xs text-zinc-500">
          No customer accounts found matching current query.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 text-[11px] uppercase tracking-wider text-zinc-500">
                <th className="py-3 font-semibold">Customer</th>
                <th className="py-3 font-semibold">Contact</th>
                <th className="py-3 font-semibold">Location</th>
                <th className="py-3 font-semibold">Province</th>
                <th className="py-3 font-semibold text-center">Orders</th>
                <th className="py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredCustomers.map(cust => (
                <tr key={cust.customerId} className="hover:bg-zinc-50 transition-colors">
                  <td className="py-3.5 pr-2">
                    <div className="font-semibold text-sm text-zinc-900">
                      {cust.firstName} {cust.lastName}
                    </div>
                    <div className="text-[11px] text-zinc-500 font-mono">{cust.email}</div>
                  </td>
                  <td className="py-3.5 font-mono text-xs text-zinc-600">{cust.contactNumber}</td>
                  <td className="py-3.5 text-zinc-600">
                    <div>{cust.city}</div>
                    <div className="text-[11px] text-zinc-500">{cust.district} District</div>
                  </td>
                  <td className="py-3.5 text-zinc-600">{cust.province}</td>
                  <td className="py-3.5 text-center font-semibold text-zinc-900">
                    {cust.totalOrders || 0}
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => setActiveProfile(cust)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 border border-zinc-300 hover:bg-zinc-100 text-[11px] font-medium text-zinc-900 rounded-none transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Customer Full Profile Modal */}
      {activeProfile && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-none border border-zinc-200 shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
                  Customer Record #{activeProfile.customerId}
                </span>
                <h3 className="font-serif text-xl text-[#0a0a0a]">
                  {activeProfile.firstName} {activeProfile.lastName}
                </h3>
              </div>
              <button
                onClick={() => setActiveProfile(null)}
                aria-label="Close profile"
                className="text-zinc-500 hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-zinc-600">
              <div>
                <span className="font-semibold text-zinc-900">Email:</span>{' '}
                <span className="font-mono">{activeProfile.email}</span>
              </div>
              <div>
                <span className="font-semibold text-zinc-900">Phone Number:</span>{' '}
                <span className="font-mono">{activeProfile.contactNumber}</span>
              </div>
              <div>
                <span className="font-semibold text-zinc-900">Linked User Account ID:</span>{' '}
                <span className="font-mono">app_user #{activeProfile.userId}</span>
              </div>
              <div className="pt-2 border-t border-zinc-100">
                <div className="font-semibold text-zinc-900 mb-1">Shipping Street Address:</div>
                <div className="bg-zinc-50 p-2.5 rounded-none border border-zinc-200 leading-relaxed">
                  {activeProfile.shippingAddress}
                  <br />
                  {activeProfile.city}, {activeProfile.district} District
                  <br />
                  {activeProfile.province} Province {activeProfile.postalCode ? `(${activeProfile.postalCode})` : ''}
                </div>
              </div>
              <div className="flex justify-between pt-2 text-zinc-500">
                <span>Registered On:</span>
                <span>{activeProfile.registeredAt || '2026-02-14'}</span>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-200 flex justify-end">
              <button
                onClick={() => setActiveProfile(null)}
                className="px-4 py-2 bg-black text-white text-xs uppercase tracking-wider font-medium rounded-none hover:bg-zinc-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
