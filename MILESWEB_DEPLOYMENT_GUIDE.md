# 🚀 MilesWeb Deployment Guide for Kiana Naturopathy

This guide provides step-by-step instructions to deploy your Kiana Naturopathy full-stack application on **MilesWeb**.

---

## 📌 Method 1: MilesWeb cPanel (Shared / Node.js Web Hosting) — *Recommended*

Most MilesWeb hosting plans come with **cPanel** and the CloudLinux **Setup Node.js App** tool.

### Step 1: Create the Node.js Application in cPanel
1. Log in to your **MilesWeb cPanel**.
2. Scroll to the **Software** section and click on **Setup Node.js App** (or search for `Node.js`).
3. Click the blue **Create Application** button.
4. Fill in the application settings:
   - **Node.js version**: Choose **20.x** or **22.x** (recommended).
   - **Application mode**: Select **Production**.
   - **Application root**: Enter `kiana-app` (this creates a folder in your home directory).
   - **Application URL**: Select your domain (e.g. `yourdomain.com`).
   - **Application startup file**: Enter `app.js`.
5. Click **Create** at the top right.
6. Once created, click **Stop App** temporarily while you upload your files.

---

### Step 2: Upload Your Deployment Files
1. In cPanel, open **File Manager** (under Files).
2. Navigate into the application root folder you created: `/home/yourusername/kiana-app`.
3. Upload the **`kiana-milesweb-deploy.zip`** file into this folder.
4. Right-click `kiana-milesweb-deploy.zip` and select **Extract**.
5. Ensure the extracted files and folders are located directly inside `/home/yourusername/kiana-app`:
   ```
   kiana-app/
   ├── .output/
   │   ├── public/
   │   └── server/
   ├── public/
   ├── app.js
   ├── package.json
   ├── .env
   └── ecosystem.config.cjs
   ```

---

### Step 3: Configure Environment Variables (Optional)
1. Go back to **cPanel** ➔ **Setup Node.js App** ➔ Click the **Edit (Pencil)** icon next to your app.
2. Scroll down to the **Environment variables** section and click **Add Variable**:
   - `NODE_ENV` = `production`
   - `APP_BASE_URL` = `https://kiananaturopathy.com`
3. Click **Save** at the top right.

---

### Step 4: Start the Application & Verify
1. Click **Run NPM Install** if prompted, or click **Start App** / **Restart**.
2. Open your website in a browser: `https://kiananaturopathy.com`.
3. Test the homepage, shop, doctor consultation booking, AI remedy assistant, and cart checkout (Cash on Delivery & Instant UPI QR work out of the box)!

---

## 📌 Method 2: MilesWeb VPS / Cloud Server (Ubuntu / Debian with SSH)

If you have a MilesWeb VPS or Dedicated Server with root access:

### Step 1: Connect & Install Node.js
```bash
ssh root@your-server-ip

# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x & PM2
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git
sudo npm install -g pm2
```

### Step 2: Upload Files to Server
Upload `kiana-milesweb-deploy.zip` to `/var/www/kiana-naturopathy`:
```bash
mkdir -p /var/www/kiana-naturopathy
cd /var/www/kiana-naturopathy
# Unzip deployment package
unzip kiana-milesweb-deploy.zip
```

### Step 3: Configure Environment Variables
```bash
cp .env.example .env
nano .env
# Set APP_BASE_URL to your live domain
```

### Step 4: Start with PM2
```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

### Step 5: Configure Nginx Reverse Proxy
Edit your Nginx site configuration:
```nginx
server {
    server_name kiananaturopathy.com www.kiananaturopathy.com;

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
Reload Nginx and install free SSL certificate:
```bash
sudo nginx -t && sudo systemctl reload nginx
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d kiananaturopathy.com -d www.kiananaturopathy.com
```

---

## 🔒 Post-Deployment Checklist
- [ ] Test **Cash on Delivery** and **Instant UPI QR** checkout.
- [ ] Verify **SSL (HTTPS)** is active and padlock is green in browser address bar.
- [ ] Access the Admin Dashboard at `https://kiananaturopathy.com/admin` (Default password: `kiana2026`).
