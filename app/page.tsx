"use client";

import Link from "next/link";
import {
  Search,
  ShoppingBag,
  IndianRupee,
  Utensils,
  Clock,
  ArrowRight,
  CheckCircle2,
  ChefHat,
  PackageCheck,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  MenuItem,
  Order,
  getMenuItems,
  getOrders,
} from "@/lib/store";

export default function Home() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
const [search, setSearch] = useState("");
  useEffect(() => {
    const loadDashboard = () => {
      setMenuItems(getMenuItems());
      setOrders(getOrders());
    };

    loadDashboard();

    window.addEventListener(
      "storage",
      loadDashboard
    );

    return () => {
      window.removeEventListener(
        "storage",
        loadDashboard
      );
    };
  }, []);

  /*
   * Dashboard calculations
   */

  const totalOrders = orders.length;

  const totalSales = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce(
      (total, order) => total + order.total,
      0
    );

  const pendingOrders = orders.filter(
    (order) =>
      order.status === "Pending" ||
      order.status === "Preparing"
  ).length;

  const availableItems = menuItems.filter(
    (item) => item.available
  ).length;

  const recentOrders = orders.slice(0, 5);
const searchResults = menuItems.filter((item) =>
  item.name
    .toLowerCase()
    .includes(search.toLowerCase())
);
  return (
    <main className="min-h-screen bg-[var(--background)] p-4 text-[var(--foreground)] sm:p-6 lg:p-8">
      {/* Welcome */}
     <section className="mb-8">
  <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
    <div>
      <p className="mb-1 text-sm font-medium text-orange-500">
        TODAY
      </p>

      <h1 className="text-2xl font-bold sm:text-3xl">
        Good morning, Admin
      </h1>

      <p className="mt-2 text-[var(--muted)]">
        Here's what's happening in your canteen today.
      </p>
    </div>

    <Link
      href="/menu"
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 hover:shadow-orange-500/30"
    >
      <ShoppingBag size={17} />
      Create Order
    </Link>
  </div>
</section>

      {/* Search */}
     <div className="relative mb-6 max-w-xl">
  <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3">
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
      placeholder="Search menu items..."
      className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
    />
  </div>

  {search.trim() && (
    <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-xl">
      {searchResults.length > 0 ? (
        <div className="max-h-64 overflow-y-auto p-2">
          {searchResults.map((item) => (
            <Link
              key={item.id}
              href="/menu"
              className="flex items-center justify-between rounded-lg px-3 py-3 transition hover:bg-orange-50 dark:hover:bg-orange-950/30"
            >
              <div>
                <p className="text-sm font-medium">
                  {item.name}
                </p>

                <p className="mt-1 text-xs text-[var(--muted)]">
                  {item.category}
                </p>
              </div>

              <span className="text-sm font-bold text-orange-500">
                ₹{item.price}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-5 text-center">
          <p className="text-sm font-medium">
            No menu items found
          </p>

          <p className="mt-1 text-xs text-[var(--muted)]">
            Try another item name.
          </p>
        </div>
      )}
    </div>
  )}
</div>

      {/* Stats */}
<section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Today's Orders"
          value={totalOrders.toString()}
          description="Orders placed today"
          icon={<ShoppingBag size={20} />}
          color="orange"
        />

        <StatCard
          title="Today's Sales"
          value={`₹${totalSales}`}
          description="From all active orders"
          icon={<IndianRupee size={20} />}
          color="emerald"
        />

        <StatCard
          title="Menu Items"
          value={availableItems.toString()}
          description={`${menuItems.length} total items`}
          icon={<Utensils size={20} />}
          color="blue"
        />

        <StatCard
          title="Pending Orders"
          value={pendingOrders.toString()}
          description="Needs attention"
          icon={<Clock size={20} />}
          color="purple"
        />
      </section>

      {/* Main Grid */}
      <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
        {/* Recent Orders */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center justify-between border-b border-[var(--border)] p-5">
            <div>
              <h2 className="font-bold">
                Recent Orders
              </h2>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Latest orders placed in the canteen
              </p>
            </div>

            <Link
              href="/orders"
              className="flex items-center gap-1 text-sm font-semibold text-orange-500 hover:text-orange-600"
            >
              View all
              <ArrowRight size={15} />
            </Link>
          </div>

          {recentOrders.length > 0 ? (
            <div className="divide-y divide-[var(--border)]">
              {recentOrders.map((order) => (
                <RecentOrder
                  key={order.id}
                  order={order}
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-56 flex-col items-center justify-center p-6 text-center">
              <ShoppingBag
                size={36}
                className="mb-3 text-[var(--muted)]"
              />

              <h3 className="font-semibold">
                No orders yet
              </h3>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Orders placed from the menu will
                appear here.
              </p>

              <Link
                href="/menu"
                className="mt-4 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
              >
                Create Order
              </Link>
            </div>
          )}
        </div>

        {/* Quick Overview */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <div className="mb-6">
            <h2 className="font-bold">
              Canteen Overview
            </h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              Current status of your canteen.
            </p>
          </div>

          <div className="space-y-4">
            <OverviewRow
              icon={<Utensils size={18} />}
              label="Total Menu Items"
              value={menuItems.length}
              color="orange"
            />

            <OverviewRow
              icon={<CheckCircle2 size={18} />}
              label="Available Items"
              value={availableItems}
              color="emerald"
            />

            <OverviewRow
              icon={<ChefHat size={18} />}
              label="Preparing Orders"
              value={
                orders.filter(
                  (order) =>
                    order.status === "Preparing"
                ).length
              }
              color="blue"
            />

            <OverviewRow
              icon={<PackageCheck size={18} />}
              label="Ready Orders"
              value={
                orders.filter(
                  (order) =>
                    order.status === "Ready"
                ).length
              }
              color="purple"
            />
          </div>

          <Link
            href="/menu"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-4 py-3 text-sm font-semibold transition hover:border-orange-500 hover:text-orange-500"
          >
            Manage Menu
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Quick Actions button*/}
      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/menu"
          className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-lg"
        >
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-950/40">
            <Utensils size={21} />
          </div>

          <h3 className="font-bold">
            Manage Menu
          </h3>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Add items, update prices and manage
            availability.
          </p>

          <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-orange-500">
            Open Menu
            <ArrowRight
              size={15}
              className="transition group-hover:translate-x-1"
            />
          </div>
        </Link>

        <Link
          href="/orders"
          className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-lg"
        >
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-500 dark:bg-blue-950/40">
            <ShoppingBag size={21} />
          </div>

          <h3 className="font-bold">
            Manage Orders
          </h3>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Track orders and update their status.
          </p>

          <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-orange-500">
            Open Orders
            <ArrowRight
              size={15}
              className="transition group-hover:translate-x-1"
            />
          </div>
        </Link>
      </section>
    </main>
  );
}

/*
 * Stat Card
 */

function StatCard({
  title,
  value,
  description,
  icon,
  color,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  color:
    | "orange"
    | "emerald"
    | "blue"
    | "purple";
}) {
  const colors = {
    orange:
      "bg-orange-50 text-orange-500 dark:bg-orange-950/40",
    emerald:
      "bg-emerald-50 text-emerald-500 dark:bg-emerald-950/40",
    blue:
      "bg-blue-50 text-blue-500 dark:bg-blue-950/40",
    purple:
      "bg-purple-50 text-purple-500 dark:bg-purple-950/40",
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--muted)]">
          {title}
        </p>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors[color]}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-4 text-2xl font-bold">
        {value}
      </p>

      <p className="mt-1 text-xs text-[var(--muted)]">
        {description}
      </p>
    </div>
  );
}

/*
 * Recent Order
 */

function RecentOrder({
  order,
}: {
  order: Order;
}) {
  return (
    <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-950/40">
          <ShoppingBag size={18} />
        </div>

        <div>
          <p className="text-sm font-semibold">
            {order.id}
          </p>

          <p className="mt-1 text-xs text-[var(--muted)]">
            {order.customer} · {order.time}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <OrderStatus status={order.status} />

        <p className="font-bold text-orange-500">
          ₹{order.total}
        </p>
      </div>
    </div>
  );
}

/*
 * Status
 */

function OrderStatus({
  status,
}: {
  status: Order["status"];
}) {
  const styles: Record<
    Order["status"],
    string
  > = {
    Pending:
      "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400",
    Preparing:
      "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",
    Ready:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
    Completed:
      "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400",
    Cancelled:
      "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

/*
 * Overview Row
 */

function OverviewRow({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color:
    | "orange"
    | "emerald"
    | "blue"
    | "purple";
}) {
  const colors = {
    orange:
      "bg-orange-50 text-orange-500 dark:bg-orange-950/40",
    emerald:
      "bg-emerald-50 text-emerald-500 dark:bg-emerald-950/40",
    blue:
      "bg-blue-50 text-blue-500 dark:bg-blue-950/40",
    purple:
      "bg-purple-50 text-purple-500 dark:bg-purple-950/40",
  };

  return (
    <div className="flex items-center justify-between rounded-xl border border-[var(--border)] p-3">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${colors[color]}`}
        >
          {icon}
        </div>

        <span className="text-sm font-medium">
          {label}
        </span>
      </div>

      <span className="font-bold">
        {value}
      </span>
    </div>
  );
}