🍴 CanteenHub – Smart Canteen Management System

A modern, responsive, and user-friendly Canteen Management System built with Next.js, React, TypeScript, and Tailwind CSS.

CanteenHub is designed to simplify everyday canteen operations by providing a centralized platform for managing food menus, handling customer orders, tracking order progress, monitoring sales, and maintaining canteen information.

The application provides an intuitive dashboard that allows administrators to manage their canteen activities efficiently without relying on manual record-keeping.

-

📌 Table of Contents

- "Overview" (#-overview)
- "Why CanteenHub?" (#-why-canteenhub)
- "Key Features" (#-key-features)
- "Application Modules" (#-application-modules)
- "Order Management Workflow" (#-order-management-workflow)
- "Technology Stack" (#-technology-stack)
- "Project Architecture" (#-project-architecture)
- "Project Structure" (#-project-structure)
- "Getting Started" (#-getting-started)
- "Installation" (#-installation)
- "Running the Application" (#-running-the-application)
- "Data Management" (#-data-management)
- "Responsive Design" (#-responsive-design)
- "Future Improvements" (#-future-improvements)
- "Use Cases" (#-use-cases)
- "Contributing" (#-contributing)
- "License" (#-license)

-

🚀 Overview

CanteenHub is a web-based application developed to digitize and simplify canteen management operations.

Traditional canteen management often involves manually maintaining food menus, recording customer orders, calculating bills, and tracking order statuses.

CanteenHub addresses these challenges through a centralized dashboard where administrators can:

- Monitor daily canteen performance.
- Manage food items and their availability.
- Create and process customer orders.
- Track orders through different preparation stages.
- Calculate order totals automatically.
- Monitor daily sales and order statistics.
- Customize application preferences.

The application focuses on simplicity, accessibility, and efficient management.

-

🎯 Why CanteenHub?

The main objective of CanteenHub is to make canteen operations faster, more organized, and easier to manage.

Problems It Addresses

Traditional Challenges| CanteenHub Solution
Manual order management| Digital order management
Difficulty maintaining menus| Centralized menu management
Manual bill calculation| Automatic price calculation
Difficulty tracking orders| Real-time status management within the application
Manual sales tracking| Dashboard-based sales statistics
Poor organization| Centralized management interface
Limited accessibility| Responsive web application

-

✨ Key Features

1. 📊 Interactive Dashboard

The dashboard provides an overview of important canteen activities.

Dashboard includes:

- Total orders placed today.
- Total sales generated.
- Menu item statistics.
- Available food item count.
- Unavailable food item count.
- Pending orders.
- Preparing orders.
- Ready orders.
- Recent customer orders.
- Today's sales goal progress.
- Quick navigation actions.
- Menu item search.

Benefits:

Administrators can understand the current operational situation of their canteen without navigating through multiple pages.

2. 🍔 Menu Management

The Menu Management module allows administrators to maintain and organize the complete food menu.

Available Operations:

- View all available menu items.
- Search food items by name.
- Filter items by category.
- Add new food items.
- Update existing food item information.
- Delete menu items.
- Change item availability.
- Add food items to the shopping cart.

Each menu item can contain information such as:

- Food name.
- Food category.
- Price.
- Availability status.
- Other item details supported by the application.

Benefits:

Administrators can easily maintain the food catalog and control which items are currently available for ordering.

3. 🛒 Shopping Cart & Checkout

CanteenHub provides a simple cart system for creating customer orders.

Cart Features:

- Add multiple food items.
- Increase item quantities.
- Decrease item quantities.
- Remove items from the cart.
- Calculate item subtotals automatically.
- Calculate the final order total.
- Display selected items before checkout.

Checkout Features:

- Enter customer information.
- Review selected food items.
- Verify quantities and prices.
- Calculate the final payable amount.
- Create a customer order.

Benefits:

The checkout process reduces manual calculations and makes order creation easier.

4. 📦 Order Management

The Order Management module provides centralized control over customer orders.

Features:

- View all customer orders.
- Search orders.
- Filter orders by status.
- View detailed order information.
- Update order status.
- Generate unique Order IDs.
- Display order date and time.

Order Information:

An order can contain:

- Unique Order ID.
- Customer information.
- Ordered food items.
- Item quantities.
- Individual item prices.
- Total order amount.
- Current order status.
- Order creation date and time.

5. 🔄 Order Status Tracking

CanteenHub follows a structured order-processing workflow.

"Pending → Preparing → Ready → Completed"

Status Explanation:

Status| Description
Pending| The order has been created and is waiting for processing.
Preparing| The canteen staff is preparing the food.
Ready| The order is prepared and ready for collection.
Completed| The customer has collected the order and the process is finished.

This workflow helps administrators organize order processing and understand which orders require attention.

6. ⚙️ Application Settings

The Settings module allows administrators to customize the application.

Available Settings:

- Switch between light and dark themes.
- Manage canteen information.
- Manage admin profile information.
- Clear locally stored application data.

Benefits:

The settings module provides a centralized place for managing application preferences and basic administrative information.

7. 📱 Responsive User Interface

CanteenHub is designed to work across different screen sizes.

Supported devices:

- Desktop computers.
- Laptops.
- Tablets.
- Smartphones.

The responsive interface ensures that important management operations remain accessible across devices.

-------

🧩 Application Modules

CanteenHub is organized into the following major modules:

Module| Responsibility
Dashboard| Displays canteen statistics and recent activity.
Menu| Manages food items and their availability.
Cart| Handles selected items and quantities.
Checkout| Collects customer information and creates orders.
Orders| Manages customer orders and their statuses.
Settings| Controls application preferences and canteen information.

-------

🔄 Order Management Workflow

The application follows a simple order-processing lifecycle.

       Customer
           |
           v
    Select Food Items
           |
           v
       Add to Cart
           |
           v
        Checkout
           |
           v
     Create Order
           |
           v
        PENDING
           |
           v
       PREPARING
           |
           v
          READY
           |
           v
       COMPLETED

Workflow Explanation

1. The customer selects food items from the available menu.
2. Selected items are added to the cart.
3. Quantities can be modified before checkout.
4. The application calculates the total amount.
5. Customer information is entered.
6. A new order is generated with a unique Order ID.
7. The administrator processes the order.
8. The order status is updated as preparation progresses.
9. Once collected, the order is marked as completed.

---

🛠️ Technology Stack

CanteenHub uses modern web development technologies to provide a responsive and maintainable application.

Technology| Purpose
Next.js| React-based application framework and routing.
React.js| Component-based user interface development.
TypeScript| Static typing and improved code reliability.
Tailwind CSS| Responsive styling and UI development.
Lucide React| Modern icons and interface elements.
LocalStorage| Persistent client-side application data.

Technology Details

Next.js

Used as the main application framework for building the web application and organizing pages through its App Router.

React.js

Used to develop reusable UI components and manage interactive application interfaces.

TypeScript

Provides static type checking, better code organization, and improved development experience.

Tailwind CSS

Used to create a modern, responsive, and consistent interface without writing extensive custom CSS.

Lucide React

Provides clean and lightweight icons for dashboard cards, navigation, buttons, and other UI components.

LocalStorage

Used to store application information locally in the browser so that supported data can persist between page reloads.

---

📁 Project Architecture

CanteenHub follows a modular frontend architecture.

Architecture Overview

             CanteenHub
                  |
          Next.js Application
                  |
          React Components
                  |
       -----------------------
       |          |          |
    Dashboard   Menu      Orders
       |          |          |
       |        Cart     Status Update
       |          |
       |       Checkout
       |          |
       -----------------------
                  |
             lib/store.ts
                  |
              LocalStorage
                  |
           Browser Storage

The application separates page-level functionality from its shared data management logic.

The "lib/store.ts" module acts as the central location for application data operations.

---

📂 Project Structure

canteen-management/
│
├── app/
│   │
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
│   │
│   ├── layout.tsx
│   │
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

Directory Explanation

"app/"

Contains the application's pages and global layout.

- "page.tsx" – Main dashboard.
- "menu/page.tsx" – Menu management interface.
- "orders/page.tsx" – Order management interface.
- "settings/page.tsx" – Application settings.
- "layout.tsx" – Root layout and shared application structure.
- "globals.css" – Global styles.

"lib/"

Contains shared application logic.

- "store.ts" – Centralized data management and LocalStorage operations.

"public/"

Stores static assets such as images, logos, and other public resources.

---

⚡ Getting Started

Follow these instructions to run CanteenHub on your local machine.

Prerequisites

Make sure you have the following installed:

- Node.js (LTS version recommended).
- npm, yarn, pnpm, or bun.
- Git.
- A modern web browser.
- Visual Studio Code (recommended).

---

📥 Installation

Step 1: Clone the Repository

git clone https://github.com/YOUR_USERNAME/canteen-management.git

Step 2: Navigate to the Project Directory

cd canteen-management

Step 3: Install Dependencies

Using npm:

npm install

Alternatively, using pnpm:

pnpm install

Step 4: Start the Development Server

npm run dev

Step 5: Open the Application

Visit:

http://localhost:3000

The CanteenHub application should now be running locally.

---

📜 Available Scripts

The following are typical Next.js scripts. Their availability depends on your "package.json" configuration.

Command| Description
"npm run dev"| Starts the development server.
"npm run build"| Creates an optimized production build.
"npm run start"| Starts the production server.
"npm run lint"| Runs linting if configured.

---

💾 Data Management

CanteenHub currently uses browser LocalStorage for client-side data persistence.

How It Works

- Application data is stored in the browser.
- Data can remain available after refreshing the page.
- Shared store logic helps different modules access application data.
- Clearing application data removes the locally stored information.

Important Limitations

Since the current application uses LocalStorage:

- Data is generally limited to the browser and device where it was created.
- Data is not automatically synchronized between multiple devices.
- Clearing browser storage can result in data loss.
- LocalStorage is not a replacement for a secure database.
- The current storage architecture is not intended for multi-user production deployment.

A backend and database integration would be required for centralized, multi-user data management.

---

📱 Responsive Design

CanteenHub is designed with a responsive-first approach.

The interface adapts to different screen sizes to provide a consistent user experience.

Desktop:

- Expanded dashboard layout.
- Better visibility of statistics.
- Convenient management of menus and orders.

Tablet:

- Adaptable layouts.
- Optimized content spacing.
- Accessible navigation.

Mobile:

- Compact interface.
- Mobile-friendly navigation.
- Responsive cards and layouts.
- Accessible management features.

---

🔮 Future Improvements

CanteenHub currently provides the foundation for a digital canteen management system.

The following features can be introduced in future versions.

Backend & Database Integration

- Node.js and Express.js backend.
- MongoDB or PostgreSQL database.
- REST API integration.
- Centralized data synchronization.

Authentication & Authorization

- Admin login.
- Staff accounts.
- Customer accounts.
- Role-based access control.
- Secure authentication.

Advanced Order Management

- Customer order tracking.
- Order notifications.
- Order cancellation.
- Order history.
- Estimated preparation time.

Payment Integration

- UPI payments.
- QR code payments.
- Online payment gateway.
- Digital receipts.

Advanced Analytics

- Weekly and monthly sales reports.
- Best-selling food items.
- Revenue analytics.
- Order trends.
- Inventory reports.

Inventory Management

- Ingredient tracking.
- Stock availability.
- Low-stock notifications.
- Automatic availability updates.

Additional Features

- Customer-facing ordering interface.
- QR code-based menu access.
- Printable bills.
- Export reports to PDF and Excel.
- Multi-canteen support.

---

🎯 Use Cases

CanteenHub can be useful in different environments, including:

- School canteens.
- College canteens.
- University food courts.
- Office cafeterias.
- Hostel dining facilities.
- Small restaurants and food counters.

The application is particularly suitable for small canteens that want to move from manual order management to a simple digital system.

---

🤝 Contributing

Contributions, suggestions, and improvements are welcome.

If you would like to contribute:

1. Fork the repository.
2. Create a new feature branch.
3. Make your changes.
4. Commit your changes.
5. Push the branch.
6. Open a Pull Request.

Example:

git checkout -b feature/new-feature

git add .

git commit -m "Add new feature"

git push origin feature/new-feature

---

🔒 Security & Privacy

CanteenHub currently uses client-side browser storage.

It should be treated as a frontend-focused project rather than a production-ready secure multi-user platform.

For production deployment, consider implementing:

- Server-side authentication.
- Secure database storage.
- Input validation.
- API authorization.
- Data backup and recovery.
- Proper access control.

---

📄 License

This project can be distributed under the MIT License.

If you choose the MIT License, include a "LICENSE" file in the repository containing the complete license text.

---

👨‍💻 Developer

Abhranil Roy

B.Tech – Computer Science & Engineering

Interested in Software Development, Artificial Intelligence, Machine Learning, and Full-Stack Development.

---

⭐ Support

If you find CanteenHub interesting or useful, consider giving the repository a ⭐ on GitHub.

Your support and feedback are appreciated!

---

CanteenHub – Making Canteen Management Smarter, Simpler, and More Efficient. 🍴
