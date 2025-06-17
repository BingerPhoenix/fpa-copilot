# 🚀 FP&A Copilot Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ **Requirements**
- [ ] **Node.js 18.17.0+** installed
- [ ] **npm 9.0.0+** installed
- [ ] **Vercel CLI** installed (`npm install -g vercel`)
- [ ] **Git repository** set up and connected
- [ ] **Environment variables** configured

### ✅ **Code Quality**
- [ ] All TypeScript errors resolved
- [ ] Build passes locally (`npm run build`)
- [ ] No critical security vulnerabilities
- [ ] Performance optimizations applied

---

## 🏗️ **Build Configuration Overview**

### **Next.js Optimizations**
```javascript
// next.config.js features:
✅ Turbopack for faster builds
✅ Image optimization (WebP, AVIF)
✅ Bundle splitting for performance
✅ Security headers
✅ Static optimization
✅ Compression enabled
✅ Console log removal in production
```

### **Performance Features**
- **Code Splitting**: Automatic vendor and component chunks
- **Lazy Loading**: Components load on demand
- **Image Optimization**: Modern formats with responsive sizing
- **Caching**: Optimized cache headers for static assets
- **Compression**: Gzip enabled for all responses

---

## 🌐 **Vercel Deployment (Recommended)**

### **Option 1: Automated Deployment Script**
```bash
# Quick deployment to preview
./scripts/deploy.sh

# Production deployment
./scripts/deploy.sh production

# With custom options
SKIP_TESTS=true SKIP_LINT=true ./scripts/deploy.sh production
```

### **Option 2: Manual Vercel Deployment**

#### **Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

#### **Step 2: Login to Vercel**
```bash
vercel login
```

#### **Step 3: Deploy to Preview**
```bash
vercel
```

#### **Step 4: Deploy to Production**
```bash
vercel --prod
```

### **Vercel Configuration**
The project includes optimized `vercel.json`:
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build:production",
  "outputDirectory": ".next",
  "functions": {
    "app/**/*.js": { "maxDuration": 30 }
  }
}
```

---

## 🔧 **Environment Variables Setup**

### **Required Variables**
```bash
# Basic configuration
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Feature flags
NEXT_PUBLIC_ENABLE_ONBOARDING=true
NEXT_PUBLIC_ENABLE_EXPORT=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_DEMO_MODE=true
```

### **Vercel Environment Setup**
1. **Via Vercel Dashboard**:
   - Go to Project Settings → Environment Variables
   - Add each variable with appropriate scope

2. **Via Vercel CLI**:
   ```bash
   vercel env add NEXT_PUBLIC_APP_URL
   vercel env add NODE_ENV
   ```

3. **Pull Environment Variables Locally**:
   ```bash
   vercel env pull .env.local
   ```

---

## 🏭 **Alternative Deployment Platforms**

### **Netlify**
```bash
# Build command
npm run build

# Publish directory
.next

# Environment variables
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app.netlify.app
```

### **AWS Amplify**
```yaml
# amplify.yml
version: 1
applications:
  - frontend:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - npm run build:production
      artifacts:
        baseDirectory: .next
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
```

### **Docker Deployment**
```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 🔍 **Post-Deployment Verification**

### **Health Check Endpoint**
```bash
# Check application health
curl https://your-domain.com/api/health-check

# Expected response:
{
  "status": "healthy",
  "version": "1.0.0",
  "environment": "production",
  "uptime": 3600,
  "services": {
    "application": {
      "status": "operational",
      "responseTime": 45,
      "lastCheck": "2024-01-01T12:00:00.000Z"
    }
  }
}
```

### **Performance Testing**
```bash
# Lighthouse audit
npm run performance:audit

# Bundle analysis
npm run build:analyze
```

### **Manual Testing Checklist**
- [ ] **Homepage loads** within 2 seconds
- [ ] **Visual Intelligence** responds to queries
- [ ] **AI Agents** display insights correctly
- [ ] **Export functionality** works for all formats
- [ ] **Onboarding flow** completes successfully
- [ ] **Mobile responsiveness** on various devices
- [ ] **Error boundaries** handle errors gracefully

---

## 📊 **Monitoring & Observability**

### **Performance Monitoring**
```javascript
// Built-in performance tracking
- First Load JS: ~151 kB
- Page Load Time: <2 seconds
- Bundle Chunks: Optimized splitting
```

### **Error Tracking**
```javascript
// Error boundary integration ready for:
- Sentry
- LogRocket
- Bugsnag
- DataDog
```

### **Analytics Setup**
```javascript
// Ready for integration with:
- Google Analytics
- Posthog
- Mixpanel
- Amplitude
```

---

## 🔐 **Security Considerations**

### **Built-in Security Headers**
```javascript
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### **Security Checklist**
- [ ] **Environment variables** secured
- [ ] **API endpoints** protected
- [ ] **HTTPS** enforced
- [ ] **Content Security Policy** configured
- [ ] **Dependencies** audited for vulnerabilities

---

## 🚨 **Troubleshooting**

### **Common Build Issues**

#### **Build Fails - TypeScript Errors**
```bash
# Check TypeScript configuration
npm run type-check

# Fix common issues
- Unused imports
- Type mismatches
- Missing dependencies
```

#### **Build Fails - Memory Issues**
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

#### **Deployment Fails - Vercel Issues**
```bash
# Check Vercel status
vercel --debug

# Clear Vercel cache
vercel --force

# Re-link project
vercel link
```

### **Runtime Issues**

#### **Slow Page Load**
- Check bundle size with `npm run build:analyze`
- Verify CDN caching is working
- Enable Vercel Analytics for insights

#### **API Errors**
- Check environment variables
- Verify API routes are deployed
- Review Vercel function logs

#### **Missing Features**
- Verify feature flags are set correctly
- Check environment-specific configurations
- Ensure all dependencies are installed

---

## 📈 **Performance Optimization**

### **Current Performance Metrics**
```
Build Size Analysis:
├ Homepage: 4.72 kB (151 kB total)
├ AI Agents: 15.4 kB (162 kB total)
├ Visual Intelligence: 2.33 kB (144 kB total)
└ Static Assets: Optimized & cached

Performance Scores:
✅ First Contentful Paint: <1.5s
✅ Largest Contentful Paint: <2.5s
✅ Time to Interactive: <3.5s
✅ Cumulative Layout Shift: <0.1
```

### **Optimization Features**
- **Automatic code splitting** by route and component
- **Image optimization** with next/image
- **Font optimization** with next/font
- **Bundle analyzer** integration
- **Lazy loading** for heavy components
- **Service worker** ready for PWA

---

## 🔄 **CI/CD Pipeline Setup**

### **GitHub Actions Example**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 📞 **Support & Resources**

### **Documentation**
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Performance Best Practices](./docs/performance.md)

### **Getting Help**
- **Project Issues**: Create GitHub issue
- **Deployment Questions**: Check Vercel docs
- **Performance Issues**: Run analysis tools

### **Useful Commands**
```bash
# Development
npm run dev                 # Start development server
npm run lint               # Check code quality
npm run type-check         # Verify TypeScript

# Building
npm run build              # Production build
npm run build:analyze      # Build with bundle analysis
npm run preview            # Preview production build

# Deployment
./scripts/deploy.sh        # Automated deployment
vercel --prod              # Manual production deploy
vercel env pull            # Sync environment variables

# Monitoring
npm run performance:audit  # Lighthouse audit
npm run security:audit     # Security check
```

---

## ✅ **Deployment Success Criteria**

Your deployment is successful when:

1. **✅ Build Completes** without errors
2. **✅ Health Check** returns 200 status
3. **✅ Core Features** work as expected:
   - Visual Intelligence responds to queries
   - AI Agents generate insights
   - Export functionality works
   - Onboarding flow completes
4. **✅ Performance** meets targets:
   - Page load < 2 seconds
   - No console errors
   - Mobile responsive
5. **✅ Monitoring** is active:
   - Health checks responding
   - Error tracking configured
   - Performance metrics available

---

*🎉 **Congratulations!** Your FP&A Copilot is now live and ready to transform financial analysis workflows.* 