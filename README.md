# 🍴 CanteenHub

A simple, responsive and modern canteen management application built with Next.js.

CanteenHub helps manage menu items, create customer orders, track order status and monitor daily canteen activity from a clean dashboard.

---

## ✨ Features

### 📊 Dashboard
- Overview of daily orders
- Total sales
- Available menu items
- Pending orders
- Recent orders
- Quick access to menu and orders
- Menu item search

### 🍔 Menu Management
- View all menu items
- Search menu items
- Filter by category
- Add new food items
- Edit existing items
- Delete items
- Enable/disable item availability
- Add items to cart

### 🛒 Cart & Checkout
- Add multiple items
- Increase/decrease quantity
- Remove items
- Automatic total calculation
- Customer name and phone number
- Simple checkout flow

### 📦 Order Management
- View real orders
- Search orders
- Filter by order status
- View complete order details
- Update order status

Order flow:

`Pending → Preparing → Ready → Completed`

### ⚙️ Settings
- Light mode
- Dark mode
- Canteen information
- Admin profile
- Clear local application data

### 📱 Responsive Design
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

1. Clone the repository👇
git clone YOUR_REPOSITORY_URL

2. Enter the project👇
cd canteen-management

3. Install dependencies👇
npm install

4. Start the development server👇
npm run dev

5. Open in browser👇
http://localhost:3000