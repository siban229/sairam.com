import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useCafe } from '../../context/CafeContext';
import { formatCurrency, STATUS_COLORS } from '../../utils/formatters';
import {
  Grid3X3,
  QrCode,
  Users,
  Printer,
  RotateCcw,
  Plus,
  Eye,
  ExternalLink,
  Pencil,
  CheckCircle2,
  AlertCircle,
  Coffee,
  Sparkles
} from 'lucide-react';

export default function TablesPage() {
  const { tables, orders, updateTableStatus, resetTable, addTable, editTable, settings } = useCafe();
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedTableForQR, setSelectedTableForQR] = useState(null);
  const [selectedTableForOrder, setSelectedTableForOrder] = useState(null);
  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const [selectedTableForEdit, setSelectedTableForEdit] = useState(null);
  const [editTableCapacity, setEditTableCapacity] = useState(4);
  const [editTableName, setEditTableName] = useState('');
  const [newTableCapacity, setNewTableCapacity] = useState(4);

  // Status categories
  const statuses = [
    'All',
    'Available',
    'Occupied',
    'Order Pending',
    'Preparing',
    'Ready',
    'Served',
    'Billing'
  ];

  const filteredTables = filterStatus === 'All'
    ? tables
    : tables.filter(t => t.status === filterStatus);

  // Helper to find the active order for a table
  const getActiveOrder = (table) => {
    if (!table.activeOrderId) return null;
    return orders.find(o => o.id === table.activeOrderId && o.status !== 'Completed');
  };

  // Helper to get QR link URL
  const getTableQRUrl = (tableName) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
    return `${origin}/menu?table=${encodeURIComponent(tableName)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#241A14] flex items-center gap-2">
            <Grid3X3 className="w-6 h-6 text-[#5C3A21]" />
            Table Management (12 Tables)
          </h2>
          <p className="text-xs text-[#8A7A6E] mt-0.5">
            Monitor real-time table occupancy, generate guest QR codes, and manage table states.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddTableModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5C3A21] hover:bg-[#4B2E19] text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Table</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {statuses.map(st => {
          const count = st === 'All' ? tables.length : tables.filter(t => t.status === st).length;
          const isActive = filterStatus === st;

          return (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-[#5C3A21] text-white border-[#5C3A21] shadow-sm'
                  : 'bg-white text-[#665A4F] border-[#E8E0D5] hover:bg-[#FAF7F2]'
              }`}
            >
              {st} <span className="opacity-70 ml-1">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Tables 12-Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {filteredTables.map(table => {
          const activeOrder = getActiveOrder(table);
          const statusStyle = STATUS_COLORS[table.status] || STATUS_COLORS.Available;
          const isOccupied = table.status !== 'Available';
          const qrUrl = getTableQRUrl(table.name);

          return (
            <div
              key={table.id}
              className={`bg-white rounded-3xl p-5 border transition-all hover:shadow-md flex flex-col justify-between ${
                isOccupied ? 'border-[#5C3A21]/30 shadow-sm' : 'border-[#E8E0D5]'
              }`}
            >
              <div>
                {/* Table Header: Name + Capacity + Status Pill */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-extrabold text-[#241A14]">
                      {table.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#8A7A6E] mt-0.5">
                      <Users className="w-3.5 h-3.5" />
                      <span>{table.capacity} Guests</span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                    {table.status}
                  </span>
                </div>

                {/* Active Order Card info or Available State */}
                {activeOrder ? (
                  <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#E8E0D5] mb-4 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-[#5C3A21]">
                        #{activeOrder.id}
                      </span>
                      <span className="font-bold text-[#241A14]">
                        {formatCurrency(activeOrder.total)}
                      </span>
                    </div>
                    <p className="text-xs text-[#665A4F] font-medium truncate">
                      {activeOrder.customerName || 'Guest'}
                    </p>
                    <p className="text-[11px] text-[#8A7A6E] truncate">
                      {activeOrder.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </p>
                  </div>
                ) : (
                  <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-2xl text-center mb-4">
                    <p className="text-xs font-semibold text-emerald-800">
                      Table is ready for guests
                    </p>
                    <p className="text-[11px] text-emerald-600/80">
                      Walk-in or QR self-order
                    </p>
                  </div>
                )}

                {/* Status Dropdown Controller */}
                <div className="space-y-1 mb-4">
                  <label className="text-[10px] font-bold uppercase text-[#8A7A6E] tracking-wider block">
                    Change Status
                  </label>
                  <select
                    value={table.status}
                    onChange={(e) => updateTableStatus(table.id, e.target.value)}
                    className="w-full text-xs font-semibold py-2 px-3 rounded-xl bg-[#F8F5F0] border border-[#E8E0D5] text-[#241A14] focus:outline-none focus:ring-2 focus:ring-[#5C3A21]"
                  >
                    {statuses.filter(s => s !== 'All').map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons: QR Code, Reset, View Order */}
              <div className="pt-3 border-t border-[#E8E0D5]/70 flex items-center justify-between gap-1.5">
                <button
                  onClick={() => {
                    setSelectedTableForEdit(table);
                    setEditTableCapacity(table.capacity || 4);
                    setEditTableName(table.name || '');
                  }}
                  className="p-2 rounded-xl bg-[#FAF7F2] hover:bg-[#EAE3D9] text-[#5C3A21] border border-[#E8E0D5] transition-colors"
                  title="Edit table"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedTableForQR(table)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-[#FAF7F2] hover:bg-[#EAE3D9] text-[#5C3A21] border border-[#E8E0D5] text-xs font-semibold transition-colors"
                  title="Generate & Print Table QR Code"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#E58A3A]" />
                  <span>QR Code</span>
                </button>

                {activeOrder ? (
                  <button
                    onClick={() => setSelectedTableForOrder(activeOrder)}
                    className="p-2 rounded-xl bg-[#FAF7F2] hover:bg-[#EAE3D9] text-[#5C3A21] border border-[#E8E0D5] transition-colors"
                    title="View Active Order"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                ) : null}

                {table.status !== 'Available' && (
                  <button
                    onClick={() => resetTable(table.id)}
                    className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#5C3A21] border border-amber-200 transition-colors"
                    title="Reset Table to Available"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* QR Code Modal with Live Preview and Print functionality */}
      {selectedTableForQR && (
        <div className="fixed inset-0 z-50 bg-[#241A14]/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E8E0D5] relative text-center">
            <button
              onClick={() => setSelectedTableForQR(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F8F5F0] text-[#665A4F] hover:text-[#241A14] flex items-center justify-center text-sm font-bold"
            >
              ✕
            </button>

            {/* Printable Table QR Stand Card */}
            <div className="printable-area p-6 bg-gradient-to-b from-[#FAF7F2] to-white rounded-3xl border border-[#E8E0D5] shadow-inner mb-5">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Coffee className="w-5 h-5 text-[#E58A3A]" />
                <span className="font-extrabold text-base tracking-tight text-[#241A14]">
                  {settings.cafeName || 'Sairam Chahawala'}
                </span>
              </div>
              <p className="text-[11px] text-[#8A7A6E] mb-4">
                Scan to browse digital menu & order directly
              </p>

              {/* The SVG QR Code */}
              <div className="bg-white p-4 rounded-2xl border border-[#E8E0D5] inline-block shadow-sm">
                <QRCodeSVG
                  value={getTableQRUrl(selectedTableForQR.name)}
                  size={190}
                  level="H"
                  includeMargin={true}
                  bgColor="#FFFFFF"
                  fgColor="#241A14"
                />
              </div>

              <div className="mt-4">
                <div className="inline-block px-4 py-1.5 rounded-full bg-[#5C3A21] text-white font-extrabold text-sm tracking-wide">
                  {selectedTableForQR.name}
                </div>
                <p className="text-[10px] text-[#8A7A6E] mt-2">
                  No app download needed • Instant browser menu
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5C3A21] hover:bg-[#4B2E19] text-white text-xs font-semibold shadow-md transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Print Standee</span>
              </button>

              <a
                href={getTableQRUrl(selectedTableForQR.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#EAE3D9] text-[#5C3A21] border border-[#E8E0D5] text-xs font-semibold transition-all"
              >
                <span>Test Link</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#E58A3A]" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Add Table Modal */}
      {showAddTableModal && (
        <div className="fixed inset-0 z-50 bg-[#241A14]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#E8E0D5]">
            <h3 className="text-lg font-bold text-[#241A14] mb-3">Add New Table</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#665A4F] block mb-1">
                  Table Number
                </label>
                <input
                  type="text"
                  disabled
                  value={`Table ${String(tables.length + 1).padStart(2, '0')}`}
                  className="w-full text-xs font-bold py-2 px-3 rounded-xl bg-[#F8F5F0] border border-[#E8E0D5] text-[#8A7A6E]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#665A4F] block mb-1">
                  Seating Capacity (Guests)
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={newTableCapacity}
                  onChange={(e) => setNewTableCapacity(Number(e.target.value))}
                  className="w-full text-xs font-semibold py-2 px-3 rounded-xl bg-white border border-[#E8E0D5] text-[#241A14]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowAddTableModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#665A4F] hover:bg-[#F8F5F0]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    addTable({ capacity: newTableCapacity });
                    setShowAddTableModal(false);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#5C3A21] text-white hover:bg-[#4B2E19]"
                >
                  Create Table
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Table Modal */}
      {selectedTableForEdit && (
        <div className="fixed inset-0 z-50 bg-[#241A14]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#E8E0D5]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#241A14]">Edit {selectedTableForEdit.name}</h3>
              <button onClick={() => setSelectedTableForEdit(null)} className="w-8 h-8 rounded-full bg-[#F8F5F0] text-[#665A4F] font-bold">✕</button>
            </div>
            <label className="text-xs font-semibold text-[#665A4F] block mb-1">Seating Capacity (Guests)</label>
            <label className="text-xs font-semibold text-[#665A4F] block mb-1">Table Name</label>
            <input
              type="text"
              required
              value={editTableName}
              onChange={(e) => setEditTableName(e.target.value)}
              placeholder="e.g. Window Table"
              className="w-full mb-4 text-xs font-semibold py-2 px-3 rounded-xl bg-white border border-[#E8E0D5] text-[#241A14]"
            />
            <label className="text-xs font-semibold text-[#665A4F] block mb-1">Seating Capacity (Guests)</label>
            <input
              type="number"
              min="1"
              max="20"
              value={editTableCapacity}
              onChange={(e) => setEditTableCapacity(Number(e.target.value))}
              className="w-full text-xs font-semibold py-2 px-3 rounded-xl bg-white border border-[#E8E0D5] text-[#241A14]"
            />
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setSelectedTableForEdit(null)} className="px-4 py-2 rounded-xl text-xs font-semibold text-[#665A4F] hover:bg-[#F8F5F0]">Cancel</button>
              <button
                onClick={() => {
                  editTable(selectedTableForEdit.id, {
                    name: editTableName.trim() || selectedTableForEdit.name,
                    capacity: editTableCapacity
                  });
                  setSelectedTableForEdit(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#E58A3A] text-white hover:bg-[#D77A28]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table Order Details Modal */}
      {selectedTableForOrder && (
        <div className="fixed inset-0 z-50 bg-[#241A14]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E8E0D5]">
            <div className="flex items-center justify-between border-b border-[#E8E0D5] pb-3 mb-3">
              <div>
                <span className="text-xs font-mono font-bold text-[#E58A3A]">#{selectedTableForOrder.id}</span>
                <h3 className="text-base font-bold text-[#241A14]">{selectedTableForOrder.tableName}</h3>
              </div>
              <button
                onClick={() => setSelectedTableForOrder(null)}
                className="w-7 h-7 rounded-full bg-[#F8F5F0] text-[#665A4F] hover:text-[#241A14] flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-[#FAF7F2] p-3 rounded-xl text-xs flex justify-between">
                <div>
                  <span className="text-[#8A7A6E]">Guest:</span>{' '}
                  <span className="font-semibold text-[#241A14]">{selectedTableForOrder.customerName}</span>
                </div>
                <div>
                  <span className="text-[#8A7A6E]">Status:</span>{' '}
                  <span className="font-bold text-[#E58A3A]">{selectedTableForOrder.status}</span>
                </div>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {selectedTableForOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between p-2 rounded-lg border border-[#E8E0D5] text-xs">
                    <span>{item.quantity}x {item.name}</span>
                    <span className="font-bold">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#E8E0D5] pt-2 flex justify-between text-sm font-bold">
                <span>Total:</span>
                <span>{formatCurrency(selectedTableForOrder.total)}</span>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedTableForOrder(null)}
                className="px-4 py-2 rounded-xl bg-[#5C3A21] text-white text-xs font-semibold"
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
