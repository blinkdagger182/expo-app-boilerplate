/**
 * Pawket Tab Screen - Entry point for the Pawket app in the tab navigation
 * 
 * Learning curriculum:
 * - Integrating screens within a tab-based navigation system
 * - Understanding Expo Router's file-based routing
 * - Using React Native's SafeAreaView for proper device spacing
 * - Implementing status bar configuration
 */

import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { Pawket } from '@/components/pawket/Pawket';

/**
 * PawketTabScreen component that serves as the entry point for the Pawket app
 * within the tab navigation system
 */
export default function PawketTabScreen() {
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
