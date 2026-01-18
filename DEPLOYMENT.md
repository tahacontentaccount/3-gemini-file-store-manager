# AWS Amplify Deployment Checklist

## Pre-Deployment

- [x] Build configuration verified (`amplify.yml`)
- [x] SPA routing configured (`public/_redirects`)
- [x] Environment variables documented
- [x] Build test successful locally
- [x] Node.js version specified (18+)

## Deployment Steps

### 1. Connect Repository
1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. Click **"New app"** → **"Host web app"**
3. Select **"GitHub"** and authorize access
4. Choose repository: `tahacontentaccount/3-gemini-file-store-manager`
5. Select branch: `main`
6. Click **"Next"**

### 2. Configure Build Settings
Amplify should auto-detect the configuration from `amplify.yml`. Verify:
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Base directory:** `/` (root)

If not auto-detected, use these settings:
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
```

### 3. Add Environment Variables
In Amplify Console → Your App → **"Environment variables"**, add:

| Key | Value | Description |
|-----|-------|-------------|
| `VITE_N8N_BASE_URL` | `https://your-n8n-instance.app.n8n.cloud/webhook` | Your n8n webhook base URL |

**Important:** Replace with your actual n8n webhook URL.

### 4. Deploy
1. Click **"Save and deploy"**
2. Wait for build to complete (usually 2-5 minutes)
3. Your app will be live at: `https://<app-id>.amplifyapp.com`

## Post-Deployment

### Verify Deployment
- [ ] App loads correctly
- [ ] API key entry page works
- [ ] Can create stores
- [ ] Stores appear in the list
- [ ] Can upload documents
- [ ] Chat functionality works

### Custom Domain (Optional)
1. In Amplify Console → **"Domain management"**
2. Click **"Add domain"**
3. Enter your domain name
4. Follow DNS configuration instructions
5. Wait for SSL certificate provisioning

## Troubleshooting

### Build Fails
- Check build logs in Amplify Console
- Verify `VITE_N8N_BASE_URL` is set
- Ensure Node.js 18+ is available (check build logs)

### Routes Return 404
- Verify `public/_redirects` exists with: `/*    /index.html   200`
- Check that file is in build output

### API Calls Fail
- Verify `VITE_N8N_BASE_URL` environment variable is correct
- Check n8n workflow is active
- Verify CORS settings if needed
- Check browser console for errors

### Environment Variables Not Working
- Ensure variable name starts with `VITE_` (required for Vite)
- Redeploy after adding/changing variables
- Check build logs to verify variables are available

## Rollback

If deployment has issues:
1. Go to Amplify Console → Your App → **"Deployments"**
2. Find the previous successful deployment
3. Click **"Redeploy this version"**

## Monitoring

- View build logs: Amplify Console → Your App → **"Deployments"**
- View app logs: Amplify Console → Your App → **"Monitoring"**
- Set up alerts for failed builds in AWS CloudWatch

