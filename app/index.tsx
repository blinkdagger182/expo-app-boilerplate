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
import { StyleSheet, View, Text, TouchableOpacity, Image, ActivityIndicator, Alert, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Pawket } from '@/components/pawket/Pawket';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useAuth } from '@/contexts/AuthContext';

/**
 * MainScreen component that serves as the primary entry point for the app
 * This component checks for authentication and onboarding status
 */
export default function MainScreen() {
  const { isOnboarded } = useOnboarding();
  const { user, loading: authLoading, signIn, signUp, signInWithGoogle } = useAuth();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user needs to go through onboarding
  useEffect(() => {
    if (user) {
      // User is authenticated, check onboarding status
      if (isOnboarded === false) {
        // Navigate to onboarding
        const timer = setTimeout(() => {
          router.replace('/onboard');
        }, 100);
        return () => clearTimeout(timer);
      } else {
        // Navigate to main app
        router.replace('/pawket');
      }
    } else if (!authLoading) {
      // User is not authenticated, show login screen
      setCheckingOnboarding(false);
    }
  }, [isOnboarded, user, authLoading]);

  // Handle login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      setIsSubmitting(true);
      await signIn(email, password);
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Failed to sign in');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle signup
  const handleSignup = async () => {
    if (!email || !password || !name) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      await signUp(email, password, name);
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message || 'Failed to create account');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true);
      await signInWithGoogle();
    } catch (error: any) {
      Alert.alert('Google Sign In Failed', error.message || 'Failed to sign in with Google');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle between login and signup
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    // Clear form fields when switching modes
    setEmail('');
    setPassword('');
    setName('');
  };

  // Show loading state while checking auth and onboarding status
  if (authLoading || (user && checkingOnboarding)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // If not authenticated, show login/signup screen
  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar style="light" />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.authContainer}>
              {/* Logo and App Name */}
              <View style={styles.logoContainer}>
                <Image 
                  source={require('../assets/images/pawket-logo.png')} 
                  style={styles.logo}
                  resizeMode="contain"
                />
                <Text style={styles.appName}>Pawket</Text>
                <Text style={styles.appTagline}>Connect with cat lovers everywhere</Text>
              </View>

              {/* Auth Form */}
              <View style={styles.formContainer}>
                <Text style={styles.formTitle}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
                
                {/* Name field (signup only) */}
                {!isLogin && (
                  <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Your Name"
                      placeholderTextColor="#9CA3AF"
                      value={name}
                      onChangeText={setName}
                      autoCapitalize="words"
                    />
                  </View>
                )}
                
                {/* Email field */}
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                
                {/* Password field */}
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>
                
                {/* Submit button */}
                <TouchableOpacity 
                  style={styles.submitButton}
                  onPress={isLogin ? handleLogin : handleSignup}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.submitButtonText}>{isLogin ? 'Sign In' : 'Create Account'}</Text>
                  )}
                </TouchableOpacity>
                
                {/* Google Sign In */}
                <TouchableOpacity 
                  style={styles.googleButton}
                  onPress={handleGoogleSignIn}
                  disabled={isSubmitting}
                >
                  <Ionicons name="logo-google" size={20} color="#FFFFFF" style={styles.googleIcon} />
                  <Text style={styles.googleButtonText}>Continue with Google</Text>
                </TouchableOpacity>
                
                {/* Toggle auth mode */}
                <TouchableOpacity 
                  style={styles.toggleContainer}
                  onPress={toggleAuthMode}
                >
                  <Text style={styles.toggleText}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <Text style={styles.toggleTextHighlight}>{isLogin ? 'Sign Up' : 'Sign In'}</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // If authenticated and onboarded, render the Pawket component
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
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
    marginTop: 16,
  },
  authContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#FFFFFF',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#4285F4',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  googleIcon: {
    marginRight: 12,
  },
  googleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleContainer: {
    alignItems: 'center',
  },
  toggleText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  toggleTextHighlight: {
    color: '#8B5CF6',
    fontWeight: 'bold',
  },
});
