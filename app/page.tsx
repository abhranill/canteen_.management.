"use client";

import Link from "next/link";
import { Search, ShoppingBag, IndianRupee, Utensils, Clock } from "lucide-react";
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

    window.addEventListener("storage", loadData);

    return () => {
      window.removeEventListener("storage", loadData);
    };
  }, []);

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const todayOrders = orders.filter(
    (order) => order.date === today
  );

  const totalOrders = todayOrders.length;

  const totalSales = todayOrders
    .filter((order) => order.status !== "Cancelled")
    .reduce((total, order) => total + order.total, 0);

  const pendingOrders = orders.filter(
    (order) =>
      order.status === "Pending" ||
      order.status === "Preparing"
  ).length;

  const availableItems = menuItems.filter(
    (item) => item.available
  ).length;

  const popularItems = menuItems
    .filter((item) => item.available)
    .map((item) => {
      const orderCount = orders.reduce(
        (count, order) => {
          const orderedItem = order.items.find(
            (orderItem) => orderItem.id === item.id
          );

          return count + (orderedItem?.quantity ?? 0);
        },
        0
      );

      return {
        ...item,
        orderCount,
      };
    })
    .sort((a, b) => b.orderCount - a.orderCount)
    .slice(0, 6);

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
        <p className="mb-2 text-sm font-semibold text-orange-500">
          TODAY
        </p>

        <h1 className="text-3xl font-bold sm:text-4xl">
          Good morning, Admin
        </h1>

        <p className="mt-2 text-sm text-[var(--muted)] sm:text-base">
          Here's what's happening in your canteen today.
        </p>
      </section>

      {/* Search */}
      <section className="mx-auto mb-8 max-w-7xl">
        <div className="flex max-w-2xl items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3">
          <Search
            size={19}
            className="shrink-0 text-[var(--muted)]"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
          icon={<ShoppingBag size={20} />}
        />

        <StatCard
          title="Today's Sales"
          value={`₹${totalSales.toLocaleString("en-IN")}`}
          description="Sales from today's orders"
          icon={<IndianRupee size={20} />}
        />

        <StatCard
          title="Available Items"
          value={availableItems.toString()}
          description={`${menuItems.length} total menu items`}
          icon={<Utensils size={20} />}
        />

        <StatCard
          title="Pending Orders"
          value={pendingOrders.toString()}
          description={
            pendingOrders > 0
              ? "Needs attention"
              : "All caught up"
          }
          icon={<Clock size={20} />}
        />

      </section>

      {/* Popular Today */}
      <section className="mx-auto mt-10 max-w-7xl">

        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">
              Popular Today
            </h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              Available and most ordered food items
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
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-10 text-center">
            <Utensils
              size={32}
              className="mx-auto text-[var(--muted)]"
            />

            <p className="mt-3 font-semibold">
              No available items found
            </p>

            <p className="mt-1 text-sm text-[var(--muted)]">
              Try another search or make some menu items available.
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
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:-translate-y-0.5 hover:shadow-lg">

      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="text-sm text-[var(--muted)]">
          {title}
        </p>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-500 dark:bg-orange-950/40">
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
  item,
}: {
  item: MenuItem & { orderCount: number };
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] transition hover:-translate-y-1 hover:shadow-xl">

      <div className="flex h-32 items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 text-5xl dark:from-orange-950/40 dark:to-amber-950/30">
        🍴
      </div>

      <div className="p-5">

        <div className="flex items-start justify-between gap-3">

          <div className="min-w-0">
            <h3 className="truncate font-bold">
              {item.name}
            </h3>

            <p className="mt-1 text-xs text-[var(--muted)]">
              {item.category}
            </p>
          </div>

          <span className="shrink-0 font-bold text-orange-500">
            ₹{item.price}
          </span>

        </div>

        <div className="mt-4 flex items-center justify-between">

          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
            Available
          </span>

          <span className="text-xs text-[var(--muted)]">
            {item.orderCount} orders
          </span>

        </div>

      </div>
    </div>
  );
}