# 🚀 Setup Guide - NewOrleansChef (YOUR API KEYS CONFIGURED!)

## ✅ What's Already Done

Your API keys are **pre-configured** in the `.env.local` file:
- ✅ Ticketmaster API Key
- ✅ Eventbrite Private Token  
- ✅ Uber Client ID & Secret
- ⏳ Uber Server Token (needs generation - 1 command)

---

## 📦 Step 1: Extract & Install (2 minutes)

```bash
# Extract the archive
tar -xzf neworleanschef.tar.gz
cd neworleanschef

# Install dependencies
npm install
```

This installs all required packages (Next.js, React, Tailwind, API clients, etc.)

---

## 🔑 Step 2: Generate Uber Token (1 minute)

Your Uber credentials are configured, but you need to generate a server token:

```bash
npm run setup:uber
```

This will output something like:
```
UBER_SERVER_TOKEN=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Copy the token** and add it to `.env.local`:
```env
UBER_SERVER_TOKEN=paste_your_token_here
```

---

## ✅ Step 3: Test APIs (1 minute)

Verify all three APIs work:

```bash
npm run test:apis
```

**Expected output:**
```
✓ Ticketmaster API working! Found 5 events
✓ Eventbrite API working! Found 5 events  
✓ Uber API working! Found 4 ride options

Overall: 3/3 APIs working
All APIs configured correctly! You're ready to build! 🚀
```

---

## 🎨 Step 4: Start Development (30 seconds)

```bash
npm run dev
```

**Open your browser:**
```
http://localhost:3000
```

**You should see:**
- ✅ Beautiful landing page
- ✅ Navigation working
- ✅ Smooth animations
- ✅ Responsive design

---

## 🧪 Step 5: Test API Endpoints

Open these URLs to verify APIs work:

**1. Test Restaurants API:**
```
http://localhost:3000/api/restaurants
```
Should return: JSON with 10 New Orleans restaurants

**2. Test Events API (Ticketmaster + Eventbrite):**
```
http://localhost:3000/api/events?category=music&limit=10
```
Should return: Live events from both APIs

**3. Test Uber API:**
```
http://localhost:3000/api/uber/link?endLat=29.9273&endLng=-90.0875&destination=Commander's%20Palace
```
Should return: Uber deep link URL

---

## 🎉 You're Ready!

If all tests pass, you're ready to start building!

---

## 📊 Your API Credentials Summary

### Ticketmaster
- **Consumer Key:** OKZTAyge4Kujbs6Amfd4dr9TnlSAbAA8
- **API URL:** https://app.ticketmaster.com/discovery/v2
- **Status:** ✅ Configured
- **Limits:** 5,000 calls/day (free)

### Eventbrite
- **Token:** E2FI5PZONFMI4BQSWY3C
- **API URL:** https://www.eventbriteapi.com/v3
- **Status:** ✅ Configured
- **Limits:** 1,000 calls/hour (free)

### Uber
- **Client ID:** jPhPauUiEz8pbYqdHp6NNksbNvEqPrC3
- **Client Secret:** -koFQTctSeJr4w4eq6-U7f-2n6GFYGv9WcIpuQPJ
- **API URL:** https://api.uber.com/v1.2
- **Status:** ⏳ Need to generate server token
- **Limits:** Unlimited (free)

---

## 🛠️ Troubleshooting

### "Cannot find module 'next'"
```bash
npm install
```

### "Uber token expired"
Tokens expire after ~30 days. Regenerate:
```bash
npm run setup:uber
```

### "Port 3000 already in use"
```bash
# Kill the process
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

### APIs returning errors
```bash
# Re-test all APIs
npm run test:apis

# Check console for specific errors
```

---

## 📝 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Testing
npm run test:apis        # Test all API integrations
npm run setup:uber       # Generate Uber token

# Check API endpoints
curl http://localhost:3000/api/restaurants
curl http://localhost:3000/api/events?keyword=jazz
```

---

## 🎯 Next Steps

### This Week: Build Core Pages

**1. Restaurant Detail Page** (4-6 hours)
```bash
# Create file
touch app/restaurants/[id]/page.js
```
Features to add:
- Full restaurant info
- Image gallery
- Signature dishes
- Hours & location
- Uber "Get a Ride" button
- "Book Table" form

**2. Events Page** (3-4 hours)
```bash
# Create file  
touch app/events/page.js
```
Features to add:
- Event grid with filters
- Search bar
- Category filters
- Date filters
- Event cards

**3. Booking Flow** (2-3 hours)
```bash
# Create file
touch app/book/page.js
```
Features to add:
- Restaurant selection
- Date/time picker
- Party size
- Contact form
- Email to john@nthtrip.com

---

## 🚀 Deployment (When Ready)

### Option 1: Vercel (Recommended)

```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/neworleanschef.git
git push -u origin main

# Deploy on Vercel
# 1. Go to vercel.com
# 2. Import GitHub repo
# 3. Add environment variables from .env.local
# 4. Deploy!
```

### Option 2: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/neworleanschef)

---

## 📞 Need Help?

**Check these first:**
1. Console errors (F12 → Console)
2. Terminal errors (where you ran `npm run dev`)
3. API test results (`npm run test:apis`)

**Still stuck?**
- Email: john@nthtrip.com
- Include: What you did, what happened, what you expected

---

## ✨ You're All Set!

Everything is configured and ready. Time to build! 🚀

**Next command:**
```bash
npm run dev
```

**Then open:** http://localhost:3000

---

Built for GetNth / NthTrip LLC
January 2026
