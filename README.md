# Vinayaka Chikkis - Artisanal MERN E-Commerce Platform

A high-converting, responsive, and artisanal e-commerce web application for **Vinayaka Chikkis**, a traditional homemade snack brand specializing in authentic jaggery-based sweets, handcrafted in Godavari brass kadhais.

---

## 🎨 Artisanal Jaggery & Gold Design System

- **Primary Color (`#D97706`)**: Deep Jaggery Amber — Used for high-converting CTAs, buy buttons, active selections, and interactive states.
- **Secondary Color (`#B45309`)**: Warm Caramel — Used for badges, price savings indicators, and secondary highlights.
- **Text (`#291D17`)**: Deep Espresso Brown — Used for typography, high-contrast headings, and body copy.
- **Backgrounds (`#FEF9F3`)**: Creamy Oat — Soft, natural background paired with pure white cards (`#FFFFFF`) for visual clarity.
- **Typography**: `Poppins` (Headings) + `Inter` (Body sans-serif).
- **Aesthetic Elements**: Soft shadows (`shadow-soft`, `shadow-elevated`), `rounded-2xl` corners, smooth micro-interactions, and festive confetti feedback.

---

## 🌟 Key Features

### 1. 🛒 Product Catalog with Dynamic Weight Customization
- **Featured Traditional Snacks**: Homemade Peanut Chikki (Kadalai Mittai), Sesame Chikki (Til Patti), Dry Fruit Royal Crunch, Coconut Jaggery Delight, Crushed Peanut Laddu Bites, Roasted Flaxseed Energy Bar, and Festive Hampers.
- **Dynamic Weight Selector**: Users can toggle between **250g, 500g, 1kg, and Family Packs** directly on each card or in the quick-view modal. The price, original MRP, and savings badge ("Save ₹60", "Save ₹141") recalculate instantly in real-time.
- **Trust Badges on Every Product**: "100% Vegetarian", "High Protein", "Rich in Iron", "No Refined Sugar", "Zero Preservatives".
- **Product Detail Modal**: Complete nutritional values chart (Energy, Protein, Iron, Calcium, Added Sugar), ingredients breakdown, traditional recipe backstory, shelf life (90 days), and verified reviews.

### 2. 💬 Direct WhatsApp Checkout Integration
- Slide-out Cart Drawer with weight switcher, quantity controls, and coupon discounts (`VINAYAKA10`, `SWEETDEAL`, `FESTIVE20`).
- Free Delivery Progress Meter (Free Shipping above ₹499).
- Delivery Address & Customer Contact collector.
- **Automatic Formatted WhatsApp Message**: Generates an itemized text message with Order ID, customer details, ordered items with selected weights and quantities, subtotal, discounts, and final total.
- Automatically launches `wa.me/919876543210` with the pre-filled message.
- Order Placed confirmation modal with celebratory confetti, message copy fallback, and direct seller chat re-trigger.

### 3. 👤 User Authentication & Profile Dashboard
- JWT-based authentication with bcrypt password hashing.
- **⚡ 1-Click Demo Login** (`demo@vinayakachikkis.com` / `password123`) for evaluation.
- **Saved Address Book**: Add, edit, delete, and set default delivery addresses.
- **Order History**: Real-time view of past orders, statuses (`Placed`, `Packed`, `Dispatched`, `Delivered`), and WhatsApp order links.

### 4. 📈 Conversion Rate Optimization (CRO) Sections
- High-converting Hero Banner with social proof rating (4.9/5 from 15,000+ customers).
- Side-by-side **Why Our Jaggery is Superior** comparison table against commercial factory chikkis.
- **35-Year Heritage Story** covering traditional wood-fire roasting.
- **Verified Customer Testimonials** with buyer avatars and locations.
- Interactive **FAQ Accordion**.

---

## 🏗️ Project Architecture

```
e-commerce web/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection with resilient memory-server fallback
│   ├── controllers/
│   │   ├── authController.js   # User registration, login, address book
│   │   ├── productController.js# Product listing, search, category & highlight filters
│   │   └── orderController.js  # Order creation & WhatsApp message generator
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication & protect middleware
│   │   └── errorMiddleware.js  # 404 & error handlers
│   ├── models/
│   │   ├── User.js             # User & Address Mongoose schema
│   │   ├── Product.js          # Product, Weight Variants & Nutrition schema
│   │   └── Order.js            # Order, Items, & WhatsApp tracking schema
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth endpoints
│   │   ├── productRoutes.js    # /api/products endpoints
│   │   └── orderRoutes.js      # /api/orders endpoints
│   ├── seeders/
│   │   └── seedData.js         # Authentic traditional chikki inventory seeder
│   ├── .env                    # Port, Mongo URI, JWT secret, Seller phone
│   └── server.js               # Express application entry point
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/         # Header, Footer, AnnouncementBar
│   │   │   ├── home/           # HeroSection, TrustBadges, WhyJaggery, Story, Reviews, FAQ
│   │   │   ├── products/       # ProductCard, ProductGrid, ProductDetailModal
│   │   │   ├── cart/           # CartDrawer
│   │   │   ├── checkout/       # CheckoutModal, OrderSuccessModal
│   │   │   ├── auth/           # AuthModal
│   │   │   └── profile/        # ProfileDashboard
│   │   ├── context/            # AuthContext, CartContext, ToastContext
│   │   ├── data/               # fallbackProducts.js
│   │   ├── services/           # api.js
│   │   ├── utils/              # whatsappHelper.js
│   │   ├── App.jsx             # Main Application
│   │   ├── index.css           # Tailwind styles & Google Fonts
│   │   └── main.jsx            # React root
│   ├── tailwind.config.js      # Exact hex color tokens (#D97706, #B45309, #291D17, #FEF9F3)
│   ├── vite.config.js          # Vite config with /api proxy
│   └── package.json
└── package.json                # Root package with concurrently / dev scripts
```

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18+) & npm

### Starting Backend (Port 5000)
```bash
cd backend
npm install
node server.js
```

### Starting Frontend (Port 5173)
```bash
cd frontend
npm install
npm run dev
```

Visit **`http://localhost:5173`** in your browser to view the application.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check & connection status |
| `GET` | `/api/products` | Get products with search, category, and sort filters |
| `GET` | `/api/products/:identifier` | Get single product by slug or ID |
| `POST` | `/api/auth/register` | Register new user account |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT |
| `GET` | `/api/auth/profile` | Get current user profile & addresses (Protected) |
| `POST` | `/api/auth/addresses` | Add new saved address (Protected) |
| `DELETE` | `/api/auth/addresses/:id` | Delete saved address (Protected) |
| `PUT` | `/api/auth/addresses/:id/default` | Set address as default (Protected) |
| `POST` | `/api/orders` | Create order & generate itemized WhatsApp URL |
| `GET` | `/api/orders/myorders` | Get logged-in user order history (Protected) |
| `GET` | `/api/orders/:orderNumber` | Get order details by order number |
