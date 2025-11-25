# Migration Guide

This guide helps you complete the migration from the old structure to the new standardized structure.

## What Changed?

### 1. Directory Structure
- All source code moved to `src/` directory
- Components organized into `common/` and `ui/` subdirectories
- Screens separated from components
- Navigation logic extracted to `navigation/` directory

### 2. File Naming
- `*Page.tsx` → `*Screen.tsx` (e.g., `HomePage` → `HomeScreen`)
- `Pawket.tsx` → `MainNavigator.tsx`
- `utils.ts` → `helpers.ts`
- All "pawket" references replaced with functional names

### 3. Import Paths
```typescript
// Old
import { HomePage } from '@/components/pawket/HomePage';
import { Avatar } from '@/components/pawket/Avatar';

// New
import { HomeScreen } from '@/src/screens/HomeScreen';
import { Avatar } from '@/src/components/common/Avatar';

// Or using index exports
import { HomeScreen } from '@/src/screens';
import { Avatar } from '@/src/components/common';
```

## Step-by-Step Migration

### Step 1: Verify New Structure ✅
The new `src/` directory has been created with all files copied and updated.

### Step 2: Update Import References
Search for and update any remaining old import paths:

```bash
# Find old imports
grep -r "@/components/pawket" app/
grep -r "from './Avatar'" src/
grep -r "from './Button'" src/
```

### Step 3: Test the Application
1. Start the development server:
   ```bash
   npm start
   ```

2. Test each screen:
   - [ ] Authentication flow
   - [ ] Onboarding flow
   - [ ] Home screen (camera, posts, feed)
   - [ ] Profile screen
   - [ ] Messages screen
   - [ ] Settings screen
   - [ ] Navigation (swipe between screens)

### Step 4: Remove Old Files
Once everything is tested and working, remove the old structure:

```bash
# Remove old component directory
rm -rf components/pawket/

# Remove duplicate app routes (if not needed)
rm -rf app/(tabs)/

# Remove old pawket route
rm app/pawket.tsx
```

### Step 5: Update Documentation
- [ ] Update README.md with new structure
- [ ] Update any developer documentation
- [ ] Update onboarding docs for new developers

## Common Issues and Solutions

### Issue: Import errors
**Solution**: Check that tsconfig.json has the correct path mapping:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@/src/*": ["./src/*"]
    }
  }
}
```

### Issue: Component not found
**Solution**: Verify the component was copied to the new location:
```bash
ls -la src/components/common/
ls -la src/screens/
```

### Issue: Navigation not working
**Solution**: Check that MainNavigator is properly imported in app/index.tsx and app/main.tsx

## Rollback Plan

If you need to rollback to the old structure:

1. The old files are still in place in `components/pawket/` and `app/`
2. Revert changes to `app/index.tsx`:
   ```typescript
   import { Pawket } from '@/components/pawket/Pawket';
   ```
3. Revert changes to `tsconfig.json`
4. Remove the `src/` directory

## Verification Checklist

Before removing old files, verify:

- [ ] All screens render correctly
- [ ] Navigation works (swipe left/right)
- [ ] Authentication flow works
- [ ] Onboarding flow works
- [ ] Camera functionality works
- [ ] Image upload works
- [ ] Messages load correctly
- [ ] Profile displays correctly
- [ ] Settings work correctly
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] App builds successfully for iOS
- [ ] App builds successfully for Android

## Next Steps

After migration is complete:

1. Update `.cursorrules` to reference new structure
2. Create component documentation
3. Set up automated tests for new structure
4. Update CI/CD pipelines if needed
5. Train team on new structure

## Questions?

If you encounter issues during migration:
1. Check the PROJECT_STRUCTURE.md file
2. Review the import paths in working files
3. Check the console for specific error messages
4. Verify all dependencies are installed
