# Mr. & Mrs. Waffle and Brownie - Digital Menu & Admin

A premium, mobile-first digital menu website for a small dessert shop. Includes a real-time admin dashboard, image upload capabilities, and a QR Studio for generating table QR codes.

## Features
- **Client Menu**: Modern, appetizing chocolate theme with lazy-loading and category filtering.
- **Admin Dashboard**: Real-time management of menu items, categories, and offers using Firebase.
- **QR Studio**: Generate and download themed QR codes for your shop tables.
- **Image Uploads**: Integrated with Firebase Storage for easy item photo management.

## Tech Stack
- **Framework**: Next.js 15
- **Styling**: Tailwind CSS / Lucide Icons / Framer Motion
- **Database/Auth**: Firebase Firestore & Auth
- **Storage**: Firebase Storage
- **QR Generation**: qrcode.react

## Deployment to Vercel

### 1. Push to GitHub
If you haven't already:
```bash
git add .
git commit -m "Ready for Vercel"
git push origin main
```

### 2. Connect to Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New** -> **Project**.
3. Import your `mr_mrs_waffles` repository.

### 3. Set Environment Variables
In the Vercel dashboard, add the following environment variables (from `.env.example`):
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### 4. Deploy!
Click **Deploy** and your premium digital menu will be live!

---
Developed with ❤️ for Mr. & Mrs. Waffle.
