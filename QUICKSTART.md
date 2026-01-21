# 🚀 Quick Start Guide - NewOrleansChef

## What You've Got

A complete Next.js web application with:
✅ Restaurant discovery (dish-based recommendations)
✅ Event discovery (Ticketmaster + Eventbrite APIs)
✅ Uber integration (ride coordination)
✅ Beautiful, responsive design
✅ Professional landing page
✅ API routes ready to go
✅ Database models prepared

## Get Running in 10 Minutes

### 1. Install Dependencies (2 min)

```bash
cd neworleanschef
npm install
```

This installs Next.js, React, Tailwind, and all API clients.

### 2. Get Your API Keys (5 min)

You need 3 keys minimum:

**A. Ticketmaster** (2 min)
- Go to: https://developer.ticketmaster.com/
- Click "Get Your API Key"
- Sign up, create app
- Copy API key

**B. Eventbrite** (2 min)
- Go to: https://www.eventbrite.com/platform/
- Sign up
- Go to: Account Settings → Developer Links → API Keys
- Create app, copy Private Token

**C. Uber** (1 min)
- Go to: https://developer.uber.com/
- Sign up, create app
- Copy Client ID and generate Server Token

### 3. Configure Environment (1 min)

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your keys:

```env
# REQUIRED - Add your keys here
TICKETMASTER_API_KEY=paste_your_key_here
NEXT_PUBLIC_TICKETMASTER_KEY=paste_your_key_here
EVENTBRITE_PRIVATE_TOKEN=paste_your_token_here
UBER_SERVER_TOKEN=paste_your_token_here
NEXT_PUBLIC_UBER_CLIENT_ID=paste_your_client_id_here

# OPTIONAL - Add later for full functionality
MONGODB_URI=mongodb://localhost:27017/neworleanschef
NEXTAUTH_SECRET=random_string_for_auth
```

### 4. Start Development Server (1 min)

```bash
npm run dev
```

Open: http://localhost:3000

**You should see:**
- Beautiful landing page
- Restaurant listings
- Navigation working
- Responsive design

### 5. Test APIs (1 min)

Open these URLs in your browser:

**Restaurants:**
http://localhost:3000/api/restaurants

**Events:**
http://localhost:3000/api/events?category=music&limit=10

**Uber Link:**
http://localhost:3000/api/uber/link?endLat=29.9273&endLng=-90.0875&destination=Commander's%20Palace

All working? ✅ You're ready to build!

---

## Next Steps

### This Week: Build Core Pages

**1. Restaurant Detail Page**
- Create: `app/restaurants/[id]/page.js`
- Show: Full details, menu, hours, Uber button
- Time: 4-6 hours

**2. Events Page**
- Create: `app/events/page.js`
- Show: Grid of events with filters
- Time: 3-4 hours

**3. Booking Flow**
- Create: `app/book/page.js`
- Simple reservation request form
- Time: 2-3 hours

### Week 2-3: Polish for Kickstarter

- Add more restaurants (target: 50)
- Professional images
- User authentication (optional for MVP)
- Group coordination features
- Mobile testing

### Week 4: Launch!

- Deploy to Vercel (see DEPLOYMENT.md)
- Record demo video
- Launch Kickstarter campaign!

---

## Project Structure Explained

```
neworleanschef/
├── app/                          # Next.js 14 App Router
│   ├── page.js                   # Landing page (DONE ✅)
│   ├── layout.js                 # Root layout (DONE ✅)
│   ├── globals.css               # Styles (DONE ✅)
│   └── api/                      # API Routes (DONE ✅)
│       ├── restaurants/          # Restaurant endpoints
│       ├── events/               # Events endpoints
│       └── uber/                 # Uber endpoints
│
├── lib/                          # Core Logic
│   ├── api/                      # API Clients (DONE ✅)
│   │   ├── ticketmaster.js       # Ticketmaster integration
│   │   ├── eventbrite.js         # Eventbrite integration
│   │   └── uber.js               # Uber integration
│   └── data/
│       └── restaurants.js        # Restaurant database (DONE ✅)
│
├── components/                   # React Components (TO DO 🔨)
│   ├── RestaurantCard.js         # Restaurant card component
│   ├── EventCard.js              # Event card component
│   └── UberButton.js             # Uber ride button
│
└── public/                       # Static Assets (TO DO 📸)
    └── images/                   # Restaurant & event images
```

---

## Common Issues & Solutions

### "Cannot find module 'next'"
```bash
# Solution: Install dependencies
npm install
```

### "API key not found" error
```bash
# Solution: Check .env.local exists and has correct keys
cat .env.local
# Restart dev server after adding keys
```

### "Port 3000 already in use"
```bash
# Solution: Kill process or use different port
npx kill-port 3000
# Or:
npm run dev -- -p 3001
```

### Restaurants not showing up
```bash
# Solution: API route issue. Check console for errors.
# Open: http://localhost:3000/api/restaurants
# Should return JSON with restaurant data
```

---

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Testing APIs
curl localhost:3000/api/restaurants
curl localhost:3000/api/events?keyword=jazz

# Git
git status              # Check changes
git add .               # Stage all changes
git commit -m "message" # Commit changes
git push                # Push to GitHub
```

---

## VS Code Recommended Extensions

1. **ES7+ React/Redux/React-Native snippets** - Faster coding
2. **Tailwind CSS IntelliSense** - Auto-complete for CSS
3. **Prettier** - Code formatting
4. **ESLint** - Code linting

Install: Cmd/Ctrl + Shift + X, search extension name

---

## Resources

**Documentation:**
- Next.js: https://nextjs.org/docs
- React: https://react.dev
- Tailwind CSS: https://tailwindcss.com/docs
- Ticketmaster API: https://developer.ticketmaster.com/api-explorer
- Eventbrite API: https://www.eventbrite.com/platform/docs
- Uber API: https://developer.uber.com/docs

**Learning:**
- Next.js Tutorial: https://nextjs.org/learn
- React Course: https://react.dev/learn
- Tailwind Tutorial: https://tailwindcss.com/docs/utility-first

**Community:**
- Next.js Discord: https://nextjs.org/discord
- Stack Overflow: Tag questions with #nextjs

---

## Need Help?

**Stuck on something?**
1. Check console for errors (F12 → Console)
2. Read error message carefully
3. Google the error message
4. Check documentation
5. Email: john@nthtrip.com

**Found a bug?**
- Note: What you did
- Note: What happened
- Note: What you expected
- Email with screenshots

---

## Ready to Build?

1. ✅ Dependencies installed
2. ✅ API keys configured
3. ✅ Dev server running
4. ✅ Landing page loaded

**Next:** Start building restaurant detail pages!

See you in the code. 🚀

---

Built for GetNth / NthTrip LLC
Contact: john@nthtrip.com
