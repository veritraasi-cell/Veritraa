# Product Requirements Document (PRD)
## Veritraa E-Commerce Website - Premium Spices & Dry Fruits

---

## 📋 Document Information
- **Product Name:** Veritraa E-Commerce Platform
- **Version:** 1.0
- **Date:** 2024
- **Document Owner:** Veritraa Team
- **Status:** Ready for Development

---

## 🎯 Executive Summary

### Product Vision
Build a premium, conversion-focused e-commerce platform for Veritraa that embodies purity, authenticity, and trust while providing seamless shopping experience for retail customers and bulk buyers.

### Business Objectives
- Establish Veritraa as a premium spice brand online
- Enable direct-to-consumer sales (retail & bulk)
- Build customer trust through transparency
- Create scalable foundation for product expansion
- Support women-led supply chain narrative

### Success Metrics
- Conversion Rate: >2.5%
- Average Order Value: ₹800+
- Page Load Time: <2 seconds
- Mobile Traffic: 60%+
- Customer Retention: 30%+ within 6 months

---

## 🏗️ Technical Architecture

### Recommended Tech Stack

#### **RECOMMENDED APPROACH: Headless Commerce**

**Frontend:**
- **Framework:** Next.js 14 (React)
- **Styling:** Tailwind CSS + Framer Motion
- **State Management:** Zustand / React Context
- **Payment Integration:** Razorpay SDK
- **Analytics:** Google Analytics 4, Meta Pixel

**Backend & CMS:**
- **E-Commerce Platform:** Shopify (Headless) OR Medusa.js
- **CMS:** Sanity.io OR Shopify CMS
- **Database:** PostgreSQL (if Medusa) / Shopify's built-in
- **File Storage:** AWS S3 / Cloudinary
- **Email Service:** SendGrid / Amazon SES

**Infrastructure:**
- **Hosting:** Vercel (Frontend) + Shopify/Railway (Backend)
- **CDN:** Cloudflare
- **SSL:** Let's Encrypt / Cloudflare
- **Domain:** GoDaddy/Namecheap

**Why This Stack:**
1. **Speed:** Next.js provides excellent performance
2. **Scalability:** Easily handles traffic spikes
3. **SEO:** Server-side rendering for better rankings
4. **Cost-Effective:** $50-150/month initial costs
5. **Premium Feel:** Smooth animations, fast loads
6. **Easy Management:** Shopify admin for non-technical staff

### Alternative Stack (Budget-Friendly)
- **WordPress + WooCommerce** with premium theme (Flatsome/Shoptimizer)
- **Hosting:** Cloudways/WP Engine
- **Cost:** $30-80/month

---

## 🎨 Design System & Brand Guidelines

### Color Palette

```css
/* Primary Colors */
--primary-green: #2D5016      /* Deep forest green - trust, purity */
--primary-gold: #C9A962        /* Premium gold - quality */
--accent-terracotta: #D4745E   /* Warm earthy - heritage */

/* Neutral Colors */
--cream: #F7F4ED               /* Background - clean, natural */
--warm-white: #FDFBF7          /* Secondary background */
--charcoal: #2C2C2C            /* Text primary */
--medium-gray: #6B6B6B         /* Text secondary */
--light-gray: #E8E8E8          /* Borders, dividers */

/* Accent Colors */
--success-green: #4CAF50
--error-red: #D32F2F
--warning-amber: #F57C00
```

### Typography

```css
/* Primary Font: Crimson Pro (Serif - premium, traditional) */
@import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@300;400;600;700&display=swap');

/* Secondary Font: Inter (Sans-serif - modern, readable) */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

/* Usage */
H1: Crimson Pro, 48px, Bold
H2: Crimson Pro, 36px, SemiBold
H3: Crimson Pro, 28px, SemiBold
H4: Inter, 20px, Medium
Body: Inter, 16px, Regular
Small: Inter, 14px, Regular
```

### Design Principles
1. **Premium Minimalism:** Clean, spacious, high-quality imagery
2. **Trust Signals:** Certifications, lab-tested badges, transparency
3. **Natural Aesthetics:** Earth tones, organic shapes, botanical elements
4. **Clear Hierarchy:** Easy navigation, clear CTAs
5. **Mobile-First:** 60% users expected on mobile

---

## 📐 Complete Sitemap

```
veritraa.com/
│
├── Home (/)
│
├── About Us (/about)
│   ├── Our Story
│   ├── Vision & Mission
│   ├── Core Values
│   └── Women-Led Supply Chain
│
├── Shop (/shop)
│   ├── All Products
│   ├── Premium Blends
│   │   ├── Shahi Garam Masala
│   │   ├── Kanda Lasun Chutney
│   │   ├── Malvani Fish Fry Masala
│   │   ├── Kala Masala
│   │   ├── Goda Masala
│   │   ├── Mutton Masala
│   │   ├── Chicken Masala
│   │   ├── Shahi Biryani Masala
│   │   ├── Kolhapuri Misal Masala
│   │   └── Kolhapuri Lal Tikhat Masala
│   │
│   ├── Core Range
│   │   ├── Turmeric Powder
│   │   ├── Red Chilli Powder
│   │   ├── Coriander Powder
│   │   ├── Cumin Powder
│   │   └── Chaat Masala
│   │
│   └── Dry Fruits (Future)
│
├── Bulk Orders (/bulk-orders)
│   ├── Request Quote Form
│   ├── Wholesale Pricing Info
│   └── Custom Packaging Options
│
├── Quality Promise (/quality)
│   ├── Lab Testing
│   ├── Certifications (FSSAI, etc.)
│   ├── Sourcing Transparency
│   └── Processing Standards
│
├── Recipes (/recipes) [Optional - Phase 2]
│
├── Contact Us (/contact)
│
├── My Account (/account)
│   ├── Login/Register
│   ├── Order History
│   ├── Addresses
│   ├── Wishlist
│   └── Settings
│
├── Cart (/cart)
│
├── Checkout (/checkout)
│
└── Legal
    ├── Privacy Policy
    ├── Terms & Conditions
    ├── Shipping Policy
    └── Return & Refund Policy
```

---

## 📄 Detailed Page Specifications

### 1. HOME PAGE

#### Section Breakdown

**1.1 Hero Section**
```
Layout: Full-width, split design
Left: 50% - Premium lifestyle image (spices in traditional vessels)
Right: 50% - Content

Content:
- Headline: "Pure. True. Trusted."
- Subheadline: "Premium Indian Spices Rooted in Authenticity"
- Body Text: "Uncompromised quality. Radical transparency. 
              Every batch lab-tested, traceable, and crafted 
              with discipline."
- CTA Buttons: 
  * Primary: "Explore Products" → /shop
  * Secondary: "Our Story" → /about

Design Elements:
- Subtle botanical line illustrations (minimalist leaves/spice motifs)
- Badge: "Lab-Tested Purity" with checkmark icon
- Smooth parallax scrolling effect
```

**1.2 Trust Bar**
```
Layout: Horizontal scroll (mobile) / Fixed 4-column (desktop)

Icons + Text:
✓ 100% Pure - No Adulteration
🔬 Lab-Tested Quality
🌾 Region-Specific Sourcing
🚚 Free Shipping Above ₹499

Style: Cream background, gold icons, Inter font
```

**1.3 Featured Products Carousel**
```
Headline: "Signature Blends"

Display: 
- 4 products visible (desktop)
- 1.5 products visible (mobile)
- Auto-rotate every 4 seconds

Product Card:
- High-res image (800x800px minimum)
- Product name
- Price (₹xxx for XXXg)
- "View Details" button (hover: gold background)
- Quick "Add to Cart" icon

Featured Products:
1. Shahi Garam Masala
2. Kolhapuri Lal Tikhat Masala
3. Turmeric Powder
4. Kanda Lasun Chutney
```

**1.4 Brand Story Section**
```
Layout: 2-column (desktop) / Stacked (mobile)

Left: Image - Woman farmer sorting spices OR spice field

Right: Content
- Overline: "About Veritraa"
- Headline: "Built on Purity, Authenticity & Trust"
- Body: (150-word excerpt from About section)
- CTA: "Read Our Full Story" → /about

Background: Warm white with subtle botanical pattern
```

**1.5 Quality Promise Grid**
```
Headline: "The Veritraa Difference"

3-Column Grid:

Column 1:
Icon: Shield with checkmark
Title: "Uncompromised Quality"
Text: "Every batch rigorously tested. No additives. 
       No shortcuts."

Column 2:
Icon: Document with seal
Title: "Radical Transparency"
Text: "Clear sourcing. Honest labeling. 
       Traceable origins."

Column 3:
Icon: Award ribbon
Title: "Consistent Standards"
Text: "Disciplined processes. Reliable results. 
       Batch after batch."

Style: White cards with subtle shadow, hover lift effect
```

**1.6 Product Categories**
```
Headline: "Shop by Category"

2 Large Cards (side-by-side):

Card 1: Premium Blends
- Image: Collage of masala blends
- Text: "Traditional recipes, modern standards"
- CTA: "Explore Blends"

Card 2: Core Range
- Image: Collage of everyday spices
- Text: "Everyday essentials, exceptional quality"
- CTA: "Shop Core Range"

Hover Effect: Subtle zoom on image, gold border
```

**1.7 Bulk Orders CTA**
```
Layout: Full-width banner
Background: Deep green with botanical pattern overlay

Content (Centered):
- Headline: "Supply Quality to Your Business"
- Subtext: "Wholesale pricing, custom packaging, 
            consistent quality for restaurants, 
            retailers & food businesses."
- CTA: "Request Bulk Quote" → /bulk-orders
- Phone: "Call: +91-XXXXXXXXXX"

Style: White text, gold CTA button
```

**1.8 Instagram Feed [Optional - Phase 2]**
```
Headline: "Follow Our Journey @veritraa"
Display: Latest 6 Instagram posts
CTA: "Follow Us"
```

**1.9 Newsletter Signup**
```
Background: Cream

Content:
- Headline: "Join the Veritraa Family"
- Subtext: "Get exclusive recipes, quality insights, 
            and special offers."
- Form: Email input + "Subscribe" button
- Privacy note: "We respect your inbox. Unsubscribe anytime."

Design: Centered, max-width 600px
```

---

### 2. SHOP PAGE

#### Layout Structure

**2.1 Header Section**
```
- Page Title: "Our Products"
- Breadcrumb: Home > Shop
- Intro Text: "Every product crafted with purity, tested for 
              quality, and sealed for freshness."
```

**2.2 Filters & Sorting (Sidebar - Desktop / Dropdown - Mobile)**

```
FILTERS:
- Category
  □ Premium Blends (10)
  □ Core Range (5)
  □ Dry Fruits (0) [Grayed out - Coming Soon]

- Price Range
  □ Under ₹100
  □ ₹100 - ₹200
  □ ₹200 - ₹500
  □ Above ₹500

- Product Type
  □ Masala Blends
  □ Single Spices
  □ Chutneys

- Special Features
  □ Lab Tested
  □ Regional Specialty
  □ Bulk Available

SORT BY:
- Featured
- Price: Low to High
- Price: High to Low
- Newest First
- A-Z

Clear All Filters button
```

**2.3 Product Grid**

```
Desktop: 3 columns
Tablet: 2 columns
Mobile: 1 column

Spacing: 30px gap

PRODUCT CARD DESIGN:
┌─────────────────────┐
│                     │
│   Product Image     │ ← Hover: Show "Quick View"
│   (Square, 500px)   │
│                     │
├─────────────────────┤
│ ⭐⭐⭐⭐⭐ (12)      │ ← Reviews
│                     │
│ Product Name        │
│ Weight Options      │ ← 100g | 250g | 500g
│                     │
│ ₹199  ₹249         │ ← Sale price / Original
│                     │
│ [Add to Cart] ❤️    │ ← Button + Wishlist icon
└─────────────────────┘

Badges (top-right of image):
- "Lab Tested" (green badge)
- "Best Seller" (gold badge)
- "New" (terracotta badge)
```

**2.4 Quick View Modal**
```
Trigger: Click product image or "Quick View" button

Modal Content:
- Product image (larger)
- Product name
- Star rating + review count
- Price + weight selector
- Short description (2-3 lines)
- Quantity selector
- "Add to Cart" button
- "View Full Details" link
```

---

### 3. PRODUCT DETAIL PAGE (PDP)

#### Layout (Desktop)

```
┌──────────────────────────────────────────────┐
│ Breadcrumb: Home > Shop > [Product Name]     │
└──────────────────────────────────────────────┘

┌──────────────────┬───────────────────────────┐
│                  │                           │
│  IMAGE GALLERY   │   PRODUCT INFO            │
│                  │                           │
│  [Main Image]    │   Product Name            │
│  (800x800px)     │   ⭐⭐⭐⭐⭐ (23 reviews)  │
│                  │                           │
│  [Thumb] [Thumb] │   ₹199 ₹249 (20% off)    │
│  [Thumb] [Thumb] │                           │
│                  │   Size: ○100g ◉250g ○500g │
│  Zoom on hover   │                           │
│                  │   Quantity: [−] 1 [+]     │
│                  │                           │
│                  │   [Add to Cart - Large]   │
│                  │   [Buy Now]               │
│                  │   ❤️ Add to Wishlist      │
│                  │                           │
│                  │   ✓ Free shipping >₹499   │
│                  │   ✓ COD Available         │
│                  │   ✓ Easy Returns          │
│                  │                           │
│                  │   Share: [Icons]          │
└──────────────────┴───────────────────────────┘
```

**3.1 Tabs Section (Full-width below product info)**

```
TAB 1: Description
- Full product description from content provided
- Key highlights (bullet points with checkmark icons)
- Suggested uses

TAB 2: Quality & Testing
- "What makes this product pure"
- Lab testing information
- Certifications (FSSAI logo, etc.)
- Sourcing details (origin region)

TAB 3: Ingredients & Nutrition [If applicable]
- Full ingredient list
- Nutritional information table
- Allergen information

TAB 4: Usage & Storage
- How to use
- Storage instructions
- Shelf life

TAB 5: Reviews (XX)
- Star rating breakdown graph
- Individual reviews with:
  * Reviewer name
  * Star rating
  * Date
  * Review text
  * Helpful counter
- "Write a Review" button
```

**3.2 Related Products**
```
Headline: "You May Also Like"
Display: 4 products (same format as shop page cards)
Logic: Same category OR frequently bought together
```

**3.3 Trust Badges (Sticky section)**
```
Display throughout page:
- 🔬 Lab Tested Purity
- 🌾 Traceable Origins
- ✓ FSSAI Certified
- 📦 Hygienically Packaged
```

---

### 4. ABOUT US PAGE

#### Content Sections

**4.1 Hero Section**
```
Background: Large image - spice farm or women sorting spices
Overlay: Dark gradient (50% opacity)

Content (Centered, white text):
- Headline: "Pure. True. Trusted."
- Subheadline: "Built on Purity, Authenticity & Trust"
- Scroll indicator
```

**4.2 Brand Story**
```
Layout: Centered, max-width 800px

Content:
[Full "About Veritraa" text from your content]

Typography:
- First paragraph: Larger (20px)
- Dropcap on first letter
- Pull quote: "Premium is not a statement — 
               it is a standard reflected in every batch."
```

**4.3 Vision & Mission (Side-by-side cards)**
```
Card 1: Vision
Icon: 🌿
[Vision text]

Card 2: Mission
Icon: 🌿
[Mission text]

Design: White cards on cream background, shadow on hover
```

**4.4 Core Values (Accordion or Cards)**
```
Display each of the 5 values:
1. Uncompromised Quality
2. Radical Transparency
3. Discipline in Every Detail
4. Respect for Origin
5. Purposeful Growth

Each card:
- Number icon (01, 02, etc.)
- Title
- Description
- Related icon/illustration

Layout: 
Desktop: 2-column grid (3rd centered)
Mobile: Stacked
```

**4.5 Women-Led Supply Chain Section**
```
Layout: Image left (60%), Content right (40%)

Image: Women workers in field/facility

Content:
- Headline: "Building Sustainable Communities"
- Body text about women-led supply chain initiative
- Stats (if available):
  * "XX women employed"
  * "XX families supported"
  * "XX tons processed annually"

CTA: "Learn More" [links to detailed page in Phase 2]
```

**4.6 Timeline [Optional - if you have milestones]**
```
Vertical timeline showing:
- Year founded
- First product launch
- Certifications achieved
- Major milestones
```

**4.7 Team Section [Optional - Phase 2]**

**4.8 CTA Section**
```
Background: Deep green

Content (Centered):
- Headline: "Experience the Veritraa Difference"
- CTA: "Shop Now" → /shop
```

---

### 5. BULK ORDERS PAGE

**5.1 Hero**
```
Headline: "Supply Quality to Your Business"
Subtext: "Wholesale pricing, custom packaging options, 
          and consistent quality for restaurants, retailers, 
          and food service businesses."
```

**5.2 Benefits Grid**
```
3 columns:

1. Wholesale Pricing
   "Volume-based discounts for bulk orders"

2. Custom Packaging
   "Private labeling and custom pack sizes available"

3. Consistent Quality
   "Same rigorous standards, batch after batch"
```

**5.3 How It Works**
```
Step-by-step process:
1. Submit Request → 2. Get Quote → 3. Approve → 4. Receive Order

Visual: Numbered icons with connecting line
```

**5.4 Request Quote Form**

```
Form Fields:

Business Information:
- Business Name *
- Business Type (Dropdown: Restaurant, Retail Store, 
  Food Service, Distributor, Other)
- GSTIN (optional)

Contact Information:
- Full Name *
- Phone Number *
- Email Address *
- City *
- State *

Order Details:
- Products Interested In (Multi-select checklist)
- Estimated Monthly Requirement (Dropdown: 
  <50kg, 50-100kg, 100-500kg, 500kg+)
- Preferred Pack Size (text field)
- Custom Packaging Required? (Yes/No)

Additional Information:
- Message / Special Requirements (textarea)

[Submit Request] button

Note: "We'll respond within 24 business hours"
```

**5.5 FAQ Section**
```
Q: What is the minimum order quantity?
Q: Do you offer custom blending?
Q: What payment terms do you offer?
Q: Do you ship pan-India?
Q: Can I get product samples?

Accordion-style answers
```

**5.6 Contact Options**
```
Prefer to talk? 
📞 Call us: +91-XXXXXXXXXX
✉️ Email: bulk@veritraa.com
⏰ Mon-Sat, 9 AM - 6 PM
```

---

### 6. QUALITY PROMISE PAGE

**6.1 Hero**
```
Headline: "Our Commitment to Purity"
Subtext: "Every claim backed by testing. 
          Every promise kept through discipline."
```

**6.2 Quality Pillars (4 Sections)**

**Section 1: Sourcing**
```
Icon: 🌾
Content:
- Region-specific sourcing
- Farmer partnerships
- Selection criteria
- Visual: Map of India highlighting source regions
```

**Section 2: Processing**
```
Icon: ⚙️
Content:
- Hygienic facilities
- Temperature-controlled processing
- Minimal processing to retain oils & aroma
- Visual: Processing facility photos
```

**Section 3: Testing**
```
Icon: 🔬
Content:
- Lab testing parameters:
  * Purity analysis
  * Moisture content
  * Microbial testing
  * Heavy metal testing
  * Adulteration checks
- Third-party certifications
- Visual: Lab testing equipment/certificates
```

**Section 4: Packaging**
```
Icon: 📦
Content:
- Food-grade materials
- Freshness-sealed technology
- Tamper-proof packaging
- Clear labeling standards
- Visual: Packaging close-up
```

**6.3 Certifications Display**
```
Headline: "Certified & Compliant"

Display logos:
- FSSAI License
- ISO certifications (if any)
- Lab testing certifications
- Any other relevant certifications

Each with certification number and validity
```

**6.4 Traceability Section**
```
Headline: "Know Your Source"

Content:
- Explanation of batch coding system
- How customers can trace their product
- QR code implementation info (Phase 2 feature)

Visual: Infographic showing journey from farm to package
```

**6.5 Comparison Table [Optional]**
```
"Why We're Different"

Table comparing:
                Veritraa  |  Standard Market
Lab Tested        ✓       |       ✗
Source Traced     ✓       |       ✗
No Additives      ✓       |       ✗
Etc.
```

---

### 7. CONTACT PAGE

**7.1 Contact Information**
```
Layout: 2 columns

Left: Contact Details
📍 Address:
   Veritraa
   [Full Address]
   [City, State, PIN]

📞 Phone: +91-XXXXXXXXXX
📧 Email: hello@veritraa.com
🕐 Hours: Mon-Sat, 9 AM - 6 PM IST

Social Media Icons (clickable):
Instagram | Facebook | WhatsApp

Right: Contact Form
- Name *
- Email *
- Phone *
- Subject (Dropdown: General Inquiry, Order Support, 
  Bulk Orders, Quality Question, Other)
- Message *
- [Send Message] button
```

**7.2 FAQ Quick Links**
```
"Quick Answers"
- Shipping Policy
- Return & Refund
- Track Order
- Bulk Orders
```

**7.3 Map [Optional]**
```
Embedded Google Map showing office/facility location
```

---

### 8. CART PAGE

**Layout**

```
┌─────────────────────────────────┬──────────────┐
│ CART ITEMS                      │ ORDER        │
│                                 │ SUMMARY      │
│ ┌─────────────────────────────┐ │              │
│ │ [Img] Product Name          │ │ Subtotal:    │
│ │       100g                  │ │ ₹599         │
│ │       ₹199                  │ │              │
│ │       Qty: [-] 2 [+]   [X] │ │ Shipping:    │
│ └─────────────────────────────┘ │ ₹40          │
│                                 │              │
│ ┌─────────────────────────────┐ │ Discount:    │
│ │ [Img] Product Name          │ │ -₹50         │
│ │       250g                  │ │              │
│ │       ₹349                  │ │ ─────────    │
│ │       Qty: [-] 1 [+]   [X] │ │ Total:       │
│ └─────────────────────────────┘ │ ₹588         │
│                                 │              │
│ [Continue Shopping]             │ [Proceed to  │
│                                 │  Checkout]   │
│ ─────────────────────────────── │              │
│ Promo Code: [___________] Apply │ ✓ Free ship  │
│                                 │   at ₹499    │
└─────────────────────────────────┴──────────────┘
```

**Features:**
- Quantity update (instant price recalculation)
- Remove item
- Save for later option
- Promo code application
- Shipping calculator (based on pincode)
- Free shipping progress bar if <₹499

**Trust Elements:**
- Secure checkout badge
- Accepted payment methods icons
- Customer support contact

**Recommendations:**
- "Frequently Bought Together" section below cart
- "Customers Also Viewed"

---

### 9. CHECKOUT PAGE

**Single-Page Checkout (Preferred) OR Multi-Step**

```
Progress Bar: Cart > Information > Payment > Confirm

SECTION 1: Contact Information
┌──────────────────────────────┐
│ Email: [________________]    │ (Auto-fill if logged in)
│ ☐ Email me with offers       │
└──────────────────────────────┘

SECTION 2: Delivery Address
┌──────────────────────────────┐
│ Full Name: [____________]    │
│ Phone: [_________________]   │
│ Address Line 1: [_______]    │
│ Address Line 2: [_______]    │
│ City: [_____] State: [___]   │
│ PIN Code: [______]           │
│ Address Type: ○ Home ○ Work  │
│ ☐ Save for future orders     │
└──────────────────────────────┘

SECTION 3: Delivery Method
┌──────────────────────────────┐
│ ◉ Standard (3-5 days) - FREE │ (for orders >₹499)
│ ○ Express (1-2 days) - ₹99   │
└──────────────────────────────┘

SECTION 4: Payment Method
┌──────────────────────────────┐
│ ○ Razorpay (UPI/Card/Wallet) │
│ ○ Cash on Delivery (+₹30)    │
└──────────────────────────────┘

ORDER SUMMARY (Sticky Sidebar)
┌──────────────────────────────┐
│ 2 Items                      │
│ ────────────────             │
│ [Mini cart items]            │
│ ────────────────             │
│ Subtotal:  ₹599              │
│ Shipping:  FREE              │
│ ────────────────             │
│ Total:     ₹599              │
│                              │
│ [Place Order]                │
│                              │
│ 🔒 Secure Checkout           │
└──────────────────────────────┘

Below order button:
- Terms & Conditions acceptance checkbox
- Security badges (SSL, Razorpay)
- Return policy link
```

**Form Validation:**
- Real-time validation
- Error messages below fields
- PIN code serviceability check
- Phone number format validation

**Trust Elements:**
- SSL badge
- Razorpay secure badge
- "Your data is protected" message
- Customer support contact prominently displayed

---

### 10. MY ACCOUNT / USER DASHBOARD

**Sidebar Navigation:**
```
- Dashboard
- Orders
- Addresses
- Wishlist
- Account Details
- Logout
```

**10.1 Dashboard Overview**
```
Welcome back, [Name]!

Quick Stats:
┌─────────┬─────────┬─────────┐
│ Orders  │ Wishlist│ Rewards │
│   12    │    5    │  ₹150   │
└─────────┴─────────┴─────────┘

Recent Orders:
[List of 3 most recent orders with status]

Quick Actions:
- Reorder favorite products
- Track current order
- Update profile
```

**10.2 Orders Page**
```
Tabs: All Orders | Processing | Shipped | Delivered | Cancelled

Order Card:
┌─────────────────────────────────────┐
│ Order #VER-2024-001                 │
│ Placed: Jan 15, 2024                │
│ Status: Delivered ✓                 │
│ ─────────────────────────────       │
│ [Product Image] Product Name        │
│                 Qty: 2              │
│ ─────────────────────────────       │
│ Total: ₹599                         │
│                                     │
│ [View Details] [Reorder] [Invoice] │
└─────────────────────────────────────┘
```

**10.3 Order Detail Page**
```
Order #VER-2024-001
Status: Shipped
Expected Delivery: Jan 20, 2024

Tracking:
[Progress bar: Ordered > Processed > Shipped > Delivered]

Items:
[List with images, names, quantities, prices]

Shipping Address:
[Full address]

Payment Method:
[Payment mode used]

Order Summary:
Subtotal: ₹599
Shipping: FREE
Total: ₹599

Actions:
- Download Invoice
- Request Return (if applicable)
- Contact Support
```

**10.4 Addresses Page**
```
Saved Addresses

[Address Card 1] - Default
[Address Card 2]

Each card:
- Name, Phone
- Full Address
- Actions: Edit | Delete | Set as Default

[+ Add New Address] button
```

**10.5 Wishlist Page**
```
Your Saved Items (5)

Grid of product cards (same as shop page)
Each with:
- Remove from wishlist icon
- Add to cart button
- Stock status
```

**10.6 Account Details**
```
Profile Information
- Name
- Email
- Phone
- [Update] button

Change Password
- Current Password
- New Password
- Confirm Password
- [Update Password] button

Preferences
- Email notifications checkbox
- WhatsApp updates checkbox

[Save Preferences]
```

---

### 11. FOOTER (Global)

**Layout: 4 Columns + Bottom Bar**

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ ABOUT       │ SHOP        │ SUPPORT     │ CONNECT     │
│ VERITRAA    │             │             │             │
│             │             │             │             │
│ Our Story   │ All Products│ Contact Us  │ 📍 Address  │
│ Quality     │ Premium     │ Shipping    │ ☎️  Phone    │
│  Promise    │  Blends     │  Policy     │ ✉️  Email    │
│ Core Values │ Core Range  │ Returns &   │             │
│ Bulk Orders │ Bulk Orders │  Refunds    │ Follow Us:  │
│             │             │ FAQs        │ [Ig] [Fb]   │
│             │             │ Track Order │ [Wa] [Li]   │
└─────────────┴─────────────┴─────────────┴─────────────┘

Newsletter Signup Section (Full-width, cream background)
┌───────────────────────────────────────────────────────┐
│ Join the Veritraa Family                              │
│ Get recipes, quality insights & exclusive offers      │
│ [Email Input Field]  [Subscribe Button]               │
└───────────────────────────────────────────────────────┘

Bottom Bar (Dark green background)
┌───────────────────────────────────────────────────────┐
│ © 2024 Veritraa. All rights reserved.                 │
│ Privacy Policy | Terms & Conditions | Sitemap         │
│ [Payment Icons: Razorpay, UPI, Cards, COD]           │
└───────────────────────────────────────────────────────┘
```

---

## 🛒 E-Commerce Features Specification

### Product Management

**Product Attributes:**
```
- SKU
- Product Name
- Category (Premium Blends / Core Range / Dry Fruits)
- Sub-category (Masala Blends / Single Spices / etc.)
- Variants:
  * Weight (100g, 250g, 500g, 1kg)
  * Each with separate:
    - Price
    - Stock quantity
    - SKU
- Description (Short & Long)
- Key Highlights (bullet points)
- Ingredients
- Nutritional Info (if applicable)
- Storage Instructions
- Usage Instructions
- Images (Multiple - min 4 per product)
- SEO Meta Title
- SEO Meta Description
- Related Products
- Status (Active/Draft/Out of Stock)
- Featured Product (Yes/No)
- Best Seller Badge (Yes/No)
- New Product Badge (Yes/No)
```

**Inventory Management:**
- Real-time stock tracking
- Low stock alerts (email to admin at <10 units)
- Out of stock handling:
  * Hide "Add to Cart"
  * Show "Notify When Available" email signup
- Bulk inventory update capability

**Pricing:**
- Regular price
- Sale price (optional)
- Bulk pricing tiers:
  * 5-10 units: 5% off
  * 10-20 units: 10% off
  * 20+ units: 15% off (auto-applied at cart)

---

### Shopping Cart Features

**Cart Functionality:**
- Add to cart (without page reload - AJAX)
- Update quantity
- Remove item
- Save for later
- Mini cart (sidebar/dropdown) with item count badge
- Persistent cart (7 days for guest, indefinite for logged-in users)
- Cart abandonment email (after 2 hours - Phase 2)

**Cart Validations:**
- Stock availability check
- Minimum order value (if set)
- Maximum quantity per product (if set)

**Promotions:**
- Coupon code application
- Automatic discounts (bulk, first order, etc.)
- Free shipping threshold progress bar
- Gift with purchase (Phase 2)

---

### Checkout Process

**Checkout Features:**
- Guest checkout (with email)
- Registered user checkout (auto-fill)
- Multiple shipping addresses
- Address validation (PIN code serviceability)
- Shipping method selection
- Payment gateway integration (Razorpay)
- COD option (with ₹30 charge)
- Order notes field
- Terms & Conditions acceptance

**Payment Methods:**
- Razorpay Integration:
  * Credit/Debit Cards
  * UPI
  * Net Banking
  * Wallets (Paytm, PhonePe, etc.)
- Cash on Delivery
- Bank Transfer (for bulk orders - manual process)

**Order Confirmation:**
- Immediate on-screen confirmation
- Email confirmation with:
  * Order number
  * Items ordered
  * Shipping address
  * Payment method
  * Expected delivery date
  * Invoice (PDF attachment)
  * Track order link

---

### User Account Features

**Registration/Login:**
- Email + Password
- Social Login (Google, Facebook - Phase 2)
- OTP-based login (WhatsApp/SMS - Phase 2)
- Guest checkout option

**Account Features:**
- Order history (with reorder option)
- Saved addresses (multiple)
- Wishlist
- Product reviews submission
- Profile editing
- Password change
- Email preferences

**Loyalty Program (Phase 2):**
- Points on purchases
- Referral rewards
- Birthday discounts

---

### Shipping & Delivery

**Shipping Zones & Rates:**
```
India-wide shipping

Zone 1 (Metro cities):
- Standard (3-4 days): FREE above ₹499, ₹40 below
- Express (1-2 days): ₹99

Zone 2 (Rest of India):
- Standard (4-6 days): FREE above ₹499, ₹60 below
- Express (2-3 days): ₹149

International (Phase 2)
```

**Delivery Features:**
- Real-time shipping calculator
- PIN code serviceability check
- Delivery date estimator
- Order tracking (via courier partner API)
- Delivery notifications:
  * Order placed
  * Order shipped (with tracking number)
  * Out for delivery
  * Delivered

**Shipping Integration:**
- Shiprocket / Delhivery / Dunzo (for local)
- Multi-carrier support
- Auto-selection of best carrier based on destination

---

### Returns & Refunds

**Policy:**
- 7-day return policy (for unopened products)
- Refund or replacement option
- Free return shipping (for defective products)
- Restocking fee: None for defective, 10% for change of mind

**Process:**
- Customer initiates return from account dashboard
- Admin approves/rejects with reason
- Return shipping label generated
- Refund processed within 5-7 days after receiving product

**Exceptions:**
- No returns on opened food products (unless defective)
- Custom/bulk orders non-returnable

---

### Reviews & Ratings

**Review System:**
- Star rating (1-5)
- Written review (optional)
- Photo upload (optional - Phase 2)
- Verified purchase badge
- Helpful/Not Helpful voting
- Admin moderation (approve before publish)

**Display:**
- Average rating on product card
- Rating breakdown on PDP (5-star graph)
- Most helpful reviews highlighted
- Sort by: Most Recent, Highest Rated, Most Helpful

---

### Search Functionality

**Search Features:**
- Predictive search (autocomplete)
- Search suggestions
- Product image in suggestions
- Recent searches (for logged-in users)
- No results → Show popular products + contact support

**Search Filters:**
- By product name
- By category
- By ingredients (future)
- By price range

---

### SEO & Performance

**SEO Optimization:**
- Unique meta titles & descriptions per page
- Schema markup:
  * Product schema (name, price, availability, reviews)
  * Breadcrumb schema
  * Organization schema
  * FAQ schema
- Clean URL structure: `/shop/turmeric-powder`
- Image alt texts
- XML sitemap (auto-generated)
- Robots.txt
- Canonical URLs
- Open Graph tags (for social sharing)

**Performance:**
- Image optimization (WebP format, lazy loading)
- CDN for static assets
- Minified CSS/JS
- Browser caching
- Gzip compression
- Target: Google PageSpeed score >90

---

### Analytics & Tracking

**Implement:**
- Google Analytics 4
  * E-commerce tracking
  * Conversion funnels
  * User behavior flow
  * Product performance
  
- Facebook Pixel
  * Conversion tracking
  * Retargeting audiences
  
- Google Tag Manager
  * Event tracking (Add to Cart, Purchase, etc.)

**Key Metrics to Track:**
- Traffic sources
- Conversion rate
- Average order value
- Cart abandonment rate
- Product views → Add to cart rate
- Search terms
- Popular products
- Customer lifetime value

---

### Email Marketing

**Automated Emails:**
1. Welcome email (on registration)
2. Order confirmation
3. Shipping notification
4. Delivery confirmation
5. Review request (3 days post-delivery)
6. Cart abandonment (2 hours, 24 hours)
7. Wishlist reminder (7 days)
8. Re-engagement (30 days inactive)

**Newsletter:**
- Monthly newsletter
- New product launches
- Recipes & usage tips
- Exclusive offers
- Unsubscribe option

**Email Design:**
- Responsive HTML templates
- Brand colors & fonts
- Clear CTAs
- Product images

**Tool:** SendGrid / Mailchimp / Klaviyo

---

### WhatsApp Integration (Phase 1.5)

**Use Cases:**
- Order confirmation message
- Shipping updates
- Customer support
- Bulk order inquiries
- Quick reorder (click-to-chat)

**Implementation:**
- WhatsApp Business API OR
- Twilio WhatsApp Business

---

## 📱 Mobile App Considerations (Phase 3)

**Current:**
- 100% responsive web design
- PWA features:
  * Add to home screen prompt
  * Offline fallback page
  * Push notifications (browser)

**Future Native App Features:**
- Barcode scanner (for batch traceability)
- Push notifications
- Saved payment methods
- Voice search
- AR product visualization

---

## 🔐 Security & Compliance

### Security Measures

**SSL Certificate:**
- HTTPS across entire site
- 256-bit encryption

**Payment Security:**
- PCI DSS compliant (via Razorpay)
- No card details stored on server
- Secure payment gateway redirect

**Data Protection:**
- Password hashing (bcrypt)
- SQL injection prevention
- XSS protection
- CSRF tokens
- Rate limiting on forms
- Regular security audits

**Backup:**
- Daily automated backups
- 30-day retention
- Off-site storage (AWS S3)

### Legal Compliance

**Required Pages:**
1. **Privacy Policy**
   - Data collection details
   - Cookie usage
   - Third-party sharing
   - User rights (GDPR-ready)

2. **Terms & Conditions**
   - User agreement
   - Prohibited uses
   - Intellectual property
   - Limitation of liability

3. **Shipping Policy**
   - Delivery timelines
   - Shipping charges
   - Coverage areas
   - Delays & force majeure

4. **Return & Refund Policy**
   - Eligibility criteria
   - Process
   - Timeline
   - Exceptions

5. **Cancellation Policy**
   - Order cancellation window
   - Refund process

**FSSAI Compliance:**
- FSSAI license number displayed
- Product labeling standards
- Ingredient listing
- Nutritional info (where required)
- Manufacturing/Packing date
- Best before date

**Cookie Consent:**
- Cookie banner on first visit
- Accept/Reject/Customize options
- Cookie policy page

---

## 🎨 Design Assets Required

### Photography

**Product Photography:**
- **Per Product (15+ images per product):**
  * Hero image (white background, 2000x2000px)
  * Lifestyle images (in use, 1200x1200px) - 3-4 shots
  * Close-up (texture, color)
  * Packaging (front, back, side)
  * Ingredient spread
  * Size comparison
  * All angles

**Brand Photography:**
- Source farms/regions (10+ images)
- Processing facility (8-10 images)
- Women workers (respectful, empowering shots) (10+)
- Spice close-ups/textures (20+)
- Recipe/cooking shots (Phase 2)

**Hero Banners:**
- Homepage hero (1920x800px) - 3 variations
- Category banners (1920x400px)
- Promotional banners (various sizes)

### Graphic Elements

**Icons:**
- Trust badges (Lab Tested, FSSAI, etc.) - Vector
- Product category icons - Set of 10
- Feature icons (shipping, COD, returns, etc.) - Set of 15
- Social media icons (branded) - Set of 5
- UI icons (cart, wishlist, search, etc.) - Set of 30

**Illustrations:**
- Botanical line art (leaves, spices) - 10+ elements
- Process flow diagrams
- Infographics (sourcing map, quality process)

**Logo Files:**
- Primary logo (color, white, black)
- Logomark/icon (for favicon, social)
- Formats: SVG, PNG (transparent), AI

**Brand Patterns:**
- Subtle background pattern (botanical motif)
- Packaging pattern (if applicable)

### Video Content (Phase 2)

- Brand story video (2 min)
- Product usage videos (30 sec each)
- Behind-the-scenes (processing, testing)
- Recipe videos

---

## 🧪 Testing Requirements

### Pre-Launch Testing

**Functional Testing:**
- [ ] All navigation links work
- [ ] Search functionality
- [ ] Filter & sort work correctly
- [ ] Product quick view
- [ ] Add to cart (all variants)
- [ ] Cart operations (update qty, remove, save for later)
- [ ] Coupon code application
- [ ] Checkout flow (guest & registered)
- [ ] Payment gateway (test transactions)
- [ ] Order confirmation emails
- [ ] Account registration/login
- [ ] Password reset
- [ ] Address management
- [ ] Order history
- [ ] Wishlist operations
- [ ] Review submission
- [ ] Contact form
- [ ] Newsletter signup
- [ ] Bulk order form

**Browser Testing:**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

**Device Testing:**
- Desktop (1920x1080, 1366x768)
- Laptop (1440x900)
- Tablet (iPad, Android tablets)
- Mobile (iPhone 12/13/14, Android phones - various sizes)

**Performance Testing:**
- Page load speed (<2 sec)
- Image optimization
- Server response time
- Database query optimization
- Load testing (simulate 1000 concurrent users)

**Security Testing:**
- SQL injection attempts
- XSS attempts
- CSRF protection
- SSL certificate validation
- Payment security (PCI compliance check)

**SEO Testing:**
- Meta tags present
- Schema markup validation
- XML sitemap generation
- Robots.txt
- Mobile-friendliness (Google test)
- Page speed (Google PageSpeed Insights)

**Usability Testing:**
- 5-10 target users navigate site
- Task completion rate
- Time to checkout
- Confusion points
- Feedback collection

---

## 📊 Admin Panel Requirements

### Dashboard

**Overview Widgets:**
- Today's sales (₹)
- This month's sales (₹)
- Total orders (today, this month)
- Pending orders (needs attention)
- Low stock alerts
- Recent orders (last 10)
- Top-selling products (this month)
- Traffic overview (GA integration)

**Quick Actions:**
- Add new product
- Process pending order
- View all orders
- Manage inventory

### Order Management

**Orders List:**
- Filters: Status, Date Range, Payment Method
- Search: Order ID, Customer Name, Email, Phone
- Bulk actions: Export, Update Status
- Columns: Order ID, Date, Customer, Items, Total, Status, Actions

**Order Detail:**
- Customer info (name, email, phone)
- Shipping address
- Items ordered (with images)
- Payment method & status
- Order timeline
- Actions:
  * Update status (Processing, Shipped, Delivered, Cancelled)
  * Add tracking number
  * Send notification to customer
  * Print invoice
  * Print packing slip
  * Issue refund
  * Add internal notes

**Order Statuses:**
- Pending Payment
- Processing
- Shipped
- Delivered
- Cancelled
- Refunded
- Failed

### Product Management

**Products List:**
- Filters: Category, Stock Status, Product Type
- Search by name/SKU
- Bulk actions: Delete, Update Category, Export
- Columns: Image, Name, SKU, Price, Stock, Status, Actions

**Add/Edit Product:**
- General Info:
  * Product name
  * SKU
  * Category
  * Description (WYSIWYG editor)
  * Short description
- Pricing:
  * Regular price
  * Sale price
  * Bulk pricing tiers
- Inventory:
  * Stock quantity (per variant)
  * Low stock threshold
  * Stock status (In Stock / Out of Stock)
- Variants:
  * Weight options (100g, 250g, etc.)
  * Price per variant
  * SKU per variant
  * Stock per variant
- Images:
  * Multiple upload
  * Drag-to-reorder
  * Set featured image
- Product Data:
  * Key highlights (repeater field)
  * Ingredients
  * Nutritional info
  * Storage instructions
  * Usage instructions
- SEO:
  * Meta title
  * Meta description
  * Slug
- Related Products (multi-select)
- Badges (Featured, Best Seller, New)
- Publish status

**Categories Management:**
- Add/Edit/Delete categories
- Category image
- Category description
- SEO fields

### Customer Management

**Customers List:**
- Search by name/email/phone
- Filters: Registration date, Order count
- Columns: Name, Email, Phone, Orders, Total Spent, Last Order, Actions

**Customer Detail:**
- Personal info
- Order history
- Addresses
- Wishlist
- Total spent
- Average order value
- Actions:
  * Send email
  * Add note
  * View orders

### Inventory Management

**Stock Overview:**
- All products with current stock
- Low stock alerts (highlighted)
- Out of stock products
- Bulk stock update (CSV import)

### Bulk Orders Management

**Quote Requests List:**
- Pending / Responded / Converted
- Customer details
- Products requested
- Quantity
- Actions:
  * Send quote
  * Mark as converted
  * Add notes

### Coupons & Discounts

**Coupons List:**
- Active / Expired / Scheduled

**Add/Edit Coupon:**
- Coupon code
- Discount type (% or fixed ₹)
- Discount amount
- Minimum purchase
- Maximum discount (for %)
- Usage limit (total & per user)
- Valid from/to dates
- Applicable products/categories
- Exclude sale items (checkbox)

**Automatic Discounts:**
- Bulk purchase discounts
- First order discount
- Free shipping thresholds

### Reviews Management

**Reviews List:**
- Pending approval
- Approved
- Spam

**Review Moderation:**
- Approve/Reject
- Mark as spam
- Reply to review (Phase 2)

### Reports & Analytics

**Sales Reports:**
- Sales by date range
- Sales by product
- Sales by category
- Payment method breakdown

**Customer Reports:**
- New customers
- Customer lifetime value
- Repeat purchase rate

**Product Reports:**
- Top sellers
- Low performers
- Inventory value

**Export:**
- All reports exportable to CSV/Excel

### Content Management

**Pages:**
- Edit About Us
- Edit Quality Promise
- Edit T&C, Privacy Policy, etc.

**Banners:**
- Homepage hero slider
- Promotional banners
- Manage all banners

**Blog (Phase 2):**
- Add/Edit posts
- Categories
- Tags

### Settings

**General Settings:**
- Site name & tagline
- Logo upload
- Favicon
- Contact info
- Social media links

**Email Settings:**
- SMTP configuration
- Email templates (order confirmation, etc.)
- Test email

**Shipping Settings:**
- Shipping zones
- Rates per zone
- Free shipping threshold
- Courier partner integration

**Payment Settings:**
- Razorpay API keys
- COD enable/disable
- COD charges

**Tax Settings (if applicable):**
- GST configuration

**SEO Settings:**
- Default meta description
- Google Analytics ID
- Facebook Pixel ID

### User Roles & Permissions

**Roles:**
- Super Admin (full access)
- Admin (all except settings)
- Order Manager (orders only)
- Content Manager (products, pages, blogs)
- Customer Support (view orders, customers)

---

## 🚀 Launch Plan

### Phase 1: MVP Launch (Weeks 1-8)

**Week 1-2: Setup & Design**
- [ ] Domain & hosting setup
- [ ] Install CMS/platform
- [ ] Design system finalization
- [ ] Homepage design approval
- [ ] Key page designs (Shop, PDP, Cart, Checkout)

**Week 3-4: Core Development**
- [ ] Frontend development (all pages)
- [ ] Product structure setup
- [ ] Shopping cart implementation
- [ ] Checkout flow
- [ ] Payment gateway integration
- [ ] User registration/login

**Week 5: Content & Products**
- [ ] Product photography
- [ ] Product listing (all 15 products)
- [ ] Content writing for all pages
- [ ] Legal pages
- [ ] Email templates

**Week 6: Testing**
- [ ] Functionality testing
- [ ] Cross-browser testing
- [ ] Mobile testing
- [ ] Payment testing
- [ ] Load testing
- [ ] Bug fixing

**Week 7: Pre-Launch**
- [ ] SEO optimization
- [ ] Analytics setup
- [ ] Social media setup
- [ ] Email marketing tool setup
- [ ] Customer support system (WhatsApp Business)
- [ ] Staff training (admin panel)

**Week 8: Launch**
- [ ] Final checks
- [ ] Go live
- [ ] Launch announcement (email, social)
- [ ] Monitor closely for issues

### Phase 2: Enhancements (Months 3-6)

- [ ] Customer reviews & ratings (if not in Phase 1)
- [ ] Loyalty program
- [ ] Recipe section
- [ ] Blog
- [ ] Advanced filtering
- [ ] Wishlist sharing
- [ ] Social proof notifications ("X people bought this")
- [ ] Product recommendations engine
- [ ] Live chat support
- [ ] WhatsApp automation
- [ ] Email automation flows (abandoned cart, etc.)
- [ ] Instagram shop integration
- [ ] Gift options
- [ ] Subscription model (monthly spice box)

### Phase 3: Advanced Features (Months 6-12)

- [ ] Mobile app (iOS & Android)
- [ ] AR product visualization
- [ ] Batch traceability (QR code scan)
- [ ] Voice search
- [ ] Multi-language support
- [ ] International shipping
- [ ] B2B portal (separate login for wholesalers)
- [ ] Advanced analytics dashboard
- [ ] AI-powered product recommendations
- [ ] Chatbot

---

## 💰 Budget Estimate

### Initial Setup (One-Time Costs)

| Item | Cost (INR) |
|------|------------|
| **Design & Development** | |
| Website design (premium) | ₹50,000 - ₹1,00,000 |
| Frontend development | ₹60,000 - ₹1,20,000 |
| Backend development | ₹40,000 - ₹80,000 |
| Admin panel customization | ₹20,000 - ₹40,000 |
| **OR Shopify Theme + Customization** | ₹30,000 - ₹60,000 |
| **Content** | |
| Professional product photography (15 products) | ₹25,000 - ₹50,000 |
| Copywriting | ₹15,000 - ₹25,000 |
| Video content (Phase 2) | ₹50,000+ |
| **Technical** | |
| Domain name (.com) | ₹800/year |
| SSL certificate | FREE (via hosting/Cloudflare) |
| **Legal** | |
| Privacy Policy, T&C drafting | ₹5,000 - ₹10,000 |
| **TOTAL (Custom Build)** | **₹2,10,800 - ₹4,16,800** |
| **TOTAL (Shopify Route)** | **₹1,00,800 - ₹1,75,800** |

### Monthly Recurring Costs

| Item | Cost (INR/month) |
|------|------------------|
| **Hosting & Infrastructure** | |
| Shopify Plan (if using) | ₹2,000 - ₹6,500 |
| OR VPS Hosting (Custom) | ₹2,000 - ₹8,000 |
| CDN (Cloudflare Pro) | ₹1,500 (optional) |
| **Software & Tools** | |
| Email marketing (SendGrid/Mailchimp) | ₹1,000 - ₹3,000 |
| SMS/WhatsApp API | ₹1,000 - ₹5,000 (usage-based) |
| Analytics tools | FREE - ₹3,000 |
| **Transaction Fees** | |
| Razorpay (2% + GST per transaction) | Variable |
| **Maintenance** | |
| Developer support (as needed) | ₹5,000 - ₹15,000 |
| **Marketing** | |
| Google Ads | ₹10,000 - ₹50,000 |
| Facebook/Instagram Ads | ₹10,000 - ₹50,000 |
| SEO tools (Ahrefs/SEMrush) | ₹8,000 - ₹15,000 |
| **TOTAL (excluding marketing)** | **₹12,500 - ₹40,500** |
| **TOTAL (with marketing)** | **₹40,500 - ₹1,55,500** |

**Note:** Marketing budget can scale based on revenue.

---

## 📈 Marketing & Growth Strategy

### Pre-Launch (2-4 weeks before)

**Build Anticipation:**
- [ ] Create social media accounts (Instagram, Facebook, WhatsApp Business)
- [ ] Post behind-the-scenes content (sourcing, testing, packaging)
- [ ] Build email list (landing page with "Notify Me" form)
- [ ] Reach out to food bloggers/influencers
- [ ] Create brand story video

**Offer:**
- Early bird discount (20% off for first 100 orders)
- Free shipping for launch week

### Launch Week

**Channels:**
- [ ] Email blast to waitlist
- [ ] Social media announcements
- [ ] PR outreach (food magazines, local media)
- [ ] Influencer unboxing/reviews
- [ ] WhatsApp broadcast (if you have contacts)
- [ ] Google My Business listing
- [ ] Google Ads (branded keywords)
- [ ] Facebook/Instagram ads (lookalike audiences)

### Ongoing Marketing (Post-Launch)

**SEO:**
- Blog content (recipes, spice benefits, cooking tips)
- Guest posts on food blogs
- Backlink building
- Local SEO optimization

**Social Media:**
- Instagram: Product photography, recipes, customer reviews, stories
- Facebook: Community building, ads
- Pinterest: Recipe pins (high intent traffic)
- YouTube: Recipe videos, brand story (Phase 2)

**Paid Advertising:**
- **Google Ads:**
  * Search ads (branded + category keywords)
  * Shopping ads (product listings)
  * Display retargeting
- **Facebook/Instagram:**
  * Carousel ads (product showcase)
  * Collection ads
  * Retargeting (cart abandoners, site visitors)
  * Lookalike audiences

**Email Marketing:**
- Welcome series (3 emails)
- Weekly newsletter (recipes, new products)
- Abandoned cart recovery
- Post-purchase follow-up
- Re-engagement campaigns

**Influencer Marketing:**
- Micro-influencers (5k-50k followers) in food niche
- Product seeding
- Affiliate partnerships (10% commission)

**Partnerships:**
- Collaborate with recipe creators
- Partner with meal kit services
- Retail partnerships (local gourmet stores)

**Referral Program:**
- Give ₹100, Get ₹100 (for referrer and referee)

**Content Marketing:**
- Blog (SEO-focused):
  * "10 Authentic Maharashtrian Recipes"
  * "How to Identify Pure Turmeric"
  * "Spice Storage Guide"
  * etc.
- Video recipes
- Downloadable spice guides (lead magnets)

**Community Building:**
- Facebook group for customers
- Recipe contest (user-generated content)
- Feature customer photos (with permission)

---

## 🎯 KPIs & Success Metrics

### Website Performance
- **Page Load Time:** <2 seconds
- **Bounce Rate:** <50%
- **Session Duration:** >2 minutes
- **Pages per Session:** >3

### E-Commerce Metrics
- **Conversion Rate:** 2-4% (target: 3%)
- **Average Order Value:** ₹600-1000 (target: ₹800)
- **Cart Abandonment Rate:** <70% (target: 60%)
- **Add-to-Cart Rate:** >5% of product views

### Customer Metrics
- **Customer Acquisition Cost:** <₹200
- **Customer Lifetime Value:** >₹2,000
- **Repeat Purchase Rate:** >30% within 6 months
- **Net Promoter Score:** >50

### Sales Metrics
- **Monthly Revenue:** (Set based on goals)
- **Orders per Month:** (Set based on goals)
- **Revenue per Visitor:** >₹20

### Marketing Metrics
- **Email Open Rate:** >20%
- **Email Click Rate:** >3%
- **Social Media Engagement:** >2%
- **ROAS (Return on Ad Spend):** >3:1 (₹3 revenue per ₹1 ad spend)

---

## 📋 Content Checklist

### Required Content (Before Launch)

**Homepage:**
- [x] Hero headline & subheadline (provided)
- [x] Brand story excerpt (provided)
- [x] Product descriptions (provided)
- [ ] Customer testimonials (collect)
- [ ] FAQ section (create)

**Product Pages:**
- [x] Product names (provided)
- [x] Descriptions (provided)
- [x] Key highlights (provided)
- [ ] High-res images (arrange photoshoot)
- [ ] Pricing (set based on cost)
- [ ] Stock quantities (determine)

**About Page:**
- [x] Brand story (provided)
- [x] Vision & Mission (provided)
- [x] Core values (provided)
- [ ] Team photos (if applicable)
- [ ] Facility images (if available)

**Legal Pages:**
- [ ] Privacy Policy (draft with lawyer)
- [ ] Terms & Conditions (draft with lawyer)
- [ ] Shipping Policy (create based on logistics)
- [ ] Return & Refund Policy (define policy, then write)

**Other:**
- [ ] FAQ (at least 15 questions)
- [ ] Contact page content
- [ ] Email templates (order confirmation, shipping, etc.)
- [ ] Social media bio & descriptions

---

## 🛠️ Technical Specifications

### Performance Requirements

**Load Times:**
- Homepage: <2 seconds
- Product page: <2.5 seconds
- Checkout: <2 seconds

**Optimization:**
- Images: WebP format, lazy loading, max 150KB per image
- CSS/JS: Minified and combined
- Caching: Browser caching (7 days), server-side caching
- Database: Indexed queries, optimized

### Browser Support
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- iOS Safari (last 2 versions)
- Chrome Android (last 2 versions)

### Responsive Breakpoints
```css
Mobile: 320px - 767px
Tablet: 768px - 1023px
Desktop: 1024px - 1919px
Large Desktop: 1920px+
```

### Accessibility (WCAG 2.1 Level AA)
- Keyboard navigation support
- Screen reader compatibility
- Color contrast ratios (minimum 4.5:1)
- Alt text for all images
- ARIA labels for interactive elements
- Focus indicators
- Skip to main content link

### API Integrations

**Payment:**
- Razorpay API v2
- Webhook for payment status updates

**Shipping:**
- Shiprocket API OR Delhivery API
- Real-time rate calculation
- Tracking updates

**Email:**
- SendGrid API OR SMTP
- Transactional emails
- Marketing emails

**SMS/WhatsApp:**
- Twilio / Gupshup / Interakt
- Order notifications
- OTP (Phase 2)

**Analytics:**
- Google Analytics 4
- Facebook Pixel
- Google Tag Manager

**Social:**
- Instagram Basic Display API (for feed - Phase 2)

---

## 🔄 Maintenance & Updates

### Daily
- Monitor order processing
- Respond to customer queries
- Check website uptime
- Review analytics dashboard

### Weekly
- Update inventory
- Process reviews
- Check for broken links
- Review top-performing products
- Analyze cart abandonment

### Monthly
- Backup verification
- Security updates
- Performance audit
- SEO ranking check
- Competitor analysis
- Content calendar planning
- Email campaign review

### Quarterly
- Major feature updates
- Design refresh (if needed)
- Customer feedback review
- Pricing strategy review
- A/B testing results
- Marketing strategy adjustment

### Annually
- Full security audit
- Platform/plugin updates
- Domain & SSL renewal
- Legal compliance review
- Full inventory audit

---

## 🚨 Risk Mitigation

### Technical Risks

**Risk: Website downtime**
- Mitigation: 99.9% uptime SLA from hosting provider, status page, backup hosting

**Risk: Payment gateway failure**
- Mitigation: Backup payment method (bank transfer instructions), real-time monitoring

**Risk: Security breach**
- Mitigation: Regular security audits, SSL, secure coding practices, backups

**Risk: Slow website**
- Mitigation: CDN, image optimization, caching, regular performance tests

### Business Risks

**Risk: Low initial traffic**
- Mitigation: Pre-launch marketing, email list building, paid ads budget

**Risk: High cart abandonment**
- Mitigation: Abandoned cart emails, simplify checkout, trust badges, free shipping threshold

**Risk: Product returns**
- Mitigation: Clear product descriptions, high-quality images, quality control

**Risk: Cash flow issues**
- Mitigation: Start with limited inventory, COD limits, bulk order prepayment

### Operational Risks

**Risk: Inventory stockouts**
- Mitigation: Low stock alerts, demand forecasting, backup suppliers

**Risk: Shipping delays**
- Mitigation: Multiple courier partners, clear delivery timelines, proactive communication

**Risk: Customer service overload**
- Mitigation: Comprehensive FAQ, chatbot (Phase 2), WhatsApp Business

---

## 📞 Support & Training

### Customer Support Channels

**Live Support:**
- WhatsApp Business: +91-XXXXXXXXXX (9 AM - 6 PM, Mon-Sat)
- Phone: +91-XXXXXXXXXX (same hours)

**Asynchronous:**
- Email: hello@veritraa.com (24-hour response time)
- Contact form on website

**Self-Service:**
- Comprehensive FAQ page
- Order tracking page
- Knowledge base (Phase 2)

### Staff Training Required

**Admin Panel Training:**
- How to add/edit products
- Processing orders
- Managing inventory
- Applying coupons
- Running reports
- Handling returns

**Customer Service Training:**
- Product knowledge
- Order issues resolution
- Return/refund process
- Escalation procedures
- Tone & brand voice

**Documentation:**
- Admin manual (PDF)
- Video tutorials
- Quick reference guides

---

## 📝 Post-Launch Checklist

### Week 1
- [ ] Monitor site 24/7 for critical issues
- [ ] Process all orders promptly
- [ ] Respond to all customer queries <2 hours
- [ ] Track conversion rate daily
- [ ] Check payment gateway reconciliation
- [ ] Monitor social media mentions
- [ ] Send thank-you email to first customers

### Week 2-4
- [ ] Collect customer feedback
- [ ] Request reviews from satisfied customers
- [ ] Analyze best-selling products
- [ ] Identify drop-off points in checkout
- [ ] A/B test homepage hero
- [ ] Optimize ad campaigns
- [ ] Plan content for next month

### Month 2-3
- [ ] Implement abandoned cart emails
- [ ] Launch referral program
- [ ] Start blog content
- [ ] Explore influencer partnerships
- [ ] Optimize product pages based on data
- [ ] Consider product expansion

---

## 🎨 Brand Assets Package

### Logo Variations Needed
```
1. Primary Logo (horizontal)
   - Full color
   - White (for dark backgrounds)
   - Black (for light backgrounds)

2. Logo Icon/Mark
   - Full color
   - White
   - Black

3. File Formats:
   - SVG (for web)
   - PNG (transparent, 512x512, 1024x1024, 2048x2048)
   - AI/EPS (source files)
   - Favicon (16x16, 32x32, 180x180)
```

### Color Codes
```
Primary Green:   #2D5016 / RGB(45,80,22)
Gold:            #C9A962 / RGB(201,169,98)
Terracotta:      #D4745E / RGB(212,116,94)
Cream:           #F7F4ED / RGB(247,244,237)
Charcoal:        #2C2C2C / RGB(44,44,44)
```

### Typography Files
```
- Crimson Pro (Regular, SemiBold, Bold) - Downloaded from Google Fonts
- Inter (Regular, Medium, SemiBold) - Downloaded from Google Fonts
```

### Icons Required
```
- Trust badges (Set of 6-8) - Custom designed
- Category icons (Set of 5) - Custom or licensed
- Feature icons (Set of 15) - Can use FontAwesome Pro or custom
- Social media icons - Branded versions
```

### Photography Style Guide
```
- Natural lighting
- Earthy, warm tones
- Clean, minimal backgrounds (white/cream)
- Show product texture and color accurately
- Lifestyle shots: homey, authentic, Indian context
- No overly staged/artificial setups
```

---

## 🔗 Recommended Service Providers

### Web Development
- **Freelancer Platforms:** Upwork, Toptal, Fiverr Pro
- **Agencies:** (Research based on portfolio and budget)
- **Shopify Experts:** Shopify Partner Directory

### Photography
- **Local:** (Search "product photography + [your city]")
- **Budget:** DIY with smartphone + lightbox + editing
- **Tools:** Lightroom for editing

### Hosting
- **Shopify:** Built-in hosting
- **Custom Site:** Cloudways, WP Engine, AWS, DigitalOcean

### Email Marketing
- SendGrid (transactional + marketing)
- Mailchimp (marketing-focused)
- Klaviyo (e-commerce specialized - pricey but powerful)

### Payment Gateway
- **Razorpay** (recommended - all payment methods, easy integration)
- PayU
- Instamojo

### Shipping
- **Shiprocket** (aggregator - recommended)
- Delhivery (direct)
- Dunzo (for local/same-day)

### Customer Support
- **WhatsApp Business** (free)
- Freshdesk (ticketing system)
- Intercom (live chat + automation)

### Analytics
- Google Analytics 4 (free)
- Hotjar (heatmaps, session recordings - free tier available)

---

## 🎓 Learning Resources

### For Managing the Website
- Shopify Academy (if using Shopify) - Free courses
- WooCommerce documentation (if using WordPress)
- YouTube: "E-commerce website management"

### For Digital Marketing
- Google Digital Garage (free certifications)
- HubSpot Academy (free marketing courses)
- Neil Patel's blog & YouTube channel

### For Product Photography
- "Product Photography on a Budget" - YouTube tutorials
- Skillshare courses on food photography

### For Email Marketing
- Mailchimp's Marketing Library
- "Email Marketing Best Practices" - various blogs

---

## ✅ Final Pre-Launch Checklist

### Content
- [ ] All product listings complete (15 products)
- [ ] High-quality images uploaded (min 4 per product)
- [ ] About Us page finalized
- [ ] Quality Promise page live
- [ ] All legal pages published
- [ ] Contact information correct
- [ ] FAQ section complete

### Technical
- [ ] Domain configured correctly
- [ ] SSL certificate active (HTTPS working)
- [ ] All pages mobile-responsive
- [ ] Forms tested (contact, newsletter, bulk order)
- [ ] Shopping cart functional
- [ ] Checkout process smooth
- [ ] Payment gateway tested (test mode)
- [ ] Email confirmations working
- [ ] Analytics tracking installed
- [ ] Facebook Pixel installed
- [ ] XML sitemap submitted to Google
- [ ] Google My Business claimed
- [ ] 404 page created

### Compliance
- [ ] FSSAI license number displayed
- [ ] Privacy Policy accessible
- [ ] Terms & Conditions accessible
- [ ] Cookie consent banner active
- [ ] Return policy clearly stated

### Marketing
- [ ] Social media accounts created
- [ ] Email marketing tool configured
- [ ] Welcome email sequence ready
- [ ] Launch announcement drafted
- [ ] Ad campaigns set up (paused, ready to activate)
- [ ] Influencer outreach list prepared

### Operations
- [ ] Order fulfillment process defined
- [ ] Inventory counted and entered
- [ ] Packaging materials ready
- [ ] Shipping accounts active
- [ ] Customer service scripts prepared
- [ ] Staff trained on admin panel

### Testing
- [ ] Full user journey tested (browse → cart → checkout → order)
- [ ] Test orders placed (and cancelled/refunded)
- [ ] All browsers tested
- [ ] All devices tested
- [ ] Page speed >90 on PageSpeed Insights
- [ ] Broken link check passed
- [ ] Accessibility check passed

### Backup
- [ ] Initial full backup taken
- [ ] Backup restoration tested

---

## 🎉 Launch Day Plan

### Morning (Before 10 AM)
- [ ] Final functionality check
- [ ] Switch payment gateway to LIVE mode
- [ ] Take full backup
- [ ] Send launch email to waitlist
- [ ] Post on social media
- [ ] Activate Google Ads
- [ ] Activate Facebook/Instagram Ads
- [ ] Send WhatsApp broadcast (if applicable)

### Throughout Day
- [ ] Monitor website closely (assign team member)
- [ ] Watch for order notifications
- [ ] Respond to queries immediately
- [ ] Monitor analytics in real-time
- [ ] Check payment gateway dashboard
- [ ] Track social media engagement

### Evening
- [ ] Review day's performance
- [ ] Note any issues encountered
- [ ] Plan next day's tasks
- [ ] Thank early customers (personal touch)

### Week 1
- [ ] Daily performance review
- [ ] Process orders promptly
- [ ] Maintain <2-hour customer response time
- [ ] Document any issues
- [ ] Collect customer feedback
- [ ] Make minor optimizations as needed

---

## 📧 Contact & Next Steps

**To build this website, you'll need:**

1. **Finalize Technical Approach:**
   - Decision: Shopify vs. Custom Development
   - Recommendation: **Shopify** for faster launch, lower cost, easier management

2. **Hire Development Team:**
   - Option A: Shopify Expert (find on Shopify Partners)
   - Option B: Full-stack developer (if custom)
   - Timeline: 6-8 weeks

3. **Product Photography:**
   - Book professional photographer OR
   - DIY setup (can guide you)

4. **Legal:**
   - Consult lawyer for T&C, Privacy Policy
   - Ensure FSSAI compliance

5. **Pricing Strategy:**
   - Calculate cost per product
   - Set retail prices (competitor research)
   - Define bulk pricing tiers

6. **Logistics:**
   - Finalize shipping partners
   - Define packaging
   - Set up warehouse/storage

---

## 📎 Appendices

### A. Sample Product Data Structure (CSV)

```csv
SKU,Product Name,Category,Weight,Price,Sale Price,Stock,Description,Image URL
VER-TUR-100,Veritraa Turmeric Powder,Core Range,100g,99,89,500,"Naturally Rich...",https://...
VER-TUR-250,Veritraa Turmeric Powder,Core Range,250g,229,199,300,"Naturally Rich...",https://...
```

### B. Sample Email Templates

**Order Confirmation:**
```
Subject: Order Confirmed - #[ORDER_NUMBER] | Veritraa

Hi [Customer Name],

Thank you for choosing Veritraa! 🌿

Your order has been confirmed and will be shipped within 24 hours.

ORDER DETAILS:
Order Number: #[ORDER_NUMBER]
Order Date: [DATE]

ITEMS:
[Product Name] - [Quantity] x ₹[Price]
...

Subtotal: ₹[SUBTOTAL]
Shipping: ₹[SHIPPING]
Total: ₹[TOTAL]

SHIPPING TO:
[Full Address]

We'll send you another email with tracking details once your order ships.

Questions? Reply to this email or WhatsApp us at +91-XXXXXXXXXX

Pure. True. Trusted.
Team Veritraa
```

### C. SEO Keyword Ideas

**Primary Keywords:**
- Buy spices online India
- Pure turmeric powder
- Authentic garam masala
- Premium masala brands
- Kolhapuri masala online
- Maharashtrian spices
- Organic spice blends
- Lab-tested spices

**Long-Tail:**
- Where to buy pure turmeric powder in India
- Best garam masala for biryani
- Authentic Maharashtrian masala online
- Chemical-free spices India
- Kolhapuri tikhat masala buy online

### D. Social Media Content Ideas

**Instagram Posts:**
1. Product spotlight (high-quality photo + description)
2. Behind-the-scenes (sourcing, testing, packing)
3. Recipe reels
4. Customer testimonials
5. Spice benefits infographics
6. "Did you know?" facts about spices
7. Team/farmer features
8. Packaging unboxing

**Instagram Stories:**
1. Polls (favorite spice, recipe preferences)
2. Q&A sessions
3. Order packing videos
4. Product launches
5. Limited-time offers
6. Customer shoutouts

---

## 🏁 Conclusion

This PRD provides a comprehensive blueprint for building the Veritraa e-commerce website. Here's your roadmap:

### Immediate Next Steps (This Week):
1. ✅ Review and approve this PRD
2. ✅ Decide on platform (Shopify recommended)
3. ✅ Set budget allocation
4. ✅ Hire web developer/agency
5. ✅ Book product photography session

### Next 2 Weeks:
1. Complete product photography
2. Finalize pricing
3. Start website design
4. Draft legal pages

### Next 4-8 Weeks:
1. Website development
2. Content creation
3. Product listing
4. Testing
5. Pre-launch marketing

### Launch:
1. Go live
2. Execute marketing plan
3. Monitor and optimize

**Remember:** Start with Phase 1 (MVP). Launch with core features, then iterate based on customer feedback and data. Perfection is the enemy of progress.

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Status:** Ready for Execution

---

**Questions or need clarification on any section?** I'm here to help refine this PRD further!