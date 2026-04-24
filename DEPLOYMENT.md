# Deployment Guide

This guide shows how to deploy your Hlasy Žiakov application to various platforms.

## Pre-Deployment Checklist

- [ ] Update `.env` values for production
- [ ] Never commit `.env` file to Git
- [ ] Test locally: `npm start`
- [ ] Verify database connection
- [ ] Check CORS settings if needed
- [ ] Set `NODE_ENV=production`

---

## 1. Heroku (Recommended for beginners)

### Prerequisites
- Heroku account (free tier available)
- Heroku CLI installed
- Git repository

### Deploy Steps

```bash
# Login to Heroku
heroku login

# Create new app
heroku create your-app-name

# Set environment variables
heroku config:set DB_HOST=your_host
heroku config:set DB_USER=your_user
heroku config:set DB_PASSWORD=your_password
heroku config:set DB_NAME=your_database
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

---

## 2. AWS EC2

### Prerequisites
- AWS account
- EC2 instance (Ubuntu 20.04 LTS recommended)
- Domain name (optional)

### Setup Steps

```bash
# SSH into your instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Clone your repository
git clone your-repo-url
cd your-project

# Install dependencies
npm install --production

# Create .env file with production values
sudo nano .env

# Start with PM2
sudo pm2 start server.js --name "hlasy-ziakov"
sudo pm2 startup
sudo pm2 save

# (Optional) Set up Nginx as reverse proxy
sudo apt install -y nginx
# Edit /etc/nginx/sites-available/default
```

**Nginx config example** (`/etc/nginx/sites-available/default`):
```nginx
server {
    listen 80;
    server_name your-domain.com;

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

---

## 3. DigitalOcean App Platform

### Deploy Steps

1. Connect your GitHub repository to DigitalOcean
2. Create new App
3. Add Build Command: `npm install`
4. Add Run Command: `npm start`
5. Add Environment Variables:
   - DB_HOST
   - DB_USER
   - DB_PASSWORD
   - DB_NAME
   - NODE_ENV=production
6. Deploy!

---

## 4. Railway.app

### Deploy Steps

1. Push code to GitHub
2. Connect Railway to GitHub account
3. Create new project → Discover from GitHub
4. Select your repository
5. Railway will detect it's a Node.js app
6. Add environment variables in Variables tab
7. Deploy automatically

---

## 5. Vercel (Frontend only, backend elsewhere)

Vercel is best for frontend only. Host backend separately on Heroku/AWS and update `API` URL in script.js.

---

## Production Checklist

### Security
- [ ] Use strong database password
- [ ] Set up HTTPS/SSL certificate
- [ ] Enable firewall rules
- [ ] Use environment variables for all secrets
- [ ] Set NODE_ENV=production
- [ ] Add rate limiting if needed

### Performance
- [ ] Enable gzip compression
- [ ] Set up CDN for static files
- [ ] Monitor database connections
- [ ] Use PM2 for process management

### Monitoring
- [ ] Set up error logging (Sentry, LogRocket)
- [ ] Monitor server health
- [ ] Set up database backups
- [ ] Configure alerts for errors

---

## Database Backup

### MySQL Backup
```bash
# Local backup
mysqldump -h your_host -u your_user -p your_database > backup.sql

# Restore from backup
mysql -h your_host -u your_user -p your_database < backup.sql
```

---

## Scaling Tips

1. **Database**: Set up read replicas for high traffic
2. **Caching**: Add Redis for frequent queries
3. **API**: Use load balancing
4. **Static Files**: Serve from CDN

---

## Troubleshooting

### "Connection refused"
- Check database credentials
- Verify database is running
- Check firewall rules

### "Cannot GET /"
- Make sure `index.html` is in the root directory
- Check express.static() path in server.js

### High Memory Usage
- Set `NODE_ENV=production`
- Use PM2 with memory limits
- Check for memory leaks

### Database Timeout
- Increase connection pool limit
- Check database performance
- Add database indexing

---

## Support

For deployment issues:
- Check logs: `heroku logs --tail` (Heroku)
- Check PM2 logs: `pm2 logs` (EC2/DigitalOcean)
- Update Node.js if needed
- Contact your hosting provider

---

**Happy deploying! 🚀**
