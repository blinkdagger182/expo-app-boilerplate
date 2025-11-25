/**
 * Main Navigator - Horizontal swipe navigation between screens
 * 
 * Screens:
 * - Profile (left)
 * - Home (center/default)
 * - Messages (right)
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Dimensions, 
  Animated, 
  PanResponder,
  Text
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProfileScreen, HomeScreen, MessagesScreen } from '../screens';
import { getSwipeThreshold } from '../utils/helpers';

export const MainNavigator: React.FC = () => {
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
        return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < Math.abs(gestureState.dx);
      },
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderGrant: () => {
        setIsGestureActive(true);
      },
      onPanResponderMove: (_, gestureState) => {
        let newPosition = -currentPageRef.current * Dimensions.get('window').width;
      
        if (currentPageRef.current === 1) {
          newPosition += gestureState.dx;
        } else if (currentPageRef.current === 0 && gestureState.dx < 0) {
          newPosition += gestureState.dx;
        } else if (currentPageRef.current === 2 && gestureState.dx > 0) {
          newPosition += gestureState.dx;
        }
      
        const minPosition = -2 * Dimensions.get('window').width;
        const maxPosition = 0;
        translateX.setValue(Math.max(minPosition, Math.min(maxPosition, newPosition)));
      },
      
      onPanResponderRelease: (_, gestureState) => {
        setIsGestureActive(false);
      
        if (Math.abs(gestureState.dx) > swipeThreshold) {
          if (currentPageRef.current === 1) {
            navigateToPage(gestureState.dx > 0 ? 0 : 2);
          } else if (currentPageRef.current === 0 && gestureState.dx < 0) {
            navigateToPage(1);
          } else if (currentPageRef.current === 2 && gestureState.dx > 0) {
            navigateToPage(1);
          } else {
            navigateToPage(currentPageRef.current);
          }
        } else {
          navigateToPage(currentPageRef.current);
        }
      
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
  
  useEffect(() => {
    setIsMounted(true);
    translateX.setValue(-Dimensions.get('window').width);
    currentPageRef.current = 1;
    
    const timer = setTimeout(() => {
      setShowSwipeHelp(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);
  
  if (!isMounted) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {showSwipeHelp && (
        <View style={[styles.swipeHelp, { top: insets.top + 48 }]}>
          <Text style={styles.swipeHelpText}>Swipe left/right to navigate pages</Text>
        </View>
      )}
      
      <Animated.View 
        style={[
          styles.pagesContainer,
          { transform: [{ translateX }] }
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.page}>
          <ProfileScreen />
        </View>
        
        <View style={styles.page}>
          <HomeScreen />
        </View>
        
        <View style={styles.page}>
          <MessagesScreen />
        </View>
      </Animated.View>
      
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
