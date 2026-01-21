# NewOrleansChef - Dining & Lifestyle Discovery App

A comprehensive dining and events discovery platform for New Orleans, combining restaurant recommendations, event discovery (Ticketmaster + Eventbrite), and transportation coordination (Uber) into one seamless experience.

## 🎯 Overview

NewOrleansChef is the validation product for GetNth's super app technology.

**Core Features:**
- Restaurant Discovery (dish-based recommendations)
- Event Integration (Ticketmaster + Eventbrite)
- Transportation (Uber API)
- Group Coordination
- Professional Design

## 🚀 Quick Start

```bash
npm install
cp .env.example .env.local
# Add your API keys to .env.local
npm run dev
```

Visit `http://localhost:3000`

## 🔑 Required API Keys

1. **Ticketmaster**: https://developer.ticketmaster.com/
2. **Eventbrite**: https://www.eventbrite.com/platform/
3. **Uber**: https://developer.uber.com/
4. **MongoDB**: https://www.mongodb.com/cloud/atlas

See full setup instructions in `/docs/API_SETUP.md`

## 📁 Key Files

- `/lib/api/ticketmaster.js` - Ticketmaster integration
- `/lib/api/eventbrite.js` - Eventbrite integration
- `/lib/api/uber.js` - Uber ride coordination
- `/lib/data/restaurants.js` - Restaurant database
- `/app/api/restaurants/route.js` - Restaurant API
- `/app/api/events/route.js` - Events API
- `/app/api/uber/route.js` - Uber API

## 🎬 For Kickstarter Demo

MVP features ready for demo:
- ✅ Restaurant discovery
- ✅ Event discovery
- ✅ Uber integration
- ⏳ Detail pages (next)
- ⏳ Booking flow (next)

## 💰 Monthly Costs (Production)

- API Usage: $0 (free tiers)
- Hosting (Vercel): $20-40
- MongoDB: $0-25
- **Total: $20-65/month**

## 📞 Contact

John Gasquet
john@nthtrip.com

© 2026 GetNth / NthTrip LLC
