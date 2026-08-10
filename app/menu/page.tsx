"use client";

import {
  Search,
  Plus,
  ShoppingCart,
  Utensils,
  Coffee,
  Sandwich,
  Salad,
  Soup,
  Pencil,
  Trash2,
  X,
  Check,
  Minus,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  MenuItem,
  CartItem,
  getMenuItems,
  saveMenuItems,
  getOrders,
  saveOrders,
  createOrder,
} from "@/lib/store";

const categories = [
  "All Items",
  "Fast Food",
  "Beverages",
  "Healthy",
  "Meals",
];

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All Items");

  const [showModal, setShowModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
const [showCheckout, setShowCheckout] =
  useState(false);

const [customerName, setCustomerName] =
  useState("");

const [customerPhone, setCustomerPhone] =
  useState("");

const [orderSuccess, setOrderSuccess] =
  useState(false);
  const [editingItem, setEditingItem] =
    useState<MenuItem | null>(null);

  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] =
    useState("Fast Food");
  const [formPrice, setFormPrice] = useState("");

  /*
   * Load menu
   */
  useEffect(() => {
    setItems(getMenuItems());
  }, []);

  /*
   * Filter menu
   */
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All Items" ||
      item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  /*
   * Cart total
   */
  const cartTotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  /*
   * Cart item count
   */
  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  /*
   * Add to cart
   */
  const addToCart = (item: MenuItem) => {
    if (!item.available) {
      return;
    }

    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItem) {
        return currentCart.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1,
              }
            : cartItem
        );
      }

      return [
        ...currentCart,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
        },
      ];
    });
  };

  /*
   * Increase quantity
   */
  const increaseQuantity = (id: number) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  /*
   * Decrease quantity
   */
  const decreaseQuantity = (id: number) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  /*
   * Remove item from cart
   */
  const removeFromCart = (id: number) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== id)
    );
  };
/*
 * Open checkout
 */
const openCheckout = () => {
  if (cart.length === 0) {
    return;
  }

  setShowCart(false);
  setShowCheckout(true);
};

/*
 * Place order
 */
const handlePlaceOrder = (
  event: React.FormEvent
) => {
  event.preventDefault();

  const name = customerName.trim();
  const phone = customerPhone.trim();

  if (!name || !phone || cart.length === 0) {
    return;
  }

  const newOrder = createOrder(
    name,
    phone,
    cart
  );

  const existingOrders = getOrders();

  saveOrders([
    newOrder,
    ...existingOrders,
  ]);

  setCart([]);
  setCustomerName("");
  setCustomerPhone("");

  setShowCheckout(false);
  setOrderSuccess(true);
};
  /*
   * Add modal
   */
  const openAddModal = () => {
    setEditingItem(null);
    setFormName("");
    setFormCategory("Fast Food");
    setFormPrice("");
    setShowModal(true);
  };

  /*
   * Edit modal
   */
  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormPrice(item.price.toString());
    setShowModal(true);
  };

  /*
   * Close modal
   */
  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormName("");
    setFormCategory("Fast Food");
    setFormPrice("");
  };

  /*
   * Save menu item
   */
  const handleSubmit = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    const name = formName.trim();
    const price = Number(formPrice);

    if (!name || !price || price <= 0) {
      return;
    }

    let updatedItems: MenuItem[];

    if (editingItem) {
      updatedItems = items.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              name,
              category: formCategory,
              price,
            }
          : item
      );
    } else {
      const newItem: MenuItem = {
        id: Date.now(),
        name,
        category: formCategory,
        price,
        available: true,
      };

      updatedItems = [...items, newItem];
    }

    setItems(updatedItems);
    saveMenuItems(updatedItems);

    closeModal();
  };

  /*
   * Delete item
   */
  const deleteItem = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (!confirmed) {
      return;
    }

    const updatedItems = items.filter(
      (item) => item.id !== id
    );

    setItems(updatedItems);
    saveMenuItems(updatedItems);

    removeFromCart(id);
  };

  /*
   * Availability
   */
  const toggleAvailability = (id: number) => {
    const updatedItems = items.map((item) =>
      item.id === id
        ? {
            ...item,
            available: !item.available,
          }
        : item
    );

    setItems(updatedItems);
    saveMenuItems(updatedItems);
  };

  return (
    <main className="min-h-screen bg-[var(--background)] p-4 text-[var(--foreground)] sm:p-6 lg:p-8">
      {/* Header */}
      <section className="mb-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-1 text-sm font-medium text-orange-500">
              MENU MANAGEMENT
            </p>

            <h1 className="text-2xl font-bold sm:text-3xl">
              Menu Items
            </h1>

            <p className="mt-2 text-sm text-[var(--muted)]">
              Manage food items and create new orders.
            </p>
          </div>

          <div className="flex gap-3">
            {/* Cart */}
            <button
              onClick={() => setShowCart(true)}
              className="relative flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm font-semibold transition hover:border-orange-500"
            >
              <ShoppingCart size={18} />

              Cart

              {cartCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Add Item */}
            <button
              onClick={openAddModal}
              className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
            >
              <Plus size={18} />
              Add Item
            </button>
          </div>
        </div>
      </section>

      {/* Search */}
      <div className="mb-5 flex max-w-xl items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3">
        <Search
          size={19}
          className="text-[var(--muted)]"
        />

        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search food items..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </div>

      {/* Categories */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => {
          const active =
            selectedCategory === category;

          return (
            <button
              key={category}
              onClick={() =>
                setSelectedCategory(category)
              }
              className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                  : "border border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Menu Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredItems.map((item) => (
          <MenuCard
            key={item.id}
            item={item}
            onAddToCart={addToCart}
            onEdit={openEditModal}
            onDelete={deleteItem}
            onToggleAvailability={
              toggleAvailability
            }
          />
        ))}
      </div>

      {/* Empty */}
      {filteredItems.length === 0 && (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)]">
          <Search
            size={40}
            className="mb-3 text-[var(--muted)]"
          />

          <h2 className="font-semibold">
            No items found
          </h2>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Try changing your search or category.
          </p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] p-5">
              <div>
                <h2 className="text-lg font-bold">
                  {editingItem
                    ? "Edit Menu Item"
                    : "Add Menu Item"}
                </h2>

                <p className="mt-1 text-xs text-[var(--muted)]">
                  Enter the item details below.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-[var(--muted)] hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={19} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5"
            >
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Item Name
                </label>

                <input
                  type="text"
                  value={formName}
                  onChange={(event) =>
                    setFormName(event.target.value)
                  }
                  placeholder="e.g. Cheese Sandwich"
                  className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Category
                </label>

                <select
                  value={formCategory}
                  onChange={(event) =>
                    setFormCategory(event.target.value)
                  }
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm outline-none focus:border-orange-500"
                >
                  <option value="Fast Food">
                    Fast Food
                  </option>

                  <option value="Beverages">
                    Beverages
                  </option>

                  <option value="Healthy">
                    Healthy
                  </option>

                  <option value="Meals">
                    Meals
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Price
                </label>

                <div className="flex items-center rounded-xl border border-[var(--border)] focus-within:border-orange-500">
                  <span className="px-4 text-sm text-[var(--muted)]">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="1"
                    value={formPrice}
                    onChange={(event) =>
                      setFormPrice(event.target.value)
                    }
                    placeholder="60"
                    className="w-full bg-transparent px-2 py-3 text-sm outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-xl border border-[var(--border)] px-4 py-3 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600"
                >
                  <Check size={17} />

                  {editingItem
                    ? "Save Changes"
                    : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 z-[100]">
          {/* Overlay */}
          <div
            onClick={() => setShowCart(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-[var(--border)] bg-[var(--card)] shadow-2xl">
            {/* Cart Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] p-5">
              <div>
                <h2 className="text-lg font-bold">
                  Your Cart
                </h2>

                <p className="mt-1 text-xs text-[var(--muted)]">
                  {cartCount} item
                  {cartCount !== 1 ? "s" : ""}
                </p>
              </div>

              <button
                onClick={() => setShowCart(false)}
                className="rounded-lg p-2 text-[var(--muted)] hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-5">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingCart
                    size={42}
                    className="mb-4 text-[var(--muted)]"
                  />

                  <h3 className="font-semibold">
                    Your cart is empty
                  </h3>

                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Add some items from the menu.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-[var(--border)] p-4"
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold">
                            {item.name}
                          </h3>

                          <p className="mt-1 text-sm text-[var(--muted)]">
                            ₹{item.price} each
                          </p>
                        </div>

                        <button
                          onClick={() =>
                            removeFromCart(item.id)
                          }
                          className="text-[var(--muted)] hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center rounded-lg border border-[var(--border)]">
                          <button
                            onClick={() =>
                              decreaseQuantity(item.id)
                            }
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Minus size={15} />
                          </button>

                          <span className="min-w-8 text-center text-sm font-semibold">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              increaseQuantity(item.id)
                            }
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Plus size={15} />
                          </button>
                        </div>

                        <span className="font-bold text-orange-500">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="border-t border-[var(--border)] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-[var(--muted)]">
                    Total
                  </span>

                  <span className="text-xl font-bold text-orange-500">
                    ₹{cartTotal}
                  </span>
                </div>

                <button
  onClick={openCheckout}
  className="w-full rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white transition hover:bg-orange-600"
>
  Continue to Order
</button>
              </div>
            )}
          </div>
        </div>
      )}
            {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] p-5">
              <div>
                <h2 className="text-lg font-bold">
                  Customer Details
                </h2>

                <p className="mt-1 text-xs text-[var(--muted)]">
                  Enter the details to place this order.
                </p>
              </div>

              <button
                onClick={() =>
                  setShowCheckout(false)
                }
                className="rounded-lg p-2 text-[var(--muted)] hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={19} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handlePlaceOrder}
              className="space-y-5 p-5"
            >
              {/* Customer Name */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Reciever's id
                </label>

                <input
                  type="text"
                  value={customerName}
                  onChange={(event) =>
                    setCustomerName(
                      event.target.value
                    )
                  }
                  placeholder="Enter reciever's id"
                  className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-orange-500"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Phone Number
                </label>

                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(event) =>
                    setCustomerPhone(
                      event.target.value
                    )
                  }
                  placeholder="Enter phone number"
                  className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-orange-500"
                  required
                />
              </div>

              {/* Order Summary */}
              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-[var(--muted)]">
                    Items
                  </span>

                  <span className="text-sm font-semibold">
                    {cartCount}
                  </span>
                </div>

                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-[var(--muted)]">
                    Total
                  </span>

                  <span className="text-lg font-bold text-orange-500">
                    ₹{cartTotal}
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setShowCheckout(false)
                  }
                  className="flex-1 rounded-xl border border-[var(--border)] px-4 py-3 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Back
                </button>

                <button
                  type="submit"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  <Check size={17} />
                  Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
            {/* Order Success */}
      {orderSuccess && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <Check size={28} />
            </div>

            <h2 className="text-xl font-bold">
              Order Placed
            </h2>

            <p className="mt-2 text-sm text-[var(--muted)]">
              The order has been successfully added
              to the order list.
            </p>

            <button
              onClick={() => setOrderSuccess(false)}
              className="mt-6 w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function MenuCard({
  item,
  onAddToCart,
  onEdit,
  onDelete,
  onToggleAvailability,
}: {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: number) => void;
  onToggleAvailability: (id: number) => void;
}) {
  const Icon =
    item.category === "Beverages"
      ? Coffee
      : item.category === "Healthy"
        ? Salad
        : item.category === "Meals"
          ? Soup
          : Sandwich;

  return (
    <div className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] transition hover:-translate-y-1 hover:shadow-xl">
      {/* Visual */}
      <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 text-orange-500 dark:from-orange-950/40 dark:to-amber-950/30">
        <Icon
          size={58}
          strokeWidth={1.5}
        />

        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${
            item.available
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
              : "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400"
          }`}
        >
          {item.available
            ? "Available"
            : "Unavailable"}
        </span>
      </div>

      {/* Details */}
      <div className="p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-bold">
              {item.name}
            </h3>

            <p className="mt-1 text-xs text-[var(--muted)]">
              {item.category}
            </p>
          </div>

          <span className="font-bold text-orange-500">
            ₹{item.price}
          </span>
        </div>

        {/* Ordering */}
        <button
          onClick={() => onAddToCart(item)}
          disabled={!item.available}
          className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:disabled:bg-slate-700 dark:disabled:text-slate-400"
        >
          <ShoppingCart size={17} />

          {item.available
            ? "Add to Cart"
            : "Unavailable"}
        </button>

        {/* Admin Actions */}
        <div className="flex gap-2">
          <button
            onClick={() =>
              onToggleAvailability(item.id)
            }
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
              item.available
                ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/70"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            <Check size={14} />

            {item.available
              ? "Available"
              : "Enable"}
          </button>

          <button
            onClick={() => onEdit(item)}
            className="rounded-lg border border-[var(--border)] p-2 text-[var(--muted)] hover:border-orange-500 hover:text-orange-500"
            aria-label={`Edit ${item.name}`}
          >
            <Pencil size={16} />
          </button>

          <button
            onClick={() => onDelete(item.id)}
            className="rounded-lg border border-[var(--border)] p-2 text-[var(--muted)] hover:border-red-500 hover:text-red-500"
            aria-label={`Delete ${item.name}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}