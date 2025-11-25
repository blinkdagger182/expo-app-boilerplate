# Testing Checklist

Use this checklist to verify that the reorganized structure works correctly before removing old files.

## Pre-Testing Setup

- [ ] All dependencies installed (`npm install`)
- [ ] Environment variables configured (`.env` file)
- [ ] Development server can start (`npm start`)
- [ ] No TypeScript compilation errors
- [ ] No import errors in console

## Authentication Flow

### Login
- [ ] Email/password login works
- [ ] Google sign-in works (if configured)
- [ ] Error messages display correctly
- [ ] Loading states work
- [ ] Successful login navigates to correct screen

### Sign Up
- [ ] New user registration works
- [ ] Email validation works
- [ ] Password validation works
- [ ] Profile creation works
- [ ] Navigates to onboarding after signup

### Sign Out
- [ ] Sign out button works
- [ ] Returns to login screen
- [ ] Clears user session
- [ ] Clears cached data

## Onboarding Flow

- [ ] Onboarding screens display correctly
- [ ] Can navigate through all onboarding steps
- [ ] "Next" buttons work
- [ ] "Skip" button works (if applicable)
- [ ] Final screen navigates to main app
- [ ] Onboarding status is saved
- [ ] Doesn't show again after completion

## Main Navigation

### Horizontal Swipe Navigation
- [ ] Can swipe from Home to Profile (right swipe)
- [ ] Can swipe from Home to Messages (left swipe)
- [ ] Can swipe from Profile to Home (left swipe)
- [ ] Can swipe from Messages to Home (right swipe)
- [ ] Cannot swipe beyond boundaries
- [ ] Swipe animations are smooth
- [ ] Page indicators update correctly
- [ ] Swipe help message appears and disappears

## Home Screen

### Camera View
- [ ] Camera permission request works
- [ ] Camera view displays correctly
- [ ] Can switch between front/back camera
- [ ] Flash button displays
- [ ] Zoom button displays
- [ ] Capture button works
- [ ] Photo preview displays after capture
- [ ] Can retake photo
- [ ] Can add caption to photo
- [ ] Post button works

### Feed View
- [ ] Posts load correctly
- [ ] Images display properly
- [ ] Captions display correctly
- [ ] Author information shows
- [ ] Timestamps display
- [ ] Can scroll through posts vertically
- [ ] Loading indicator shows while fetching
- [ ] "Load more" works (pagination)
- [ ] "End of feed" message displays
- [ ] Pull to refresh works

### Image Upload
- [ ] Can select image from library
- [ ] Image picker opens correctly
- [ ] Selected image displays
- [ ] Can add caption
- [ ] Upload progress shows
- [ ] Success message displays
- [ ] New post appears in feed
- [ ] Paywall shows for non-premium users (if applicable)

### Real-time Updates
- [ ] New posts appear automatically
- [ ] Feed updates when others post
- [ ] No duplicate posts
- [ ] Subscription connects properly
- [ ] Subscription cleans up on unmount

## Profile Screen

### Profile Display
- [ ] User avatar displays
- [ ] User name displays
- [ ] User stats display (posts, friends, likes)
- [ ] Bio displays (if applicable)
- [ ] Edit profile button works

### Posts Grid
- [ ] User's posts display in grid
- [ ] Images load correctly
- [ ] Grid layout is correct (2-3 columns)
- [ ] Can tap on post to view details
- [ ] Empty state shows if no posts
- [ ] Loading indicator shows while fetching

### Actions
- [ ] Can edit profile
- [ ] Can change avatar
- [ ] Can update bio
- [ ] Changes save correctly
- [ ] Changes reflect immediately

## Messages Screen

### Conversations List
- [ ] Conversations load correctly
- [ ] Avatar displays for each conversation
- [ ] Last message displays
- [ ] Timestamps display
- [ ] Unread indicators work
- [ ] Can search conversations
- [ ] Search filters correctly
- [ ] Empty state shows if no messages

### Chat View
- [ ] Can open a conversation
- [ ] Messages load correctly
- [ ] Can send new message
- [ ] Messages appear in real-time
- [ ] Timestamps display
- [ ] Can scroll through history
- [ ] Keyboard behavior is correct
- [ ] Can send emojis

### Real-time Updates
- [ ] New messages appear automatically
- [ ] Typing indicators work (if implemented)
- [ ] Read receipts work (if implemented)
- [ ] Subscription connects properly

## Settings Screen

### Display
- [ ] Settings screen loads
- [ ] All settings options display
- [ ] Toggle switches work
- [ ] Buttons are clickable

### Functionality
- [ ] Can toggle onboarding setting
- [ ] Can reset onboarding
- [ ] Can sign out
- [ ] Confirmation dialogs work
- [ ] Changes save correctly

## Cross-Screen Functionality

### Navigation
- [ ] Can navigate between all screens
- [ ] Back navigation works
- [ ] Deep linking works (if implemented)
- [ ] Navigation state persists correctly

### State Management
- [ ] Auth state persists across screens
- [ ] User data is consistent
- [ ] Context updates propagate correctly
- [ ] No state conflicts

## UI/UX

### Layout
- [ ] Safe areas handled correctly (notch, home indicator)
- [ ] Status bar displays correctly
- [ ] Headers display correctly
- [ ] Footers display correctly
- [ ] No layout overflow issues

### Responsiveness
- [ ] Works on different screen sizes
- [ ] Landscape mode works (if supported)
- [ ] Tablet layout works (if supported)
- [ ] Text scales appropriately

### Styling
- [ ] Colors are consistent
- [ ] Fonts are correct
- [ ] Spacing is consistent
- [ ] Borders and shadows display correctly
- [ ] Dark mode works (if implemented)

### Interactions
- [ ] Buttons have proper touch feedback
- [ ] Loading states are clear
- [ ] Error states are clear
- [ ] Success states are clear
- [ ] Animations are smooth

## Platform-Specific Testing

### iOS
- [ ] App launches correctly
- [ ] Navigation works
- [ ] Camera works
- [ ] Image picker works
- [ ] Keyboard behavior is correct
- [ ] Safe areas handled correctly
- [ ] No crashes
- [ ] No console errors

### Android
- [ ] App launches correctly
- [ ] Navigation works
- [ ] Camera works
- [ ] Image picker works
- [ ] Keyboard behavior is correct
- [ ] Back button works correctly
- [ ] No crashes
- [ ] No console errors

### Web (if applicable)
- [ ] App loads in browser
- [ ] Basic functionality works
- [ ] Responsive design works
- [ ] No console errors

## Performance

### Loading Times
- [ ] Initial load is reasonable
- [ ] Screen transitions are smooth
- [ ] Images load efficiently
- [ ] No significant lag

### Memory
- [ ] No memory leaks
- [ ] App doesn't crash with extended use
- [ ] Images are properly cached
- [ ] Subscriptions clean up properly

### Network
- [ ] Works with slow connection
- [ ] Handles offline state gracefully
- [ ] Retry logic works
- [ ] Error messages are clear

## Error Handling

### Network Errors
- [ ] Displays error message
- [ ] Allows retry
- [ ] Doesn't crash app
- [ ] Logs error appropriately

### Validation Errors
- [ ] Form validation works
- [ ] Error messages are clear
- [ ] Highlights problem fields
- [ ] Allows correction

### Permission Errors
- [ ] Handles denied permissions
- [ ] Shows appropriate message
- [ ] Provides way to grant permissions
- [ ] Doesn't crash app

## Security

### Authentication
- [ ] Tokens are stored securely
- [ ] Session expires appropriately
- [ ] Protected routes work
- [ ] Unauthorized access is blocked

### Data
- [ ] User data is protected
- [ ] Images are uploaded securely
- [ ] API keys are not exposed
- [ ] Environment variables work correctly

## Final Checks

### Code Quality
- [ ] No TypeScript errors
- [ ] No ESLint warnings (if configured)
- [ ] No console errors in production
- [ ] No console warnings in production

### Documentation
- [ ] README is updated
- [ ] Code comments are clear
- [ ] API documentation is current
- [ ] Migration guide is complete

### Build
- [ ] iOS build succeeds
- [ ] Android build succeeds
- [ ] Production build works
- [ ] No build warnings

## Sign-Off

- [ ] All critical features tested
- [ ] All major bugs fixed
- [ ] Performance is acceptable
- [ ] Ready for cleanup of old files

---

**Tester Name**: _______________
**Date**: _______________
**Platform**: iOS / Android / Web
**Device**: _______________
**Notes**: 

_______________________________________________
_______________________________________________
_______________________________________________
