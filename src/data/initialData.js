// Sairam Chahawala Initial Seed Data
export const INITIAL_SETTINGS = {
  cafeName: "Sairam Chahawala",
  tagline: "Specialty Tea, Refreshments & Gourmet Fast Food",
  address: "Shop No. 1, Main Road, Maharashtra",
  phone: "+91 98765 43210",
  email: "contact@sairamchahawala.com",
  gstNumber: "29AAAAA0000A1Z5",
  gstPercentage: 5,
  tableCount: 12,
  currency: "₹",
  voiceEnabled: true,
  voiceVolume: 1.0,
  voicePitch: 1.0,
  voiceRate: 1.0,
  minOrderForLoyalty: 150,
  fifthVisitDiscount: 50,
  adminPin: "1234",
  demoMode: true,
};

export const INITIAL_TABLES = [
  { id: "T-01", number: 1, name: "Table 01", capacity: 2, status: "Available", activeOrderId: null, qrCodeData: "Table-01" },
  { id: "T-02", number: 2, name: "Table 02", capacity: 4, status: "Occupied", activeOrderId: "ORD-1002", qrCodeData: "Table-02" },
  { id: "T-03", number: 3, name: "Table 03", capacity: 2, status: "Preparing", activeOrderId: "ORD-1003", qrCodeData: "Table-03" },
  { id: "T-04", number: 4, name: "Table 04", capacity: 6, status: "Order Pending", activeOrderId: "ORD-1004", qrCodeData: "Table-04" },
  { id: "T-05", number: 5, name: "Table 05", capacity: 4, status: "Ready", activeOrderId: "ORD-1005", qrCodeData: "Table-05" },
  { id: "T-06", number: 6, name: "Table 06", capacity: 2, status: "Served", activeOrderId: "ORD-1006", qrCodeData: "Table-06" },
  { id: "T-07", number: 7, name: "Table 07", capacity: 4, status: "Billing", activeOrderId: "ORD-1007", qrCodeData: "Table-07" },
  { id: "T-08", number: 8, name: "Table 08", capacity: 2, status: "Available", activeOrderId: null, qrCodeData: "Table-08" },
  { id: "T-09", number: 9, name: "Table 09", capacity: 6, status: "Available", activeOrderId: null, qrCodeData: "Table-09" },
  { id: "T-10", number: 10, name: "Table 10", capacity: 4, status: "Available", activeOrderId: null, qrCodeData: "Table-10" },
  { id: "T-11", number: 11, name: "Table 11", capacity: 2, status: "Available", activeOrderId: null, qrCodeData: "Table-11" },
  { id: "T-12", number: 12, name: "Table 12", capacity: 8, status: "Available", activeOrderId: null, qrCodeData: "Table-12" },
];

export const CATEGORIES = [
  "All",
  "Coffee",
  "Tea",
  "Pizza",
  "Burger",
  "Sandwich",
  "Cold Drinks",
  "Desserts",
  "Snacks",
  "Other"
];

export const INITIAL_MENU_ITEMS = [
  // COFFEE
  {
    id: "M-COF-01",
    name: "Espresso Macchiato",
    category: "Coffee",
    price: 180,
    description: "Double shot of single-origin arabica espresso stained with velvety microfoam.",
    isVeg: true,
    isBestseller: true,
    available: true,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
    prepTime: "4 mins"
  },
  {
    id: "M-COF-02",
    name: "Caramel Hazelnut Latte",
    category: "Coffee",
    price: 240,
    description: "Rich espresso steamed with silky milk, toasted hazelnut syrup, and salted caramel drizzle.",
    isVeg: true,
    isBestseller: true,
    available: true,
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&auto=format&fit=crop&q=80",
    prepTime: "5 mins"
  },
  {
    id: "M-COF-03",
    name: "Classic Cappuccino",
    category: "Coffee",
    price: 210,
    description: "Equal harmony of rich espresso, steamed whole milk, and dense creamy froth dusted with Dutch cocoa.",
    isVeg: true,
    isBestseller: false,
    available: true,
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&auto=format&fit=crop&q=80",
    prepTime: "4 mins"
  },
  {
    id: "M-COF-04",
    name: "Cold Brew On Tap (Vanilla Sweet Cream)",
    category: "Coffee",
    price: 260,
    description: "18-hour slow steeped cold brew poured over clear ice topped with house-made vanilla sweet cream.",
    isVeg: true,
    isBestseller: true,
    available: true,
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80",
    prepTime: "3 mins"
  },

  // PIZZA
  {
    id: "M-PIZ-01",
    name: "Artisan Margherita Di Bufala",
    category: "Pizza",
    price: 380,
    description: "San Marzano tomato sugo, fresh buffalo mozzarella, fresh basil, extra virgin olive oil on hand-stretched crust.",
    isVeg: true,
    isBestseller: true,
    available: true,
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop&q=80",
    prepTime: "15 mins"
  },
  {
    id: "M-PIZ-02",
    name: "Smoked Chicken & Jalapeño Pizza",
    category: "Pizza",
    price: 460,
    description: "Hickory smoked chicken chunks, pickled jalapenos, roasted red peppers, mozzarella and smoky BBQ drizzle.",
    isVeg: false,
    isBestseller: true,
    available: true,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80",
    prepTime: "16 mins"
  },
  {
    id: "M-PIZ-03",
    name: "Truffle Mushroom Meltdown",
    category: "Pizza",
    price: 490,
    description: "Wild portobello and button mushrooms, white truffle oil, fontina cheese, caramelized onions and thyme.",
    isVeg: true,
    isBestseller: false,
    available: true,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
    prepTime: "15 mins"
  },

  // BURGER
  {
    id: "M-BUR-01",
    name: "The Truffle Brioche Smash Burger",
    category: "Burger",
    price: 340,
    description: "Signature double grilled patty, cheddar melt, truffle aioli, caramelized onions on toasted butter brioche bun.",
    isVeg: false,
    isBestseller: true,
    available: true,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
    prepTime: "12 mins"
  },
  {
    id: "M-BUR-02",
    name: "Crispy Peri Peri Paneer Burger",
    category: "Burger",
    price: 290,
    description: "Crunchy panko-crusted cottage cheese patty, spicy peri peri slaw, chipotle mayo, dill pickles.",
    isVeg: true,
    isBestseller: true,
    available: true,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80",
    prepTime: "10 mins"
  },

  // SANDWICH
  {
    id: "M-SND-01",
    name: "Pesto Bocconcini Sourdough Panini",
    category: "Sandwich",
    price: 280,
    description: "Slow-baked sourdough grilled with aromatic basil pesto, sun-dried tomatoes, fresh bocconcini and arugula.",
    isVeg: true,
    isBestseller: true,
    available: true,
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80",
    prepTime: "8 mins"
  },
  {
    id: "M-SND-02",
    name: "Smoked Chicken Club Sandwich",
    category: "Sandwich",
    price: 320,
    description: "Triple-decker toasted sandwich with smoked chicken breast, boiled egg, crispy bacon substitute, lettuce & honey mustard.",
    isVeg: false,
    isBestseller: false,
    available: true,
    image: "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=600&auto=format&fit=crop&q=80",
    prepTime: "9 mins"
  },

  // TEA
  {
    id: "M-TEA-01",
    name: "Kashmiri Kahwa Saffron Blend",
    category: "Tea",
    price: 190,
    description: "Fragrant green tea simmered with royal saffron strands, crushed green cardamoms, cinnamon and almond slivers.",
    isVeg: true,
    isBestseller: false,
    available: true,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80",
    prepTime: "5 mins"
  },
  {
    id: "M-TEA-02",
    name: "Masala Chai Pot (Serves 2)",
    category: "Tea",
    price: 160,
    description: "Freshly brewed Assam tea spiced with crushed fresh ginger, lemongrass, cloves and organic jaggery syrup.",
    isVeg: true,
    isBestseller: true,
    available: true,
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80",
    prepTime: "6 mins"
  },

  // COLD DRINKS
  {
    id: "M-DRK-01",
    name: "Passionfruit Mint Sparkler",
    category: "Cold Drinks",
    price: 210,
    description: "Real tropical passionfruit pulp, muddled spearmint, crushed ice topped with chilled fizzy soda.",
    isVeg: true,
    isBestseller: true,
    available: true,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80",
    prepTime: "4 mins"
  },
  {
    id: "M-DRK-02",
    name: "Belgian Dark Chocolate Frappé",
    category: "Cold Drinks",
    price: 270,
    description: "Blended 70% dark Belgian chocolate with chilled milk, espresso shot, crushed ice, whipped cream.",
    isVeg: true,
    isBestseller: false,
    available: true,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80",
    prepTime: "5 mins"
  },

  // DESSERTS
  {
    id: "M-DES-01",
    name: "Classic Italian Tiramisu Cup",
    category: "Desserts",
    price: 260,
    description: "Espresso-soaked savoiardi ladyfingers layered with airy mascarpone cream and dusted with raw cocoa.",
    isVeg: true,
    isBestseller: true,
    available: true,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop&q=80",
    prepTime: "2 mins"
  },
  {
    id: "M-DES-02",
    name: "Warm Molten Choco Lava Cake",
    category: "Desserts",
    price: 240,
    description: "Baked dark chocolate cake with an oozing liquid ganache core, served alongside Madagascar vanilla gelato.",
    isVeg: true,
    isBestseller: true,
    available: true,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80",
    prepTime: "8 mins"
  },

  // SNACKS
  {
    id: "M-SNK-01",
    name: "Parmesan Truffle Fries",
    category: "Snacks",
    price: 220,
    description: "Double-cooked crispy potato wedges tossed in aromatic white truffle oil, grated aged parmesan and sea salt.",
    isVeg: true,
    isBestseller: true,
    available: true,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80",
    prepTime: "7 mins"
  },
  {
    id: "M-SNK-02",
    name: "Cheesy Garlic Herb Pull-Apart",
    category: "Snacks",
    price: 250,
    description: "Warm artisan loaf stuffed with melted mozzarella, roasted garlic butter, rosemary and oregano flakes.",
    isVeg: true,
    isBestseller: false,
    available: true,
    image: "https://images.unsplash.com/photo-1619895092538-128341789043?w=600&auto=format&fit=crop&q=80",
    prepTime: "10 mins"
  }
];

export const INITIAL_CUSTOMERS = [
  {
    id: "CUST-001",
    name: "Rahul Sharma",
    phone: "9876543210",
    totalVisits: 4, // 4 visits! Next completed order hits 5th visit reward (₹50 OFF!)
    totalOrders: 4,
    totalSpent: 3420,
    loyaltyPoints: 340,
    birthday: "1994-08-15",
    memberSince: "2026-09-12",
    availableCoupons: [
      { code: "NEXTVISIT50", title: "Unlock ₹50 OFF on 5th Visit", discount: 50, minBill: 200, isLocked: false }
    ],
    completedOrderIds: ["ORD-901", "ORD-905", "ORD-912", "ORD-920"]
  },
  {
    id: "CUST-002",
    name: "Priya Nair",
    phone: "9812345678",
    totalVisits: 9, // 9 visits! Next order hits 10th visit reward (Free Drink / Item!)
    totalOrders: 9,
    totalSpent: 8750,
    loyaltyPoints: 870,
    birthday: "1997-11-20",
    memberSince: "2026-07-04",
    availableCoupons: [
      { code: "VIPGOLD50", title: "₹50 Loyal Customer Perk", discount: 50, minBill: 250, isLocked: false },
      { code: "FREECOFFEE", title: "Free Specialty Coffee on 10th Visit", discount: 180, minBill: 0, isLocked: false }
    ],
    completedOrderIds: ["ORD-801", "ORD-805", "ORD-811", "ORD-820", "ORD-830", "ORD-845", "ORD-860", "ORD-875", "ORD-890"]
  },
  {
    id: "CUST-003",
    name: "Amitav Sengupta",
    phone: "9745612389",
    totalVisits: 2,
    totalOrders: 2,
    totalSpent: 1240,
    loyaltyPoints: 120,
    birthday: "1990-03-05",
    memberSince: "2026-10-15",
    availableCoupons: [
      { code: "VISIT3PERK", title: "Special Surprise on 3rd Visit", discount: 30, minBill: 200, isLocked: false }
    ],
    completedOrderIds: ["ORD-930", "ORD-945"]
  },
  {
    id: "CUST-004",
    name: "Ananya Iyer",
    phone: "9900112233",
    totalVisits: 1,
    totalOrders: 1,
    totalSpent: 620,
    loyaltyPoints: 60,
    birthday: "1999-05-18",
    memberSince: "2026-10-29",
    availableCoupons: [
      { code: "WELCOME10", title: "10% Welcome Discount", discountPercent: 10, minBill: 300, isLocked: false }
    ],
    completedOrderIds: ["ORD-955"]
  }
];

export const INITIAL_ORDERS = [
  {
    id: "ORD-1002",
    tableId: "T-02",
    tableNumber: 2,
    tableName: "Table 02",
    customerName: "Rahul Sharma",
    customerPhone: "9876543210",
    status: "Occupied", // Just seated, viewing menu
    items: [
      { id: "M-COF-02", name: "Caramel Hazelnut Latte", price: 240, quantity: 2, specialInstructions: "Extra hot, oat milk" },
      { id: "M-SND-01", name: "Pesto Bocconcini Sourdough Panini", price: 280, quantity: 1, specialInstructions: "Well toasted" }
    ],
    subtotal: 760,
    gst: 38,
    discount: 0,
    couponApplied: null,
    total: 798,
    paymentMethod: "UPI",
    paymentStatus: "Pending",
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    isDemo: true
  },
  {
    id: "ORD-1003",
    tableId: "T-03",
    tableNumber: 3,
    tableName: "Table 03",
    customerName: "Sneha Kapur",
    customerPhone: "9844012345",
    status: "Preparing",
    items: [
      { id: "M-PIZ-01", name: "Artisan Margherita Di Bufala", price: 380, quantity: 1, specialInstructions: "Add extra fresh basil" },
      { id: "M-DRK-01", name: "Passionfruit Mint Sparkler", price: 210, quantity: 2, specialInstructions: "Less ice" }
    ],
    subtotal: 800,
    gst: 40,
    discount: 0,
    couponApplied: null,
    total: 840,
    paymentMethod: "Card",
    paymentStatus: "Pending",
    createdAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    isDemo: true
  },
  {
    id: "ORD-1004",
    tableId: "T-04",
    tableNumber: 4,
    tableName: "Table 04",
    customerName: "Tanmay Bhatia",
    customerPhone: "9819988776",
    status: "Order Pending",
    items: [
      { id: "M-BUR-01", name: "The Truffle Brioche Smash Burger", price: 340, quantity: 2, specialInstructions: "No onions in one burger" },
      { id: "M-PIZ-02", name: "Smoked Chicken & Jalapeño Pizza", price: 460, quantity: 1, specialInstructions: "Crispy crust please" },
      { id: "M-SNK-01", name: "Parmesan Truffle Fries", price: 220, quantity: 1, specialInstructions: "" }
    ],
    subtotal: 1360,
    gst: 68,
    discount: 0,
    couponApplied: null,
    total: 1428,
    paymentMethod: "UPI",
    paymentStatus: "Pending",
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    isDemo: true
  },
  {
    id: "ORD-1005",
    tableId: "T-05",
    tableNumber: 5,
    tableName: "Table 05",
    customerName: "Vikram Rathore",
    customerPhone: "9822334455",
    status: "Ready",
    items: [
      { id: "M-COF-04", name: "Cold Brew On Tap (Vanilla Sweet Cream)", price: 260, quantity: 2, specialInstructions: "" },
      { id: "M-DES-01", name: "Classic Italian Tiramisu Cup", price: 260, quantity: 2, specialInstructions: "" }
    ],
    subtotal: 1040,
    gst: 52,
    discount: 0,
    couponApplied: null,
    total: 1092,
    paymentMethod: "Cash",
    paymentStatus: "Pending",
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    isDemo: true
  },
  {
    id: "ORD-1006",
    tableId: "T-06",
    tableNumber: 6,
    tableName: "Table 06",
    customerName: "Priya Nair",
    customerPhone: "9812345678",
    status: "Served",
    items: [
      { id: "M-BUR-02", name: "Crispy Peri Peri Paneer Burger", price: 290, quantity: 1, specialInstructions: "Extra spicy peri sauce" },
      { id: "M-SNK-01", name: "Parmesan Truffle Fries", price: 220, quantity: 1, specialInstructions: "" },
      { id: "M-TEA-02", name: "Masala Chai Pot (Serves 2)", price: 160, quantity: 1, specialInstructions: "Less sugar" }
    ],
    subtotal: 670,
    gst: 33.5,
    discount: 0,
    couponApplied: null,
    total: 703.5,
    paymentMethod: "UPI",
    paymentStatus: "Pending",
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    isDemo: true
  },
  {
    id: "ORD-1007",
    tableId: "T-07",
    tableNumber: 7,
    tableName: "Table 07",
    customerName: "Ananya Iyer",
    customerPhone: "9900112233",
    status: "Billing",
    items: [
      { id: "M-PIZ-03", name: "Truffle Mushroom Meltdown", price: 490, quantity: 1, specialInstructions: "" },
      { id: "M-COF-01", name: "Espresso Macchiato", price: 180, quantity: 2, specialInstructions: "" },
      { id: "M-DES-02", name: "Warm Molten Choco Lava Cake", price: 240, quantity: 1, specialInstructions: "Serve with extra spoon" }
    ],
    subtotal: 1090,
    gst: 54.5,
    discount: 0,
    couponApplied: null,
    total: 1144.5,
    paymentMethod: "UPI",
    paymentStatus: "Pending",
    createdAt: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
    isDemo: true
  },
  // Earlier completed orders today for realistic analytics and charts
  {
    id: "ORD-1001",
    tableId: "T-01",
    tableNumber: 1,
    tableName: "Table 01",
    customerName: "Karan Mehta",
    customerPhone: "9871122334",
    status: "Completed",
    items: [
      { id: "M-COF-02", name: "Caramel Hazelnut Latte", price: 240, quantity: 2 },
      { id: "M-DES-01", name: "Classic Italian Tiramisu Cup", price: 260, quantity: 1 }
    ],
    subtotal: 740,
    gst: 37,
    discount: 0,
    couponApplied: null,
    total: 777,
    paymentMethod: "UPI",
    paymentStatus: "Completed",
    createdAt: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    isDemo: true
  },
  {
    id: "ORD-1000",
    tableId: "T-08",
    tableNumber: 8,
    tableName: "Table 08",
    customerName: "Divya Joshi",
    customerPhone: "9899887766",
    status: "Completed",
    items: [
      { id: "M-PIZ-01", name: "Artisan Margherita Di Bufala", price: 380, quantity: 2 },
      { id: "M-DRK-02", name: "Belgian Dark Chocolate Frappé", price: 270, quantity: 2 }
    ],
    subtotal: 1300,
    gst: 65,
    discount: 50,
    couponApplied: "WELCOME50",
    total: 1315,
    paymentMethod: "Card",
    paymentStatus: "Completed",
    createdAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    isDemo: true
  }
];

export const INITIAL_COUPONS = [
  { code: "FLOW10", discountPercent: 10, maxDiscount: 100, minBill: 300, description: "10% off on bills above ₹300", active: true },
  { code: "VISIT5", discount: 50, minBill: 250, description: "₹50 off for 5th Visit loyalty milestone", active: true },
  { code: "CAFECHEF", discount: 100, minBill: 600, description: "₹100 off on gourmet orders above ₹600", active: true },
  { code: "FREELATTE", discount: 210, minBill: 400, description: "Complimentary handcrafted coffee", active: true }
];
