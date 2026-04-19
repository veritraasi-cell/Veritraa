# Veritraa - Quick Reference Guide

Fast lookup for common tasks, commands, and solutions.

---

## 🚀 Quick Start

### First Time Setup
```bash
# 1. Navigate to project
cd c:\Users\acer\Documents\GitHub\Veritraa

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local

# 4. Fill in .env.local with your credentials

# 5. Start development server
npm run dev

# 6. Open browser
# http://localhost:3000
```

### Daily Development
```bash
# Start dev server
npm run dev

# Run linter
npm run lint

# Build for production
npm run build

# Test production build
npm run start
```

---

## 📁 Project Structure

```
Veritraa/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage
│   ├── shop/page.tsx            # Product catalog
│   ├── cart/page.tsx            # Shopping cart
│   ├── checkout/page.tsx        # Checkout flow
│   ├── about/page.tsx           # About page
│   ├── quality/page.tsx         # Quality promise
│   ├── bulk-orders/page.tsx     # Bulk orders form
│   ├── contact/page.tsx         # Contact page
│   └── api/                     # API routes (ready for build)
│
├── components/                  # Reusable components
│   ├── Header.tsx              # Navigation header
│   ├── Footer.tsx              # Footer
│   └── ProductCard.tsx         # Product card
│
├── lib/                        # Utilities & data
│   ├── types.ts               # TypeScript types
│   ├── products.ts            # Product catalog
│   └── store.ts               # Zustand cart store
│
├── public/                     # Static assets
├── styles/                     # Global styles
│   └── globals.css            # CSS with animations
│
├── tailwind.config.ts         # Tailwind configuration
├── next.config.js             # Next.js configuration
├── tsconfig.json              # TypeScript configuration
├── .eslintrc.json             # ESLint configuration
├── package.json               # Dependencies
├── .env.example               # Environment template
├── README.md                  # Project documentation
├── IMPLEMENTATION_CHECKLIST.md
├── DEPLOYMENT_GUIDE.md
└── QUICK_REFERENCE.md         # This file
```

---

## 🔧 Common Commands

### Development
```bash
# Start dev server (+watch mode)
npm run dev

# Build production
npm run build

# Test production build
npm run start

# Type check
npm run type-check

# Lint code
npm run lint

# Format code (if configured)
npm run format
```

### Dependency Management
```bash
# Install packages
npm install

# Add package
npm install package-name

# Remove package
npm uninstall package-name

# Update package
npm update package-name

# Check outdated
npm outdated

# Audit security
npm audit

# Fix vulnerabilities
npm audit fix
```

### Git Commands
```bash
# Check status
git status

# Add changes
git add .

# Commit
git commit -m "message"

# Push to GitHub
git push origin main

# Pull latest
git pull origin main

# Create branch
git checkout -b feature/name

# Switch branch
git checkout main
```

---

## 💾 Database Queries

### Connect to PostgreSQL
```bash
# Local (if running locally)
psql -U postgres -d veritraa

# AWS RDS
psql -h veritraa.XXXXX.rds.amazonaws.com -U postgres -d veritraa
```

### Common Queries
```sql
-- Show all products
SELECT * FROM products;

-- Show product with variants
SELECT p.*, pv.weight, pv.price, pv.stock 
FROM products p 
LEFT JOIN product_variants pv ON p.id = pv.product_id;

-- Get orders for user
SELECT * FROM orders WHERE user_id = 1;

-- Get order total
SELECT 
  o.id, 
  COUNT(*) as items,
  SUM(oi.price * oi.quantity) as total
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id;
```

---

## 🔐 Environment Variables

### All Variables (Copy to .env.local)
```
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/veritraa

# Payment - Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_XXXXXX
RAZORPAY_KEY_SECRET=XXXXXX

# Email - SendGrid
SENDGRID_API_KEY=SG.XXXXXX
SENDGRID_SENDER_EMAIL=noreply@veritraa.com

# Auth
NEXTAUTH_SECRET=generate_with_openssl_rand_-base64_32
NEXTAUTH_URL=http://localhost:3000

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXX
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=XXXXXX

# AWS S3 (optional)
AWS_S3_ACCESS_KEY_ID=AKIA...
AWS_S3_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET_NAME=veritraa-images
AWS_S3_REGION=ap-south-1

# URLs
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Generate NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

---

## 🛒 Cart & Store Usage

### Add to Cart
```typescript
import { useCart } from '@/lib/store';

const { addItem } = useCart();

addItem({
  productId: '1',
  variantId: '1.100g',
  quantity: 2,
  product: productData,
  variant: variantData,
});
```

### Get Cart Total
```typescript
import { useCart } from '@/lib/store';

const { getCartTotal } = useCart();
const total = getCartTotal(); // Returns number
```

### Clear Cart
```typescript
const { clearCart } = useCart();
clearCart(); // Removes all items
```

---

## 🎨 Tailwind Colors

### Veritraa Brand Colors
```javascript
// In Tailwind:
bg-veritraa-green       // #2D5016 (dark green)
bg-veritraa-gold        // #C9A962 (gold accent)
bg-veritraa-terracotta  // #D4745E (warm)
bg-veritraa-cream       // #F7F4ED (off-white)
bg-veritraa-charcoal    // #2C2C2C (dark text)

// Usage:
className="bg-veritraa-green text-veritraa-cream"
```

### Common Combinations
```
Text on Green: text-veritraa-cream
Text on Cream: text-veritraa-charcoal
Accents: text-veritraa-gold
Borders: border-veritraa-terracotta
Hover: hover:bg-veritraa-green
```

---

## 🐛 Debugging

### Check TypeScript Errors
```bash
npm run type-check
```

### Lint Errors
```bash
npm run lint
```

### Build Errors
```bash
# Clear cache
rm -rf .next

# Rebuild
npm run build
```

### Network Issues
```bash
# Check current environment
npm run dev

# Open DevTools (F12) → Network tab
# Check for failed requests
# Verify API endpoints
```

### Browser Console Errors
```javascript
// Clear console
console.clear()

// Check for 404s, CORS, or auth errors
// All should be in browser DevTools
```

---

## 📦 Adding New Features

### Add New Page
```bash
# Create route
mkdir -p app/new-page
touch app/new-page/page.tsx

# Add to navigation (Header.tsx or Footer.tsx)
```

### Add New Component
```bash
# Create component
touch components/MyComponent.tsx

# Use in page
import { MyComponent } from '@/components/MyComponent';
```

### Add Product Variant
```typescript
// In lib/products.ts, update product object:
variants: [
  {
    weight: '100g',
    price: 299,
    salePrice: 249,
    stock: 50,
    sku: 'GARAM-100-01',
  },
  // Add more...
]
```

---

## 🚀 Deployment Commands

### Vercel Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### AWS Amplify
```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize
amplify init

# Add hosting
amplify hosting add

# Deploy
amplify publish
```

### Docker (Local)
```bash
# Build image
docker build -t veritraa .

# Run container
docker run -p 3000:3000 veritraa

# Using docker-compose
docker-compose up -d

# Stop
docker-compose down
```

---

## 💡 Performance Tips

### Optimize Images
```typescript
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="description"
  width={400}
  height={400}
  loading="lazy"           // Lazy load
  placeholder="blur"       // Blur while loading
  quality={75}            // Reduce quality
/>
```

### Code Splitting
```typescript
// Automatic with Next.js
// Routes are automatically code-split

// Dynamic imports
const Component = dynamic(() => import('@/components/Heavy'), {
  loading: () => <p>Loading...</p>,
});
```

### Database Queries
```typescript
// Select only needed fields
const products = await db.product.findMany({
  select: { id: true, name: true, price: true },
  take: 10, // Limit results
});
```

---

## 🆘 Common Issues & Fixes

### "Module not found" Error
```bash
# Clear node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Port 3000 Already in Use
```bash
# Find and kill process
# Windows PowerShell:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:3000 | xargs kill -9
```

### Build Fails
```bash
# Check errors
npm run build

# Clear cache
rm -rf .next

# Try again
npm run build
```

### Zustand Store Not Persisting
```typescript
// Ensure localStorage key matches:
const useCart = create(
  persist(
    (set) => ({ /* store */ }),
    { name: 'veritraa-cart' }
  )
)
```

### Images Not Loading
```typescript
// Add domain to next.config.js
images: {
  domains: ['yourdomain.com', 's3.amazonaws.com'],
}
```

---

## 📱 Testing Checklist

### Before Pushing Code
- [ ] No TypeScript errors: `npm run type-check`
- [ ] No lint errors: `npm run lint`
- [ ] Builds successfully: `npm run build`
- [ ] Page loads: http://localhost:3000
- [ ] Mobile responsive: F12 → Toggle device toolbar
- [ ] No console errors: F12 → Console tab
- [ ] All links working: Click through pages
- [ ] Forms submit: Test checkout, contact, bulk orders
- [ ] Cart works: Add item, remove, checkout

### Before Deploying
- [ ] All tests pass
- [ ] Code reviewed
- [ ] Environment variables set
- [ ] Database setup complete
- [ ] Payment gateway configured
- [ ] Email service configured
- [ ] Analytics setup
- [ ] SSL certificate ready
- [ ] Backups configured
- [ ] Monitoring setup

---

## 📞 Support

**Getting Help:**
- Errors: Check browser DevTools (F12)
- TypeScript: Run `npm run type-check`
- Build issues: Run `npm run build` locally first
- Deployment: Check DEPLOYMENT_GUIDE.md
- Features: Check IMPLEMENTATION_CHECKLIST.md

**Resources:**
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org/docs/)

---

**Last Updated**: February 25, 2026  
**Version**: 1.0 - MVP Complete ✅

