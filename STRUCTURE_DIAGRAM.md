# Project Structure Diagram

## Visual Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Pawket App                              │
│                  (Expo React Native)                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    app/ (Routing)                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  index.tsx → Auth Check → Onboarding Check           │  │
│  │       │                        │                      │  │
│  │       ├─ Not Auth → Login      │                      │  │
│  │       ├─ Not Onboarded → /onboarding                 │  │
│  │       └─ Ready → /main                                │  │
│  │                                                        │  │
│  │  main.tsx → MainNavigator                            │  │
│  │                                                        │  │
│  │  onboarding/ → Onboarding Flow                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              src/navigation/MainNavigator.tsx               │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Profile    │◄─┤     Home     │─►│   Messages   │    │
│  │   Screen     │  │    Screen    │  │    Screen    │    │
│  │   (Left)     │  │  (Center)    │  │   (Right)    │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
│  Horizontal Swipe Navigation                               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    src/ (Source Code)                       │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  screens/                                            │  │
│  │  ├─ HomeScreen.tsx      (Camera + Feed)            │  │
│  │  ├─ ProfileScreen.tsx   (User Profile)             │  │
│  │  ├─ MessagesScreen.tsx  (Chat)                     │  │
│  │  ├─ SettingsScreen.tsx  (Settings)                 │  │
│  │  └─ onboarding/         (Onboarding Screens)       │  │
│  └─────────────────────────────────────────────────────┘  │
│                            │                                │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  components/                                         │  │
│  │  ├─ common/             (Shared Components)         │  │
│  │  │  ├─ Avatar.tsx                                   │  │
│  │  │  ├─ Button.tsx                                   │  │
│  │  │  ├─ Input.tsx                                    │  │
│  │  │  └─ ...                                          │  │
│  │  └─ ui/                 (Platform-specific)         │  │
│  └─────────────────────────────────────────────────────┘  │
│                            │                                │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  contexts/              (State Management)          │  │
│  │  ├─ AuthContext.tsx                                 │  │
│  │  └─ OnboardingContext.tsx                           │  │
│  └─────────────────────────────────────────────────────┘  │
│                            │                                │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  services/              (External APIs)             │  │
│  │  ├─ supabase.ts         (Database)                  │  │
│  │  └─ superwall.ts        (Paywall)                   │  │
│  └─────────────────────────────────────────────────────┘  │
│                            │                                │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  hooks/                 (Custom Hooks)              │  │
│  │  ├─ useSuperwall.ts                                 │  │
│  │  ├─ useColorScheme.ts                               │  │
│  │  └─ useThemeColor.ts                                │  │
│  └─────────────────────────────────────────────────────┘  │
│                            │                                │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  utils/                 (Helpers)                   │  │
│  │  config/                (Configuration)             │  │
│  │  constants/             (Constants)                 │  │
│  │  types/                 (TypeScript Types)          │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

```
┌──────────────┐
│     User     │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────────────────┐
│                  Screen Component                     │
│  (HomeScreen, ProfileScreen, MessagesScreen)         │
└──────┬───────────────────────────────────────────────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌─────────────┐   ┌─────────────┐
│   Context   │   │   Service   │
│  (State)    │   │   Layer     │
└─────┬───────┘   └─────┬───────┘
      │                 │
      │                 ▼
      │          ┌─────────────┐
      │          │  Supabase   │
      │          │  (Backend)  │
      │          └─────┬───────┘
      │                │
      │                ▼
      │          ┌─────────────┐
      └─────────►│  Real-time  │
                 │   Updates   │
                 └─────────────┘
```

## Navigation Flow

```
                    ┌─────────────────┐
                    │   App Launch    │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  index.tsx      │
                    │  (Entry Point)  │
                    └────────┬────────┘
                             │
                ┌────────────┼────────────┐
                │            │            │
                ▼            ▼            ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │  Login   │  │Onboarding│  │   Main   │
        │  Screen  │  │  Flow    │  │Navigator │
        └──────────┘  └──────────┘  └────┬─────┘
                                          │
                        ┌─────────────────┼─────────────────┐
                        │                 │                 │
                        ▼                 ▼                 ▼
                ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
                │   Profile    │  │     Home     │  │   Messages   │
                │   Screen     │  │    Screen    │  │    Screen    │
                │              │  │              │  │              │
                │  ◄───────────┼──┼──────────────┼──┼──────────►  │
                │   Swipe      │  │   Swipe      │  │   Swipe     │
                └──────────────┘  └──────────────┘  └──────────────┘
```

## Component Hierarchy

```
MainNavigator
├── ProfileScreen
│   ├── Avatar
│   ├── Button
│   └── FlatList (Posts Grid)
│
├── HomeScreen
│   ├── Camera View
│   │   ├── CameraView (expo-camera)
│   │   └── Button (Capture)
│   │
│   ├── Feed View
│   │   ├── ScrollView (Vertical)
│   │   ├── Post Items
│   │   │   ├── Avatar
│   │   │   ├── Image
│   │   │   └── Caption
│   │   └── Loading Indicator
│   │
│   └── Input (Message)
│
└── MessagesScreen
    ├── Input (Search)
    ├── FlatList (Conversations)
    │   └── Conversation Item
    │       ├── Avatar
    │       ├── Name
    │       └── Last Message
    └── Button (New Message)
```

## File Naming Pattern

```
Screens:          *Screen.tsx
Components:       PascalCase.tsx
Utilities:        camelCase.ts
Contexts:         *Context.tsx
Hooks:            use*.ts
Services:         camelCase.ts
Types:            PascalCase.ts or index.ts
```

## Import Pattern

```typescript
// From screens
import { HomeScreen } from '@/src/screens/HomeScreen';
import { HomeScreen } from '@/src/screens'; // Using index

// From components
import { Avatar } from '@/src/components/common/Avatar';
import { Avatar } from '@/src/components/common'; // Using index

// From services
import { supabaseService } from '@/src/services/supabase';

// From contexts
import { useAuth } from '@/src/contexts/AuthContext';

// From hooks
import { useSuperwall } from '@/src/hooks/useSuperwall';

// From utils
import { getSwipeThreshold } from '@/src/utils/helpers';
```

## State Management Pattern

```
┌─────────────────────────────────────────────────────┐
│                  Global State                        │
│  ┌────────────────┐      ┌────────────────┐        │
│  │  AuthContext   │      │  Onboarding    │        │
│  │                │      │  Context       │        │
│  │  - user        │      │  - isOnboarded │        │
│  │  - profile     │      │  - settings    │        │
│  │  - signIn()    │      │  - reset()     │        │
│  │  - signOut()   │      │                │        │
│  └────────────────┘      └────────────────┘        │
└─────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────┐
│              Component Local State                   │
│  ┌────────────────┐      ┌────────────────┐        │
│  │  HomeScreen    │      │  ProfileScreen │        │
│  │                │      │                │        │
│  │  - posts       │      │  - userPosts   │        │
│  │  - loading     │      │  - stats       │        │
│  │  - page        │      │  - loading     │        │
│  └────────────────┘      └────────────────┘        │
└─────────────────────────────────────────────────────┘
```

## Service Layer Pattern

```
┌─────────────────────────────────────────────────────┐
│                  Service Layer                       │
│                                                      │
│  ┌────────────────────────────────────────────┐    │
│  │  supabaseService                           │    │
│  │                                            │    │
│  │  - getPosts()                              │    │
│  │  - createPost()                            │    │
│  │  - updateProfile()                         │    │
│  │  - sendMessage()                           │    │
│  │  - subscribeToRealtime()                   │    │
│  └────────────────────────────────────────────┘    │
│                      │                              │
│                      ▼                              │
│  ┌────────────────────────────────────────────┐    │
│  │  Supabase Client                           │    │
│  │  - Database                                │    │
│  │  - Storage                                 │    │
│  │  - Auth                                    │    │
│  │  - Realtime                                │    │
│  └────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

---

This diagram provides a visual representation of the new project structure, making it easier to understand the organization and relationships between different parts of the application.
