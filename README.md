# Veritraa E-Commerce Platform

A premium e-commerce website for Veritraa - authentic, lab-tested Indian spices and dry fruits. Built with Next.js 14, React, Tailwind CSS, and TypeScript.

## 🚀 Live Server

The development server is now running at: **http://localhost:3000**

## 📋 Project Overview

This is a full-stack implementation of the Veritraa PRD (Product Requirements Document), featuring:

- **Modern E-Commerce Platform**: Complete shopping experience with product catalog, cart, and checkout
- **Premium Design System**: Tailwind CSS with custom color scheme (Green, Gold, Terracotta)
- **Responsive Mobile-First**: Works seamlessly on all devices
- **Product Management**: 15+ premium spices catalog with variants and reviews
- **Shopping Cart**: Persistent cart with Zustand state management
- **Checkout Flow**: Complete checkout process with form validation
- **User Pages**: About, Quality Promise, Bulk Orders, Contact, Shop

## 🏗️ Technology Stack

- **Frontend Framework**: Next.js 14 with App Router
- **UI Library**: React 18
- **Styling**: Tailwind CSS + Custom CSS modules
- **State Management**: Zustand (lightweight & performant)
- **Icons**: Lucide React
- **Language**: TypeScript
- **Database**: Ready for integration (data currently in-memory)
- **Forms**: HTML5 with client-side validation

## 📁 Project Structure

```
veritraa/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with Header/Footer
│   ├── page.tsx           # Homepage with hero, products, CTAs
│   ├── globals.css        # Global styles & animations
│   ├── shop/              # Product shop page
│   ├── product/           # Product detail pages (ready)
│   ├── cart/              # Shopping cart page
│   ├── checkout/          # Checkout flow
│   ├── about/             # About Us page
│   ├── quality/           # Quality Promise page
│   ├── bulk-orders/       # Bulk Orders form
│   └── contact/           # Contact Us page
│
├── components/            # Reusable React components
│   ├── Header.tsx         # Navigation header
│   ├── Footer.tsx         # Website footer
│   └── ProductCard.tsx    # Product card component
│
├── lib/                   # Utility functions & data
│   ├── types.ts          # TypeScript types
│   ├── products.ts       # Product data & queries
│   ├── store.ts          # Zustand cart store
│   └── utils.ts          # Helper functions
│
├── hooks/               # Custom React hooks (ready for expansion)
├── public/              # Static assets
├── tailwind.config.ts   # Tailwind configuration
├── next.config.js       # Next.js configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies

```

## 🎨 Design System

### Color Palette
- **Primary Green**: `#2D5016` - Trust, purity
- **Gold Accent**: `#C9A962` - Premium, quality
- **Terracotta**: `#D4745E` - Warmth, heritage
- **Cream Background**: `#F7F4ED` - Clean, natural
- **Charcoal Text**: `#2C2C2C` - Readability

### Typography
- **Serif Font**: Crimson Pro (headings)
- **Sans-serif Font**: Inter (body text)

### Responsive Breakpoints
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

## 🛒 Features Implemented

### ✅ Phase 1 - MVP (Completed)

1. **Homepage**
   - Hero section with CTA
   - Trust bar (4 trust signals)
   - Featured products carousel
   - Brand story section
   - Quality promise grid
   - Product categories showcase
   - Bulk orders CTA banner
   - Newsletter signup
   - Footer

2. **Shop Page**
   - Product grid (responsive)
   - Category filtering
   - Price range filtering
   - Sorting (featured, price, rating)
   - 15 premium spices with variants
   - Product stock display

3. **Shopping Cart**
   - Add/remove items
   - Update quantities
   - Persistent storage (localStorage)
   - Order summary
   - Shipping calculator
   - Promo code ready

4. **Checkout**
   - Contact information form
   - Delivery address management
   - Shipping method selection
   - Payment method options (Razorpay, COD)
   - Order summary sidebar
   - Form validation

5. **Product Pages**
   - About Us with brand story
   - Quality Promise with certifications
   - Bulk Orders with request form
   - Contact Us with multiple contact options

6. **Global Components**
   - Responsive Header with mobile menu
   - Footer with newsletter & links
   - Product cards with variants
   - Icons & UI elements (Lucide React)

## 📦 Product Catalog

### Premium Blends (10 products)
1. Shahi Garam Masala
2. Kanda Lasun Chutney
3. Malvani Fish Fry Masala
4. Kala Masala
5. Goda Masala
6. Mutton Masala
7. Chicken Masala
8. Shahi Biryani Masala
9. Kolhapuri Misal Masala
10. Kolhapuri Lal Tikhat Masala

### Core Range (5 products)
1. Turmeric Powder
2. Red Chilli Powder
3. Coriander Powder
4. Cumin Powder
5. Chaat Masala

Each product includes:
- Multiple weight variants (100g, 250g, 500g, 1kg)
- Lab-tested badges & reviews
- Pricing with sale prices
- Ingredient lists
- Storage & usage instructions
- Stock management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Navigate to project**:
   ```bash
   cd "c:\Users\acer\Documents\GitHub\Veritraa"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   ```
   http://localhost:3000
   ```

### Building for Production

```bash
npm run build
npm run start
```

## 🔄 How the Cart System Works

The cart uses **Zustand** for state management with localStorage persistence:

```typescript
// Add item to cart
useCart((state) => state.addItem(product, variant, quantity));

// Get cart total
const total = useCart((state) => state.getCartTotal());

// Get item count
const count = useCart((state) => state.getCartItemsCount());
```

Cart persists across page refreshes and sessions.

## 📋 Pages Implemented

| Page | Route | Status | Features |
|------|-------|--------|----------|
| Home | / | ✅ Complete | Hero, featured products, CTAs |
| Shop | /shop | ✅ Complete | Filters, sorting, 15 products |
| About | /about | ✅ Complete | Brand story, values, team info |
| Quality | /quality | ✅ Complete | Certifications, traceability |
| Bulk Orders | /bulk-orders | ✅ Complete | Request form, FAQs |
| Contact | /contact | ✅ Complete | Contact info, form, maps ready |
| Cart | /cart | ✅ Complete | Items, summary, checkout CTA |
| Checkout | /checkout | ✅ Complete | Address, payment, order summary |
| Product Detail | /product/[id] | 📝 Ready | Template created |
| Account | /account | 🚧 Phase 2 | Order history, wishlist |
| Admin | /admin | 🚧 Phase 2 | Dashboard, order management |

## 🔐 Security & Compliance

- SSL/HTTPS ready for production
- Environment variables support (.env.local)
- FSSAI compliance messaging
- Privacy policy & Terms ready
- SEO-optimized meta tags
- Schema markup support

## 📊 Performance

- **Page Load**: <2 seconds target (via Next.js SSR)
- **Images**: Optimized with next/image
- **CSS**: Minified via Tailwind
- **JavaScript**: Minified & code-split automatically
- **Mobile First**: Responsive design from ground up

## 🔌 API Ready

All API routes are ready for backend integration:
- Payment gateway (Razorpay)
- Email service (SendGrid)
- SMS/WhatsApp (Twilio)
- Analytics (Google Analytics, Meta Pixel)
- Shipping partners (Shiprocket, Delhivery)

## 🎯 Next Steps (Phase 2)

1. **Backend Integration**
   - Connect to PostgreSQL database
   - User authentication (NextAuth.js)
   - Order management API
   - Inventory system

2. **Payment Integration**
   - Razorpay API integration
   - COD order handling
   - Invoice generation
   - Email confirmations

3. **Admin Features**
   - Product management
   - Order processing
   - Customer management
   - Analytics dashboard

4. **Advanced Features**
   - Product reviews & ratings
   - Wishlist functionality
   - User accounts & profiles
   - Email marketing automation
   - Loyalty program

5. **Mobile App**
   - React Native or Flutter
   - PWA for web

## 📱 Responsive Design

The site is fully responsive:
- **Mobile** (320px-767px): Single column, hamburger menu
- **Tablet** (768px-1023px): 2-column layouts
- **Desktop** (1024px+): Full 3-4 column grids

## 🌟 Key Features

✨ **Premium Design**: Custom brand colors, typography, animations
🛒 **Shopping Cart**: Persistent, real-time updates
💳 **Checkout**: Multi-step process with validation
📦 **Inventory**: Stock tracking per variant
🔐 **Trust Signals**: Badges, certifications, guarantees
📱 **Mobile Optimized**: Touch-friendly, fast
♿ **Accessible**: WCAG compliance ready
🚀 **Performance**: Optimized images, lazy loading
🎨 **Animations**: Smooth transitions, fade-ins

## 📞 Support

For questions or issues:
- Email: hello@veritraa.com
- Phone: +91-9876543210
- WhatsApp: [Link]

## 📄 License

© 2024 Veritraa. All rights reserved.

---

**Built with ❤️ for Veritraa**
*Pure. True. Trusted.*
