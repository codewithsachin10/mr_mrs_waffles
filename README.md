# Mr. & Mrs. Waffle and Brownie - Digital Menu & Admin Platform

A premium, mobile-first digital menu and management platform for a boutique dessert shop.

## 🚀 Features

### Customer-Facing Website
- **Modern & Premium Design**: Dark chocolate and caramel gold theme.
- **Mobile-First**: Optimized for QR-code scanning and mobile browsing.
- **Sticky Navigation**: Smooth scrolling with category tabs.
- **Live Search**: Find treats instantly.
- **WhatsApp Ordering**: Direct connection for orders and pre-orders.
- **Dynamic Content**: Powered by a robust database structure.

### Admin Dashboard
- **Secure Access**: Protected management portal.
- **Overview Stats**: Monitor active items, sold-out products, and performance.
- **Category Management**: Create, edit, and reorder menu categories.
- **Item Management**: Full CRUD for menu items with featured & availability toggles.
- **Announcement Controls**: Update shop banners and contact info without touching code.

## 🛠 Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Database/Auth**: Supabase
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📦 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install --cache ./npm-cache --legacy-peer-deps
   ```

2. **Setup Supabase**:
   - Create a project on [Supabase](https://supabase.com).
   - Run the SQL schema from `src/lib/supabase.ts` comments (or use the provided types).
   - Add your environment variables to `.env.local`:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

3. **Run Locally**:
   ```bash
   npm run dev
   ```

## 🎨 Design Colors
- Background: `#0C0908` (Deep Chocolate)
- Accent: `#D4A373` (Caramel Gold)
- Secondary: `#8B4513` (Waffle Brown)
- Highlight: `#E63946` (Strawberry Pink)

## 📄 License
Mit License. Built for "Mr. & Mrs. Waffle and Brownie".
