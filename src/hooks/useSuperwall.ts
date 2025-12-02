import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { SubscriptionStatus } from '@superwall/react-native-superwall';
import { superwallService } from '../services/superwall';

export function useSuperwall() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    if (Platform.OS === 'web') {
      setIsLoading(false);
      setIsAvailable(false);
      return;
    }

    // Check if Superwall is available (not in Expo Go)
    try {
      superwallService.initialize();
      checkSubscription();
    } catch (error) {
      console.warn('[Superwall] Not available in this environment (Expo Go). Use a development build for full features.');
      setIsAvailable(false);
      setIsLoading(false);
    }
  }, []);

  const checkSubscription = async () => {
    try {
      const status = await superwallService.getSubscriptionStatus();
      setIsSubscribed(status === SubscriptionStatus.ACTIVE);
    } catch (error) {
      console.error('[Superwall] Hook subscription check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const showPaywall = async (triggerId: string) => {
    if (isLoading || Platform.OS === 'web' || !isAvailable) {
      console.log('[Superwall] Paywall not available. Build a development build to enable subscriptions.');
      return;
    }
    
    try {
      await superwallService.presentPaywall(triggerId);
      // Refresh subscription status after paywall interaction
      await checkSubscription();
    } catch (error) {
      console.error('[Superwall] Hook failed to show paywall:', error);
    }
  };

  return {
    isSubscribed,
    isLoading,
    showPaywall,
    checkSubscription,
    isAvailable,
  };
} 