/**
 * Main App Entry Point - Pawket App
 * 
 * Learning curriculum:
 * - Understanding Expo Router's file-based routing
 * - Using React Native's SafeAreaView for proper device spacing
 * - Implementing status bar configuration
 * - Creating a standalone mobile app experience
 */

import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

import { Pawket } from '@/components/pawket/Pawket';
import { useOnboarding } from '@/contexts/OnboardingContext';

/**
 * MainScreen component that serves as the primary entry point for the app
 * This component checks for onboarding status and renders the Pawket app
 */
export default function MainScreen() {
  const { isOnboarded } = useOnboarding();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  // Check if user needs to go through onboarding
  useEffect(() => {
    if (isOnboarded === false) {
      // Use a small timeout to ensure the component is mounted before navigation
      const timer = setTimeout(() => {
        router.replace('/onboard');
      }, 100);
      return () => clearTimeout(timer);
    }
    setCheckingOnboarding(false);
  }, [isOnboarded]);

  // Show loading state while checking onboarding status
  if (checkingOnboarding) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <Pawket />
    </SafeAreaView>
  );
}

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
});
