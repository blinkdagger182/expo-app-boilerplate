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
import { View, StyleSheet, StatusBar } from 'react-native';
import { MainNavigator } from '@/src/navigation/MainNavigator';

/**
 * PawketScreen component that serves as the main entry point for the Pawket app
 * This component wraps the Pawket component with necessary providers and safety features
 */
export default function MainScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#111827" />
      <MainNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
});
