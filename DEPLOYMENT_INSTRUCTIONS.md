# New Orleans Chef - Deployment Instructions

## Server Setup Guide

After connecting via PuTTY to your server, follow these steps to deploy the app.

### 1. Update System Packages
```bash
sudo apt-get update
sudo apt-get upgrade -y
```

### 2. Install Node.js and npm
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
npm --version
```

### 3. Install Git
```bash
sudo apt-get install -y git
```

### 4. Clone the Repository
```bash
cd ~
git clone https://github.com/jgasquet/NewOrleansChef.git
cd NewOrleansChef
```

### 5. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 6. Create Environment File
```bash
cp .env.example .env.local
```

**Edit `.env.local` and add your API keys:**
```bash
nano .env.local
```

Update these values:
```
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-random-secret-key-here
NEXTAUTH_URL=https://yourdomain.com
MONGODB_URI=your-mongodb-connection-string
TICKETMASTER_API_KEY=your-key
EVENTBRITE_API_KEY=your-key
UBER_CLIENT_ID=your-id
UBER_CLIENT_SECRET=your-secret
```

### 7. Build the Application
```bash
npm run build
```

### 8. Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### 9. Start App with PM2
```bash
pm2 start npm --name "neworleanschef" -- start
pm2 save
sudo pm2 startup
```

### 10. Install and Configure Nginx
```bash
sudo apt-get install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 11. Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/default
```

Replace the content with:
```nginx
upstream nextjs {
    server 127.0.0.1:3000;
}

server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    server_name yourdomain.com www.yourdomain.com;
    
    location / {
        proxy_pass http://nextjs;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 12. Test and Enable Nginx Configuration
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 13. Setup SSL with Let's Encrypt (Optional but Recommended)
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 14. Verify Deployment
- Visit: `http://yourdomain.com` (or `https://yourdomain.com` if SSL enabled)
- Check PM2 status: `pm2 status`
- View logs: `pm2 logs neworleanschef`

## Maintenance Commands

**Restart the app:**
```bash
pm2 restart neworleanschef
```

**View logs:**
```bash
pm2 logs neworleanschef
```

**Stop the app:**
```bash
pm2 stop neworleanschef
```

**Update app (pull latest from GitHub):**
```bash
cd ~/NewOrleansChef
git pull origin main
npm install --legacy-peer-deps
npm run build
pm2 restart neworleanschef
```

## Troubleshooting

**App not starting?**
- Check logs: `pm2 logs neworleanschef`
- Check port availability: `netstat -tulpn | grep 3000`

**Nginx not proxying?**
- Test config: `sudo nginx -t`
- Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`

**Environment variables not loaded?**
- Verify `.env.local` exists and has correct permissions
- Restart app: `pm2 restart neworleanschef`

## Quick Deployment Script

Save this as `deploy.sh` and run `bash deploy.sh` for automated setup:

```bash
#!/bin/bash

# Update and install dependencies
sudo apt-get update
sudo apt-get upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs git nginx certbot python3-certbot-nginx

# Clone and setup app
cd ~
git clone https://github.com/jgasquet/NewOrleansChef.git
cd NewOrleansChef
npm install --legacy-peer-deps

# Copy env file
cp .env.example .env.local
echo "✓ Edit .env.local with your API keys"
echo "Then run: npm run build && sudo npm install -g pm2 && pm2 start npm --name 'neworleanschef' -- start"
```
