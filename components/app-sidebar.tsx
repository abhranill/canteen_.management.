"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Utensils,
  ShoppingBag,
  Settings,
  Sun,
  Moon,
  Bell,
  Menu,
  X,
  ChefHat,
} from "lucide-react";
import { useEffect, useState } from "react";

const navigation = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Menu",
    href: "/menu",
    icon: Utensils,
  },
  {
    label: "Orders",
    href: "/orders",
    icon: ShoppingBag,
  },
];

export default function AppSidebar() {
  const pathname = usePathname();

  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("canteen-theme");

    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
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

  const closeMobileMenu = () => {
    setMobileMenu(false);
  };

  return (
    <>
      {/* ================= MOBILE HEADER ================= */}
      <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--card)] px-4 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white">
            <ChefHat size={20} />
          </div>

          <span className="font-bold">CanteenHub</span>
        </div>

        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="rounded-lg p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Toggle menu"
        >
          {mobileMenu ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* ================= MOBILE OVERLAY ================= */}
      {mobileMenu && (
        <div
          onClick={closeMobileMenu}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 border-r border-[var(--border)] bg-[var(--card)] p-5 transition-transform duration-300 ${
          mobileMenu ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-white">
            <ChefHat size={24} />
          </div>

          <div>
            <h1 className="font-bold">CanteenHub</h1>

            <p className="text-xs text-[var(--muted)]">
              Management System
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;

            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                <Icon size={19} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="my-6 border-t border-[var(--border)]" />

        {/* Settings */}
        <Link
          href="/settings"
          onClick={closeMobileMenu}
          className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
            pathname.startsWith("/settings")
              ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
              : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          }`}
        >
          <Settings size={19} />
          Settings
        </Link>

        {/* Bottom Card */}
        <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
          <div className="mb-2 h-1 w-10 rounded-full bg-orange-500" />

          <p className="text-sm font-semibold">CanteenHub</p>

          <p className="mt-1 text-xs text-[var(--muted)]">
            Simple. Fast. Delicious.
          </p>
        </div>
      </aside>

      {/* ================= DESKTOP HEADER ================= */}
      <header className="fixed right-0 top-0 z-30 hidden h-16 border-b border-[var(--border)] bg-[var(--card)] lg:left-64 lg:flex">
        <div className="flex w-full items-center justify-between px-8">
          <p className="text-sm text-[var(--muted)]">
            Canteen Management
          </p>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button
              className="rounded-xl p-2.5 transition hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Notifications"
            >
              <Bell size={20} />
            </button>

            {/* Theme */}
            <button
              onClick={toggleTheme}
              className="rounded-xl p-2.5 transition hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
            </button>

            {/* Admin */}
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
        </div>
      </header>

      {/* ================= MOBILE CONTROLS ================= */}
      <div className="fixed left-0 right-0 top-16 z-30 flex h-14 items-center justify-end border-b border-[var(--border)] bg-[var(--card)] px-4 lg:hidden">
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button
            className="rounded-xl p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Notifications"
          >
            <Bell size={19} />
          </button>

          {/* Theme */}
          <button
            onClick={toggleTheme}
            className="rounded-xl p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun size={19} />
            ) : (
              <Moon size={19} />
            )}
          </button>

          {/* Admin */}
          <div className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 font-bold text-white">
            A
          </div>
        </div>
      </div>
    </>
  );
}