import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCafe } from '../../context/CafeContext';
import { formatCurrency, formatDateTime, STATUS_COLORS } from '../../utils/formatters';
import {
  IndianRupee,
  ShoppingBag,
  Users,
  Grid3X3,
  Clock,
  CheckCircle,
  TrendingUp,
  UtensilsCrossed,
  Sparkles,
  QrCode,
  ArrowUpRight,
  Eye,
  ChevronRight,
  Coffee,
  Check
} from 'lucide-react';

export default function DashboardPage() {
  const { stats, orders, tables, menuItems, settings, updateOrderStatus } = useCafe();
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Recent 6 orders
  const recentOrders = orders.slice(0, 6);

  // Top popular menu items based on order item counts
  const popularItems = React.useMemo(() => {
    const counts = {};
    orders.forEach(ord => {
      if (ord.items) {
        ord.items.forEach(item => {
          counts[item.name] = (counts[item.name] || 0) + (item.quantity || 1);
        });
      }
    });

    return menuItems
      .map(item => ({
        ...item,
        orderCount: counts[item.name] || 0
      }))
      .sort((a, b) => b.orderCount - a.orderCount)
      .slice(0, 5);
  }, [orders, menuItems]);

  // Weekly Revenue mock-to-live data points for chart
  const weeklyData = [
    { day: 'Mon', revenue: 4200 },
    { day: 'Tue', revenue: 5800 },
    { day: 'Wed', revenue: 6400 },
    { day: 'Thu', revenue: 5100 },
    { day: 'Fri', revenue: 8900 },
    { day: 'Sat', revenue: 11200 },
    { day: 'Today', revenue: Math.max(stats.todaysRevenue, 3800) }
  ];
  const maxWeeklyRevenue = Math.max(...weeklyData.map(d => d.revenue), 12000);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-white via-[#FFF9F1] to-[#FFF0D9] rounded-3xl p-6 sm:p-8 text-[#24324A] shadow-[0_18px_45px_rgba(235,141,45,0.14)] border border-[#F4DFC2] relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full bg-[#E58A3A]/20 border border-[#E58A3A]/40 text-[#E58A3A] text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Real-time Operations
            </span>
            <span className="text-xs text-[#8290A5]">Live workspace</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#24324A] tracking-tight">
            {settings.cafeName || 'Sairam Chahawala'}
          </h2>
          <p className="text-sm text-[#617089] mt-1">
            Seamless table management, QR self-ordering, automated kitchen display, and loyalty perks.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <Link
            to="/admin/pos"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#E58A3A] hover:bg-[#D77A28] text-white font-semibold text-sm shadow-lg shadow-[#E58A3A]/30 transition-all transform active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Open POS Terminal</span>
          </Link>
          <Link
            to="/admin/tables"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all backdrop-blur-sm"
          >
            <Grid3X3 className="w-4 h-4" />
            <span>Manage 12 Tables</span>
          </Link>
        </div>

        {/* Decorative background coffee bean circles */}
        <div className="absolute right-[-40px] bottom-[-40px] w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
      </div>

      {/* Primary KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8E0D5] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#8A7A6E] uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-[#241A14]">
              {formatCurrency(stats.totalRevenue)}
            </h3>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +18.4%
            </span>
          </div>
          <p className="text-xs text-[#8A7A6E] mt-1">
            Today: <span className="font-semibold text-[#241A14]">{formatCurrency(stats.todaysRevenue)}</span>
          </p>
        </div>

        {/* Today's Orders */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8E0D5] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#8A7A6E] uppercase tracking-wider">
              Today's Orders
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#E58A3A] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-[#241A14]">
              {stats.todaysOrdersCount}
            </h3>
            <span className="text-[11px] font-semibold text-amber-700">
              {stats.pendingOrdersCount} pending
            </span>
          </div>
          <p className="text-xs text-[#8A7A6E] mt-1">
            All-time: <span className="font-semibold text-[#241A14]">{stats.totalOrdersCount} orders</span>
          </p>
        </div>

        {/* Active Tables */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8E0D5] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#8A7A6E] uppercase tracking-wider">
              Active Tables
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Grid3X3 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-[#241A14]">
              {stats.activeTablesCount} <span className="text-sm font-normal text-[#8A7A6E]">/ {settings.tableCount || 12}</span>
            </h3>
            <span className="text-[11px] font-semibold text-blue-600">
              {Math.round((stats.activeTablesCount / (settings.tableCount || 12)) * 100)}% Occ
            </span>
          </div>
          <p className="text-xs text-[#8A7A6E] mt-1">
            {(settings.tableCount || 12) - stats.activeTablesCount} tables available now
          </p>
        </div>

        {/* Average Order Value */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8E0D5] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#8A7A6E] uppercase tracking-wider">
              Avg Order Value
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-[#241A14]">
              {formatCurrency(stats.avgOrderValue)}
            </h3>
            <span className="text-[11px] font-semibold text-purple-600">
              {stats.completedOrdersCount} completed
            </span>
          </div>
          <p className="text-xs text-[#8A7A6E] mt-1">
            Loyalty Customers: <span className="font-semibold text-[#241A14]">{stats.totalCustomersCount} enrolled</span>
          </p>
        </div>
      </div>

      {/* Middle Row: Revenue Chart & Table Occupancy Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Revenue Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[#E8E0D5] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-lg text-[#241A14]">Weekly Revenue Trend</h3>
              <p className="text-xs text-[#8A7A6E]">Sales breakdown across the last 7 operating days</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs text-[#665A4F] font-medium">
                <span className="w-3 h-3 rounded bg-[#E58A3A]" /> Sales (₹)
              </span>
            </div>
          </div>

          {/* Clean Responsive Bar Chart */}
          <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 pt-4 border-b border-[#E8E0D5]">
            {weeklyData.map((d, index) => {
              const heightPercent = Math.round((d.revenue / maxWeeklyRevenue) * 100);
              const isToday = d.day === 'Today';

              return (
                <div key={index} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="text-[10px] font-semibold text-[#8A7A6E] opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                    ₹{d.revenue}
                  </div>
                  <div className="w-full max-w-[42px] bg-[#F1ECE4] rounded-t-xl h-full flex items-end overflow-hidden p-1">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        isToday
                          ? 'bg-gradient-to-t from-[#D77A28] to-[#E58A3A]'
                          : 'bg-gradient-to-t from-[#5C3A21] to-[#8C532B] group-hover:from-[#E58A3A] group-hover:to-[#F59E0B]'
                      }`}
                    />
                  </div>
                  <span className={`text-xs mt-2 font-medium ${isToday ? 'text-[#E58A3A] font-bold' : 'text-[#8A7A6E]'}`}>
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-[#8A7A6E]">
            <span>Peak day: Saturday (₹11,200)</span>
            <span>Target: ₹10,000/day</span>
          </div>
        </div>

        {/* Live Table Matrix (12 Tables Mini View) */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E0D5] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg text-[#241A14]">Table Status</h3>
                <p className="text-xs text-[#8A7A6E]">Real-time 12-table layout</p>
              </div>
              <Link
                to="/admin/tables"
                className="text-xs font-semibold text-[#E58A3A] hover:underline flex items-center gap-0.5"
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 12 mini tables grid */}
            <div className="grid grid-cols-4 gap-2.5">
              {tables.slice(0, 12).map(table => {
                const statusStyle = STATUS_COLORS[table.status] || STATUS_COLORS.Available;
                const isOccupied = table.status !== 'Available';

                return (
                  <Link
                    key={table.id}
                    to="/admin/tables"
                    className={`p-2 rounded-xl border text-center transition-all hover:scale-105 ${statusStyle.bg} ${statusStyle.border}`}
                    title={`${table.name}: ${table.status}`}
                  >
                    <div className="text-xs font-bold text-[#241A14]">{table.name.replace('Table ', 'T-')}</div>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                      <span className="text-[9px] font-medium text-[#665A4F] truncate max-w-[45px]">
                        {table.status}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#E8E0D5]/70 flex items-center justify-between text-xs">
            <span className="text-[#8A7A6E]">Quick QR Menu:</span>
            <Link
              to="/menu?table=Table%2001"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5C3A21] hover:text-[#E58A3A] font-semibold flex items-center gap-1"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Table 01 Scan</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Live Orders & Popular Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders List */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[#E8E0D5] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg text-[#241A14]">Live & Recent Orders</h3>
              <p className="text-xs text-[#8A7A6E]">Incoming orders from QR menu & POS terminal</p>
            </div>
            <Link
              to="/admin/kitchen"
              className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] text-[#5C3A21] border border-[#E8E0D5] text-xs font-semibold hover:bg-[#EAE3D9] transition-colors flex items-center gap-1.5"
            >
              <UtensilsCrossed className="w-3.5 h-3.5 text-[#E58A3A]" />
              <span>Kitchen Display</span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8E0D5] text-[#8A7A6E] font-semibold">
                  <th className="pb-3 pl-2">Order ID</th>
                  <th className="pb-3">Table</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Items</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 pr-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E0D5]/60">
                {recentOrders.map(order => {
                  const statusStyle = STATUS_COLORS[order.status] || STATUS_COLORS.Available;
                  const totalItemsCount = order.items.reduce((s, i) => s + (i.quantity || 1), 0);

                  return (
                    <tr key={order.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="py-3 pl-2 font-mono font-bold text-[#5C3A21]">
                        {order.id}
                      </td>
                      <td className="py-3 font-semibold text-[#241A14]">
                        {order.tableName}
                      </td>
                      <td className="py-3 text-[#665A4F]">
                        {order.customerName}
                      </td>
                      <td className="py-3 text-[#665A4F]">
                        <span className="font-medium text-[#241A14]">{totalItemsCount} items</span>
                        <p className="text-[10px] text-[#8A7A6E] truncate max-w-[150px]">
                          {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                        </p>
                      </td>
                      <td className="py-3 font-bold text-[#241A14]">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 pr-2 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 text-[#5C3A21] hover:bg-[#E8E0D5] rounded-lg transition-colors"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Popular Menu Items */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E0D5] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg text-[#241A14]">Popular Items</h3>
                <p className="text-xs text-[#8A7A6E]">Top favorites among cafe guests</p>
              </div>
              <Link
                to="/admin/menu"
                className="text-xs font-semibold text-[#E58A3A] hover:underline"
              >
                Catalog
              </Link>
            </div>

            <div className="space-y-3.5">
              {popularItems.map((item, index) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover border border-[#E8E0D5]"
                    />
                    <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-[#5C3A21] text-white text-[10px] font-bold flex items-center justify-center">
                      #{index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#241A14] truncate">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-[#8A7A6E]">
                      {item.category} • {formatCurrency(item.price)}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#5C3A21] bg-[#F8F5F0] px-2 py-1 rounded-lg border border-[#E8E0D5]">
                    {item.orderCount} sold
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#E8E0D5]">
            <Link
              to="/admin/pos"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#5C3A21] hover:bg-[#4B2E19] text-white font-semibold text-xs transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Punch New POS Order</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-[#241A14]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E8E0D5] relative">
            <div className="flex items-center justify-between border-b border-[#E8E0D5] pb-4 mb-4">
              <div>
                <span className="text-xs font-mono font-bold text-[#E58A3A]">
                  #{selectedOrder.id}
                </span>
                <h3 className="text-lg font-bold text-[#241A14]">
                  {selectedOrder.tableName} Order
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-[#F8F5F0] text-[#665A4F] hover:text-[#241A14] flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {/* Customer info */}
              <div className="bg-[#FAF7F2] p-3.5 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#8A7A6E]">Guest:</span>{' '}
                  <span className="font-bold text-[#241A14]">{selectedOrder.customerName}</span>
                </div>
                {selectedOrder.customerPhone && (
                  <div>
                    <span className="text-[#8A7A6E]">Phone:</span>{' '}
                    <span className="font-mono text-[#5C3A21]">{selectedOrder.customerPhone}</span>
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#8A7A6E] uppercase tracking-wider">
                  Ordered Items
                </span>
                {selectedOrder.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-[#E8E0D5] text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#5C3A21] text-white font-bold text-xs flex items-center justify-center">
                        {item.quantity}x
                      </span>
                      <div>
                        <p className="font-semibold text-[#241A14]">{item.name}</p>
                        {item.specialInstructions && (
                          <p className="text-[10px] text-[#E58A3A] italic">
                            Note: "{item.specialInstructions}"
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="font-bold text-[#241A14]">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial summary */}
              <div className="bg-[#F8F5F0] p-4 rounded-2xl space-y-1.5 text-xs">
                <div className="flex justify-between text-[#665A4F]">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#665A4F]">
                  <span>GST ({settings.gstPercentage || 5}%):</span>
                  <span>{formatCurrency(selectedOrder.gst)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({selectedOrder.couponApplied || 'Promo'}):</span>
                    <span>-{formatCurrency(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold text-[#241A14] pt-2 border-t border-[#E8E0D5]">
                  <span>Total Amount:</span>
                  <span>{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>

              {/* Quick Status Update buttons */}
              <div>
                <span className="text-xs font-semibold text-[#8A7A6E] uppercase tracking-wider block mb-2">
                  Update Live Status
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {['Preparing', 'Ready', 'Served'].map(st => (
                    <button
                      key={st}
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, st);
                        setSelectedOrder({ ...selectedOrder, status: st });
                      }}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        selectedOrder.status === st
                          ? 'bg-[#5C3A21] text-white border-[#5C3A21]'
                          : 'bg-white text-[#5C3A21] border-[#E8E0D5] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#E8E0D5] flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 rounded-xl bg-[#5C3A21] text-white text-xs font-semibold hover:bg-[#4B2E19]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
