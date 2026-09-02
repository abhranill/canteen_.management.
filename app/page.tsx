"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Utensils,
  ShoppingBag,
  Settings,
  Sun,
  Moon,
  Bell,
  Search,
  Menu,
  X,
  ChefHat,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  getMenuItems,
  getOrders,
  MenuItem,
  Order,
} from "@/lib/store";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setDarkMode(
      document.documentElement.classList.contains("dark")
    );

    setMenuItems(getMenuItems());
    setOrders(getOrders());
  }, []);

  const toggleTheme = () => {
    const newTheme = !darkMode;

    setDarkMode(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("canteen-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("canteen-theme", "light");
    }
  };

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

  const popularItems = menuItems
    .filter((item) => item.available)
    .map((item) => {
      const orderCount = orders.reduce(
        (count, order) => {
          const itemInOrder = order.items.find(
            (orderItem) => orderItem.id === item.id
          );

          return (
            count + (itemInOrder?.quantity ?? 0)
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

  const filteredPopularItems = popularItems.filter(
    (item) =>
      item.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.category
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors">

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--card)] px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white">
            <ChefHat size={20} />
          </div>

          <span className="font-bold">
            CanteenHub
          </span>
        </div>

        <button
          onClick={() =>
            setMobileMenu(!mobileMenu)
          }
          className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Toggle menu"
        >
          {mobileMenu ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>
      </header>

      {/* Mobile Overlay */}
      {mobileMenu && (
        <div
          onClick={() => setMobileMenu(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 border-r border-[var(--border)] bg-[var(--card)] p-5 transition-transform duration-300 lg:translate-x-0 ${
          mobileMenu
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-white">
            <ChefHat size={24} />
          </div>

          <div>
            <h1 className="font-bold">
              CanteenHub
            </h1>

            <p className="text-xs text-[var(--muted)]">
              Management System
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <NavItem
            icon={<LayoutDashboard size={19} />}
            label="Dashboard"
            href="/"
            active
            onClick={() => setMobileMenu(false)}
          />

          <NavItem
            icon={<Utensils size={19} />}
            label="Menu"
            href="/menu"
            onClick={() => setMobileMenu(false)}
          />

          <NavItem
            icon={<ShoppingBag size={19} />}
            label="Orders"
            href="/orders"
            onClick={() => setMobileMenu(false)}
          />
        </nav>

        <div className="my-6 border-t border-[var(--border)]" />

        <NavItem
          icon={<Settings size={19} />}
          label="Settings"
          href="/settings"
          onClick={() => setMobileMenu(false)}
        />

        {/* Bottom Card */}
        <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
          <div className="mb-2 h-1 w-10 rounded-full bg-orange-500" />

          <p className="text-sm font-semibold">
            CanteenHub
          </p>

          <p className="mt-1 text-xs text-[var(--muted)]">
            Simple. Fast. Delicious.
          </p>
        </div>
      </aside>

      {/* Main Area */}
      <div className="lg:ml-64">

        {/* Desktop Header */}
        <header className="hidden h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--card)] px-8 lg:flex">
          <p className="text-sm text-[var(--muted)]">
            Canteen Management
          </p>

          <div className="flex items-center gap-3">
            <button
              className="rounded-xl p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Notifications"
            >
              <Bell size={20} />
            </button>

            <button
              onClick={toggleTheme}
              className="rounded-xl p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
            </button>

            <div className="ml-2 flex items-center gap-3 border-l border-[var(--border)] pl-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 font-bold text-white">
                A
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Admin
                </p>

                <p className="text-xs text-[var(--muted)]">
                  Manager
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Controls */}
        <div className="flex items-center justify-end border-b border-[var(--border)] bg-[var(--card)] px-4 py-3 lg:hidden">
          <div className="flex items-center gap-2">
            <button
              className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Notifications"
            >
              <Bell size={19} />
            </button>

            <button
              onClick={toggleTheme}
              className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <Sun size={19} />
              ) : (
                <Moon size={19} />
              )}
            </button>

            <div className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 font-bold text-white">
              A
            </div>
          </div>
        </div>

        {/* Dashboard */}
        <main className="p-4 sm:p-6 lg:p-8">

          {/* Welcome */}
          <section className="mb-8">
            <p className="mb-1 text-sm font-medium text-orange-500">
              TODAY
            </p>

            <h2 className="text-2xl font-bold sm:text-3xl">
              Good morning, Admin
            </h2>

            <p className="mt-2 text-[var(--muted)]">
              Here's what's happening in your
              canteen today.
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
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search menu items..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          {/* Stats */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Today's Orders"
              value={totalOrders.toString()}
              change="Today's orders"
              icon="🛍️"
            />

            <StatCard
              title="Today's Sales"
              value={`₹${totalSales.toLocaleString("en-IN")}`}
              change="Completed sales"
              icon="💰"
            />

            <StatCard
              title="Menu Items"
              value={availableItems.toString()}
              change={`${menuItems.length} total items`}
              icon="🍔"
            />

            <StatCard
              title="Pending Orders"
              value={pendingOrders.toString()}
              change={
                pendingOrders > 0
                  ? "Needs attention"
                  : "All caught up"
              }
              icon="⏳"
            />
          </section>

          {/* Popular Items */}
          <section className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">
                  Popular Today
                </h3>

                <p className="text-sm text-[var(--muted)]">
                  Your most ordered food items
                </p>
              </div>

              <Link
                href="/menu"
                className="text-sm font-semibold text-orange-500 hover:text-orange-600"
              >
                View menu →
              </Link>
            </div>

            {filteredPopularItems.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredPopularItems.map(
                  (item) => (
                    <FoodCard
                      key={item.id}
                      emoji="🍴"
                      name={item.name}
                      category={item.category}
                      price={`₹${item.price}`}
                      orders={`${item.orderCount} orders`}
                    />
                  )
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
                <p className="font-semibold">
                  No items found
                </p>

                <p className="mt-1 text-sm text-[var(--muted)]">
                  Try another search or add menu
                  items.
                </p>
              </div>
            )}
          </section>

        </main>
      </div>
    </div>
  );
}

function NavItem({
  icon,
  label,
  href,
  active = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
        active
          ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
          : "text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800"
      }`}
    >
      {icon}
      {label}
    </Link>
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
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-[var(--muted)]">
          {title}
        </p>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-lg dark:bg-orange-950/40">
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
  emoji,
  name,
  category,
  price,
  orders,
}: {
  emoji: string;
  name: string;
  category: string;
  price: string;
  orders: string;
}) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex h-32 items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 text-6xl dark:from-orange-950/40 dark:to-amber-950/30">
        {emoji}
      </div>

      <div className="p-5">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div>
            <h4 className="font-bold">
              {name}
            </h4>

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