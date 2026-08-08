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
      <body>
        <AppSidebar />

        <div className="lg:ml-64 pt-16">
          {children}
        </div>
      </body>
    </html>
  );
}