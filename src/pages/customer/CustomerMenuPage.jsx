import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCafe } from '../../context/CafeContext';
import { formatCurrency } from '../../utils/formatters';
import {
  Coffee,
  Search,
  ShoppingBag,
  Plus,
  Minus,
  Sparkles,
  Award,
  Clock,
  ArrowRight,
  X,
  ChevronRight,
  CheckCircle2,
  Tag,
  Phone,
  User,
  AlertCircle
} from 'lucide-react';

export default function CustomerMenuPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    tables,
    menuItems,
    settings,
    createOrder,
    getCustomerByPhone,
    validateCoupon,
    addToast,
    triggerConfetti
  } = useCafe();

  // Detect table from URL: e.g. /menu?table=Table%2004 or /menu?table=4
  const rawTableParam = searchParams.get('table') || 'Table 04';
  const tableNumberParsed = rawTableParam.replace(/\D/g, '') || '04';
  const detectedTableName = `Table ${tableNumberParsed.padStart(2, '0')}`;
  const currentTable = tables.find(t => t.name?.toLowerCase() === detectedTableName.toLowerCase()) || tables[3] || tables[0] || {
    id: `TEMP-${tableNumberParsed}`,
    number: Number(tableNumberParsed),
    name: detectedTableName,
    capacity: 0,
    status: 'Available'
  };

  // Active Category filter & search
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);

  // Cart state
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Item customization modal
  const [selectedItemForModal, setSelectedItemForModal] = useState(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [modalInstruction, setModalInstruction] = useState('');

  // Checkout inputs
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [identifiedCustomer, setIdentifiedCustomer] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const categories = [
    'All',
    'Coffee',
    'Tea',
    'Pizza',
    'Burger',
    'Sandwich',
    'Cold Drinks',
    'Desserts',
    'Snacks',
    'Other'
  ];

  // Lookup customer when phone reaches 10 digits
  useEffect(() => {
    const clean = customerPhone.replace(/\D/g, '');
    if (clean.length === 10) {
      const cust = getCustomerByPhone(clean);
      if (cust) {
        setIdentifiedCustomer(cust);
        if (!customerName) setCustomerName(cust.name);
      } else {
        setIdentifiedCustomer(null);
      }
    } else {
      setIdentifiedCustomer(null);
    }
  }, [customerPhone]);

  // Filter menu items
  const filteredItems = menuItems.filter(item => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVeg = !vegOnly || item.isVeg;
    return matchesCat && matchesSearch && matchesVeg && item.available !== false && item.showOnQr !== false;
  });

  // Open item modal
  const openItemDetails = (item) => {
    setSelectedItemForModal(item);
    setModalQuantity(1);
    setModalInstruction('');
  };

  // Add item from modal or quick add
  const handleAddToCart = (item, quantity = 1, instruction = '') => {
    if (!item.available) {
      addToast('Sorry, this item is sold out for today', 'error');
      return;
    }

    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.id === item.id
            ? {
                ...i,
                quantity: i.quantity + quantity,
                specialInstructions: instruction || i.specialInstructions
              }
            : i
        );
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity,
          isVeg: item.isVeg,
          specialInstructions: instruction,
          image: item.image
        }
      ];
    });

    setSelectedItemForModal(null);
    addToast(`Added ${quantity}x ${item.name} to cart`, 'success');
  };

  const updateCartQuantity = (id, delta) => {
    setCartItems(prev =>
      prev
        .map(i => {
          if (i.id === id) {
            const next = i.quantity + delta;
            return next > 0 ? { ...i, quantity: next } : null;
          }
          return i;
        })
        .filter(Boolean)
    );
  };

  // Totals
  const totalCartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const gstRate = (settings.gstPercentage || 5) / 100;
  const gst = Math.round(subtotal * gstRate * 100) / 100;
  const finalTotal = Math.max(0, subtotal + gst - discountAmount);

  // Apply Coupon
  const handleApplyCoupon = (codeToApply) => {
    const code = codeToApply || couponCode;
    const res = validateCoupon(code, subtotal);
    if (res.valid) {
      setAppliedCoupon(res.coupon);
      setDiscountAmount(res.discount);
      addToast(`🎉 Coupon "${code}" applied: ₹${res.discount} OFF!`, 'success');
    } else {
      addToast(res.message, 'error');
    }
  };

  // Place Order
  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;

    const newOrder = createOrder({
      tableId: currentTable.id,
      tableNumber: currentTable.number,
      tableName: currentTable.name,
      customerName: customerName || 'Valued Guest',
      customerPhone,
      items: cartItems,
      discount: discountAmount,
      couponApplied: appliedCoupon?.code || null,
      status: 'Order Pending'
    });

    triggerConfetti();
    setIsCartOpen(false);

    // Navigate to live tracking screen
    navigate(`/menu/tracking/${newOrder.id}`);
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#241A14] flex flex-col font-sans pb-28">
      {/* Mobile-Friendly Top Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E8E0D5] px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#E58A3A] to-[#5C3A21] flex items-center justify-center shadow-md shadow-[#E58A3A]/20">
            <Coffee className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-[#241A14] tracking-tight flex items-center gap-1.5">
              {settings.cafeName || 'Sairam Chahawala'}
            </h1>
            <p className="text-[10px] text-[#8A7A6E]">Digital Table Service</p>
          </div>
        </div>

        {/* Table Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#5C3A21] text-white text-xs font-extrabold shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{currentTable.name}</span>
        </div>
      </header>

      {/* Hero Welcome Banner */}
      <div className="p-4 sm:p-6 max-w-3xl mx-auto w-full">
        <div className="bg-gradient-to-r from-[#241A14] to-[#5C3A21] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#E58A3A]/30 text-[#E58A3A] font-extrabold text-[10px] uppercase tracking-wider border border-[#E58A3A]/40">
              Table Order Active
            </span>
            <h2 className="text-xl sm:text-2xl font-black">
              Welcome to {settings.cafeName}
            </h2>
            <p className="text-xs text-[#C8BAAA] max-w-md">
              Order directly from your phone. Items are freshly handcrafted and sent straight to the barista & kitchen!
            </p>
          </div>

          <div className="absolute right-[-20px] bottom-[-20px] w-44 h-44 rounded-full bg-white/5 pointer-events-none" />
        </div>
      </div>

      {/* Search & Veg Filter */}
      <div className="px-4 sm:px-6 max-w-3xl mx-auto w-full space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7A6E]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search coffee, pizza, burgers..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl bg-white border border-[#E8E0D5] text-[#241A14] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5C3A21]"
            />
          </div>

          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold border transition-all ${
              vegOnly
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-white text-[#665A4F] border-[#E8E0D5]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Veg Only</span>
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all border ${
                activeCategory === cat
                  ? 'bg-[#5C3A21] text-white border-[#5C3A21] shadow-sm'
                  : 'bg-white text-[#665A4F] border-[#E8E0D5]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Dishes List */}
      <div className="px-4 sm:px-6 max-w-3xl mx-auto w-full mt-4 space-y-3">
        {filteredItems.map(item => (
          <div
            key={item.id}
            onClick={() => openItemDetails(item)}
            className="bg-white rounded-3xl p-3.5 border border-[#E8E0D5] shadow-sm hover:shadow-md transition-all flex gap-3.5 cursor-pointer relative"
          >
            {/* Dish Image */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 bg-gray-100">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-1.5 left-1.5">
                <span
                  className={`w-4 h-4 rounded-md border flex items-center justify-center p-0.5 ${
                    item.isVeg ? 'border-emerald-600 bg-white' : 'border-rose-600 bg-white'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                    }`}
                  />
                </span>
              </div>
            </div>

            {/* Dish Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-[#241A14] truncate">
                    {item.name}
                  </h3>
                  {item.isBestseller && (
                    <span className="px-1.5 py-0.5 rounded-md bg-[#E58A3A] text-white text-[9px] font-extrabold">
                      Star
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-[#8A7A6E] line-clamp-2 mt-1">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="font-extrabold text-sm text-[#5C3A21]">
                  {formatCurrency(item.price)}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(item, 1);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#5C3A21] hover:text-white text-[#5C3A21] border border-[#E8E0D5] text-xs font-extrabold transition-all flex items-center gap-1 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ADD</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Bottom Cart Bar (if items in cart) */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 max-w-lg mx-auto animate-slide-up">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-[#5C3A21] text-white rounded-3xl p-4 shadow-2xl flex items-center justify-between hover:bg-[#4B2E19] transition-all transform active:scale-95"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#E58A3A] text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
                {totalCartCount}
              </span>
              <div className="text-left">
                <p className="text-xs font-bold">View Cart Ticket</p>
                <p className="text-[10px] text-[#C8BAAA]">for {currentTable.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base">{formatCurrency(finalTotal)}</span>
              <ChevronRight className="w-5 h-5 text-[#E58A3A]" />
            </div>
          </button>
        </div>
      )}

      {/* Item Details / Customization Modal */}
      {selectedItemForModal && (
        <div className="fixed inset-0 z-50 bg-[#241A14]/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E8E0D5] relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setSelectedItemForModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F8F5F0] text-[#665A4F] flex items-center justify-center font-bold text-sm"
            >
              ✕
            </button>

            <img
              src={selectedItemForModal.image}
              alt={selectedItemForModal.name}
              className="w-full h-48 object-cover rounded-2xl mb-4"
            />

            <div className="space-y-1 mb-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-lg text-[#241A14]">
                  {selectedItemForModal.name}
                </h3>
                <span className="font-extrabold text-base text-[#5C3A21]">
                  {formatCurrency(selectedItemForModal.price)}
                </span>
              </div>
              <p className="text-xs text-[#8A7A6E]">
                {selectedItemForModal.description}
              </p>
            </div>

            {/* Special Instructions for Chef */}
            <div className="space-y-1.5 mb-4">
              <label className="text-xs font-bold text-[#665A4F] block">
                Special Requests for Kitchen (Optional)
              </label>
              <input
                type="text"
                value={modalInstruction}
                onChange={(e) => setModalInstruction(e.target.value)}
                placeholder="e.g. Extra spicy, oat milk, less ice..."
                className="w-full text-xs py-2 px-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] text-[#241A14]"
              />
            </div>

            {/* Quantity Selector & Add Button */}
            <div className="flex items-center gap-3 pt-2 border-t border-[#E8E0D5]">
              <div className="flex items-center gap-2 border border-[#E8E0D5] rounded-2xl p-1 bg-[#FAF7F2]">
                <button
                  onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                  className="w-8 h-8 rounded-xl bg-white flex items-center justify-center font-bold text-[#5C3A21]"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-6 text-center font-bold text-sm">
                  {modalQuantity}
                </span>
                <button
                  onClick={() => setModalQuantity(modalQuantity + 1)}
                  className="w-8 h-8 rounded-xl bg-[#5C3A21] text-white flex items-center justify-center font-bold"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => handleAddToCart(selectedItemForModal, modalQuantity, modalInstruction)}
                className="flex-1 py-3 px-4 rounded-2xl bg-[#E58A3A] hover:bg-[#D77A28] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-between"
              >
                <span>Add To Ticket</span>
                <span>{formatCurrency(selectedItemForModal.price * modalQuantity)}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer / Checkout Sheet */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-[#241A14]/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E8E0D5] relative max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E0D5] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E58A3A]">
                  Order Review
                </span>
                <h3 className="font-extrabold text-lg text-[#241A14]">
                  {currentTable.name} Ticket
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F8F5F0] text-[#665A4F] flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Cart Items */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {cartItems.map(item => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D5] flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-xs text-[#241A14]">{item.name}</h4>
                    <p className="text-[10px] text-[#8A7A6E]">
                      {formatCurrency(item.price)} each
                    </p>
                    {item.specialInstructions && (
                      <p className="text-[10px] text-[#E58A3A] italic">
                        "{item.specialInstructions}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateCartQuantity(item.id, -1)}
                      className="w-6 h-6 rounded-lg bg-white border border-[#E8E0D5] flex items-center justify-center text-xs font-bold"
                    >
                      -
                    </button>
                    <span className="font-bold text-xs w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.id, 1)}
                      className="w-6 h-6 rounded-lg bg-[#5C3A21] text-white flex items-center justify-center text-xs font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Loyalty Lookup (Name + Phone) */}
            <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E8E0D5] space-y-2">
              <span className="text-xs font-bold text-[#5C3A21] flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#E58A3A]" />
                Customer Loyalty & Milestone Rewards
              </span>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Mobile number"
                  className="w-full text-xs py-1.5 px-2.5 rounded-xl bg-white border border-[#E8E0D5]"
                />
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full text-xs py-1.5 px-2.5 rounded-xl bg-white border border-[#E8E0D5]"
                />
              </div>

              {identifiedCustomer && (
                <div className="text-[11px] text-[#665A4F] pt-1">
                  <p className="font-bold text-emerald-700">
                    Welcome back, {identifiedCustomer.name}! ({identifiedCustomer.totalVisits} completed visits)
                  </p>
                  {identifiedCustomer.availableCoupons?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {identifiedCustomer.availableCoupons.map((c, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleApplyCoupon(c.code)}
                          className="px-2 py-0.5 rounded bg-[#5C3A21] text-white text-[10px] font-bold"
                        >
                          Use {c.code}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Coupon Promo code input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Enter Coupon / Promo Code"
                className="flex-1 py-1.5 px-3 text-xs uppercase font-mono rounded-xl bg-[#FAF7F2] border border-[#E8E0D5]"
              />
              <button
                onClick={() => handleApplyCoupon()}
                className="px-3.5 py-1.5 bg-[#5C3A21] text-white rounded-xl text-xs font-bold"
              >
                Apply
              </button>
            </div>

            {/* Bill summary */}
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E0D5] space-y-1.5 text-xs">
              <div className="flex justify-between text-[#665A4F]">
                <span>Items Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#665A4F]">
                <span>GST ({settings.gstPercentage || 5}%):</span>
                <span>{formatCurrency(gst)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount:</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-[#241A14] pt-2 border-t border-[#E8E0D5]">
                <span>Total Amount:</span>
                <span>{formatCurrency(finalTotal)}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              onClick={handlePlaceOrder}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#E58A3A] hover:bg-[#D77A28] text-white font-extrabold text-sm shadow-xl shadow-[#E58A3A]/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Submit Order to Kitchen</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
