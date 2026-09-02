"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getMenuItems,
  getOrders,
  MenuItem,
  Order,
} from "@/lib/store";

export default function Home() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadData = () => {
      setMenuItems(getMenuItems());
      setOrders(getOrders());
    };

    loadData();

    // Refresh dashboard when localStorage changes
    window.addEventListener("storage", loadData);

    return () => {
      window.removeEventListener("storage", loadData);
    };
  }, []);

  // Today's date
  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // Today's orders
  const todayOrders = orders.filter(
    (order) => order.date === today
  );

  // Total orders today
  const totalOrders = todayOrders.length;

  // Total sales today
  const totalSales = todayOrders
    .filter((order) => order.status !== "Cancelled")
    .reduce(
      (total, order) => total + order.total,
      0
    );

  // Pending orders
  const pendingOrders = orders.filter(
    (order) =>
      order.status === "Pending" ||
      order.status === "Preparing"
  ).length;

  // Available menu items
  const availableItems = menuItems.filter(
    (item) => item.available
  ).length;

  // Popular items
  const popularItems = menuItems
    .filter((item) => item.available)
    .map((item) => {
      const orderCount = orders.reduce(
        (count, order) => {
          const orderedItem = order.items.find(
            (orderItem) => orderItem.id === item.id
          );

          return (
            count + (orderedItem?.quantity ?? 0)
          );
        },
        0
      );

      return {
        ...item,
        orderCount,
      };
    })
    .sort(
      (a, b) => b.orderCount - a.orderCount
    )
    .slice(0, 3);

  // Search popular items
  const filteredItems = popularItems.filter(
    (item) =>
      item.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.category
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 pb-10 pt-20 text-[var(--foreground)] sm:px-6 lg:px-8 lg:pb-12 lg:pt-24">

      {/* Welcome */}
      <section className="mx-auto mb-8 max-w-7xl">
        <p className="mb-1 text-sm font-medium text-orange-500">
          TODAY
        </p>

        <h1 className="text-2xl font-bold sm:text-3xl">
          Good morning, Admin
        </h1>

        <p className="mt-2 text-sm text-[var(--muted)] sm:text-base">
          Here's what's happening in your canteen today.
        </p>
      </section>

      {/* Search */}
      <section className="mx-auto mb-6 max-w-7xl">
        <div className="flex max-w-xl items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3">
          <Search
            size={19}
            className="shrink-0 text-[var(--muted)]"
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search menu items..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>
      </section>

      {/* Statistics */}
      <section className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Today's Orders"
          value={totalOrders.toString()}
          description="Orders received today"
          icon="🛍️"
        />

        <StatCard
          title="Today's Sales"
          value={`₹${totalSales.toLocaleString(
            "en-IN"
          )}`}
          description="Sales from today's orders"
          icon="💰"
        />

        <StatCard
          title="Menu Items"
          value={availableItems.toString()}
          description={`${menuItems.length} total items`}
          icon="🍔"
        />

        <StatCard
          title="Pending Orders"
          value={pendingOrders.toString()}
          description={
            pendingOrders > 0
              ? "Needs attention"
              : "All caught up"
          }
          icon="⏳"
        />

      </section>

      {/* Popular Today */}
      <section className="mx-auto mt-8 max-w-7xl">

        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold sm:text-xl">
              Popular Today
            </h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              Your most ordered food items
            </p>
          </div>

          <Link
            href="/menu"
            className="shrink-0 text-sm font-semibold text-orange-500 transition hover:text-orange-600"
          >
            View menu →
          </Link>
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => (
              <FoodCard
                key={item.id}
                name={item.name}
                category={item.category}
                price={`₹${item.price}`}
                orders={`${item.orderCount} orders`}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
            <p className="font-semibold">
              No items found
            </p>

            <p className="mt-1 text-sm text-[var(--muted)]">
              Try another search or add available
              menu items.
            </p>
          </div>
        )}

      </section>

    </main>
  );
}

/* ---------------- STAT CARD ---------------- */

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:-translate-y-0.5 hover:shadow-lg">

      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="text-sm text-[var(--muted)]">
          {title}
        </p>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-lg dark:bg-orange-950/40">
          {icon}
        </div>
      </div>

      <p className="text-2xl font-bold">
        {value}
      </p>

      <p className="mt-2 text-xs text-[var(--muted)]">
        {description}
      </p>

    </div>
  );
}

/* ---------------- FOOD CARD ---------------- */

function FoodCard({
  name,
  category,
  price,
  orders,
}: {
  name: string;
  category: string;
  price: string;
  orders: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] transition hover:-translate-y-1 hover:shadow-xl">

      {/* Food Image Area */}
      <div className="flex h-32 items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 text-5xl dark:from-orange-950/40 dark:to-amber-950/30">
        🍴
      </div>

      {/* Content */}
      <div className="p-5">

        <div className="mb-2 flex items-start justify-between gap-3">

          <div className="min-w-0">
            <h3 className="truncate font-bold">
              {name}
            </h3>

            <p className="mt-1 text-xs text-[var(--muted)]">
              {category}
            </p>
          </div>

          <span className="shrink-0 font-bold text-orange-500">
            {price}
          </span>

        </div>

        <p className="text-xs text-[var(--muted)]">
          {orders}
        </p>

      </div>
    </div>
  );
}