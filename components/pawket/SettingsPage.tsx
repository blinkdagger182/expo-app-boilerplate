import React, { useState } from 'react';
import { StyleSheet, View, Switch, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { supabaseService } from '@/services/supabase';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsPage() {
  const { 
    alwaysShowOnboarding, 
    setAlwaysShowOnboarding, 
    resetOnboarding 
  } = useOnboarding();
  
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleOnboarding = async (value: boolean) => {
    await setAlwaysShowOnboarding(value);
  };

  const handleResetOnboarding = async () => {
    Alert.alert(
      'Reset Onboarding',
      'Are you sure you want to reset the onboarding status? You will see the onboarding screens again.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              await resetOnboarding();
              Alert.alert('Success', 'Onboarding has been reset. Restart the app to see the onboarding screens.');
            } catch (error) {
              console.error('Error resetting onboarding:', error);
              Alert.alert('Error', 'Failed to reset onboarding');
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              await supabaseService.signOut();
              router.replace('/(auth)' as any);
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out');
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#0A7EA4" />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.title}>Settings</ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Onboarding</ThemedText>
          
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <ThemedText type="defaultSemiBold">Always Show Onboarding</ThemedText>
              <ThemedText type="default" style={styles.settingDescription}>
                When enabled, onboarding screens will be shown every time you open the app
              </ThemedText>
            </View>
            <Switch
              value={alwaysShowOnboarding}
              onValueChange={handleToggleOnboarding}
              trackColor={{ false: '#767577', true: '#0A7EA4' }}
              thumbColor={'#f4f3f4'}
              disabled={isLoading}
            />
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleResetOnboarding}
            disabled={isLoading}
          >
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>
              Reset Onboarding
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Account</ThemedText>
          
          <TouchableOpacity 
            style={[styles.button, styles.signOutButton]} 
            onPress={handleSignOut}
            disabled={isLoading}
          >
            <ThemedText type="defaultSemiBold" style={styles.signOutButtonText}>
              Sign Out
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: 16,
    fontSize: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#0A7EA4',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  signOutButton: {
    backgroundColor: '#F44336',
  },
  signOutButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
