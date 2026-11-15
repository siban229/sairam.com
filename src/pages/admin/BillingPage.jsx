import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Receipt, Search, ExternalLink, IndianRupee, Clock3, CheckCircle2 } from 'lucide-react';
import { useCafe } from '../../context/CafeContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

const filters = ['All', 'Billing', 'Completed', 'Pending', 'Cancelled'];

export default function BillingPage() {
  const { orders, stats } = useCafe();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredOrders = useMemo(() => orders.filter(order => {
    const matchesFilter = filter === 'All' ||
      (filter === 'Pending' ? !['Completed', 'Cancelled'].includes(order.status) :
        filter === order.status);
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [order.id, order.tableName, order.customerName, order.customerPhone]
      .filter(Boolean).some(value => String(value).toLowerCase().includes(query));
    return matchesFilter && matchesSearch;
  }), [orders, filter, search]);

  const requestedBills = orders.filter(order => order.status === 'Billing').length;
  const paidBills = orders.filter(order => order.status === 'Completed').length;
  const totalCollected = orders.filter(order => order.status === 'Completed')
    .reduce((sum, order) => sum + (order.total || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#241A14] flex items-center gap-2">
            <Receipt className="w-6 h-6 text-[#E58A3A]" /> Billing & Invoices
          </h2>
          <p className="text-xs text-[#8A7A6E] mt-1">Track every bill, payment and customer bill request.</p>
        </div>
        <Link to="/admin/pos" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E58A3A] text-white text-xs font-bold shadow-sm">
          New POS Bill <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#E8E0D5] p-5"><Clock3 className="w-5 h-5 text-purple-600" /><p className="text-xs text-[#8A7A6E] mt-3">Bill Requests</p><p className="text-2xl font-extrabold text-[#241A14]">{requestedBills}</p></div>
        <div className="bg-white rounded-2xl border border-[#E8E0D5] p-5"><CheckCircle2 className="w-5 h-5 text-emerald-600" /><p className="text-xs text-[#8A7A6E] mt-3">Paid Bills</p><p className="text-2xl font-extrabold text-[#241A14]">{paidBills}</p></div>
        <div className="bg-white rounded-2xl border border-[#E8E0D5] p-5"><IndianRupee className="w-5 h-5 text-[#E58A3A]" /><p className="text-xs text-[#8A7A6E] mt-3">Total Collected</p><p className="text-2xl font-extrabold text-[#241A14]">{formatCurrency(totalCollected)}</p></div>
      </div>

      <div className="bg-white rounded-3xl border border-[#E8E0D5] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#E8E0D5] flex flex-col md:flex-row gap-3 justify-between">
          <div className="relative max-w-sm w-full"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A7A6E]" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search bill, table or customer..." className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] text-xs" /></div>
          <div className="flex gap-2 overflow-x-auto">{filters.map(item => <button key={item} onClick={() => setFilter(item)} className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap ${filter === item ? 'bg-[#5C3A21] text-white' : 'bg-[#FAF7F2] text-[#665A4F] border border-[#E8E0D5]'}`}>{item}</button>)}</div>
        </div>
        <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="bg-[#FAF7F2] text-[#8A7A6E]"><tr><th className="p-4">Bill</th><th className="p-4">Table</th><th className="p-4">Customer</th><th className="p-4">Amount</th><th className="p-4">Status</th><th className="p-4">Date</th></tr></thead><tbody>{filteredOrders.map(order => <tr key={order.id} className="border-t border-[#E8E0D5]"><td className="p-4 font-bold text-[#241A14]">#{order.id}</td><td className="p-4 font-semibold">{order.tableName || `Table ${order.tableNumber}`}</td><td className="p-4">{order.customerName || 'Walk-in Guest'}</td><td className="p-4 font-extrabold">{formatCurrency(order.total)}</td><td className="p-4"><span className={`px-2.5 py-1 rounded-full font-bold ${order.status === 'Billing' ? 'bg-purple-100 text-purple-700' : order.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : order.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}`}>{order.status === 'Billing' ? 'Bill Requested' : order.status === 'Completed' ? 'Paid' : order.status}</span></td><td className="p-4 text-[#8A7A6E]">{formatDateTime(order.completedAt || order.billRequestedAt || order.createdAt)}</td></tr>)}</tbody></table>{filteredOrders.length === 0 && <div className="p-10 text-center text-sm text-[#8A7A6E]">No bills found</div>}</div>
      </div>
    </div>
  );
}
