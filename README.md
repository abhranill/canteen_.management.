# 🍴 CanteenHub

A simple, responsive and modern canteen management application built with Next.js.

CanteenHub helps manage menu items, create customer orders, track order status and monitor daily canteen activity through a clean and easy-to-use dashboard.

---

## ✨ Features

### 📊 Dashboard
- Daily order overview
- Sales tracking
- Menu item statistics
- Available & unavailable item count
- Pending, preparing and ready order count
- Recent orders with Order ID, date and time
- Today's sales goal progress
- Quick actions
- Menu item search

### 🍔 Menu Management
- View menu items
- Search menu items
- Filter by category
- Add new food items
- Edit menu items
- Delete menu items
- Manage item availability
- Add items to cart

### 🛒 Cart & Checkout
- Add multiple items to cart
- Increase/decrease quantity
- Remove items
- Automatic total calculation
- Customer information
- Simple checkout flow

### 📦 Order Management
- View all orders
- Search orders
- Filter by order status
- View order details
- Update order status
- Unique Order IDs
- Order date and time

Order workflow:

`Pending → Preparing → Ready → Completed`

### ⚙️ Settings
- Light mode
- Dark mode
- Canteen information
- Admin profile
- Clear local application data

### 📱 Responsive Design
Works across:
- Desktop
- Laptop
- Tablet
- Mobile

---

## 🛠️ Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React
- LocalStorage

---

## 📁 Project Structure

```text
canteen-management/
│
├── app/
│   ├── menu/
│   │   └── page.tsx
│   │
│   ├── orders/
│   │   └── page.tsx
│   │
│   ├── settings/
│   │   └── page.tsx
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── lib/
│   └── store.ts
│
├── public/
│
├── package.json
├── README.md
└── tsconfig.json