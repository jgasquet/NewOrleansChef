# ⚡ Quick Reference Card - NewOrleansChef

## 🚀 Get Started (5 Minutes)

```bash
# 1. Extract
tar -xzf neworleanschef.tar.gz && cd neworleanschef

# 2. Install
npm install

# 3. Generate Uber token
npm run setup:uber
# Copy token to .env.local

# 4. Test APIs
npm run test:apis

# 5. Start
npm run dev
```

**Open:** http://localhost:3000

---

## 🔑 Your API Keys (Pre-Configured!)

✅ **Ticketmaster:** OKZTAyge4Kujbs6Amfd4dr9TnlSAbAA8
✅ **Eventbrite:** E2FI5PZONFMI4BQSWY3C  
✅ **Uber Client:** jPhPauUiEz8pbYqdHp6NNksbNvEqPrC3
⏳ **Uber Token:** Run `npm run setup:uber` to generate

---

## 📊 Test Endpoints

```bash
# Restaurants
curl http://localhost:3000/api/restaurants

# Events  
curl http://localhost:3000/api/events?category=music

# Uber Link
curl http://localhost:3000/api/uber/link?endLat=29.9273&endLng=-90.0875
```

---

## 🎯 Next Build Tasks

**Week 1:**
- [ ] Restaurant detail pages (4-6 hrs)
- [ ] Events listing page (3-4 hrs)  
- [ ] Booking form (2-3 hrs)

**Week 2:**
- [ ] Add 40+ restaurants
- [ ] Professional images
- [ ] Mobile testing

**Week 3:**
- [ ] Deploy to Vercel
- [ ] Record demo
- [ ] Launch Kickstarter!

---

## 🛠️ Common Commands

```bash
npm run dev           # Start development
npm run test:apis     # Test all APIs
npm run setup:uber    # Generate Uber token
npm run build         # Build for production
```

---

## 📁 Key Files

```
app/page.js                    # Landing page (done)
app/api/restaurants/route.js  # Restaurant API (done)
app/api/events/route.js        # Events API (done)
app/api/uber/route.js          # Uber API (done)
lib/api/ticketmaster.js        # Ticketmaster client (done)
lib/api/eventbrite.js          # Eventbrite client (done)
lib/api/uber.js                # Uber client (done)
.env.local                     # Your API keys (configured!)
```

---

## 🐛 Quick Fixes

**Port in use:** `npx kill-port 3000`
**API errors:** `npm run test:apis`
**Missing deps:** `npm install`

---

## 💰 Costs

- **Development:** FREE
- **Production:** $20-45/month
- **APIs:** FREE (up to 50K users)

---

## 📞 Help

Email: john@nthtrip.com
Docs: SETUP.md, QUICKSTART.md, PROJECT_SUMMARY.md

---

**Ready to build? Run `npm run dev` 🚀**
