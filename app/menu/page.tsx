"use client";

import {
  Search,
  Plus,
  Utensils,
  Coffee,
  Sandwich,
  Salad,
  Soup,
  Pencil,
  Trash2,
  X,
  Check,
} from "lucide-react";
import { useEffect, useState } from "react";

type MenuItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  available: boolean;
};

const defaultItems: MenuItem[] = [
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

const categories = [
  "All Items",
  "Fast Food",
  "Beverages",
  "Healthy",
  "Meals",
];

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All Items");

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] =
    useState<MenuItem | null>(null);

  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] =
    useState("Fast Food");
  const [formPrice, setFormPrice] = useState("");

  /*
   * Load menu items
   */
  useEffect(() => {
    const savedItems = localStorage.getItem(
      "canteen-menu-items"
    );

    if (savedItems) {
      setItems(JSON.parse(savedItems));
    } else {
      setItems(defaultItems);
      localStorage.setItem(
        "canteen-menu-items",
        JSON.stringify(defaultItems)
      );
    }
  }, []);

  /*
   * Save menu items
   */
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem(
        "canteen-menu-items",
        JSON.stringify(items)
      );
    }
  }, [items]);

  /*
   * Filter items
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
   * Open Add Modal
   */
  const openAddModal = () => {
    setEditingItem(null);
    setFormName("");
    setFormCategory("Fast Food");
    setFormPrice("");
    setShowModal(true);
  };

  /*
   * Open Edit Modal
   */
  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormPrice(item.price.toString());
    setShowModal(true);
  };

  /*
   * Close Modal
   */
  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormName("");
    setFormCategory("Fast Food");
    setFormPrice("");
  };

  /*
   * Add / Edit Item
   */
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const name = formName.trim();
    const price = Number(formPrice);

    if (!name || !price || price <= 0) {
      return;
    }

    if (editingItem) {
      setItems((currentItems) =>
        currentItems.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                name,
                category: formCategory,
                price,
              }
            : item
        )
      );
    } else {
      const newItem: MenuItem = {
        id: Date.now(),
        name,
        category: formCategory,
        price,
        available: true,
      };

      setItems((currentItems) => [
        ...currentItems,
        newItem,
      ]);
    }

    closeModal();
  };

  /*
   * Delete Item
   */
  const deleteItem = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (!confirmed) {
      return;
    }

    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== id)
    );
  };

  /*
   * Toggle Availability
   */
  const toggleAvailability = (id: number) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              available: !item.available,
            }
          : item
      )
    );
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
              Add and manage the food available in your
              canteen.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
          >
            <Plus size={18} />
            Add Item
          </button>
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

      {/* Items */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredItems.map((item) => (
          <MenuCard
            key={item.id}
            item={item}
            onEdit={openEditModal}
            onDelete={deleteItem}
            onToggleAvailability={toggleAvailability}
          />
        ))}
      </div>

      {/* Empty State */}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl">
            {/* Modal Header */}
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

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5"
            >
              {/* Name */}
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
                  className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-orange-500"
                  required
                />
              </div>

              {/* Category */}
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

              {/* Price */}
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

              {/* Buttons */}
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
    </main>
  );
}

function MenuCard({
  item,
  onEdit,
  onDelete,
  onToggleAvailability,
}: {
  item: MenuItem;
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
        <div className="mb-4">
          <div className="flex items-start justify-between gap-3">
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
        </div>

        {/* Actions */}
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