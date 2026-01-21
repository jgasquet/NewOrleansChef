# Deployment Guide for NewOrleansChef

## 🚀 Deployment Options

### Option 1: Heroku (Recommended for Quick Launch)

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create new app**
   ```bash
   heroku create neworleanschef
   ```

4. **Set environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set EMAIL_USER=your-email@gmail.com
   heroku config:set EMAIL_PASS=your-app-password
   ```

5. **Deploy**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

6. **Open app**
   ```bash
   heroku open
   ```

### Option 2: DigitalOcean App Platform

1. **Connect GitHub repo**
   - Go to DigitalOcean App Platform
   - Click "Create App"
   - Connect your GitHub repository

2. **Configure app**
   - Buildpack: Node.js
   - Build Command: `npm install`
   - Run Command: `npm start`

3. **Set environment variables**
   - Add all variables from `.env.example`

4. **Deploy**
   - Click "Deploy"
   - Access via provided URL

### Option 3: AWS Elastic Beanstalk

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize EB**
   ```bash
   eb init -p node.js neworleanschef
   ```

3. **Create environment**
   ```bash
   eb create neworleanschef-prod
   ```

4. **Set environment variables**
   ```bash
   eb setenv EMAIL_USER=your-email@gmail.com
   eb setenv EMAIL_PASS=your-password
   ```

5. **Deploy**
   ```bash
   eb deploy
   ```

### Option 4: VPS (DigitalOcean, Linode, AWS EC2)

1. **SSH into server**
   ```bash
   ssh root@your-server-ip
   ```

2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install PM2**
   ```bash
   sudo npm install -g pm2
   ```

4. **Clone repository**
   ```bash
   git clone https://github.com/your-repo/neworleanschef.git
   cd neworleanschef
   npm install
   ```

5. **Create .env file**
   ```bash
   nano .env
   # Add your environment variables
   ```

6. **Start with PM2**
   ```bash
   pm2 start server.js --name neworleanschef
   pm2 save
   pm2 startup
   ```

7. **Setup Nginx**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/neworleanschef
   ```

   Add this configuration:
   ```nginx
   server {
       listen 80;
       server_name neworleanschef.com www.neworleanschef.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   sudo ln -s /etc/nginx/sites-available/neworleanschef /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

8. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d neworleanschef.com -d www.neworleanschef.com
   ```

## 🔒 Security Checklist

- [ ] Change all default passwords
- [ ] Set strong JWT_SECRET
- [ ] Enable HTTPS/SSL
- [ ] Set up firewall (ufw or AWS security groups)
- [ ] Configure CORS properly
- [ ] Add rate limiting
- [ ] Set up database backups
- [ ] Enable logging
- [ ] Add monitoring (e.g., Sentry)

## 📊 Monitoring

### Setup PM2 Monitoring
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Health Check Endpoint
The app includes `/api/health` for monitoring

### Recommended Monitoring Tools
- **Uptime monitoring**: UptimeRobot, Pingdom
- **Error tracking**: Sentry
- **Analytics**: Google Analytics, Mixpanel
- **Performance**: New Relic, DataDog

## 🔄 Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{secrets.HEROKU_API_KEY}}
        heroku_app_name: "neworleanschef"
        heroku_email: "john@nthtrip.com"
```

## 📱 Custom Domain Setup

1. **Purchase domain** (e.g., from Namecheap, GoDaddy)

2. **Point DNS to your server**
   - Type: A Record
   - Name: @
   - Value: Your server IP
   
   - Type: CNAME
   - Name: www
   - Value: neworleanschef.com

3. **Wait for DNS propagation** (can take up to 48 hours)

## 💾 Database Migration (When Ready)

1. **Setup MongoDB Atlas** (free tier available)
   - Go to https://www.mongodb.com/cloud/atlas
   - Create cluster
   - Get connection string

2. **Update .env**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/neworleanschef
   ```

3. **Migrate data**
   ```bash
   node scripts/migrate-data.js
   ```

## 🧪 Testing Before Production

1. **Test locally**
   ```bash
   npm test
   ```

2. **Test on staging**
   - Deploy to staging environment first
   - Test all functionality
   - Load testing with tools like Apache Bench

3. **Backup everything**
   - Database backup
   - Code repository backup
   - Environment variables documented

## 📈 Post-Launch Checklist

- [ ] Submit to Google Search Console
- [ ] Setup Google Analytics
- [ ] Configure email deliverability (SPF, DKIM, DMARC)
- [ ] Test reservation system end-to-end
- [ ] Test newsletter signup
- [ ] Monitor error logs
- [ ] Setup automated backups
- [ ] Create maintenance page
- [ ] Document API for partners

## 🆘 Troubleshooting

### App won't start
- Check logs: `pm2 logs` or `heroku logs --tail`
- Verify all environment variables are set
- Check Node.js version compatibility

### Email not sending
- Verify Gmail app password is correct
- Check Gmail security settings
- Try different SMTP service (SendGrid, Mailgun)

### Database connection issues
- Verify connection string
- Check IP whitelist in MongoDB Atlas
- Test connection locally first

## 📞 Support

For deployment assistance:
- Email: john@nthtrip.com
- Include: error logs, environment, steps taken
