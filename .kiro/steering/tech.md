# Tech Stack

## Core Technologies

- **React Native**: 0.76.7
- **React**: 18.3.1
- **Expo**: ~52.0.35
- **TypeScript**: 5.3.3
- **Expo Router**: ~4.0.17 (file-based routing)

## Key Libraries

### Navigation & UI
- `@react-navigation/native`: 7.0.14
- `@react-navigation/bottom-tabs`: 7.2.0
- `react-native-gesture-handler`: 2.20.2
- `react-native-reanimated`: 3.16.1
- `react-native-screens`: 4.4.0
- `react-native-safe-area-context`: 4.12.0

### Backend & Services
- `@supabase/supabase-js`: 2.49.1
- `@superwall/react-native-superwall`: 1.4.7
- `@react-native-async-storage/async-storage`: 1.23.1

### Expo Modules
- `expo-camera`: 16.0.18
- `expo-image-picker`: 16.0.6
- `expo-file-system`: 18.0.11
- `expo-secure-store`: 14.0.1
- `expo-blur`: 14.0.3
- `expo-haptics`: 14.0.1
- `expo-dev-client`: 5.0.12

### Testing
- `jest`: 29.2.1
- `jest-expo`: 52.0.4

## Build System

### Package Manager
- npm (primary)

### Common Commands

```bash
# Development
npm start                    # Start Expo dev server
npm run android             # Run on Android emulator/device
npm run ios                 # Run on iOS simulator/device
npm run web                 # Run web version

# Testing
npm test                    # Run tests in watch mode
npm run lint                # Run ESLint

# Utilities
npm run reset-project       # Reset project to clean state
```

## Development Requirements

- **Expo Dev Client**: Required for Superwall (does not work in Expo Go)
- **Development Build**: Must create a development build for native features
- **Node.js**: Compatible with current LTS versions
- **iOS**: Xcode required for iOS development
- **Android**: Android Studio required for Android development

## Configuration Files

- `app.json`: Expo configuration
- `tsconfig.json`: TypeScript configuration with path aliases
- `eas.json`: EAS Build configuration
- `.env`: Environment variables (not in git)
- `.env.example`: Environment variables template

## Path Aliases

```typescript
"@/*": ["./*"]
"@/src/*": ["./src/*"]
```

Use these aliases for cleaner imports throughout the codebase.

## Platform-Specific Code

Platform-specific files use extensions:
- `.ios.tsx` - iOS-specific implementation
- `.android.tsx` - Android-specific implementation  
- `.web.tsx` - Web-specific implementation
- `.tsx` - Default/shared implementation
