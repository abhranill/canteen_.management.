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
  items: CartItem[]
): Order {
  const total = items.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  return {
    id: `ORD-${Date.now().toString().slice(-6)}`,
    customer,
    phone,
    items,
    total,
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    status: "Pending",
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