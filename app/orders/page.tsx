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
  ArrowRight,
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

const statusStyles: Record<OrderStatus, string> = {
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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] =
    useState<"All Orders" | OrderStatus>("All Orders");

  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  /*
   * Load orders
   */
  useEffect(() => {
    const loadOrders = () => {
      setOrders(getOrders());
    };

    loadOrders();

    window.addEventListener(
      "storage",
      loadOrders
    );

    return () => {
      window.removeEventListener(
        "storage",
        loadOrders
      );
    };
  }, []);

  /*
   * Filter orders
   */
  const filteredOrders = orders.filter((order) => {
    const value = search.toLowerCase().trim();

    const matchesSearch =
      order.id.toLowerCase().includes(value) ||
      order.customer
        .toLowerCase()
        .includes(value) ||
      order.phone.includes(value);

    const matchesStatus =
      selectedStatus === "All Orders" ||
      order.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  /*
   * Update status
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
   * Cancel order
   */
  const cancelOrder = (orderId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    updateOrderStatus(
      orderId,
      "Cancelled"
    );
  };

  /*
   * Counts
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

  const cancelledCount = orders.filter(
    (order) => order.status === "Cancelled"
  ).length;

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 pb-10 pt-20 text-[var(--foreground)] sm:px-6 lg:px-8 lg:pb-12 lg:pt-24">

      {/* Header */}
      <section className="mx-auto mb-8 max-w-7xl">

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>
            <p className="mb-1 text-sm font-medium text-orange-500">
              ORDER MANAGEMENT
            </p>

            <h1 className="text-2xl font-bold sm:text-3xl">
              Orders
            </h1>

            <p className="mt-2 text-sm text-[var(--muted)] sm:text-base">
              Track and manage all canteen orders.
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-white">
            <ShoppingBag size={21} />
          </div>

        </div>

      </section>

      {/* Statistics */}
      <section className="mx-auto mb-8 grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-5">

        <OrderStat
          label="Pending"
          value={pendingCount}
          icon={<Clock size={18} />}
        />

        <OrderStat
          label="Preparing"
          value={preparingCount}
          icon={<ChefHat size={18} />}
        />

        <OrderStat
          label="Ready"
          value={readyCount}
          icon={<PackageCheck size={18} />}
        />

        <OrderStat
          label="Completed"
          value={completedCount}
          icon={<CheckCircle2 size={18} />}
        />

        <OrderStat
          label="Cancelled"
          value={cancelledCount}
          icon={<XCircle size={18} />}
        />

      </section>

      {/* Search */}
      <section className="mx-auto mb-6 max-w-7xl">

        <div className="flex max-w-2xl items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3">

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
            placeholder="Search order ID, customer or phone..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-[var(--muted)] hover:text-red-500"
            >
              <X size={17} />
            </button>
          )}

        </div>

      </section>

      {/* Status Filters */}
      <section className="mx-auto mb-8 max-w-7xl">

        <div className="flex flex-wrap gap-2">

          <StatusFilter
            label="All Orders"
            active={selectedStatus === "All Orders"}
            count={orders.length}
            onClick={() =>
              setSelectedStatus("All Orders")
            }
          />

          {statuses.map((status) => {
            const count = orders.filter(
              (order) =>
                order.status === status
            ).length;

            return (
              <StatusFilter
                key={status}
                label={status}
                active={
                  selectedStatus === status
                }
                count={count}
                onClick={() =>
                  setSelectedStatus(status)
                }
              />
            );
          })}

        </div>

      </section>

      {/* Orders */}
      <section className="mx-auto max-w-7xl">

        {filteredOrders.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-12 text-center">

            <ShoppingBag
              size={42}
              className="mx-auto text-[var(--muted)]"
            />

            <h2 className="mt-4 font-bold">
              No orders found
            </h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              Try changing your search or status filter.
            </p>

          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">

            <div className="divide-y divide-[var(--border)]">

              {filteredOrders.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  onView={() =>
                    setSelectedOrder(order)
                  }
                  onStatusChange={
                    updateOrderStatus
                  }
                  onCancel={cancelOrder}
                />
              ))}

            </div>

          </div>
        )}

      </section>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() =>
            setSelectedOrder(null)
          }
          onStatusChange={updateOrderStatus}
        />
      )}

    </main>
  );
}

/* ---------------- STAT ---------------- */

function OrderStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">

      <div className="flex items-center justify-between">

        <p className="text-sm text-[var(--muted)]">
          {label}
        </p>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-950/40">
          {icon}
        </div>

      </div>

      <p className="mt-3 text-2xl font-bold">
        {value}
      </p>

    </div>
  );
}

/* ---------------- FILTER ---------------- */

function StatusFilter({
  label,
  active,
  count,
  onClick,
}: {
  label: string;
  active: boolean;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
        active
          ? "border-orange-500 bg-orange-500 text-white"
          : "border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:border-orange-500 hover:text-orange-500"
      }`}
    >
      {label}

      <span
        className={`rounded-full px-2 py-0.5 text-xs ${
          active
            ? "bg-white/20 text-white"
            : "bg-[var(--background)]"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

/* ---------------- ORDER ROW ---------------- */

function OrderRow({
  order,
  onView,
  onStatusChange,
  onCancel,
}: {
  order: Order;
  onView: () => void;
  onStatusChange: (
    id: string,
    status: OrderStatus
  ) => void;
  onCancel: (id: string) => void;
}) {
  const nextStatus: Partial<
    Record<OrderStatus, OrderStatus>
  > = {
    Pending: "Preparing",
    Preparing: "Ready",
    Ready: "Completed",
  };

  return (
    <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">

      {/* Customer */}
      <div className="flex min-w-0 items-start gap-4">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-950/40">
          <ShoppingBag size={19} />
        </div>

        <div className="min-w-0">

          <div className="flex flex-wrap items-center gap-2">

            <h3 className="font-bold">
              {order.id}
            </h3>

            <StatusBadge
              status={order.status}
            />

          </div>

          <p className="mt-1 flex items-center gap-1 text-sm text-[var(--muted)]">
            <User size={13} />
            {order.customer}
          </p>

          <p className="mt-1 flex items-center gap-1 text-xs text-[var(--muted)]">
            <Phone size={12} />
            {order.phone}
          </p>

          <p className="mt-1 flex items-center gap-1 text-xs text-[var(--muted)]">
            <Clock size={12} />
            {order.date} · {order.time}
          </p>

        </div>

      </div>

      {/* Items + Total */}
      <div className="lg:min-w-56">

        <p className="text-sm font-medium">
          {order.items.length} item
          {order.items.length !== 1
            ? "s"
            : ""}
        </p>

        <p className="mt-1 text-xs text-[var(--muted)]">
          {order.items
            .map(
              (item) =>
                `${item.name} × ${item.quantity}`
            )
            .join(", ")}
        </p>

        <p className="mt-2 font-bold text-orange-500">
          ₹{order.total}
        </p>

      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 lg:justify-end">

        <button
          onClick={onView}
          className="flex items-center gap-2 rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm font-semibold transition hover:border-orange-500 hover:text-orange-500"
        >
          View
          <ArrowRight size={15} />
        </button>

        {nextStatus[order.status] && (
          <button
            onClick={() =>
              onStatusChange(
                order.id,
                nextStatus[order.status]!
              )
            }
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            {nextStatus[order.status]}
          </button>
        )}

        {order.status !== "Completed" &&
          order.status !== "Cancelled" && (
            <button
              onClick={() =>
                onCancel(order.id)
              }
              className="rounded-xl border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30"
            >
              Cancel
            </button>
          )}

      </div>

    </div>
  );
}

/* ---------------- BADGE ---------------- */

function StatusBadge({
  status,
}: {
  status: OrderStatus;
}) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

/* ---------------- DETAILS MODAL ---------------- */

function OrderDetailsModal({
  order,
  onClose,
  onStatusChange,
}: {
  order: Order;
  onClose: () => void;
  onStatusChange: (
    id: string,
    status: OrderStatus
  ) => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] p-5">

          <div>
            <h2 className="text-xl font-bold">
              {order.id}
            </h2>

            <div className="mt-2">
              <StatusBadge
                status={order.status}
              />
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--muted)] transition hover:bg-slate-100 hover:text-red-500 dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>

        </div>

        {/* Customer */}
        <div className="border-b border-[var(--border)] p-5">

          <h3 className="mb-3 text-sm font-semibold">
            Customer Information
          </h3>

          <div className="space-y-2 text-sm">

            <p className="flex items-center gap-2 text-[var(--muted)]">
              <User size={15} />
              {order.customer}
            </p>

            <p className="flex items-center gap-2 text-[var(--muted)]">
              <Phone size={15} />
              {order.phone}
            </p>

            <p className="flex items-center gap-2 text-[var(--muted)]">
              <Clock size={15} />
              {order.date} · {order.time}
            </p>

          </div>

        </div>

        {/* Items */}
        <div className="p-5">

          <h3 className="mb-3 text-sm font-semibold">
            Order Items
          </h3>

          <div className="space-y-3">

            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-[var(--border)] p-3"
              >

                <div>
                  <p className="font-medium">
                    {item.name}
                  </p>

                  <p className="mt-1 text-xs text-[var(--muted)]">
                    ₹{item.price} ×{" "}
                    {item.quantity}
                  </p>
                </div>

                <p className="font-semibold">
                  ₹
                  {item.price *
                    item.quantity}
                </p>

              </div>
            ))}

          </div>

          <div className="mt-5 flex items-center justify-between border-t border-[var(--border)] pt-4">

            <span className="font-semibold">
              Total
            </span>

            <span className="text-xl font-bold text-orange-500">
              ₹{order.total}
            </span>

          </div>

        </div>

        {/* Status controls */}
        {order.status !== "Completed" &&
          order.status !== "Cancelled" && (
            <div className="border-t border-[var(--border)] p-5">

              <p className="mb-3 text-sm font-semibold">
                Update Status
              </p>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">

                {statuses
                  .filter(
                    (status) =>
                      status !== "Cancelled"
                  )
                  .map((status) => (
                    <button
                      key={status}
                      onClick={() =>
                        onStatusChange(
                          order.id,
                          status
                        )
                      }
                      className={`rounded-lg border px-2 py-2 text-xs font-semibold transition ${
                        order.status === status
                          ? "border-orange-500 bg-orange-500 text-white"
                          : "border-[var(--border)] hover:border-orange-500"
                      }`}
                    >
                      {status}
                    </button>
                  ))}

              </div>

            </div>
          )}

      </div>
    </div>
  );
}