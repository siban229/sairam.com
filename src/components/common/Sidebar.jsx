import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useCafe } from '../../context/CafeContext';
import {
  LayoutDashboard,
  Calculator,
  Grid3X3,
  UtensilsCrossed,
  BookOpen,
  Users,
  Award,
  BarChart3,
  Settings,
  Coffee,
  QrCode,
  X,
  Sparkles,
  ExternalLink
  ,Receipt
} from 'lucide-react';

export default function Sidebar({ mobileOpen, closeMobileSidebar }) {
  const { stats, settings, tables } = useCafe();

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/admin/pos', label: 'POS & Billing', icon: Calculator, badge: null },
    { to: '/admin/billing', label: 'Bills & Invoices', icon: Receipt, badge: stats.ordersRequiringPayment || null },
    {
      to: '/admin/tables',
      label: 'Tables',
      icon: Grid3X3,
      badge: `${stats.activeTablesCount}/${settings.tableCount || 12}`
    },
    {
      to: '/admin/kitchen',
      label: 'Kitchen KDS',
      icon: UtensilsCrossed,
      badge: stats.pendingOrdersCount > 0 ? `${stats.pendingOrdersCount}` : null,
      badgeColor: 'bg-[#E58A3A] text-white animate-pulse'
    },
    { to: '/admin/menu', label: 'Menu Catalog', icon: BookOpen },
    { to: '/admin/customers', label: 'Customers CRM', icon: Users },
    { to: '/admin/loyalty', label: 'Loyalty & Rewards', icon: Award },
    { to: '/admin/reports', label: 'Reports & Analytics', icon: BarChart3 },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-[#241A14]/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white text-[#24324A] flex flex-col justify-between border-r border-[#E5EAF2] shadow-[8px_0_28px_rgba(36,50,74,0.06)] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Logo & Cafe Identity */}
        <div>
          <div className="p-5 flex items-center justify-between border-b border-[#E5EAF2]">
            <Link to="/admin" className="flex items-center gap-3 group" onClick={closeMobileSidebar}>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E58A3A] to-[#5C3A21] flex items-center justify-center shadow-lg shadow-[#E58A3A]/20 group-hover:scale-105 transition-transform">
                <Coffee className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-sm text-[#24324A] tracking-tight leading-tight">
                  {settings.cafeName || 'Sairam Chahawala'}
                </h1>
                <p className="text-[10px] text-[#8290A5] truncate max-w-[140px] uppercase tracking-wider font-semibold">
                  Smart Cafe POS
                </p>
              </div>
            </Link>

            <button
              onClick={closeMobileSidebar}
              className="lg:hidden text-[#A8988B] hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav List */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)]">
            <div className="px-3 py-1.5 text-[10px] font-semibold tracking-wider text-[#8A7A6E] uppercase">
              Main Operations
            </div>

            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  onClick={closeMobileSidebar}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#E58A3A] text-white shadow-md shadow-[#E58A3A]/25 font-semibold'
                        : 'text-[#617089] hover:bg-[#FFF7EC] hover:text-[#E27B17]'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        item.badgeColor || 'bg-[#5C3A21] text-[#F8F5F0]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom section: Customer QR ordering card & Quick Links */}
        <div className="p-4 border-t border-[#E5EAF2] bg-[#FBFCFE]">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-[#FFF7EC] to-white border border-[#F5D9B0] text-xs">
            <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-[#24324A] flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5 text-[#E58A3A]" />
                Customer QR Menu
              </span>
              <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-md font-mono">
                Ready
              </span>
            </div>
            <p className="text-[11px] text-[#8290A5] mb-2.5">
              Customers scan to self-order from any table.
            </p>
            <Link
              to="/menu?table=Table%2004"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl bg-[#E58A3A]/20 hover:bg-[#E58A3A]/30 text-[#E58A3A] hover:text-white border border-[#E58A3A]/40 font-semibold text-[11px] transition-all"
            >
              <span>Test Table 04 Menu</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-[#8A7A6E] px-1">
            <span>Cloud workspace</span>
            <span className="flex items-center gap-1 text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Connected
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
