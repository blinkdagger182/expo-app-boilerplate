# Project Structure

This document describes the standardized file structure for the Pawket app.

## Directory Structure

```
expo-app-boilerplate/
├── app/                          # Expo Router app directory
│   ├── (auth)/                   # Authentication group
│   │   ├── _layout.tsx
│   │   └── onboarding.tsx
│   ├── (tabs)/                   # Tab navigation group (legacy - to be removed)
│   ├── onboarding/               # Onboarding flow screens
│   │   ├── _layout.tsx
│   │   ├── features.tsx
│   │   ├── final.tsx
│   │   ├── index.tsx
│   │   ├── problem.tsx
│   │   └── solution.tsx
│   ├── _layout.tsx               # Root layout
│   ├── +not-found.tsx            # 404 screen
│   ├── index.tsx                 # Entry point (auth/onboarding check)
│   ├── main.tsx                  # Main app screen (after auth)
│   └── onboard.tsx               # Onboarding entry
│
├── src/                          # Source code (NEW STRUCTURE)
│   ├── components/               # Reusable components
│   │   ├── common/               # Common/shared components
│   │   │   ├── Avatar.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Collapsible.tsx
│   │   │   ├── ExternalLink.tsx
│   │   │   ├── HapticTab.tsx
│   │   │   ├── HelloWave.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── ParallaxScrollView.tsx
│   │   │   ├── PaywallButton.tsx
│   │   │   ├── ThemedText.tsx
│   │   │   └── ThemedView.tsx
│   │   └── ui/                   # Platform-specific UI components
│   │       ├── IconSymbol.ios.tsx
│   │       ├── IconSymbol.tsx
│   │       ├── TabBarBackground.ios.tsx
│   │       └── TabBarBackground.tsx
│   │
│   ├── screens/                  # Screen components
│   │   ├── onboarding/           # Onboarding screens
│   │   │   ├── OnboardingFeaturesScreen.tsx
│   │   │   ├── OnboardingFinalScreen.tsx
│   │   │   ├── OnboardingIntroScreen.tsx
│   │   │   ├── OnboardingProblemScreen.tsx
│   │   │   └── OnboardingSolutionScreen.tsx
│   │   ├── HomeScreen.tsx        # Main feed/camera screen (formerly HomePage/Pawket)
│   │   ├── MessagesScreen.tsx    # Messages/chat screen (formerly MessagesPage)
│   │   ├── ProfileScreen.tsx     # User profile screen (formerly ProfilePage)
│   │   └── SettingsScreen.tsx    # Settings screen (formerly SettingsPage)
│   │
│   ├── navigation/               # Navigation configuration
│   │   └── MainNavigator.tsx     # Main horizontal swipe navigation
│   │
│   ├── contexts/                 # React contexts
│   │   ├── AuthContext.tsx       # Authentication context
│   │   └── OnboardingContext.tsx # Onboarding state context
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useColorScheme.ts
│   │   ├── useColorScheme.web.ts
│   │   ├── useSuperwall.ts
│   │   └── useThemeColor.ts
│   │
│   ├── services/                 # External service integrations
│   │   ├── supabase.ts           # Supabase client and methods
│   │   └── superwall.ts          # Superwall paywall service
│   │
│   ├── utils/                    # Utility functions
│   │   └── helpers.ts            # Helper functions (formerly utils.ts)
│   │
│   ├── config/                   # Configuration files
│   │   └── superwall.ts          # Superwall configuration
│   │
│   ├── constants/                # App constants
│   │   └── Colors.ts             # Color definitions
│   │
│   └── types/                    # TypeScript type definitions
│       └── index.ts              # Shared types
│
├── assets/                       # Static assets
│   ├── fonts/                    # Custom fonts
│   └── images/                   # Images and icons
│
├── android/                      # Android native code
├── ios/                          # iOS native code
├── requirements/                 # Project requirements and rules
│   └── .cursorrules              # Cursor AI rules
│
├── .env                          # Environment variables (not in git)
├── .env.example                  # Environment variables template
├── app.json                      # Expo configuration
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript configuration
└── PROJECT_STRUCTURE.md          # This file

```

## Naming Conventions

### Files
- **Screens**: `*Screen.tsx` (e.g., `HomeScreen.tsx`, `ProfileScreen.tsx`)
- **Components**: PascalCase (e.g., `Avatar.tsx`, `Button.tsx`)
- **Utilities**: camelCase (e.g., `helpers.ts`, `validators.ts`)
- **Contexts**: `*Context.tsx` (e.g., `AuthContext.tsx`)
- **Hooks**: `use*.ts` (e.g., `useAuth.ts`, `useSuperwall.ts`)
- **Services**: camelCase (e.g., `supabase.ts`, `superwall.ts`)

### Components and Functions
- **Components**: PascalCase (e.g., `HomeScreen`, `Avatar`)
- **Functions**: camelCase (e.g., `fetchUserData`, `handleSubmit`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_URL`, `MAX_RETRIES`)

## Import Paths

Use the `@/src/*` alias for imports from the src directory:

```typescript
// Good
import { HomeScreen } from '@/src/screens/HomeScreen';
import { Avatar } from '@/src/components/common/Avatar';
import { supabaseService } from '@/src/services/supabase';

// Also acceptable (relative paths)
import { Avatar } from '../components/common/Avatar';
```

## Screen Naming Changes

| Old Name (Pawket-specific) | New Name (Functional) | Purpose |
|----------------------------|----------------------|---------|
| `Pawket.tsx` | `MainNavigator.tsx` | Main navigation component |
| `HomePage.tsx` | `HomeScreen.tsx` | Home feed with camera |
| `ProfilePage.tsx` | `ProfileScreen.tsx` | User profile |
| `MessagesPage.tsx` | `MessagesScreen.tsx` | Messages/chat |
| `SettingsPage.tsx` | `SettingsScreen.tsx` | App settings |
| `pawket.tsx` (route) | `main.tsx` (route) | Main app route |

## Migration Status

### ✅ Completed
- Created `src/` directory structure
- Moved and renamed screen components
- Moved and renamed common components
- Created `MainNavigator.tsx`
- Updated import paths in screens
- Updated onboarding screens
- Created documentation

### 🔄 In Progress
- Updating all import references
- Testing navigation flow

### ⏳ To Do
- Remove old `components/pawket/` directory
- Remove duplicate files in `app/(tabs)/`
- Update any remaining `@/components/` imports to `@/src/components/`
- Test all screens and navigation
- Update README.md with new structure

## Best Practices

1. **Single Responsibility**: Each file should have one primary export
2. **Consistent Naming**: Use the naming conventions above
3. **Organized Imports**: Group imports (React, third-party, local)
4. **Type Safety**: Use TypeScript types for all props and state
5. **Comments**: Add JSDoc comments for complex functions
6. **File Size**: Keep files under 500 lines; split if larger

## Notes

- The `app/` directory follows Expo Router conventions
- The `src/` directory follows React Native best practices
- Legacy files in `components/pawket/` will be removed after migration
- All "Pawket" references in code should be replaced with functional names
