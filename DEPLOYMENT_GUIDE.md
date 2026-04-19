# Veritraa - Production Deployment Guide

Complete guide to deploy Veritraa from development to production (Vercel, AWS, or self-hosted).

## 📚 Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Vercel Deployment (Recommended)](#vercel-deployment-recommended)
3. [AWS Deployment](#aws-deployment)
4. [Self-Hosted Deployment](#self-hosted-deployment)
5. [Environment Configuration](#environment-configuration)
6. [Database Setup](#database-setup)
7. [Payment Gateway Setup](#payment-gateway-setup)
8. [Email Service Setup](#email-service-setup)
9. [SSL & Security](#ssl--security)
10. [Performance Optimization](#performance-optimization)
11. [Monitoring & Logging](#monitoring--logging)
12. [Backup & Recovery](#backup--recovery)
13. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

### 1. Code Quality
```bash
# Run linting
npm run lint

# Build for production
npm run build

# Test the production build locally
npm run start
```

### 2. Environment Variables Required
Create `.env.local` in root directory with:
```
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/veritraa"

# Payment Gateway - Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_XXXXXXXXXXXXXX"
RAZORPAY_KEY_SECRET="XXXXXXXXXXXXXX"

# Email Service - SendGrid
SENDGRID_API_KEY="SG.XXXXXXXXXXXXXX"

# Authentication - NextAuth.js
NEXTAUTH_SECRET="generate with: openssl rand -base64 32"
NEXTAUTH_URL="https://yourdomain.com"

# Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_FACEBOOK_PIXEL_ID="1234567890"

# AWS S3 (for images)
AWS_S3_ACCESS_KEY_ID="AKIA..."
AWS_S3_SECRET_ACCESS_KEY="..."
AWS_S3_BUCKET_NAME="veritraa-images"
AWS_S3_REGION="ap-south-1"

# Domain & Security
NEXT_PUBLIC_SITE_URL="https://veritraa.com"
NEXT_PUBLIC_API_URL="https://api.veritraa.com"
```

### 3. Security Scan
```bash
# Check for vulnerabilities
npm audit

# Fix automatically if possible
npm audit fix
```

---

## Vercel Deployment (Recommended)

### Step 1: Push Code to GitHub
```bash
git init
git add .
git commit -m "Initial commit: Veritraa MVP"
git remote add origin https://github.com/yourusername/veritraa.git
git push -u origin main
```

### Step 2: Create Vercel Account & Setup
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project" → Import repository
4. Select Veritraa repo
5. Click "Import"

### Step 3: Configure Environment Variables
In Vercel Dashboard:
1. Settings → Environment Variables
2. Add all variables from `.env.local`
3. Mark sensitive keys as "Sensitive"

### Step 4: Deploy
```bash
# Vercel auto-deploys on git push
# For manual:
npm install -g vercel
vercel
```

### Production URL
```
https://veritraa.com
API: https://api.veritraa.com
```

---

## AWS Deployment

### Option 1: AWS Amplify (Easiest)
```bash
npm install -g @aws-amplify/cli
amplify init
amplify hosting add
amplify publish
```

### Option 2: EC2 + PM2 (More Control)
```bash
# Full setup instructions in advanced section below
```

---

## Environment Configuration

### Production Environment Variables
```bash
cp .env.example .env.local

# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# DATABASE_URL format:
postgresql://user:password@host:5432/veritraa
```

---

## Database Setup

### PostgreSQL Schema
```sql
-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    price DECIMAL(10, 2),
    rating DECIMAL(3, 1) DEFAULT 4.5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product Variants Table
CREATE TABLE product_variants (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id),
    weight VARCHAR(50),
    price DECIMAL(10, 2),
    stock INT,
    sku VARCHAR(100) UNIQUE
);

-- Orders Table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending',
    total DECIMAL(10, 2),
    shipping_address TEXT
);

-- Order Items Table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id),
    product_variant_id INT REFERENCES product_variants(id),
    quantity INT,
    price DECIMAL(10, 2)
);

-- Create Indexes
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_product_category ON products(category);
CREATE INDEX idx_order_status ON orders(status);
```

---

## Payment Gateway Setup (Razorpay)

### Step 1: Create Account
1. Go to [razorpay.com](https://razorpay.com)
2. Sign up and verify email
3. Complete KYC process
4. Get API Keys from Settings → API Keys

### Step 2: Add Credentials
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_XXXXXX
RAZORPAY_KEY_SECRET=XXXXXX
```

### Step 3: Webhook Setup
```bash
# In Razorpay Dashboard:
1. Settings → Webhooks
2. URL: https://yourdomain.com/api/webhooks/razorpay
3. Select: payment.authorized, payment.failed, payment.captured
```

---

## Email Service Setup (SendGrid)

### Step 1: Create Account
1. Go to [sendgrid.com](https://sendgrid.com)
2. Sign up and verify
3. Create API Key with Mail Send permission

### Step 2: Add Configuration
```env
SENDGRID_API_KEY=SG.XXXXXXXXXXXXX
SENDGRID_SENDER_EMAIL=noreply@veritraa.com
```

---

## SSL & Security

### Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d veritraa.com -d www.veritraa.com
sudo systemctl enable certbot.timer
```

### Security Headers
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
        ],
      },
    ]
  },
}
```

---

## Performance Optimization

### Image Optimization
```typescript
import Image from 'next/image';

export function OptimizedImage({ src, alt }: any) {
  return (
    <Image
      src={src}
      alt={alt}
      width={400}
      height={400}
      loading="lazy"
      placeholder="blur"
    />
  );
}
```

### Caching Strategy
```javascript
// next.config.js
async headers() {
  return [
    {
      source: '/images/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
  ];
}
```

---

## Monitoring & Logging

### Sentry Error Tracking
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest
```

### Vercel Analytics
- Built-in to Vercel
- Dashboard → Analytics tab
- Track: Traffic, Response Time, Error Rate

### Custom Logging
```typescript
export function logError(message: string, error: Error) {
  console.error(`[ERROR] ${message}:`, error);
  
  if (process.env.NODE_ENV === 'production') {
    fetch('/api/logs', {
      method: 'POST',
      body: JSON.stringify({ level: 'error', message }),
    });
  }
}
```

---

## Backup & Recovery

### Database Backup (PostgreSQL)
```bash
# Automated via RDS in AWS Console
# Backup Retention: 30 days
# Backup Window: 02:00 UTC

# Manual backup
pg_dump -h your-db-host -U postgres veritraa > backup_$(date +%Y%m%d).sql

# Restore
psql -h your-db-host -U postgres veritraa < backup_20240225.sql
```

### Code Backup
```bash
# Push to GitHub after every deployment
git push origin main
```

---

## Troubleshooting

### Build Error
```bash
npm clean-cache
rm -rf .next
npm run build
```

### Database Connection Error
```bash
# Test connection
psql -h your-db-host -U username -d dbname -c "SELECT 1;"

# Check AWS security groups allow your EC2 instance
```

### Payment Integration Not Working
```bash
# Verify credentials
echo $NEXT_PUBLIC_RAZORPAY_KEY_ID
echo $RAZORPAY_KEY_SECRET

# Check Razorpay webhook logs in Dashboard
```

### email Not Sending
```bash
# Test SendGrid key
curl -X GET "https://api.sendgrid.com/v3/mail/validate" \
  -H "Authorization: Bearer $SENDGRID_API_KEY"

# Verify sender email
# Check SendGrid delivery status
```

### Performance Issues
```bash
# Analyze bundle
npm run build -- --analyze

# Check database queries
# Monitor: top, free -m, df -h
```

---

## Post-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations completed
- [ ] SSL certificate installed
- [ ] Monitoring configured
- [ ] Backup schedule set
- [ ] DNS records updated
- [ ] Email service tested
- [ ] Payment gateway tested
- [ ] All pages accessible
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Load time < 3s
- [ ] Analytics working
- [ ] Redirects configured
- [ ] Sitemap submitted to Google
- [ ] Robots.txt configured
- [ ] 404 page tested
- [ ] Security headers verified

---

**Last Updated**: February 25, 2026  
**Status**: Ready for Production ✅
