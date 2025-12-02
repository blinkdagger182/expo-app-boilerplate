import { Platform } from 'react-native';
import { createSuperwallConfig } from '../config/superwall';

// Dynamically import Superwall to handle when it's not available (Expo Go)
let Superwall: any = null;
let SubscriptionStatus: any = null;

try {
  const superwallModule = require('@superwall/react-native-superwall');
  Superwall = superwallModule.default;
  SubscriptionStatus = superwallModule.SubscriptionStatus;
} catch (error) {
  console.warn('[Superwall] Native module not available. This is expected in Expo Go. Use a development build for full features.');
}

class SuperwallService {
  private static instance: SuperwallService;
  private initialized = false;
  private isAvailable = false;

  private constructor() {
    this.isAvailable = Superwall !== null;
  }

  static getInstance(): SuperwallService {
    if (!SuperwallService.instance) {
      SuperwallService.instance = new SuperwallService();
    }
    return SuperwallService.instance;
  }

  initialize() {
    if (this.initialized || !this.isAvailable) return;

    const apiKey = Platform.select({
      ios: process.env.EXPO_PUBLIC_SUPERWALL_API_KEY_IOS,
      android: process.env.EXPO_PUBLIC_SUPERWALL_API_KEY_ANDROID,
      default: undefined,
    });

    if (!apiKey) {
      console.warn('[Superwall] No API key found for platform:', Platform.OS);
      return;
    }

    try {
      const options = createSuperwallConfig();
      Superwall.configure(apiKey, options);
      this.initialized = true;
      console.log('[Superwall] Initialized successfully');
    } catch (error) {
      console.error('[Superwall] Initialization failed:', error);
      throw error;
    }
  }

  async presentPaywall(triggerId: string): Promise<void> {
    if (!this.isAvailable) {
      console.log('[Superwall] Not available. Build a development build to enable paywalls.');
      return;
    }

    try {
      console.log('[Superwall] Presenting paywall for trigger:', triggerId);
      await Superwall.shared.register(triggerId);
    } catch (error) {
      console.error('[Superwall] Failed to present paywall:', error);
      throw error;
    }
  }

  async getSubscriptionStatus(): Promise<any> {
    if (!this.isAvailable) {
      console.log('[Superwall] Not available. Returning UNKNOWN status.');
      return 'UNKNOWN';
    }

    try {
      const status = await Superwall.shared.getSubscriptionStatus();
      console.log('[Superwall] Subscription status:', status);
      return status;
    } catch (error) {
      console.error('[Superwall] Failed to get subscription status:', error);
      throw error;
    }
  }

  getAvailability(): boolean {
    return this.isAvailable;
  }
}

export const superwallService = SuperwallService.getInstance();
export { SubscriptionStatus }; 