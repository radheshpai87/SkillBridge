# Deploying SkillBridgeYouth to Vercel

This guide walks you through deploying your SkillBridgeYouth application to Vercel with serverless functions.

## Prerequisites

1. **MongoDB Atlas Account** (required for production database)
   - Sign up at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Note your connection string

2. **Vercel Account**
   - Sign up at [https://vercel.com](https://vercel.com)
   - Install Vercel CLI: `npm i -g vercel`

3. **GitHub Repository** (recommended)
   - Push your code to GitHub for automatic deployments

---

## Step 1: Set Up MongoDB Atlas

1. **Create a Cluster**
   - Log in to MongoDB Atlas
   - Click "Build a Database" → Choose "Free" tier
   - Select a cloud provider and region
   - Create your cluster

2. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - This is necessary for Vercel's serverless functions

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and password (save these!)
   - Set user privileges to "Read and write to any database"

4. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `skillbridge`
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/skillbridge?retryWrites=true&w=majority`

---

## Step 2: Prepare Your Project

1. **Update Environment Variables**
   ```bash
   # Make sure your .env file has production values
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secure_random_string_here
   CORS_ORIGIN=https://your-app.vercel.app
   ```

2. **Test Build Locally**
   ```bash
   npm run build
   ```
   This should create a `dist/public` folder with your built React app.

---

## Step 3: Deploy to Vercel

### Option A: Deploy via GitHub (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [https://vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel will auto-detect the configuration

3. **Configure Environment Variables**
   - In the Vercel import screen, add these environment variables:
     - `MONGODB_URI` = Your MongoDB Atlas connection string
     - `JWT_SECRET` = Your secure JWT secret
     - `NODE_ENV` = production
   - Click "Deploy"

4. **Update CORS_ORIGIN**
   - After first deployment, Vercel will give you a domain (e.g., `your-app.vercel.app`)
   - Go to Project Settings → Environment Variables
   - Add `CORS_ORIGIN` = `https://your-app.vercel.app`
   - Redeploy the project

### Option B: Deploy via CLI

1. **Login to Vercel**
   ```bash
   vercel login
   ```

2. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts to link your project
   - Vercel will build and deploy your app

3. **Add Environment Variables**
   ```bash
   vercel env add MONGODB_URI
   # Paste your MongoDB Atlas connection string

   vercel env add JWT_SECRET
   # Enter your secure JWT secret

   vercel env add NODE_ENV
   # Enter: production
   ```

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

---

## Step 4: Verify Deployment

1. **Check the Live Site**
   - Open your Vercel URL (e.g., `https://your-app.vercel.app`)
   - Try registering a new account
   - Test login functionality

2. **Check API Endpoints**
   - Open browser DevTools (F12) → Network tab
   - Verify API calls to `/api/*` are working
   - Check for any CORS errors

3. **Monitor Logs**
   ```bash
   vercel logs
   ```
   Or view logs in the Vercel dashboard under your project → "Logs"

---

## Step 5: Seed Production Database (Optional)

If you want to populate your production database with sample data:

1. **Update seed script connection**
   ```bash
   # Temporarily set MONGODB_URI in your local .env
   MONGODB_URI=your_mongodb_atlas_connection_string
   ```

2. **Run seed script**
   ```bash
   npm run seed
   ```

3. **Verify data**
   - Use MongoDB Atlas UI to browse your data
   - Or test by logging into your deployed app

---

## Configuration Files Explained

### `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist/public" }
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/index.js" },
    { "src": "/assets/(.*)", "dest": "/assets/$1" },
    { "src": "/(.*)", "dest": "/index.html" }
  ],
  "functions": {
    "api/index.js": { "maxDuration": 10 }
  }
}
```
- **builds**: Tells Vercel to build the client app
- **routes**: Directs API requests to serverless function, serves static files
- **functions**: Configures serverless function timeout (10 seconds)

### `api/index.js`
- Serverless function entry point
- Handles all `/api/*` requests
- Connects to MongoDB on cold starts
- Reuses Express app logic from `server/app.js`

---

## Troubleshooting

### Issue: "MongooseServerSelectionError"
**Solution**: Check MongoDB Atlas network access allows 0.0.0.0/0, verify connection string is correct with password encoded.

### Issue: "CORS error"
**Solution**: Ensure `CORS_ORIGIN` environment variable matches your Vercel domain (with https://).

### Issue: "Function execution timed out"
**Solution**: Optimize database queries, add indexes, or increase `maxDuration` in `vercel.json` (max 60s on Pro plan).

### Issue: "Module not found" errors
**Solution**: Ensure all dependencies are in `dependencies` (not `devDependencies`) in `package.json`.

### Issue: "API routes return 404"
**Solution**: Check `vercel.json` routes configuration, ensure `/api` path is correctly mapped.

---

## Automatic Deployments

Once connected to GitHub:
- Push to `main` branch → Auto-deploys to production
- Push to other branches → Creates preview deployments
- Pull requests → Get their own preview URLs

---

## Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions
4. Update `CORS_ORIGIN` environment variable with your custom domain

---

## Performance Tips

1. **Add Database Indexes**
   - Index frequently queried fields (e.g., `email`, `userId`)
   - Improves query performance

2. **Enable MongoDB Connection Pooling**
   - Already configured in `server/config/database.js`
   - Reuses connections across function invocations

3. **Monitor Function Execution**
   - Check Vercel Analytics for performance insights
   - Optimize slow endpoints

4. **Use Environment-Specific Configs**
   - Keep development/production configs separate
   - Use `.env.example` as template

---

## Security Checklist

- ✅ MongoDB Atlas network access configured
- ✅ Strong JWT_SECRET set (minimum 32 characters)
- ✅ CORS_ORIGIN restricted to your domain
- ✅ MongoDB connection string uses SSL/TLS
- ✅ Environment variables never committed to Git
- ✅ Database user has minimum required permissions

---

## Support

- **Vercel Documentation**: [https://vercel.com/docs](https://vercel.com/docs)
- **MongoDB Atlas Docs**: [https://docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **Project Issues**: Check server logs in Vercel dashboard

---

## Cost

- **Vercel Hobby Plan**: Free
  - 100 GB bandwidth/month
  - Serverless function execution
  - Automatic HTTPS

- **MongoDB Atlas Free Tier**: Free forever
  - 512 MB storage
  - Shared RAM
  - Perfect for development/small projects

---

**Congratulations! Your SkillBridgeYouth app is now live on Vercel! 🎉**
