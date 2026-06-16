# Early Pregnancy Prevention App - Mobile (Expo/React Native)

Mobile application built with Expo and React Native for the Young Scientist Kenya 2026 project.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device (for testing)

## Setup

1. Navigate to the mobile directory:

```bash
cd mobile
```

2. Install dependencies:

```bash
npm install
```

3. Configure backend API URL:

- Open `src/services/api.ts`
- Update the `API_URL` constant with your backend server URL

## Running the App

### Development Mode

Start the Expo development server:

```bash
npm start
```

This will open the Expo Developer Tools in your browser. You can then:

- Scan the QR code with Expo Go app (iOS/Android)
- Press `i` to open in iOS Simulator
- Press `a` to open in Android Emulator
- Press `w` to open in web browser

### Platform-Specific Commands

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Project Structure

```
mobile/
├── App.tsx                      # Root component
├── src/
│   ├── screens/                 # All screen components
│   │   ├── DashboardScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── SignupScreen.tsx
│   │   └── ...
│   ├── navigation/              # Navigation configuration
│   │   ├── RootNavigator.tsx    # Main navigator
│   │   └── TabNavigator.tsx     # Bottom tab navigator
│   ├── components/              # Reusable components
│   ├── context/                 # React Context (Auth, etc.)
│   │   └── AuthContext.tsx
│   ├── services/                # API services
│   │   └── api.ts               # Axios instance
│   ├── constants/               # App constants
│   │   └── colors.ts            # Color palette
│   ├── utils/                   # Utility functions
│   └── types/                   # TypeScript types
└── assets/                      # Images, fonts, etc.
```

## Features

### Implemented

- ✅ Authentication (Login/Signup) with backend integration
- ✅ Bottom tab navigation (Home, Learn, Play, Profile)
- ✅ Dashboard with progress tracking
- ✅ User context/state management
- ✅ API integration with interceptors
- ✅ Teal/Coral color theme matching web app

### To Be Implemented

- FAQ Screen
- Myth Busting Screen
- Anonymous Chat
- Health Services Locator
- Goals Management
- Educational Videos
- Quiz & Games
- Profile Management

## Backend Integration

The app is configured to work with the Node.js/Express backend located in the `backend/` directory.

### API Endpoints Used

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/users/progress` - Get user progress
- `GET /api/goals` - Get user goals
- And more...

Make sure the backend server is running before testing the mobile app.

## Building for Production

### iOS

1. Install EAS CLI:

```bash
npm install -g eas-cli
```

2. Build:

```bash
eas build --platform ios
```

### Android

```bash
eas build --platform android
```

## Environment Variables

Create a `.env` file in the mobile directory:

```
API_URL=http://localhost:5000/api
```

## Troubleshooting

### Metro Bundler Issues

```bash
# Clear cache
expo start -c
```

### iOS Simulator Not Working

```bash
# Reinstall iOS simulator
npm install -g ios-deploy
```

### Android Emulator Issues

- Make sure Android Studio and emulator are properly installed
- Check that ANDROID_HOME environment variable is set

## Contributing

This is a Young Scientist Kenya 2026 project by:

- Mercy Wanjiku
- Mary Muthoni

From Kiambu Township Junior School
