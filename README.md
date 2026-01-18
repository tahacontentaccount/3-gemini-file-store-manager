# Gemini File Store Manager

A React dashboard to manage Google's Gemini File Search Stores and chat with documents.

## Features

- 🔐 API Key Management (stored in localStorage)
- 📦 Create and manage Gemini File Search Stores
- 📄 Upload and manage documents in stores
- 💬 Chat with documents using Gemini AI
- 🎨 Modern, responsive UI with Tailwind CSS

## Tech Stack

- **React 18** with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **react-hot-toast** for notifications
- **n8n** backend for API integration

## Local Development

### Prerequisites

- Node.js 18+ and npm
- n8n workflow deployed and accessible

### Setup

1. Clone the repository:
```bash
git clone https://github.com/tahacontentaccount/3-gemini-file-store-manager.git
cd 3-gemini-file-store-manager
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_N8N_BASE_URL=https://your-n8n-instance.app.n8n.cloud/webhook
```

4. Start the development server:
```bash
npm run dev
```

5. Open http://localhost:5173 in your browser

## AWS Amplify Deployment

### Prerequisites

- AWS Amplify account
- n8n workflow deployed and accessible
- GitHub repository (already set up)

### Deployment Steps

1. **Connect Repository to AWS Amplify:**
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
   - Click "New app" → "Host web app"
   - Select "GitHub" and authorize
   - Choose the repository: `tahacontentaccount/3-gemini-file-store-manager`
   - Select the branch: `main`

2. **Configure Build Settings:**
   - Amplify will auto-detect the `amplify.yml` file
   - Verify the build settings:
     - **Build command:** `npm run build`
     - **Output directory:** `dist`
     - **Base directory:** `/` (root)

3. **Add Environment Variables:**
   - In Amplify Console, go to your app → "Environment variables"
   - Add the following variable:
     - **Key:** `VITE_N8N_BASE_URL`
     - **Value:** `https://your-n8n-instance.app.n8n.cloud/webhook`
     - Replace with your actual n8n webhook URL

4. **Deploy:**
   - Click "Save and deploy"
   - Amplify will build and deploy your app
   - The app will be available at: `https://<app-id>.amplifyapp.com`

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_N8N_BASE_URL` | Base URL of your n8n webhook endpoint | Yes |

**Note:** The Gemini API key is stored in the browser's localStorage and entered by users, so it doesn't need to be set as an environment variable.

### Build Configuration

The project uses:
- **Vite** for building (configured in `vite.config.js`)
- **React Router** with SPA routing (handled by `public/_redirects`)
- **Tailwind CSS** for styling

### Custom Domain (Optional)

1. In Amplify Console, go to "Domain management"
2. Click "Add domain"
3. Follow the instructions to configure your custom domain

## Project Structure

```
├── public/
│   ├── _redirects          # SPA routing for Amplify
│   └── vite.svg
├── src/
│   ├── components/         # Reusable React components
│   ├── hooks/              # Custom hooks (useApi)
│   ├── pages/              # Page components
│   ├── App.jsx             # Main app component
│   └── main.jsx            # Entry point
├── amplify.yml             # AWS Amplify build configuration
├── vite.config.js          # Vite configuration
└── package.json            # Dependencies and scripts
```

## n8n Workflow Setup

1. Import the `Gemini File Store Manager.json` workflow into your n8n instance
2. Ensure the webhook is active and accessible
3. Update the `VITE_N8N_BASE_URL` environment variable with your webhook URL
4. The workflow handles all API interactions with Google's Gemini API

## Troubleshooting

### Build Fails on Amplify

- Check that `VITE_N8N_BASE_URL` is set in Amplify environment variables
- Verify Node.js version (should be 18+)
- Check build logs in Amplify Console

### Routes Not Working

- Ensure `public/_redirects` file exists with: `/*    /index.html   200`
- Verify the file is included in the build output

### API Calls Failing

- Verify `VITE_N8N_BASE_URL` is correct
- Check n8n workflow is active
- Verify CORS settings in n8n if needed

## License

MIT
