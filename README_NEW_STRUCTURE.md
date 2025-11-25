# Pawket App - Standardized Structure

A React Native Expo app for sharing cat photos with friends.

## 📁 Project Structure

This project follows React Native best practices with a clean, organized structure:

```
├── app/                    # Expo Router - File-based routing
│   ├── index.tsx          # Entry point (auth check)
│   ├── main.tsx           # Main app (after auth)
│   └── onboarding/        # Onboarding flow
│
├── src/                   # Source code
│   ├── components/        # Reusable UI components
│   │   ├── common/       # Shared components (Avatar, Button, Input, etc.)
│   │   └── ui/           # Platform-specific UI components
│   │
│   ├── screens/          # Screen components
│   │   ├── HomeScreen.tsx      # Main feed with camera
│   │   ├── ProfileScreen.tsx   # User profile
│   │   ├── MessagesScreen.tsx  # Chat/messages
│   │   ├── SettingsScreen.tsx  # App settings
│   │   └── onboarding/         # Onboarding screens
│   │
│   ├── navigation/       # Navigation configuration
│   │   └── MainNavigator.tsx   # Horizontal swipe navigation
│   │
│   ├── contexts/         # React contexts (Auth, Onboarding)
│   ├── hooks/            # Custom React hooks
│   ├── services/         # External services (Supabase, Superwall)
│   ├── utils/            # Utility functions
│   ├── config/           # App configuration
│   ├── constants/        # Constants and theme
│   └── types/            # TypeScript types
│
├── assets/               # Static assets (images, fonts)
├── android/              # Android native code
├── ios/                  # iOS native code
└── requirements/         # Project requirements and rules
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

4. Add your Supabase credentials to `.env`:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Running the App

```bash
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

## 📱 Features

- **Authentication**: Email/password and Google sign-in
- **Onboarding**: First-time user experience
- **Camera**: Take photos directly in the app
- **Feed**: Vertical scrolling feed of cat photos
- **Profile**: View your posts and stats
- **Messages**: Chat with friends
- **Settings**: App configuration and account management
- **Paywall**: Premium features with Superwall

## 🏗️ Architecture

### Navigation

The app uses a custom horizontal swipe navigation:
- **Left**: Profile Screen
- **Center**: Home Screen (default)
- **Right**: Messages Screen

### State Management

- **React Context**: Authentication and onboarding state
- **Local State**: Component-specific state with useState/useReducer
- **Supabase Realtime**: Live updates for posts and messages

### Data Flow

```
User Action → Screen Component → Service Layer → Supabase → Real-time Updates
```

## 🎨 Styling

- **StyleSheet**: React Native's built-in styling
- **Theme**: Centralized colors and constants
- **Safe Areas**: Proper handling of notches and home indicators
- **Responsive**: Adapts to different screen sizes

## 📝 Naming Conventions

### Files
- Screens: `*Screen.tsx` (e.g., `HomeScreen.tsx`)
- Components: PascalCase (e.g., `Avatar.tsx`)
- Utilities: camelCase (e.g., `helpers.ts`)
- Contexts: `*Context.tsx`
- Hooks: `use*.ts`

### Code
- Components: PascalCase (e.g., `HomeScreen`)
- Functions: camelCase (e.g., `fetchUserData`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_URL`)

## 🔧 Development

### Import Paths

Use the `@/src/*` alias for cleaner imports:

```typescript
// Good
import { HomeScreen } from '@/src/screens/HomeScreen';
import { Avatar } from '@/src/components/common';

// Also acceptable
import { Avatar } from '../components/common/Avatar';
```

### Adding a New Screen

1. Create the screen in `src/screens/`:
   ```typescript
   // src/screens/NewScreen.tsx
   export function NewScreen() {
     return <View>...</View>;
   }
   ```

2. Add to `src/screens/index.ts`:
   ```typescript
   export { NewScreen } from './NewScreen';
   ```

3. Add route in `app/` if needed:
   ```typescript
   // app/new.tsx
   import { NewScreen } from '@/src/screens';
   export default NewScreen;
   ```

### Adding a New Component

1. Create in `src/components/common/`:
   ```typescript
   // src/components/common/NewComponent.tsx
   export function NewComponent() {
     return <View>...</View>;
   }
   ```

2. Export from `src/components/common/index.ts`:
   ```typescript
   export { NewComponent } from './NewComponent';
   ```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch
```

## 📦 Building

```bash
# Build for iOS
npm run ios -- --configuration Release

# Build for Android
npm run android -- --variant=release
```

## 🔐 Environment Variables

Required environment variables:

- `EXPO_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `EXPO_PUBLIC_SUPERWALL_API_KEY`: Superwall API key (optional)

## 📚 Documentation

- [Project Structure](./PROJECT_STRUCTURE.md) - Detailed structure documentation
- [Migration Guide](./MIGRATION_GUIDE.md) - Guide for migrating from old structure
- [Cursor Rules](./requirements/.cursorrules) - AI assistant rules

## 🤝 Contributing

1. Follow the established file structure
2. Use TypeScript for all new code
3. Add JSDoc comments for complex functions
4. Keep files under 500 lines
5. Test on both iOS and Android

## 📄 License

[Your License Here]

## 🙏 Acknowledgments

- Expo team for the amazing framework
- Supabase for backend services
- Superwall for paywall management
