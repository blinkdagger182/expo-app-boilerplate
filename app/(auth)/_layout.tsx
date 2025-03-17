/**
 * Auth Group Layout
 * 
 * Learning curriculum:
 * - Understanding Expo Router's file-based routing and group layouts
 * - Creating isolated navigation groups
 * - Using Stack navigator for authentication flows
 */

import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function AuthLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
