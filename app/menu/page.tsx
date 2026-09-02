"use client";

import {
  Search,
  Plus,
  ShoppingCart,
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
  const [orderSuccess, setOrderSuccess] =
    useState(false);

  const [customerName, setCustomerName] =
    useState("");
  const [customerPhone, setCustomerPhone] =
    useState("");

  const [editingItem, setEditingItem] =
    useState<MenuItem | null>(null);

  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] =
    useState("Fast Food");
  const [formPrice, setFormPrice] = useState("");
  const [formStock, setFormStock] = useState("10");

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
    const searchText = search.toLowerCase();

    const matchesSearch =
      item.name.toLowerCase().includes(searchText) ||
      item.category.toLowerCase().includes(searchText);

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
   * Cart count
   */
  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  /*
   * Add to cart
   *
   * IMPORTANT:
   * Out-of-stock items are allowed into the cart.
   * Stock is checked again during checkout.
   */
  const addToCart = (item: MenuItem) => {
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

    setShowCart(true);
  };

  /*
   * Increase quantity
   */
  const increaseQuantity = (id: number) => {
    setCart((currentCart) =>
      currentCart.map((cartItem) =>
        cartItem.id === id
          ? {
              ...cartItem,
              quantity: cartItem.quantity + 1,
            }
          : cartItem
      )
    );
  };

  /*
   * Decrease quantity
   */
  const decreaseQuantity = (id: number) => {
    setCart((currentCart) =>
      currentCart
        .map((cartItem) =>
          cartItem.id === id
            ? {
                ...cartItem,
                quantity: cartItem.quantity - 1,
              }
            : cartItem
        )
        .filter(
          (cartItem) => cartItem.quantity > 0
        )
    );
  };

  /*
   * Remove from cart
   */
  const removeFromCart = (id: number) => {
    setCart((currentCart) =>
      currentCart.filter(
        (cartItem) => cartItem.id !== id
      )
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

    /*
     * Final stock check
     *
     * Users can add unavailable items to cart,
     * but an order cannot be placed unless
     * enough stock is available.
     */
    for (const cartItem of cart) {
      const menuItem = items.find(
        (item) => item.id === cartItem.id
      );

      if (!menuItem) {
        alert(
          `${cartItem.name} is no longer available.`
        );
        return;
      }

      if (
        !menuItem.available ||
        menuItem.stock < cartItem.quantity
      ) {
        alert(
          `${cartItem.name} is currently out of stock or does not have enough stock.`
        );
        return;
      }
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

    /*
     * Reduce stock
     */
    const updatedItems = items.map(
      (menuItem) => {
        const orderedItem = cart.find(
          (cartItem) =>
            cartItem.id === menuItem.id
        );

        if (!orderedItem) {
          return menuItem;
        }

        const newStock =
          menuItem.stock -
          orderedItem.quantity;

        return {
          ...menuItem,
          stock: Math.max(newStock, 0),
          available:
            newStock > 0 &&
            menuItem.available,
        };
      }
    );

    setItems(updatedItems);
    saveMenuItems(updatedItems);

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
    setFormStock("10");
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
    setFormStock(item.stock.toString());
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
    setFormStock("10");
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
    const stock = Number(formStock);

    if (
      !name ||
      price <= 0 ||
      stock < 0
    ) {
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
              stock,
              available:
                stock > 0
                  ? item.available
                  : false,
            }
          : item
      );
    } else {
      const newItem: MenuItem = {
        id: Date.now(),
        name,
        category: formCategory,
        price,
        stock,
        available: stock > 0,
      };

      updatedItems = [
        ...items,
        newItem,
      ];
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
   * Toggle availability
   */
  const toggleAvailability = (id: number) => {
    const updatedItems = items.map(
      (item) => {
        if (item.id !== id) {
          return item;
        }

        if (item.stock <= 0) {
          return item;
        }

        return {
          ...item,
          available: !item.available,
        };
      }
    );

    setItems(updatedItems);
    saveMenuItems(updatedItems);
  };

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 pb-10 pt-20 text-[var(--foreground)] sm:px-6 lg:px-8 lg:pb-12 lg:pt-24">

      {/* Header */}
      <section className="mx-auto mb-8 max-w-7xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

          <div>
            <p className="mb-1 text-sm font-medium text-orange-500">
              MENU MANAGEMENT
            </p>

            <h1 className="text-2xl font-bold sm:text-3xl">
              Menu Items
            </h1>

            <p className="mt-2 text-sm text-[var(--muted)] sm:text-base">
              Manage food items and create new orders.
            </p>
          </div>

          <div className="flex gap-3">

            {/* Cart */}
            <button
              onClick={() =>
                setShowCart(true)
              }
              className="relative flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm font-semibold transition hover:border-orange-500"
            >
              <ShoppingCart size={18} />

              Cart

              {cartCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 text-xs text-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Add Item */}
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
            >
              <Plus size={18} />
              Add Item
            </button>

          </div>
        </div>
      </section>

      {/* Search + Categories */}
      <section className="mx-auto mb-8 max-w-7xl">

        <div className="mb-5 flex max-w-2xl items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3">
          <Search
            size={19}
            className="shrink-0 text-[var(--muted)]"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search food items..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() =>
                setSelectedCategory(category)
              }
              className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                selectedCategory === category
                  ? "border-orange-500 bg-orange-500 text-white"
                  : "border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:border-orange-500 hover:text-orange-500"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

      </section>

      {/* Menu Grid */}
      <section className="mx-auto max-w-7xl">

        {filteredItems.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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
        ) : (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-10 text-center">
            <Search
              size={32}
              className="mx-auto text-[var(--muted)]"
            />

            <h3 className="mt-4 font-bold">
              No menu items found
            </h3>

            <p className="mt-1 text-sm text-[var(--muted)]">
              Try another search or category.
            </p>
          </div>
        )}

      </section>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl">

            <div className="mb-6 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold">
                  {editingItem
                    ? "Edit Menu Item"
                    : "Add Menu Item"}
                </h2>

                <p className="mt-1 text-sm text-[var(--muted)]">
                  Enter the food item details.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-[var(--muted)] transition hover:bg-slate-100 hover:text-red-500 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Food Name
                </label>

                <input
                  value={formName}
                  onChange={(event) =>
                    setFormName(event.target.value)
                  }
                  placeholder="e.g. Cheese Burger"
                  className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-orange-500"
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
                  <option>Fast Food</option>
                  <option>Beverages</option>
                  <option>Healthy</option>
                  <option>Meals</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Price
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={formPrice}
                    onChange={(event) =>
                      setFormPrice(event.target.value)
                    }
                    placeholder="₹"
                    className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Stock
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={formStock}
                    onChange={(event) =>
                      setFormStock(event.target.value)
                    }
                    className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-orange-500"
                  />
                </div>

              </div>

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-xl border border-[var(--border)] px-4 py-3 text-sm font-semibold transition hover:border-orange-500"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  {editingItem
                    ? "Save Changes"
                    : "Add Item"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 z-[70] flex justify-end bg-black/50">

          <div className="flex h-full w-full max-w-md flex-col border-l border-[var(--border)] bg-[var(--card)] shadow-2xl">

            <div className="flex items-center justify-between border-b border-[var(--border)] p-5">

              <div>
                <h2 className="text-xl font-bold">
                  Your Cart
                </h2>

                <p className="mt-1 text-sm text-[var(--muted)]">
                  {cartCount} item
                  {cartCount !== 1 ? "s" : ""}
                </p>
              </div>

              <button
                onClick={() =>
                  setShowCart(false)
                }
                className="rounded-lg p-2 text-[var(--muted)] hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>

            </div>

            <div className="flex-1 overflow-y-auto p-5">

              {cart.length === 0 ? (
                <div className="py-16 text-center">

                  <ShoppingCart
                    size={42}
                    className="mx-auto text-[var(--muted)]"
                  />

                  <h3 className="mt-4 font-bold">
                    Your cart is empty
                  </h3>

                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Add some delicious items.
                  </p>

                </div>
              ) : (
                <div className="space-y-4">

                  {cart.map((item) => {
                    const menuItem = items.find(
                      (menuItem) =>
                        menuItem.id === item.id
                    );

                    const unavailable =
                      !menuItem ||
                      !menuItem.available ||
                      menuItem.stock <
                        item.quantity;

                    return (
                      <div
                        key={item.id}
                        className="rounded-xl border border-[var(--border)] p-4"
                      >

                        <div className="flex items-start justify-between gap-3">

                          <div>
                            <h3 className="font-semibold">
                              {item.name}
                            </h3>

                            <p className="mt-1 text-sm text-orange-500">
                              ₹{item.price}
                            </p>

                            {unavailable && (
                              <p className="mt-1 text-xs font-medium text-red-500">
                                Currently unavailable
                              </p>
                            )}
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

                        <div className="mt-4 flex items-center justify-between">

                          <div className="flex items-center gap-2">

                            <button
                              onClick={() =>
                                decreaseQuantity(
                                  item.id
                                )
                              }
                              className="rounded-lg border border-[var(--border)] p-2 hover:border-orange-500"
                            >
                              <Minus size={15} />
                            </button>

                            <span className="min-w-8 text-center font-semibold">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                increaseQuantity(
                                  item.id
                                )
                              }
                              className="rounded-lg border border-[var(--border)] p-2 hover:border-orange-500"
                            >
                              <Plus size={15} />
                            </button>

                          </div>

                          <span className="font-bold">
                            ₹
                            {item.price *
                              item.quantity}
                          </span>

                        </div>

                      </div>
                    );
                  })}

                </div>
              )}

            </div>

            {cart.length > 0 && (
              <div className="border-t border-[var(--border)] p-5">

                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-[var(--muted)]">
                    Total
                  </span>

                  <span className="text-xl font-bold">
                    ₹{cartTotal}
                  </span>
                </div>

                <button
                  onClick={openCheckout}
                  className="w-full rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white transition hover:bg-orange-600"
                >
                  Proceed to Checkout
                </button>

              </div>
            )}

          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl">

            <div className="mb-6 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold">
                  Checkout
                </h2>

                <p className="mt-1 text-sm text-[var(--muted)]">
                  Enter customer information.
                </p>
              </div>

              <button
                onClick={() =>
                  setShowCheckout(false)
                }
                className="rounded-lg p-2 text-[var(--muted)] hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={handlePlaceOrder}
              className="space-y-4"
            >

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Customer Name
                </label>

                <input
                  value={customerName}
                  onChange={(event) =>
                    setCustomerName(event.target.value)
                  }
                  placeholder="Enter customer name"
                  className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Phone Number
                </label>

                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(event) =>
                    setCustomerPhone(event.target.value)
                  }
                  placeholder="Enter phone number"
                  className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-orange-500"
                />
              </div>

              <div className="rounded-xl bg-[var(--background)] p-4">

                <div className="flex items-center justify-between">

                  <span className="text-sm text-[var(--muted)]">
                    Order Total
                  </span>

                  <span className="font-bold">
                    ₹{cartTotal}
                  </span>

                </div>

              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white transition hover:bg-orange-600"
              >
                Place Order
              </button>

            </form>

          </div>
        </div>
      )}

      {/* Success Modal */}
      {orderSuccess && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

          <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--card)] p-7 text-center shadow-2xl">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <Check size={28} />
            </div>

            <h2 className="mt-5 text-xl font-bold">
              Order Placed
            </h2>

            <p className="mt-2 text-sm text-[var(--muted)]">
              The order has been successfully added
              to the order list.
            </p>

            <button
              onClick={() =>
                setOrderSuccess(false)
              }
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

/*
 * Menu Card
 */

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

  const isAvailable =
    item.available && item.stock > 0;

  return (
    <div className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] transition hover:-translate-y-1 hover:shadow-xl">

      {/* Image / Icon */}
      <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 text-orange-500 dark:from-orange-950/40 dark:to-amber-950/30">

        <Icon
          size={58}
          strokeWidth={1.5}
        />

        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${
            isAvailable
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
              : "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400"
          }`}
        >
          {isAvailable
            ? "Available"
            : "Out of Stock"}
        </span>

      </div>

      {/* Details */}
      <div className="p-5">

        <div className="mb-4 flex items-start justify-between gap-3">

          <div className="min-w-0">

            <h3 className="truncate font-bold">
              {item.name}
            </h3>

            <p className="mt-1 text-xs text-[var(--muted)]">
              {item.category}
            </p>

            <p
              className={`mt-1 text-xs font-medium ${
                item.stock > 0
                  ? "text-[var(--muted)]"
                  : "text-red-500"
              }`}
            >
              Stock: {item.stock}
            </p>

          </div>

          <span className="shrink-0 font-bold text-orange-500">
            ₹{item.price}
          </span>

        </div>

        {/* Add To Cart */}
        <button
          onClick={() => onAddToCart(item)}
          className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 active:scale-[0.98]"
        >
          <ShoppingCart size={17} />
          Add to Cart
        </button>

        {/* Admin Controls */}
        <div className="flex gap-2">

          <button
            onClick={() =>
              onToggleAvailability(item.id)
            }
            disabled={item.stock <= 0}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
              item.stock <= 0
                ? "cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                : item.available
                  ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/70"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            <Check size={14} />

            {item.stock <= 0
              ? "Out of Stock"
              : item.available
                ? "Available"
                : "Enable"}
          </button>

          <button
            onClick={() => onEdit(item)}
            className="rounded-lg border border-[var(--border)] p-2 text-[var(--muted)] transition hover:border-orange-500 hover:text-orange-500"
            aria-label={`Edit ${item.name}`}
          >
            <Pencil size={16} />
          </button>

          <button
            onClick={() => onDelete(item.id)}
            className="rounded-lg border border-[var(--border)] p-2 text-[var(--muted)] transition hover:border-red-500 hover:text-red-500"
            aria-label={`Delete ${item.name}`}
          >
            <Trash2 size={16} />
          </button>

        </div>

      </div>
    </div>
  );
}