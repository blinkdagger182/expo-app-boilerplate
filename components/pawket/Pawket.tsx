/**
 * Main Pawket component for the app
 * 
 * Learning curriculum:
 * - Implementing horizontal swipe navigation in React Native
 * - Using React Native's Animated API for transitions
 * - Managing component state with useState and useRef
 * - Working with gesture handling in React Native
 * - Creating a multi-page mobile app interface
 * - Handling safe areas in React Native
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Dimensions, 
  Animated, 
  PanResponder,
  TouchableOpacity,
  Text
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProfilePage } from './ProfilePage';
import { HomePage } from './HomePage';
import { MessagesPage } from './MessagesPage';
import { Ionicons } from '@expo/vector-icons';
import { getSwipeThreshold } from './utils';

interface PawketProps {
  // Add any props needed
}

export const Pawket: React.FC<PawketProps> = () => {
  const [currentPage, setCurrentPage] = useState(1); // 0: Profile, 1: Home, 2: Messages
  const [isMounted, setIsMounted] = useState(false);
  const [showSwipeHelp, setShowSwipeHelp] = useState(true);
  const [isGestureActive, setIsGestureActive] = useState(false);
  
  const translateX = useRef(new Animated.Value(-Dimensions.get('window').width)).current;
  const swipeThreshold = getSwipeThreshold();
  const insets = useSafeAreaInsets();
  const currentPageRef = useRef(1);
  
  // Navigate to a specific page with animation
  const navigateToPage = (pageIndex: number) => {
    setCurrentPage(pageIndex);
    currentPageRef.current = pageIndex;
    
    Animated.spring(translateX, {
      toValue: -pageIndex * Dimensions.get('window').width,
      useNativeDriver: true,
      friction: 7,
      tension: 45,
    }).start();
  };
  
  // Set up pan responder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to horizontal gestures
        return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < Math.abs(gestureState.dx);
      },
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderGrant: () => {
        setIsGestureActive(true);
      },
      onPanResponderMove: (_, gestureState) => {
        let newPosition = -currentPageRef.current * Dimensions.get('window').width;
      
        if (currentPageRef.current === 1) {
          // Home Page: Allow both left (to Messages) and right (to Profile)
          newPosition += gestureState.dx;
        } else if (currentPageRef.current === 0 && gestureState.dx < 0) {
          // Profile Page: Only allow left swipe (negative dx) to Home
          newPosition += gestureState.dx;
        } else if (currentPageRef.current === 2 && gestureState.dx > 0) {
          // Messages Page: Only allow right swipe (positive dx) to Home
          newPosition += gestureState.dx;
        }
      
        // Ensure boundaries
        const minPosition = -2 * Dimensions.get('window').width;
        const maxPosition = 0;
        translateX.setValue(Math.max(minPosition, Math.min(maxPosition, newPosition)));
      },
      
      onPanResponderRelease: (_, gestureState) => {
        setIsGestureActive(false);
      
        if (Math.abs(gestureState.dx) > swipeThreshold) {
          if (currentPageRef.current === 1) {
            // Home Page: Can swipe left to Messages or right to Profile
            navigateToPage(gestureState.dx > 0 ? 0 : 2);
          } else if (currentPageRef.current === 0 && gestureState.dx < 0) {
            // Profile Page: Swipe left to Home only
            navigateToPage(1);
          } else if (currentPageRef.current === 2 && gestureState.dx > 0) {
            // Messages Page: Swipe right to Home only
            navigateToPage(1);
          } else {
            // If swipe doesn't match conditions, return to current page
            navigateToPage(currentPageRef.current);
          }
        } else {
          // Not enough movement, return to current page
          navigateToPage(currentPageRef.current);
        }
      
        // Hide swipe help after first gesture
        if (showSwipeHelp) {
          setShowSwipeHelp(false);
        }
      },
      
      onPanResponderTerminate: () => {
        setIsGestureActive(false);
        navigateToPage(currentPageRef.current);
      },
    })
  ).current;
  
  // Set up component after mount
  useEffect(() => {
    setIsMounted(true);
    
    // Initialize position to home page
    translateX.setValue(-Dimensions.get('window').width);
    currentPageRef.current = 1;
    
    // Hide swipe help after 5 seconds
    const timer = setTimeout(() => {
      setShowSwipeHelp(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Update currentPageRef when currentPage changes
  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);
  
  // Show loading state until mounted
  if (!isMounted) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* Swipe Navigation Instructions */}
      {showSwipeHelp && (
        <View style={[styles.swipeHelp, { top: insets.top + 48 }]}>
          <Text style={styles.swipeHelpText}>Swipe left/right to navigate pages</Text>
        </View>
      )}
      
      {/* Pages Container */}
      <Animated.View 
        style={[
          styles.pagesContainer,
          { transform: [{ translateX }] }
        ]}
        {...panResponder.panHandlers}
      >
        {/* Profile Page */}
        <View style={styles.page}>
          <ProfilePage />
        </View>
        
        {/* Home Page */}
        <View style={styles.page}>
          <HomePage />
        </View>
        
        {/* Messages Page */}
        <View style={styles.page}>
          <MessagesPage />
        </View>
      </Animated.View>
      
      {/* Page Indicator */}
      <View style={[styles.pageIndicator, { bottom: Math.max(8, insets.bottom) }]}>
        <View style={[styles.indicatorDot, currentPageRef.current === 0 && styles.activeIndicatorDot]} />
        <View style={[styles.indicatorDot, currentPageRef.current === 1 && styles.activeIndicatorDot]} />
        <View style={[styles.indicatorDot, currentPageRef.current === 2 && styles.activeIndicatorDot]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
  },
  pageIndicator: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -30 }],
    flexDirection: 'row',
    zIndex: 10,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4B5563',
    marginHorizontal: 4,
  },
  activeIndicatorDot: {
    backgroundColor: 'white',
  },
  swipeHelp: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -100 }],
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    zIndex: 10,
  },
  swipeHelpText: {
    color: 'white',
    fontSize: 12,
  },
  pagesContainer: {
    flex: 1,
    flexDirection: 'row',
    width: Dimensions.get('window').width * 3,
  },
  page: {
    width: Dimensions.get('window').width,
    height: '100%',
  },
});
