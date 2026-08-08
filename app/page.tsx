"use client";

import {
  Search,
  ClipboardList,
  IndianRupee,
  Utensils,
  Clock3,
  Sandwich,
  Coffee,
  Soup,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)] p-4 text-[var(--foreground)] sm:p-6 lg:p-8">
      {/* Welcome */}
      <section className="mb-8">
        <p className="mb-1 text-sm font-medium text-orange-500">
          TODAY
        </p>

        <h1 className="text-2xl font-bold sm:text-3xl">
          Good morning, Admin
        </h1>

        <p className="mt-2 text-[var(--muted)]">
          Here's what's happening in your canteen today.
        </p>
      </section>

      {/* Search */}
      <div className="mb-6 flex max-w-xl items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3">
        <Search
          size={19}
          className="text-[var(--muted)]"
        />

        <input
          type="text"
          placeholder="Search menu items..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </div>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Today's Orders"
          value="24"
          change="+12%"
          icon={<ClipboardList size={21} />}
        />

        <StatCard
          title="Today's Sales"
          value="₹4,820"
          change="+8.5%"
          icon={<IndianRupee size={21} />}
        />

        <StatCard
          title="Menu Items"
          value="32"
          change="4 categories"
          icon={<Utensils size={21} />}
        />

        <StatCard
          title="Pending Orders"
          value="7"
          change="Needs attention"
          icon={<Clock3 size={21} />}
        />
      </section>

      {/* Popular Items */}
      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">
              Popular Today
            </h2>

            <p className="text-sm text-[var(--muted)]">
              Your most ordered food items
            </p>
          </div>

          <a
            href="/menu"
            className="text-sm font-semibold text-orange-500 hover:text-orange-600"
          >
            View menu →
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <FoodCard
            icon={<Sandwich size={54} strokeWidth={1.5} />}
            name="Classic Burger"
            category="Fast Food"
            price="₹60"
            orders="18 orders"
          />

          <FoodCard
            icon={<Sandwich size={54} strokeWidth={1.5} />}
            name="Chicken Roll"
            category="Rolls"
            price="₹70"
            orders="15 orders"
          />

          <FoodCard
            icon={<Coffee size={54} strokeWidth={1.5} />}
            name="Masala Tea"
            category="Beverages"
            price="₹15"
            orders="32 orders"
          />
        </div>
      </section>
    </main>
  );
}

function StatCard({
  title,
  value,
  change,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-[var(--muted)]">
          {title}
        </p>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-950/40">
          {icon}
        </div>
      </div>

      <p className="text-2xl font-bold">
        {value}
      </p>

      <p className="mt-2 text-xs text-emerald-500">
        {change}
      </p>
    </div>
  );
}

function FoodCard({
  icon,
  name,
  category,
  price,
  orders,
}: {
  icon: React.ReactNode;
  name: string;
  category: string;
  price: string;
  orders: string;
}) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex h-32 items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 text-orange-500 dark:from-orange-950/40 dark:to-amber-950/30">
        {icon}
      </div>

      <div className="p-5">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-bold">
              {name}
            </h3>

            <p className="mt-1 text-xs text-[var(--muted)]">
              {category}
            </p>
          </div>

          <span className="font-bold text-orange-500">
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