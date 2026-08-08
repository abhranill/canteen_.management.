"use client";

import {
  Search,
  ShoppingBag,
  Clock3,
  CheckCircle2,
  CircleX,
  ChefHat,
  MoreHorizontal,
} from "lucide-react";
import { useState } from "react";

type OrderStatus =
  | "Pending"
  | "Preparing"
  | "Ready"
  | "Completed"
  | "Cancelled";

type Order = {
  id: string;
  customer: string;
  items: string;
  amount: number;
  time: string;
  status: OrderStatus;
};

const orders: Order[] = [
  {
    id: "#ORD-1024",
    customer: "Rahul Sharma",
    items: "Classic Burger × 2",
    amount: 120,
    time: "10:42 AM",
    status: "Completed",
  },
  {
    id: "#ORD-1023",
    customer: "Priya Das",
    items: "Chicken Roll × 1, Tea × 1",
    amount: 85,
    time: "10:35 AM",
    status: "Ready",
  },
  {
    id: "#ORD-1022",
    customer: "Arjun Roy",
    items: "Veg Thali × 1",
    amount: 90,
    time: "10:28 AM",
    status: "Preparing",
  },
  {
    id: "#ORD-1021",
    customer: "Sneha Paul",
    items: "Cold Coffee × 2",
    amount: 100,
    time: "10:20 AM",
    status: "Pending",
  },
  {
    id: "#ORD-1020",
    customer: "Amit Ghosh",
    items: "Classic Burger × 1",
    amount: 60,
    time: "10:12 AM",
    status: "Completed",
  },
  {
    id: "#ORD-1019",
    customer: "Riya Sen",
    items: "Fresh Salad × 1",
    amount: 50,
    time: "10:05 AM",
    status: "Cancelled",
  },
];

const filters = [
  "All",
  "Pending",
  "Preparing",
  "Ready",
  "Completed",
  "Cancelled",
];

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.items.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      activeFilter === "All" ||
      order.status === activeFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <main className="min-h-screen bg-[var(--background)] p-4 text-[var(--foreground)] sm:p-6 lg:p-8">
      {/* Header */}
      <section className="mb-8">
        <p className="mb-1 text-sm font-medium text-orange-500">
          ORDER MANAGEMENT
        </p>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Orders
            </h1>

            <p className="mt-2 text-sm text-[var(--muted)]">
              Track and manage today's canteen orders.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3">
            <ShoppingBag
              size={18}
              className="text-orange-500"
            />

            <span className="text-sm font-semibold">
              {orders.length} Total Orders
            </span>
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
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search orders, customers or items..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {filters.map((filter) => {
          const active = activeFilter === filter;

          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                  : "border border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  Order
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  Customer
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  Items
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  Amount
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  Time
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  Status
                </th>

                <th className="px-6 py-4" />
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 md:hidden">
        {filteredOrders.map((order) => (
          <MobileOrderCard
            key={order.id}
            order={order}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)]">
          <ShoppingBag
            size={40}
            className="mb-3 text-[var(--muted)]"
          />

          <h2 className="font-semibold">
            No orders found
          </h2>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Try changing your search or filter.
          </p>
        </div>
      )}
    </main>
  );
}

function OrderRow({
  order,
}: {
  order: Order;
}) {
  return (
    <tr className="border-b border-[var(--border)] last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/40">
      <td className="px-6 py-5">
        <p className="font-semibold">
          {order.id}
        </p>
      </td>

      <td className="px-6 py-5">
        <p className="font-medium">
          {order.customer}
        </p>
      </td>

      <td className="max-w-xs px-6 py-5">
        <p className="truncate text-sm text-[var(--muted)]">
          {order.items}
        </p>
      </td>

      <td className="px-6 py-5">
        <p className="font-bold">
          ₹{order.amount}
        </p>
      </td>

      <td className="px-6 py-5">
        <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
          <Clock3 size={15} />
          {order.time}
        </div>
      </td>

      <td className="px-6 py-5">
        <StatusBadge status={order.status} />
      </td>

      <td className="px-6 py-5">
        <button
          className="rounded-lg p-2 text-[var(--muted)] hover:bg-slate-100 hover:text-[var(--foreground)] dark:hover:bg-slate-800"
          aria-label="Order options"
        >
          <MoreHorizontal size={19} />
        </button>
      </td>
    </tr>
  );
}

function MobileOrderCard({
  order,
}: {
  order: Order;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="font-bold">
            {order.id}
          </p>

          <p className="mt-1 text-sm text-[var(--muted)]">
            {order.customer}
          </p>
        </div>

        <StatusBadge status={order.status} />
      </div>

      <div className="mb-4 flex items-start gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
        <ChefHat
          size={18}
          className="mt-0.5 shrink-0 text-orange-500"
        />

        <p className="text-sm text-[var(--muted)]">
          {order.items}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
        <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
          <Clock3 size={15} />
          {order.time}
        </div>

        <p className="font-bold text-orange-500">
          ₹{order.amount}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: OrderStatus;
}) {
  const config = {
    Pending: {
      className:
        "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
      icon: Clock3,
    },

    Preparing: {
      className:
        "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",
      icon: ChefHat,
    },

    Ready: {
      className:
        "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400",
      icon: ShoppingBag,
    },

    Completed: {
      className:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
      icon: CheckCircle2,
    },

    Cancelled: {
      className:
        "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400",
      icon: CircleX,
    },
  };

  const current = config[status];
  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${current.className}`}
    >
      <Icon size={13} />
      {status}
    </span>
  );
}