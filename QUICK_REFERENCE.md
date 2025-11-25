# Quick Reference Guide

## 🚀 Common Commands

```bash
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run tests
npm test

# Clean and reinstall
rm -rf node_modules && npm install

# Clear Expo cache
npx expo start -c
```

## 📁 Where to Find Things

| What | Where |
|------|-------|
| Screens | `src/screens/` |
| Components | `src/components/common/` |
| Navigation | `src/navigation/` |
| Auth Logic | `src/contexts/AuthContext.tsx` |
| Database | `src/services/supabase.ts` |
| Hooks | `src/hooks/` |
| Utils | `src/utils/` |
| Types | `src/types/` |
| Config | `src/config/` |
| Routes | `app/` |

## 🎯 Common Tasks

### Add a New Screen

1. Create file: `src/screens/NewScreen.tsx`
2. Export from: `src/screens/index.ts`
3. Add route: `app/new.tsx` (if needed)

```typescript
// src/screens/NewScreen.tsx
export function NewScreen() {
  return <View><Text>New Screen</Text></View>;
}

// src/screens/index.ts
export { NewScreen } from './NewScreen';

// app/new.tsx
import { NewScreen } from '@/src/screens';
export default NewScreen;
```

### Add a New Component

1. Create file: `src/components/common/NewComponent.tsx`
2. Export from: `src/components/common/index.ts`

```typescript
// src/components/common/NewComponent.tsx
export function NewComponent() {
  return <View><Text>Component</Text></View>;
}

// src/components/common/index.ts
export { NewComponent } from './NewComponent';
```

### Add a New Service Method

```typescript
// src/services/supabase.ts
export const supabaseService = {
  // ... existing methods
  
  async newMethod() {
    const { data, error } = await supabase
      .from('table')
      .select('*');
    
    if (error) throw error;
    return data;
  }
};
```

### Add a New Hook

```typescript
// src/hooks/useNewHook.ts
import { useState, useEffect } from 'react';

export function useNewHook() {
  const [state, setState] = useState(null);
  
  useEffect(() => {
    // Logic here
  }, []);
  
  return { state };
}
```

## 📝 Import Patterns

```typescript
// Screens
import { HomeScreen } from '@/src/screens/HomeScreen';
import { HomeScreen } from '@/src/screens'; // Using index

// Components
import { Avatar, Button } from '@/src/components/common';

// Services
import { supabaseService } from '@/src/services/supabase';

// Contexts
import { useAuth } from '@/src/contexts/AuthContext';

// Hooks
import { useSuperwall } from '@/src/hooks/useSuperwall';

// Utils
import { getSwipeThreshold } from '@/src/utils/helpers';

// Types
import type { Post, User } from '@/src/types';
```

## 🎨 Styling Patterns

```typescript
// Component with styles
import { StyleSheet } from 'react-native';

export function MyComponent() {
  return <View style={styles.container}>...</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
```

## 🔧 TypeScript Patterns

```typescript
// Component props
interface MyComponentProps {
  title: string;
  onPress?: () => void;
  children?: React.ReactNode;
}

export function MyComponent({ title, onPress, children }: MyComponentProps) {
  return <View>...</View>;
}

// State typing
const [user, setUser] = useState<User | null>(null);
const [posts, setPosts] = useState<Post[]>([]);
```

## 🗂️ File Naming

| Type | Pattern | Example |
|------|---------|---------|
| Screen | `*Screen.tsx` | `HomeScreen.tsx` |
| Component | `PascalCase.tsx` | `Avatar.tsx` |
| Utility | `camelCase.ts` | `helpers.ts` |
| Context | `*Context.tsx` | `AuthContext.tsx` |
| Hook | `use*.ts` | `useAuth.ts` |
| Service | `camelCase.ts` | `supabase.ts` |
| Type | `PascalCase.ts` | `User.ts` |

## 🔍 Debugging

```typescript
// Console logging
console.log('Debug:', variable);
console.error('Error:', error);
console.warn('Warning:', warning);

// React Native Debugger
// Press Cmd+D (iOS) or Cmd+M (Android) to open dev menu

// Check network requests
// Use React Native Debugger or Flipper

// Check Supabase queries
console.log('Query result:', data);
console.error('Query error:', error);
```

## 🐛 Common Issues

### Import not found
```bash
# Clear cache and restart
npx expo start -c
```

### TypeScript errors
```bash
# Check tsconfig.json paths
# Restart TypeScript server in VS Code
```

### Navigation not working
```typescript
// Check that MainNavigator is imported correctly
import { MainNavigator } from '@/src/navigation/MainNavigator';
```

### Supabase connection issues
```bash
# Check .env file
# Verify EXPO_PUBLIC_SUPABASE_URL
# Verify EXPO_PUBLIC_SUPABASE_ANON_KEY
```

## 📚 Key Files

| File | Purpose |
|------|---------|
| `app/index.tsx` | App entry point |
| `app/main.tsx` | Main app screen |
| `src/navigation/MainNavigator.tsx` | Main navigation |
| `src/contexts/AuthContext.tsx` | Authentication |
| `src/services/supabase.ts` | Database service |
| `tsconfig.json` | TypeScript config |
| `app.json` | Expo config |
| `.env` | Environment variables |

## 🔐 Environment Variables

```bash
# Required in .env
EXPO_PUBLIC_SUPABASE_URL=your_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key

# Optional
EXPO_PUBLIC_SUPERWALL_API_KEY=your_key
```

## 📱 Screen Structure

```
MainNavigator (Horizontal Swipe)
├── ProfileScreen (Left)
├── HomeScreen (Center)
└── MessagesScreen (Right)
```

## 🎯 Navigation Methods

```typescript
// Using expo-router
import { router } from 'expo-router';

router.push('/screen');      // Navigate to screen
router.replace('/screen');   // Replace current screen
router.back();               // Go back

// Using MainNavigator
// Swipe left/right between screens
```

## 💾 State Management

```typescript
// Global state (Context)
const { user, signIn, signOut } = useAuth();

// Local state (useState)
const [posts, setPosts] = useState<Post[]>([]);

// Effect (useEffect)
useEffect(() => {
  fetchData();
}, [dependency]);
```

## 🔄 Real-time Subscriptions

```typescript
// Subscribe to changes
const subscription = await supabaseService.subscribeToPosts((payload) => {
  console.log('New post:', payload);
});

// Cleanup
useEffect(() => {
  return () => {
    subscription?.unsubscribe();
  };
}, []);
```

## 📊 Data Fetching Pattern

```typescript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  async function fetchData() {
    try {
      setLoading(true);
      const result = await supabaseService.getData();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }
  
  fetchData();
}, []);
```

## 🎨 Theme Colors

```typescript
// From src/constants/Colors.ts
import { Colors } from '@/src/constants/Colors';

// Usage
backgroundColor: Colors.light.background
color: Colors.dark.text
```

## 📝 Code Style

```typescript
// Component structure
import statements
type definitions
component function
styles
export

// Naming
Components: PascalCase
Functions: camelCase
Constants: UPPER_SNAKE_CASE
Files: Match export name
```

## 🚨 Before Committing

- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Code formatted
- [ ] Imports organized
- [ ] Comments added
- [ ] Tested on device

## 📞 Getting Help

1. Check documentation files
2. Check console for errors
3. Check TypeScript errors
4. Review similar working code
5. Check Expo/React Native docs

---

**Quick Links**
- [Project Structure](./PROJECT_STRUCTURE.md)
- [Migration Guide](./MIGRATION_GUIDE.md)
- [Testing Checklist](./TESTING_CHECKLIST.md)
- [Structure Diagram](./STRUCTURE_DIAGRAM.md)
