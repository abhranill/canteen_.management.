"use client";

import {
  Search,
  ShoppingBag,
  Clock,
  CheckCircle2,
  ChefHat,
  PackageCheck,
  XCircle,
  Phone,
  User,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";

import {
  Order,
  OrderStatus,
  getOrders,
  saveOrders,
} from "@/lib/store";

const statuses: OrderStatus[] = [
  "Pending",
  "Preparing",
  "Ready",
  "Completed",
  "Cancelled",
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] =
    useState("All Orders");

  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  /*
   * Load orders
   */
  useEffect(() => {
    setOrders(getOrders());
  }, []);

  /*
   * Filter orders
   */
  const filteredOrders = orders.filter((order) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      order.id.toLowerCase().includes(searchValue) ||
      order.customer.toLowerCase().includes(searchValue) ||
      order.phone.includes(searchValue);

    const matchesStatus =
      selectedStatus === "All Orders" ||
      order.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  /*
   * Update order status
   */
  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus
  ) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId
        ? {
            ...order,
            status,
          }
        : order
    );

    setOrders(updatedOrders);
    saveOrders(updatedOrders);

    if (selectedOrder?.id === orderId) {
      setSelectedOrder({
        ...selectedOrder,
        status,
      });
    }
  };

  /*
   * Status counts
   */
  const pendingCount = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const preparingCount = orders.filter(
    (order) => order.status === "Preparing"
  ).length;

  const readyCount = orders.filter(
    (order) => order.status === "Ready"
  ).length;

  const completedCount = orders.filter(
    (order) => order.status === "Completed"
  ).length;

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
              Track and manage your canteen orders.
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-white">
            <ShoppingBag size={21} />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <OrderStat
          title="Pending"
          value={pendingCount}
          icon={<Clock size={19} />}
          color="orange"
        />

        <OrderStat
          title="Preparing"
          value={preparingCount}
          icon={<ChefHat size={19} />}
          color="blue"
        />

        <OrderStat
          title="Ready"
          value={readyCount}
          icon={<PackageCheck size={19} />}
          color="emerald"
        />

        <OrderStat
          title="Completed"
          value={completedCount}
          icon={<CheckCircle2 size={19} />}
          color="purple"
        />
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
          placeholder="Search order, customer or phone..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {["All Orders", ...statuses].map(
          (status) => {
            const active =
              selectedStatus === status;

            return (
              <button
                key={status}
                onClick={() =>
                  setSelectedStatus(status)
                }
                className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                    : "border border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {status}
              </button>
            );
          }
        )}
      </div>

      {/* Orders */}
      {filteredOrders.length > 0 ? (
        <div className="grid gap-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onView={() =>
                setSelectedOrder(order)
              }
              onStatusChange={
                updateOrderStatus
              }
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)]">
          <ShoppingBag
            size={42}
            className="mb-4 text-[var(--muted)]"
          />

          <h2 className="font-semibold">
            No orders found
          </h2>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Orders placed from the menu will appear
            here.
          </p>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={updateOrderStatus}
        />
      )}
    </main>
  );
}

/*
 * Order Card
 */
function OrderCard({
  order,
  onView,
  onStatusChange,
}: {
  order: Order;
  onView: () => void;
  onStatusChange: (
    orderId: string,
    status: OrderStatus
  ) => void;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:shadow-lg">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Customer */}
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-950/40">
            <ShoppingBag size={20} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold">
                {order.id}
              </h3>

              <StatusBadge status={order.status} />
            </div>

            <p className="mt-1 font-medium">
              {order.customer}
            </p>

            <div className="mt-1 flex flex-wrap gap-3 text-xs text-[var(--muted)]">
              <span className="flex items-center gap-1">
                <Phone size={13} />
                {order.phone}
              </span>

              <span className="flex items-center gap-1">
                <Clock size={13} />
                {order.time}
              </span>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="lg:max-w-md lg:flex-1">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Items
          </p>

          <div className="flex flex-wrap gap-2">
            {order.items.map((item) => (
              <span
                key={item.id}
                className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium dark:bg-slate-800"
              >
                {item.name} × {item.quantity}
              </span>
            ))}
          </div>
        </div>

        {/* Total + Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
          <div className="text-left sm:text-right">
            <p className="text-xs text-[var(--muted)]">
              Total
            </p>

            <p className="text-xl font-bold text-orange-500">
              ₹{order.total}
            </p>
          </div>

          <div className="flex gap-2">
            {order.status !== "Completed" &&
              order.status !== "Cancelled" && (
                <button
                  onClick={() =>
                    moveToNextStatus(
                      order,
                      onStatusChange
                    )
                  }
                  className="rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-semibold text-white hover:bg-orange-600"
                >
                  Next Status
                </button>
              )}

            <button
              onClick={onView}
              className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-xs font-semibold hover:border-orange-500 hover:text-orange-500"
            >
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
 * Status Badge
 */
function StatusBadge({
  status,
}: {
  status: OrderStatus;
}) {
  const styles: Record<
    OrderStatus,
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
 * Order Details
 */
function OrderDetails({
  order,
  onClose,
  onStatusChange,
}: {
  order: Order;
  onClose: () => void;
  onStatusChange: (
    orderId: string,
    status: OrderStatus
  ) => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] p-5">
          <div>
            <p className="text-xs font-medium text-orange-500">
              ORDER DETAILS
            </p>

            <h2 className="mt-1 text-lg font-bold">
              {order.id}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--muted)] hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={19} />
          </button>
        </div>

        <div className="space-y-6 p-5">
          {/* Customer */}
          <div className="rounded-xl border border-[var(--border)] p-4">
            <div className="mb-3 flex items-center gap-2">
              <User
                size={17}
                className="text-orange-500"
              />

              <h3 className="font-semibold">
                Customer
              </h3>
            </div>

            <p className="font-medium">
              {order.customer}
            </p>

            <p className="mt-1 text-sm text-[var(--muted)]">
              {order.phone}
            </p>
          </div>

          {/* Items */}
          <div>
            <h3 className="mb-3 font-semibold">
              Ordered Items
            </h3>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-[var(--muted)]">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>

                  <p className="font-semibold text-orange-500">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
            <span className="font-semibold">
              Total
            </span>

            <span className="text-xl font-bold text-orange-500">
              ₹{order.total}
            </span>
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Order Status
            </label>

            <select
              value={order.status}
              onChange={(event) =>
                onStatusChange(
                  order.id,
                  event.target.value as OrderStatus
                )
              }
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm outline-none focus:border-orange-500"
            >
              {statuses.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
 * Order Stat
 */
function OrderStat({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "orange" | "blue" | "emerald" | "purple";
}) {
  const colors = {
    orange:
      "bg-orange-50 text-orange-500 dark:bg-orange-950/40",
    blue:
      "bg-blue-50 text-blue-500 dark:bg-blue-950/40",
    emerald:
      "bg-emerald-50 text-emerald-500 dark:bg-emerald-950/40",
    purple:
      "bg-purple-50 text-purple-500 dark:bg-purple-950/40",
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
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
    </div>
  );
}

/*
 * Move order to next status
 */
function moveToNextStatus(
  order: Order,
  onStatusChange: (
    orderId: string,
    status: OrderStatus
  ) => void
) {
  const flow: OrderStatus[] = [
    "Pending",
    "Preparing",
    "Ready",
    "Completed",
  ];

  const currentIndex = flow.indexOf(
    order.status
  );

  if (
    currentIndex === -1 ||
    currentIndex >= flow.length - 1
  ) {
    return;
  }

  onStatusChange(
    order.id,
    flow[currentIndex + 1]
  );
}