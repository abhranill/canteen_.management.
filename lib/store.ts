export type MenuItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  available: boolean;
};

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export type OrderStatus =
  | "Pending"
  | "Preparing"
  | "Ready"
  | "Completed"
  | "Cancelled";

export type Order = {
  id: string;
  customer: string;
  phone: string;
  items: CartItem[];
  total: number;
  time: string;
  date: string;
  status: OrderStatus;
};

export const defaultMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "Classic Burger",
    category: "Fast Food",
    price: 60,
    available: true,
  },
  {
    id: 2,
    name: "Chicken Roll",
    category: "Fast Food",
    price: 70,
    available: true,
  },
  {
    id: 3,
    name: "Masala Tea",
    category: "Beverages",
    price: 15,
    available: true,
  },
  {
    id: 4,
    name: "Cold Coffee",
    category: "Beverages",
    price: 50,
    available: true,
  },
  {
    id: 5,
    name: "Veg Thali",
    category: "Meals",
    price: 90,
    available: true,
  },
  {
    id: 6,
    name: "Fresh Salad",
    category: "Healthy",
    price: 50,
    available: false,
  },
];

export function getMenuItems(): MenuItem[] {
  if (typeof window === "undefined") {
    return defaultMenuItems;
  }

  const saved = localStorage.getItem(
    "canteen-menu-items"
  );

  if (!saved) {
    localStorage.setItem(
      "canteen-menu-items",
      JSON.stringify(defaultMenuItems)
    );

    return defaultMenuItems;
  }

  try {
    return JSON.parse(saved);
  } catch {
    return defaultMenuItems;
  }
}

export function saveMenuItems(items: MenuItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    "canteen-menu-items",
    JSON.stringify(items)
  );
}

export function getOrders(): Order[] {
  if (typeof window === "undefined") {
    return [];
  }

  const saved = localStorage.getItem(
    "canteen-orders"
  );

  if (!saved) {
    return [];
  }

  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

export function saveOrders(orders: Order[]) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    "canteen-orders",
    JSON.stringify(orders)
  );
}

export function createOrder(
  customer: string,
  phone: string,
  cartItems: CartItem[]
): Order {
  const now = new Date();

  const orderNumber = Math.floor(
    100000 + Math.random() * 900000
  );

  const orderId = `ORD-${orderNumber}`;

  const total = cartItems.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  return {
    id: orderId,
    customer,
    phone,
    items: cartItems,
    total,
    status: "Pending",

    time: now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),

    date: now.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  };
}

export function clearAppData() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("canteen-menu-items");
  localStorage.removeItem("canteen-orders");
  localStorage.removeItem("canteen-theme");
}