/**
 * Pawket Screen - Main entry point for the Pawket app
 * 
 * Learning curriculum:
 * - Creating a standalone screen in Expo Router
 * - Integrating component-based architecture
 * - Using React Native's SafeAreaView for proper device spacing
 * - Implementing status bar configuration
 * - Understanding React Native's component lifecycle
 */

import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { Pawket } from '@/components/pawket/Pawket';

/**
 * PawketScreen component that serves as the main entry point for the Pawket app
 * This component wraps the Pawket component with necessary providers and safety features
 */
export default function PawketScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#111827" />
      <Pawket />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
});
