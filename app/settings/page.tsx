"use client";

import {
  Settings as SettingsIcon,
  Palette,
  Store,
  UserRound,
  Database,
  Trash2,
  Sun,
  Moon,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setDarkMode(
      document.documentElement.classList.contains("dark")
    );
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

  const clearData = () => {
    const confirmed = window.confirm(
      "This will remove saved menu data and application settings. Continue?"
    );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem("canteen-menu-items");
    localStorage.removeItem("canteen-theme");

    window.location.reload();
  };

  return (
    <main className="min-h-screen bg-[var(--background)] p-4 text-[var(--foreground)] sm:p-6 lg:p-8">
      {/* Header */}
      <section className="mb-8">
        <p className="mb-1 text-sm font-medium text-orange-500">
          APPLICATION
        </p>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-white">
            <SettingsIcon size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Settings
            </h1>

            <p className="mt-1 text-sm text-[var(--muted)]">
              Manage your canteen application preferences.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl space-y-6">
        {/* Appearance */}
        <SettingsSection
          icon={<Palette size={20} />}
          title="Appearance"
          description="Customize how CanteenHub looks."
        >
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="font-medium">
                Theme
              </p>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Choose between light and dark mode.
              </p>
            </div>

            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-medium transition hover:border-orange-500"
            >
              {darkMode ? (
                <Moon
                  size={18}
                  className="text-orange-500"
                />
              ) : (
                <Sun
                  size={18}
                  className="text-orange-500"
                />
              )}

              {darkMode
                ? "Dark Mode"
                : "Light Mode"}
            </button>
          </div>
        </SettingsSection>

        {/* Canteen Information */}
        <SettingsSection
          icon={<Store size={20} />}
          title="Canteen Information"
          description="Basic information about your canteen."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <InputField
              label="Canteen Name"
              defaultValue="CanteenHub"
            />

            <InputField
              label="Contact"
              defaultValue="+91 00000 00000"
            />

            <InputField
              label="Opening Time"
              defaultValue="08:00 AM"
            />

            <InputField
              label="Closing Time"
              defaultValue="06:00 PM"
            />
          </div>

          <button className="mt-5 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">
            Save Information
          </button>
        </SettingsSection>

        {/* Admin */}
        <SettingsSection
          icon={<UserRound size={20} />}
          title="Admin Profile"
          description="Information about the current administrator."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <InputField
              label="Name"
              defaultValue="Admin"
            />

            <InputField
              label="Role"
              defaultValue="Manager"
            />
          </div>
        </SettingsSection>

        {/* Data */}
        <SettingsSection
          icon={<Database size={20} />}
          title="Application Data"
          description="Manage locally stored application data."
        >
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="font-medium">
                Clear Local Data
              </p>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Remove saved menu items and application
                preferences from this browser.
              </p>
            </div>

            <button
              onClick={clearData}
              className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30"
            >
              <Trash2 size={17} />
              Clear Data
            </button>
          </div>
        </SettingsSection>
      </div>
    </main>
  );
}

function SettingsSection({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-950/40">
          {icon}
        </div>

        <div>
          <h2 className="font-bold">
            {title}
          </h2>

          <p className="mt-1 text-sm text-[var(--muted)]">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

function InputField({
  label,
  defaultValue,
}: {
  label: string;
  defaultValue: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        {label}
      </label>

      <input
        type="text"
        defaultValue={defaultValue}
        className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-orange-500"
      />
    </div>
  );
}