/**
 * Main App Screen - Entry point after authentication
 */

import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { MainNavigator } from '@/src/navigation/MainNavigator';

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
