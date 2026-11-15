import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  INITIAL_SETTINGS,
  INITIAL_TABLES,
  INITIAL_MENU_ITEMS,
  INITIAL_CUSTOMERS,
  INITIAL_ORDERS,
  INITIAL_COUPONS
} from '../data/initialData';
import { announceNewOrder, testVoiceAnnouncement, playChimeSound } from '../utils/audio';
import { db } from '../lib/firebase';
import {
  collection,
  doc,
  onSnapshot,
  setDoc
} from 'firebase/firestore';

const CafeContext = createContext(null);

const STORAGE_KEYS = {
  SETTINGS: 'cafeflow_settings_v1',
  TABLES: 'cafeflow_tables_v1',
  MENU: 'cafeflow_menu_v1',
  CUSTOMERS: 'cafeflow_customers_v1',
  ORDERS: 'cafeflow_orders_v1',
  COUPONS: 'cafeflow_coupons_v1',
  ANNOUNCED_ORDERS: 'cafeflow_announced_orders_v1'
};

const saveCollection = async (name, items) => {
  await Promise.all(items.map(item => setDoc(doc(db, name, String(item.id)), item)));
};

export function CafeProvider({ children }) {
  const [firestoreReady, setFirestoreReady] = useState(false);
  // 1. Settings State
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.cafeName === 'CafeFlow Artisan Roasters' || !parsed.cafeName) {
          parsed.cafeName = INITIAL_SETTINGS.cafeName;
        }
        return parsed;
      }
      return INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // 2. Tables State (12 tables)
  const [tables, setTables] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TABLES);
      return [];
    } catch {
      return [];
    }
  });

  // 3. Menu Items State
  const [menuItems, setMenuItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MENU);
      return [];
    } catch {
      return [];
    }
  });

  // 4. Customers / CRM State
  const [customers, setCustomers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      return [];
    } catch {
      return [];
    }
  });

  // 5. Orders State
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return [];
    } catch {
      return [];
    }
  });

  // 6. Coupons State
  const [coupons, setCoupons] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COUPONS);
      return [];
    } catch {
      return [];
    }
  });

  // Voice Announcement tracking to prevent duplicates on refresh
  const announcedOrderIdsRef = useRef(new Set());
  const [lastVoiceAlert, setLastVoiceAlert] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Initialize announced order set from past orders so we NEVER announce old orders on refresh
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ANNOUNCED_ORDERS);
      const set = new Set(saved ? JSON.parse(saved) : []);
      // Also mark existing initial orders as already announced
      orders.forEach(o => set.add(o.id));
      announcedOrderIdsRef.current = set;
      localStorage.setItem(STORAGE_KEYS.ANNOUNCED_ORDERS, JSON.stringify([...set]));
    } catch {
      // Ignore
    }
  }, []);

  // Save to LocalStorage whenever state updates
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // Firestore is the source of truth. Empty collections intentionally stay empty;
  // the old demo seed data is no longer loaded into the app.
  useEffect(() => {
    const unsubs = [
      onSnapshot(collection(db, 'tables'), snap => { setTables(snap.docs.map(d => d.data())); setFirestoreReady(true); }),
      onSnapshot(collection(db, 'menuItems'), snap => setMenuItems(snap.docs.map(d => d.data()))),
      onSnapshot(collection(db, 'customers'), snap => setCustomers(snap.docs.map(d => d.data()))),
      onSnapshot(collection(db, 'orders'), snap => setOrders(snap.docs.map(d => d.data()))),
      onSnapshot(collection(db, 'coupons'), snap => setCoupons(snap.docs.map(d => d.data())))
    ];
    return () => unsubs.forEach(unsub => unsub());
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
    if (firestoreReady) saveCollection('tables', tables).catch(console.error);
  }, [tables, firestoreReady]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menuItems));
    if (firestoreReady) saveCollection('menuItems', menuItems).catch(console.error);
  }, [menuItems, firestoreReady]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    if (firestoreReady) saveCollection('customers', customers).catch(console.error);
  }, [customers, firestoreReady]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    if (firestoreReady) saveCollection('orders', orders).catch(console.error);
  }, [orders, firestoreReady]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
    if (firestoreReady) saveCollection('coupons', coupons).catch(console.error);
  }, [coupons, firestoreReady]);

  // Toast helper
  const addToast = (message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore
    }
  };

  // --- Voice Controls ---
  const toggleVoiceAlerts = () => {
    setSettings(prev => ({
      ...prev,
      voiceEnabled: !prev.voiceEnabled
    }));
    addToast(
      !settings.voiceEnabled ? 'Voice notifications enabled' : 'Voice notifications muted',
      'info'
    );
  };

  const triggerTestVoice = () => {
    const text = testVoiceAnnouncement({
      rate: settings.voiceRate || 1.0,
      pitch: settings.voicePitch || 1.0,
      volume: settings.voiceVolume || 1.0
    });
    setLastVoiceAlert(text);
    addToast('Playing test voice alert...', 'success');
  };

  // --- Table Operations ---
  const updateTableStatus = (tableId, newStatus, orderId = undefined) => {
    setTables(prev =>
      prev.map(table => {
        if (table.id === tableId || table.name === tableId) {
          return {
            ...table,
            status: newStatus,
            activeOrderId: orderId !== undefined ? orderId : table.activeOrderId
          };
        }
        return table;
      })
    );
  };

  const resetTable = (tableId) => {
    setTables(prev =>
      prev.map(table => {
        if (table.id === tableId || table.name === tableId) {
          return {
            ...table,
            status: 'Available',
            activeOrderId: null
          };
        }
        return table;
      })
    );
    addToast(`Table has been reset and marked Available`, 'success');
  };

  const addTable = (tableData) => {
    const newNumber = tables.length + 1;
    const formattedNum = String(newNumber).padStart(2, '0');
    const newTable = {
      id: `T-${formattedNum}`,
      number: newNumber,
      name: `Table ${formattedNum}`,
      capacity: tableData.capacity || 4,
      status: 'Available',
      activeOrderId: null,
      qrCodeData: `Table-${formattedNum}`
    };
    setTables(prev => [...prev, newTable]);
    addToast(`Added Table ${formattedNum}`, 'success');
    return newTable;
  };

  const editTable = (tableId, updates) => {
    setTables(prev =>
      prev.map(t => (t.id === tableId ? { ...t, ...updates } : t))
    );
    addToast('Table details updated', 'success');
  };

  // --- Order Operations ---
  const createOrder = (orderData) => {
    // Generate unique order ID
    const nextNum = orders.length + 1001;
    const orderId = `ORD-${nextNum}`;

    const subtotal = orderData.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const gstRate = (settings.gstPercentage || 5) / 100;
    const gst = Math.round(subtotal * gstRate * 100) / 100;
    const discount = orderData.discount || 0;
    const total = Math.max(0, subtotal + gst - discount);

    const newOrder = {
      id: orderId,
      tableId: orderData.tableId,
      tableNumber: orderData.tableNumber || 1,
      tableName: orderData.tableName || `Table ${String(orderData.tableNumber || 1).padStart(2, '0')}`,
      customerName: orderData.customerName || 'Walk-in Guest',
      customerPhone: orderData.customerPhone || '',
      status: orderData.status || 'Order Pending',
      items: orderData.items,
      subtotal,
      gst,
      discount,
      couponApplied: orderData.couponApplied || null,
      total,
      paymentMethod: orderData.paymentMethod || 'Pending',
      paymentStatus: 'Pending',
      createdAt: new Date().toISOString(),
      isDemo: true
    };

    // Update order list
    setOrders(prev => [newOrder, ...prev]);

    // Update table status to Order Pending
    if (orderData.tableId) {
      updateTableStatus(orderData.tableId, 'Order Pending', orderId);
    }

    // Voice announcement if enabled & not announced
    if (settings.voiceEnabled && !announcedOrderIdsRef.current.has(orderId)) {
      announcedOrderIdsRef.current.add(orderId);
      localStorage.setItem(
        STORAGE_KEYS.ANNOUNCED_ORDERS,
        JSON.stringify([...announcedOrderIdsRef.current])
      );
      const spokenText = announceNewOrder(newOrder, {
        rate: settings.voiceRate || 1.0,
        pitch: settings.voicePitch || 1.0,
        volume: settings.voiceVolume || 1.0
      });
      setLastVoiceAlert(spokenText);
    } else {
      playChimeSound();
    }

    addToast(`New order #${orderId} placed for ${newOrder.tableName}!`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    let affectedOrder = null;

    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          affectedOrder = { ...ord, status: newStatus };
          return affectedOrder;
        }
        return ord;
      })
    );

    // Synchronize Table status accordingly
    if (affectedOrder && affectedOrder.tableId) {
      if (newStatus === 'Preparing') {
        updateTableStatus(affectedOrder.tableId, 'Preparing', orderId);
        playChimeSound();
        addToast(`Order #${orderId} moved to Kitchen Prep`, 'info');
      } else if (newStatus === 'Ready') {
        updateTableStatus(affectedOrder.tableId, 'Ready', orderId);
        playChimeSound();
        addToast(`Order #${orderId} is Ready for pickup!`, 'success');
      } else if (newStatus === 'Served') {
        updateTableStatus(affectedOrder.tableId, 'Served', orderId);
        addToast(`Order #${orderId} has been Served`, 'info');
      } else if (newStatus === 'Billing') {
        updateTableStatus(affectedOrder.tableId, 'Billing', orderId);
        addToast(`Bill requested for Table #${affectedOrder.tableNumber}`, 'info');
      } else if (newStatus === 'Completed') {
        // Table resets to available when completed
        resetTable(affectedOrder.tableId);
      }
    }
  };

  // Complete Payment & Loyalty Settlement (Strict: prevent duplicate visit counting)
  const completePayment = ({
    orderId,
    paymentMethod = 'UPI',
    discountAmount = 0,
    couponCode = null,
    customerPhone = '',
    customerName = ''
  }) => {
    let completedOrder = null;

    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          const discount = discountAmount || ord.discount || 0;
          const total = Math.max(0, ord.subtotal + ord.gst - discount);
          completedOrder = {
            ...ord,
            status: 'Completed',
            paymentStatus: 'Completed',
            paymentMethod,
            discount,
            couponApplied: couponCode || ord.couponApplied,
            total,
            completedAt: new Date().toISOString()
          };
          return completedOrder;
        }
        return ord;
      })
    );

    if (!completedOrder) return null;

    // Reset table status to Available
    if (completedOrder.tableId) {
      setTables(prev =>
        prev.map(t =>
          t.id === completedOrder.tableId
            ? { ...t, status: 'Available', activeOrderId: null }
            : t
        )
      );
    }

    // Process Loyalty Points & Visits ONLY if payment is completed
    const targetPhone = customerPhone || completedOrder.customerPhone;
    const targetName = customerName || completedOrder.customerName;

    let loyaltyBonusMessage = null;

    if (targetPhone && targetPhone.trim().length >= 10) {
      setCustomers(prev => {
        const cleanPhone = targetPhone.replace(/\D/g, '').slice(-10);
        const existingCust = prev.find(
          c => c.phone.replace(/\D/g, '').slice(-10) === cleanPhone
        );

        // Check if this order was already counted for this customer
        const alreadyCounted =
          existingCust &&
          existingCust.completedOrderIds &&
          existingCust.completedOrderIds.includes(orderId);

        if (alreadyCounted) {
          return prev; // Do not increment visit again!
        }

        const newVisits = existingCust ? (existingCust.totalVisits || 0) + 1 : 1;
        const newOrdersCount = existingCust ? (existingCust.totalOrders || 0) + 1 : 1;
        const addedSpent = completedOrder.total;
        const newTotalSpent = (existingCust?.totalSpent || 0) + addedSpent;
        const earnedPoints = Math.floor(addedSpent / 10);
        const newPoints = (existingCust?.loyaltyPoints || 0) + earnedPoints;
        const updatedOrderIds = existingCust?.completedOrderIds
          ? [...existingCust.completedOrderIds, orderId]
          : [orderId];

        let availableCoupons = existingCust?.availableCoupons
          ? [...existingCust.availableCoupons]
          : [];

        // Loyalty Milestone Logic:
        // 1st visit: Welcome offer
        if (newVisits === 1) {
          availableCoupons.push({
            code: 'WELCOME10',
            title: 'Welcome 10% OFF on next visit',
            discountPercent: 10,
            minBill: 250,
            isLocked: false
          });
          loyaltyBonusMessage = '🎉 Welcome to Sairam Chahawala! 10% Welcome Reward unlocked!';
        }
        // 3rd visit: Special Reward
        else if (newVisits === 3) {
          availableCoupons.push({
            code: 'VISIT3TREAT',
            title: '3rd Visit Special: ₹30 OFF',
            discount: 30,
            minBill: 200,
            isLocked: false
          });
          loyaltyBonusMessage = '🌟 3rd Visit Milestone: ₹30 Special Treat unlocked!';
          triggerConfetti();
        }
        // 5th visit: ₹50 OFF Coupon unlocked
        else if (newVisits === 5) {
          availableCoupons.push({
            code: 'FIFTHVISIT50',
            title: '5th Visit Reward: ₹50 OFF',
            discount: 50,
            minBill: 200,
            isLocked: false
          });
          loyaltyBonusMessage = '🎊 5th Visit Celebration! ₹50 OFF Coupon Unlocked!';
          triggerConfetti();
        }
        // 10th visit: Free Specialty Coffee or Burger
        else if (newVisits === 10) {
          availableCoupons.push({
            code: 'FREEDRINK10',
            title: '10th Visit VIP: Free Coffee or Burger',
            discount: 220,
            minBill: 0,
            isLocked: false
          });
          loyaltyBonusMessage = '🏆 10th Visit VIP! Free Handcrafted Drink Unlocked!';
          triggerConfetti();
        }

        if (existingCust) {
          return prev.map(c =>
            c.id === existingCust.id
              ? {
                  ...c,
                  name: targetName || c.name,
                  totalVisits: newVisits,
                  totalOrders: newOrdersCount,
                  totalSpent: newTotalSpent,
                  loyaltyPoints: newPoints,
                  availableCoupons,
                  completedOrderIds: updatedOrderIds
                }
              : c
          );
        } else {
          // Create new customer profile
          const newCust = {
            id: `CUST-${String(prev.length + 1).padStart(3, '0')}`,
            name: targetName || 'Valued Guest',
            phone: cleanPhone,
            totalVisits: 1,
            totalOrders: 1,
            totalSpent: addedSpent,
            loyaltyPoints: earnedPoints,
            birthday: '',
            memberSince: new Date().toISOString().split('T')[0],
            availableCoupons,
            completedOrderIds: [orderId]
          };
          return [...prev, newCust];
        }
      });
    }

    addToast(
      `Payment of ₹${completedOrder.total} completed via ${paymentMethod} (Demo Mode)`,
      'success'
    );

    if (loyaltyBonusMessage) {
      setTimeout(() => {
        addToast(loyaltyBonusMessage, 'success', 5000);
      }, 700);
    }

    return completedOrder;
  };

  const cancelOrder = (orderId, reason = '') => {
    let orderToCancel = null;
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          orderToCancel = { ...ord, status: 'Cancelled', cancelReason: reason };
          return orderToCancel;
        }
        return ord;
      })
    );

    if (orderToCancel && orderToCancel.tableId) {
      resetTable(orderToCancel.tableId);
    }
    addToast(`Order #${orderId} cancelled`, 'info');
  };

  // --- Menu Operations ---
  const addMenuItem = (itemData) => {
    const newItem = {
      ...itemData,
      id: `M-CUSTOM-${Date.now().toString(36)}`,
      available: itemData.available !== undefined ? itemData.available : true,
      showOnQr: itemData.showOnQr !== undefined ? itemData.showOnQr : true,
      price: Number(itemData.price) || 0
    };
    setMenuItems(prev => [newItem, ...prev]);
    addToast(`Added "${newItem.name}" to menu`, 'success');
    return newItem;
  };

  const updateMenuItem = (id, updates) => {
    setMenuItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, ...updates, price: Number(updates.price !== undefined ? updates.price : item.price) }
          : item
      )
    );
    addToast('Menu item updated successfully', 'success');
  };

  const deleteMenuItem = (id) => {
    const item = menuItems.find(i => i.id === id);
    setMenuItems(prev => prev.filter(i => i.id !== id));
    addToast(`Removed "${item?.name || 'item'}" from menu`, 'info');
  };

  const toggleItemAvailability = (id) => {
    setMenuItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, available: !item.available } : item
      )
    );
  };

  const toggleItemQrVisibility = (id) => {
    setMenuItems(prev => prev.map(item => (
      item.id === id ? { ...item, showOnQr: item.showOnQr === false } : item
    )));
    addToast('QR menu visibility updated', 'success');
  };

  // --- Customer / CRM Lookup & Updates ---
  const getCustomerByPhone = (phone) => {
    if (!phone) return null;
    const clean = phone.replace(/\D/g, '').slice(-10);
    return (
      customers.find(
        c => c.phone.replace(/\D/g, '').slice(-10) === clean
      ) || null
    );
  };

  const updateCustomer = (id, updates) => {
    setCustomers(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );
    addToast('Customer profile updated', 'success');
  };

  // --- Coupon Operations ---
  const validateCoupon = (code, subtotal) => {
    if (!code) return { valid: false, message: 'Please enter a coupon code' };
    const upper = code.trim().toUpperCase();

    // Check system coupons
    const found = coupons.find(c => c.code.toUpperCase() === upper && c.active);
    if (found) {
      if (subtotal < (found.minBill || 0)) {
        return {
          valid: false,
          message: `Minimum order of ₹${found.minBill} required for this coupon.`
        };
      }
      let discount = 0;
      if (found.discount) {
        discount = found.discount;
      } else if (found.discountPercent) {
        discount = Math.round((subtotal * found.discountPercent) / 100);
        if (found.maxDiscount && discount > found.maxDiscount) {
          discount = found.maxDiscount;
        }
      }
      return { valid: true, coupon: found, discount, message: 'Coupon applied!' };
    }

    // Check special dynamic milestone codes
    if (upper === 'FIFTHVISIT50' || upper === 'VISIT5' || upper === 'NEXTVISIT50') {
      return {
        valid: true,
        coupon: { code: upper, discount: 50 },
        discount: 50,
        message: '₹50 Milestone Loyalty Discount applied!'
      };
    }

    return { valid: false, message: 'Invalid or expired coupon code' };
  };

  // --- Reset Entire Demo Data ---
  const resetDemoData = () => {
    setSettings(INITIAL_SETTINGS);
    setTables([]);
    setMenuItems([]);
    setCustomers([]);
    setOrders([]);
    setCoupons([]);
    announcedOrderIdsRef.current = new Set();

    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    localStorage.removeItem(STORAGE_KEYS.TABLES);
    localStorage.removeItem(STORAGE_KEYS.MENU);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.COUPONS);
    localStorage.setItem(
      STORAGE_KEYS.ANNOUNCED_ORDERS,
      JSON.stringify([...announcedOrderIdsRef.current])
    );

    addToast('Demo data restored to initial pristine state', 'success');
  };

  // Aggregated live statistics for dashboard & reports
  const stats = React.useMemo(() => {
    const today = new Date().toDateString();
    const completedOrders = orders.filter(o => o.status === 'Completed');
    
    // Total Revenue (only completed orders count toward revenue)
    const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    
    // Today's orders
    const todaysOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);
    const todaysRevenue = todaysOrders
      .filter(o => o.status === 'Completed')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    const pendingOrders = orders.filter(
      o => o.status === 'Order Pending' || o.status === 'Preparing'
    );
    const activeTables = tables.filter(t => t.status !== 'Available').length;
    const avgOrderValue = completedOrders.length > 0
      ? Math.round(totalRevenue / completedOrders.length)
      : 0;

    return {
      totalRevenue,
      todaysOrdersCount: todaysOrders.length,
      todaysRevenue,
      totalOrdersCount: orders.length,
      completedOrdersCount: completedOrders.length,
      pendingOrdersCount: pendingOrders.length,
      activeTablesCount: activeTables,
      totalCustomersCount: customers.length,
      avgOrderValue
    };
  }, [orders, tables, customers]);

  const value = {
    settings,
    setSettings,
    tables,
    updateTableStatus,
    resetTable,
    addTable,
    editTable,
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleItemAvailability,
    toggleItemQrVisibility,
    customers,
    getCustomerByPhone,
    updateCustomer,
    orders,
    createOrder,
    updateOrderStatus,
    completePayment,
    cancelOrder,
    coupons,
    validateCoupon,
    voice: {
      voiceEnabled: settings.voiceEnabled,
      toggleVoiceAlerts,
      triggerTestVoice,
      lastVoiceAlert
    },
    toasts,
    addToast,
    removeToast,
    triggerConfetti,
    resetDemoData,
    stats
  };

  return <CafeContext.Provider value={value}>{children}</CafeContext.Provider>;
}

export function useCafe() {
  const context = useContext(CafeContext);
  if (!context) {
    throw new Error('useCafe must be used within a CafeProvider');
  }
  return context;
}
