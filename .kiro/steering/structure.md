# Project Structure

## Directory Organization

```
expo-app-boilerplate/
├── app/                    # Expo Router - file-based routing
├── src/                    # Source code (main application logic)
├── assets/                 # Static assets (fonts, images)
├── android/                # Android native code
├── ios/                    # iOS native code
├── supabase/              # Supabase migrations and config
└── scripts/               # Utility scripts
```

## App Directory (Expo Router)

File-based routing structure:

```
app/
├── (auth)/                # Auth group (layout wrapper)
│   ├── _layout.tsx
│   └── onboarding.tsx
├── onboarding/            # Onboarding flow
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── problem.tsx
│   ├── solution.tsx
│   ├── features.tsx
│   └── final.tsx
├── _layout.tsx            # Root layout
├── index.tsx              # Entry point
├── main.tsx               # Main app screen
└── +not-found.tsx         # 404 screen
```

## Source Directory

Organized by feature/responsibility:

```
src/
├── components/            # Reusable UI components
│   ├── common/           # Shared components (Button, Input, Avatar, etc.)
│   └── ui/               # Platform-specific UI components
├── screens/              # Screen components
│   └── onboarding/       # Onboarding-specific screens
├── navigation/           # Navigation configuration
├── contexts/             # React contexts (Auth, Onboarding)
├── hooks/                # Custom React hooks
├── services/             # External service integrations (Supabase, Superwall)
├── utils/                # Utility functions
├── config/               # Configuration files
├── constants/            # App constants (Colors, etc.)
└── types/                # TypeScript type definitions
```

## Naming Conventions

### Files
- **Screens**: `*Screen.tsx` (e.g., `HomeScreen.tsx`)
- **Components**: PascalCase (e.g., `Avatar.tsx`, `Button.tsx`)
- **Utilities**: camelCase (e.g., `helpers.ts`)
- **Contexts**: `*Context.tsx` (e.g., `AuthContext.tsx`)
- **Hooks**: `use*.ts` (e.g., `useAuth.ts`)
- **Services**: camelCase (e.g., `supabase.ts`)

### Code
- **Components**: PascalCase (e.g., `HomeScreen`, `Avatar`)
- **Functions**: camelCase (e.g., `fetchUserData`, `handleSubmit`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_URL`, `MAX_RETRIES`)

## Import Conventions

Use path aliases for cleaner imports:

```typescript
// Preferred
import { HomeScreen } from '@/src/screens/HomeScreen';
import { Avatar } from '@/src/components/common/Avatar';
import { supabaseService } from '@/src/services/supabase';

// Also acceptable (relative paths within same directory)
import { Avatar } from '../components/common/Avatar';
```

## Component Organization

Group imports in this order:
1. React and React Native imports
2. Third-party library imports
3. Local imports (components, hooks, utils)
4. Type imports
5. Styles

```typescript
import React, { useState } from 'react';
import { View, Text } from 'react-native';

import { useAuth } from '@/src/contexts/AuthContext';

import { Button } from '@/src/components/common/Button';
import type { Profile } from '@/src/services/supabase';
```

## Platform-Specific Files

Use platform extensions for platform-specific implementations:
- `IconSymbol.ios.tsx` - iOS implementation
- `IconSymbol.tsx` - Default/Android/Web implementation

## Best Practices

1. **Single Responsibility**: Each file should have one primary export
2. **File Size**: Keep files under 500 lines; split if larger
3. **Type Safety**: Use TypeScript types for all props and state
4. **Comments**: Add JSDoc comments for complex functions
5. **Consistent Naming**: Follow the naming conventions above
6. **Organized Imports**: Group and order imports consistently

## Key Architectural Patterns

- **Context API**: Used for global state (Auth, Onboarding)
- **Service Layer**: Centralized API calls in `src/services/`
- **Custom Hooks**: Reusable logic in `src/hooks/`
- **File-based Routing**: Expo Router in `app/` directory
- **Component Composition**: Reusable components in `src/components/`
