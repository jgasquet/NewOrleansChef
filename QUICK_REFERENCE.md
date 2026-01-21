# NewOrleansChef - Quick Reference Card

## 🚀 Common Commands

### Development
```bash
# Start development server (auto-restart on changes)
npm run dev

# Start production server
npm start

# Install new package
npm install package-name

# Update all packages
npm update
```

### Testing API with curl

```bash
# Get all restaurants
curl http://localhost:3000/api/restaurants

# Get Creole restaurants
curl http://localhost:3000/api/restaurants/cuisine/creole

# Search for oysters
curl http://localhost:3000/api/restaurants/search/query?q=oysters

# Create reservation
curl -X POST http://localhost:3000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantId": "commanders-palace",
    "restaurantName": "Commanders Palace",
    "name": "John Gasquet",
    "email": "john@nthtrip.com",
    "phone": "555-1234",
    "date": "2026-02-14",
    "time": "19:00",
    "partySize": 4
  }'

# Subscribe to newsletter
curl -X POST http://localhost:3000/api/users/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

### Deployment

```bash
# Deploy to Heroku
git push heroku main

# View Heroku logs
heroku logs --tail

# Restart Heroku app
heroku restart

# Deploy to DigitalOcean
doctl apps create-deployment <app-id>

# SSH to VPS
ssh root@your-server-ip

# Check PM2 processes
pm2 list

# View PM2 logs
pm2 logs neworleanschef

# Restart PM2 app
pm2 restart neworleanschef
```

### Git Commands

```bash
# Initialize repository
git init
git add .
git commit -m "Initial commit"

# Connect to GitHub
git remote add origin https://github.com/yourusername/neworleanschef.git
git branch -M main
git push -u origin main

# Update code
git add .
git commit -m "Description of changes"
git push
```

## 📁 Important Files

| File | Purpose |
|------|---------|
| `server.js` | Main Express server |
| `package.json` | Dependencies & scripts |
| `.env` | Environment variables (SECRET!) |
| `index.html` | Main webpage |
| `public/js/main.js` | Frontend JavaScript |
| `public/css/styles.css` | Styles |
| `src/data/restaurants.json` | Restaurant database |
| `server/routes/*.js` | API endpoints |

## 🔑 Environment Variables

```bash
# Required
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Optional
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb://...
```

## 🌐 URLs

| Environment | URL |
|-------------|-----|
| Local Dev | http://localhost:3000 |
| API Health | http://localhost:3000/api/health |
| Restaurants | http://localhost:3000/api/restaurants |
| Heroku | https://neworleanschef.herokuapp.com |
| Production | https://neworleanschef.com |

## 📧 Email Setup (Gmail)

1. Go to: https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Click "App passwords"
4. Select "Mail" and "Other (Custom name)"
5. Enter "NewOrleansChef"
6. Copy the 16-character password
7. Add to `.env` as EMAIL_PASS

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port already in use | `lsof -ti:3000 \| xargs kill` |
| Module not found | `npm install` |
| Email not sending | Check .env EMAIL credentials |
| Can't connect to server | Check if server is running |
| CORS error | Check CORS settings in server.js |

## 🔢 Port Numbers

- **3000** - Main app (default)
- **3001** - Alternative if 3000 busy
- **27017** - MongoDB (if using locally)
- **5432** - PostgreSQL (if switching from Mongo)

## 📊 Monitoring

```bash
# CPU/Memory usage
top

# Disk space
df -h

# Check if port is in use
lsof -i :3000

# Check Node.js processes
ps aux | grep node

# Monitor logs in real-time
tail -f logs/app.log
```

## 🔐 Security Reminders

- ✅ Never commit `.env` to git
- ✅ Use strong passwords
- ✅ Enable HTTPS in production
- ✅ Keep dependencies updated
- ✅ Validate all user inputs
- ✅ Use environment variables for secrets
- ✅ Enable rate limiting
- ✅ Regular backups

## 📱 Testing Checklist

Quick tests before deploying:
1. Can you see the homepage?
2. Do cuisine modals open?
3. Can you submit a reservation?
4. Does newsletter signup work?
5. Did you receive test emails?
6. Does it work on mobile?

## 🎯 Quick Links

- **GitHub**: https://github.com/yourusername/neworleanschef
- **Heroku Dashboard**: https://dashboard.heroku.com
- **MongoDB Atlas**: https://cloud.mongodb.com
- **Docs**: See README.md

## 💡 Pro Tips

1. **Always test locally first** before deploying
2. **Keep .env file secure** - never commit it
3. **Use PM2 for production** - auto-restarts on crash
4. **Set up monitoring early** - catch issues fast
5. **Backup database regularly** - safety first
6. **Document changes** - future you will thank you
7. **Test emails in spam folder** - deliverability matters
8. **Monitor error logs** - find issues quickly

## 📞 Emergency Contacts

**Technical Issues**
- Email: john@nthtrip.com
- Include: error messages, logs, screenshots

**Quick Response Times**
- Server down: Immediate
- Email issues: Within 1 hour
- Feature requests: 24-48 hours

---

**Keep this file handy for quick reference!**

Print it out or bookmark it in your browser.
