# Firebase Hosting Setup Guide

This guide will walk you through setting up Firebase Hosting for the QTI Playground application.

## Prerequisites

- Node.js 18+ installed
- A Google account
- Admin access to the GitHub repository (for setting up GitHub Actions)

## Step 1: Create Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., `qti-playground`)
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Firebase Hosting

1. In your Firebase project dashboard, click "Hosting" in the left sidebar
2. Click "Get started"
3. Follow the setup steps (the CLI commands are already configured in this project)

## Step 3: Configure Project ID

1. Note your Firebase project ID from the Firebase Console (usually shown in the URL and project settings)
2. Update the `.firebaserc` file in the project root:
   ```json
   {
     "projects": {
       "default": "your-actual-project-id-here"
     }
   }
   ```

## Step 4: Authenticate Firebase CLI

```bash
npm run firebase:login
```

This will open a browser window for authentication. Sign in with your Google account.

## Step 5: Deploy to Firebase

```bash
npm run firebase:deploy
```

This will:
1. Build the application
2. Deploy to Firebase Hosting
3. Provide you with a live URL

## GitHub Actions Setup (Optional but Recommended)

To enable automatic deployments:

### 1. Generate Service Account Key

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Save the JSON file securely

### 2. Add GitHub Secret

1. Go to your GitHub repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `FIREBASE_SERVICE_ACCOUNT_QTI_PLAYGROUND`
4. Value: Copy and paste the entire contents of the JSON file from step 1

### 3. Update Workflow Files

Update the project ID in these files:
- `.github/workflows/firebase-hosting-merge.yml`
- `.github/workflows/firebase-hosting-pull-request.yml`

Replace `'your-firebase-project-id'` with your actual project ID.

## Local Development with Firebase

To serve the app locally using Firebase hosting emulator:

```bash
npm run firebase:serve
```

This runs the built app through Firebase's local hosting emulator.

## Deployment Commands

| Command | Description |
|---------|-------------|
| `npm run firebase:login` | Authenticate with Firebase |
| `npm run firebase:deploy` | Build and deploy to production |
| `npm run firebase:serve` | Serve locally with Firebase emulator |
| `npm run build` | Build the app only |

## Troubleshooting

### "Firebase project not found"
- Check that your project ID in `.firebaserc` matches exactly with your Firebase Console
- Ensure you're logged in with the correct Google account

### "Permission denied"
- Make sure your Google account has Owner or Editor permissions on the Firebase project
- Try logging out and back in: `firebase logout && npm run firebase:login`

### GitHub Actions failing
- Verify the service account JSON is correctly added as a GitHub secret
- Check that the project ID in workflow files matches your Firebase project
- Ensure Firebase Hosting is enabled in your project

## Next Steps

Once Firebase Hosting is working, you can consider:
- Setting up Firebase Authentication for user management
- Adding Firestore for data storage
- Implementing Firebase Functions for backend logic