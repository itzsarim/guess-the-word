# 🚀 Deployment Guide

This guide will help you deploy your AI Dumb Charades app to various platforms.

## 📋 Prerequisites

- ✅ Node.js installed (version 16 or higher)
- ✅ npm or yarn package manager
- ✅ Git repository set up
- ✅ All dependencies installed (`npm install`)

## 🔧 Build the App

Before deploying, always build your app:

```bash
npm run build
```

This creates a `dist` folder with your production-ready app.

## 🌐 Deployment Options

### 1. Vercel (Recommended - Easiest)

Vercel is the easiest way to deploy React apps with automatic deployments.

#### Setup:
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Features:
- ✅ Automatic deployments on git push
- ✅ Custom domains
- ✅ SSL certificates
- ✅ Global CDN
- ✅ Preview deployments

### 2. Netlify

Great for static sites with drag-and-drop deployment.

#### Setup:
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login to Netlify
netlify login

# Deploy
npm run deploy:netlify
```

#### Alternative (Drag & Drop):
1. Run `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag the `dist` folder to the deploy area
4. Configure custom domain if needed

### 3. GitHub Pages

Perfect if you want to host on GitHub.

#### Setup:
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts (already done)
# "predeploy": "npm run build",
# "deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

#### Configuration:
- Repository must be public
- Go to Settings > Pages
- Set source to "gh-pages" branch

### 4. Firebase Hosting

Google's hosting solution with good performance.

#### Setup:
```bash
# Install Firebase CLI
npm i -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase
firebase init hosting

# Deploy
firebase deploy
```

### 5. AWS S3 + CloudFront

Enterprise-grade hosting solution.

#### Setup:
1. Create S3 bucket
2. Enable static website hosting
3. Upload `dist` folder contents
4. Configure CloudFront distribution
5. Set up custom domain

## 🔒 Environment Variables

If you need to add environment variables later:

1. Create `.env` file in root directory
2. Add variables:
   ```
   VITE_API_URL=https://your-api.com
   VITE_APP_NAME=AI Dumb Charades
   ```
3. Access in code: `import.meta.env.VITE_API_URL`

## 📱 PWA Support (Optional)

To make your app installable on mobile devices:

1. Create `public/manifest.json`
2. Add service worker
3. Configure icons
4. Test with Lighthouse

## 🚨 Common Issues & Solutions

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 404 Errors on Refresh
- Ensure your hosting platform supports SPA routing
- Vercel and Netlify handle this automatically
- For others, configure redirects to `index.html`

### Performance Issues
- Run `npm run build` to create optimized production build
- Check bundle size with `npm run build -- --analyze`
- Optimize images and assets

## 📊 Performance Monitoring

### Lighthouse Score
- Run Lighthouse in Chrome DevTools
- Aim for 90+ in all categories
- Focus on Core Web Vitals

### Bundle Analysis
```bash
# Install bundle analyzer
npm install --save-dev rollup-plugin-visualizer

# Add to vite.config.js and analyze build
```

## 🔄 Continuous Deployment

### GitHub Actions (Vercel/Netlify)
- Connect your GitHub repository
- Enable automatic deployments
- Every push to main branch deploys automatically

### Manual Deployment
```bash
# Build and deploy
npm run build
# Then upload dist folder to your hosting platform
```

## 📞 Support

If you encounter issues:

1. Check the [Vite documentation](https://vitejs.dev/)
2. Review [React deployment guide](https://create-react-app.dev/docs/deployment/)
3. Check your hosting platform's documentation
4. Open an issue in this repository

---

**Happy Deploying! 🎉** 