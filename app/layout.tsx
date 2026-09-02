import type { Metadata } from "next";
import "./globals.css";
import AppSidebar from "@/components/app-sidebar";

export const metadata: Metadata = {
  title: "CanteenHub",
  description: "Canteen Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen overflow-x-hidden">
        <AppSidebar />

        <main className="min-h-screen lg:ml-64">
          {children}
        </main>
      </body>
    </html>
  );
}