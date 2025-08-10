# Firebase Authentication Setup

## Enable Authentication in Firebase Console

1. Go to your [Firebase Console](https://console.firebase.google.com/project/qti-playground/authentication)
2. Click on "Authentication" in the left sidebar
3. Click "Get started" if it's your first time
4. Go to the "Sign-in method" tab
5. Click on "Email/Password"
6. Toggle "Enable" for Email/Password (the first option)
7. Click "Save"

## Get Your Firebase Configuration

1. Go to Project Settings (gear icon in Firebase Console)
2. Scroll down to "Your apps" section
3. If you haven't added a web app yet:
   - Click "Add app" and select Web (</> icon)
   - Register your app with a nickname (e.g., "QTI Playground Web")
   - You'll get your configuration object
4. If you already have a web app:
   - Click on the app to see the configuration

5. Copy your configuration values and update `src/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "qti-playground.firebaseapp.com",
  projectId: "qti-playground",
  storageBucket: "qti-playground.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Security Notes

- The Firebase configuration values are safe to expose in your frontend code
- Authentication and data access are protected by Firebase Security Rules
- Never expose service account keys or admin SDK credentials in frontend code

## Testing Authentication

After setup:
1. Run `npm run dev`
2. Click "Login / Sign Up" button in the top right
3. Create a new account with email and password
4. You should see your avatar with first initial in the top right
5. Click avatar to see dropdown with logout option

## Troubleshooting

### "auth/configuration-not-found" Error
- Make sure you've enabled Email/Password authentication in Firebase Console

### "auth/invalid-api-key" Error
- Double-check your API key in `src/lib/firebase.ts`
- Ensure you're using the Web API key, not a server key

### "auth/unauthorized-domain" Error
- Add your domain to authorized domains in Firebase Console:
  - Go to Authentication → Settings → Authorized domains
  - Add `localhost` for development
  - Add your production domain when deployed