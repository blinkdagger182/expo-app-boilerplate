import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useSegments } from 'expo-router';

// Feature flag to control onboarding behavior
// Set to true to always show onboarding, false to show only for first-time users
export const ALWAYS_SHOW_ONBOARDING = false;

type OnboardingContextType = {
  isOnboarded: boolean | null;
  setIsOnboarded: (value: boolean) => void;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
  alwaysShowOnboarding: boolean;
  setAlwaysShowOnboarding: (value: boolean) => Promise<void>;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const STORAGE_KEY = 'hasCompletedOnboarding';
const FEATURE_FLAG_KEY = 'alwaysShowOnboarding';

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const [alwaysShowOnboarding, setAlwaysShowOnboarding] = useState<boolean>(ALWAYS_SHOW_ONBOARDING);
  const segments = useSegments();

  useEffect(() => {
    checkOnboardingStatus();
    loadFeatureFlag();
  }, []);

  useEffect(() => {
    if (isOnboarded === null) return;

    // Check if we're in the onboarding screen
    const inOnboardingGroup = segments[0] === 'onboarding';
    const inAuthGroup = segments[0] === '(auth)';

    // If always show onboarding is enabled, or user is not onboarded yet
    if ((alwaysShowOnboarding || !isOnboarded) && !inOnboardingGroup && !inAuthGroup) {
      // Use setTimeout to ensure navigation happens after component is mounted
      setTimeout(() => {
        router.replace('/onboarding');
      }, 100);
    } else if (isOnboarded && inOnboardingGroup) {
      setTimeout(() => {
        router.replace('/');
      }, 100);
    }
  }, [isOnboarded, segments, alwaysShowOnboarding]);

  const checkOnboardingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEY);
      setIsOnboarded(value === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setIsOnboarded(false);
    }
  };

  const loadFeatureFlag = async () => {
    try {
      const value = await AsyncStorage.getItem(FEATURE_FLAG_KEY);
      // If the value exists in storage, use it, otherwise use the default
      setAlwaysShowOnboarding(value === null ? ALWAYS_SHOW_ONBOARDING : value === 'true');
    } catch (error) {
      console.error('Error loading feature flag:', error);
      setAlwaysShowOnboarding(ALWAYS_SHOW_ONBOARDING);
    }
  };

  const handleSetIsOnboarded = async (value: boolean) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, String(value));
      setIsOnboarded(value);
    } catch (error) {
      console.error('Error setting onboarding status:', error);
    }
  };

  /**
   * Complete the onboarding process and mark the user as onboarded
   */
  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, 'true');
      setIsOnboarded(true);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  /**
   * Reset the onboarding status to force showing onboarding again
   */
  const resetOnboarding = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, 'false');
      setIsOnboarded(false);
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  };

  /**
   * Update the always show onboarding feature flag
   */
  const handleSetAlwaysShowOnboarding = async (value: boolean) => {
    try {
      await AsyncStorage.setItem(FEATURE_FLAG_KEY, String(value));
      setAlwaysShowOnboarding(value);
    } catch (error) {
      console.error('Error setting feature flag:', error);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        isOnboarded: isOnboarded === null ? false : isOnboarded,
        setIsOnboarded: handleSetIsOnboarded,
        completeOnboarding,
        resetOnboarding,
        alwaysShowOnboarding,
        setAlwaysShowOnboarding: handleSetAlwaysShowOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}