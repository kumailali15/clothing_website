# SHOP.CO - Full-Stack E-Commerce Web Application

A full-stack recreation of the **SHOP.CO** e-commerce template based on the Figma design. Built with **React.js** (Vite) on the frontend and **Express.js** on the backend using local **JSON files** for persistent storage and management of products, users, reviews, and orders.

---

## ✨ Features Implemented

### 1. 🏠 Homepage
- **Top Announcement Bar**: "Sign up and get 20% off to your first order. Sign Up Now" with dismiss `X` button and registration modal trigger.
- **Header & Navbar**:
  - Bold custom **SHOP.CO** branding
  - Responsive navigation links (Shop dropdown, On Sale, New Arrivals, Brands)
  - **Live Search Bar** with debounced autocomplete results dropdown
  - Shopping Cart icon with real-time badge count
  - User profile modal trigger (Login / Sign up / Logout)
  - Mobile hamburger drawer
- **Hero Section**:
  - Headline: *"FIND CLOTHES THAT MATCHES YOUR STYLE"*
  - Subtext and *"Shop Now"* action button
  - Statistics: **200+** International Brands, **2,000+** High-Quality Products, **30,000+** Happy Customers
  - Fashion models showcase with decorative vector stars
- **Luxury Brands Banner**: VERSACE, ZARA, GUCCI, PRADA, Calvin Klein
- **New Arrivals**: Product cards grid with ratings, prices, and discount badges
- **Top Selling**: Best-selling clothing items grid
- **Browse By Dress Style**: Bento grid for *Casual*, *Formal*, *Party*, and *Gym* wear
- **Our Happy Customers**: Testimonials carousel with star ratings, green verified buyer badges, and quote cards
- **Newsletter Subscription**: Floating newsletter card with instant validation and discount code delivery
- **Footer**: Brand statement, social links, navigation categories, copyright, and payment badges (Visa, Mastercard, PayPal, Apple Pay, Google Pay)

---

### 2. 👗 Category / Shop Page
- **Breadcrumb Navigation**: `Home > Shop > [Category / Dress Style]`
- **Interactive Left Filter Sidebar**:
  - Category list (T-Shirts, Shorts, Shirts, Hoodies, Jeans, Jackets)
  - Price Range Slider ($50 – $400)
  - Color picker swatch palette with active checkmark indicator
  - Size selector pills (XX-Small to 4X-Large)
  - Dress Style filter (Casual, Formal, Party, Gym)
  - "Apply Filter" & "Reset All Filters" buttons
- **Mobile Filter Drawer**: Slide-up modal for mobile screens
- **Sorting Options**: Most Popular, Price: Low to High, Price: High to Low, Highest Rated, Newest
- **Product Grid & Pagination**: Paginated browsing with "Previous" and "Next" controls

---

### 3. 🔍 Product Detail Page
- **Breadcrumbs**: `Home > Shop > Men > T-Shirts > [Product Title]`
- **Interactive Multi-Thumbnail Gallery**: Clickable thumbnails with high-resolution preview
- **Product Overview**:
  - Title, star rating with numeric score (e.g. `4.5/5`)
  - Current price, strikethrough original price, and discount percentage pill
  - Detailed product description
- **Color Selection**: Interactive color circles with checkmark on the selected color
- **Size Selection**: Small, Medium, Large, X-Large pills with active toggle
- **Quantity Modifier & Add to Cart**: Increment (`+`) / Decrement (`-`) buttons, large "Add to Cart" button, and animated toast confirmation
- **Tabbed Information**:
  - **Product Details**: Fabric, specifications, stock count
  - **Rating & Reviews**: Reviews listing, sorting by rating/date, and **"Write a Review"** modal with star rating picker and comment submission
  - **FAQs**: Accordion FAQ questions and answers
- **"YOU MIGHT ALSO LIKE"**: Dynamic related products recommendation grid

---

### 4. 🛒 Cart & Checkout Page
- **Cart Items List**:
  - Product thumbnail, title, selected size, and color
  - Quantity increment/decrement buttons with real-time recalculation
  - Delete item button with confirmation toast
- **Order Summary Card**:
  - Subtotal calculation
  - Dynamic discount application (-20%)
  - Delivery Fee ($15 or Free for orders over $200)
  - Promo code input with instant validation (`SHOP20`, `WELCOME10`, `FREESHIP`)
  - Grand total
- **Checkout Modal Flow**:
  - Step 1: Shipping address (Name, Email, Phone, Street, City, State, Zip, Country)
  - Step 2: Payment method selection (Credit Card, PayPal, Cash on Delivery)
  - Step 3: Order placement saving to backend `orders.json`
  - Step 4: **Order Confirmation Screen** with generated **Order ID**, delivery summary, and receipt

---

### 5. 🔐 User Authentication & Modal
- Sign In & Sign Up tabs
- Form validation (email format, password length, password matching)
- Persisted to backend `backend/data/users.json` and client `localStorage`

---

## 🛠️ Tech Stack & Architecture

```
FullStack Project/
├── backend/
│   ├── data/
│   │   ├── products.json   # Catalog with prices, colors, sizes, images
│   │   ├── reviews.json    # Reviews and ratings
│   │   ├── users.json      # Registered users
│   │   └── orders.json     # Placed orders
│   ├── routes/
│   │   ├── products.js     # Filter, sort, pagination, search
│   │   ├── reviews.js      # Fetch and post reviews
│   │   ├── auth.js         # Register, login
│   │   ├── orders.js       # Order creation and retrieval
│   │   └── coupons.js      # Coupon verification (SHOP20, etc.)
│   ├── utils/
│   │   └── jsonStore.js    # JSON read/write helpers
│   ├── server.js           # Express app on port 5000
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # TopBanner, Navbar, Footer, ProductCard, etc.
│   │   ├── context/        # CartContext, AuthContext
│   │   ├── pages/          # HomePage, CategoryPage, ProductDetailPage, CartPage
│   │   ├── services/       # api.js client
│   │   ├── index.css       # Design tokens & responsive styles
│   │   └── App.jsx         # Router & root layout
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── package.json
```

---

## 🚀 How to Run Locally

### 1. Start the Backend Server
```bash
cd backend
node server.js
```
The backend will run on `http://localhost:5000`.

### 2. Start the Frontend Application
```bash
cd frontend
npm run dev
```
The React frontend will be accessible on `http://localhost:5173`.
