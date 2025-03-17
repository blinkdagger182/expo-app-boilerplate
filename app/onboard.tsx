/**
 * Onboarding Screen for the Pawket App
 * 
 * Learning curriculum:
 * - Creating an onboarding experience in React Native
 * - Using React Native's animation APIs
 * - Implementing a multi-step onboarding flow
 * - Managing app state with context
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Define the onboarding steps with properly typed icon names
const onboardingSteps = [
  {
    title: 'Welcome to Pawket',
    description: 'Your pet companion app for sharing and connecting with other pet lovers',
    icon: 'paw-outline' as const,
  },
  {
    title: 'Share Your Pet Photos',
    description: 'Capture and share your pet\'s best moments with friends and the community',
    icon: 'camera-outline' as const,
  },
  {
    title: 'Connect with Pet Lovers',
    description: 'Chat with other pet owners and build a network of pet-loving friends',
    icon: 'chatbubbles-outline' as const,
  },
];

export default function OnboardScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const { completeOnboarding } = useOnboarding();
  const scrollX = React.useRef(new Animated.Value(0)).current;

  // Handle next step
  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding and navigate to main screen
      completeOnboarding();
      router.replace('/');
    }
  };

  // Handle skip
  const handleSkip = () => {
    completeOnboarding();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Skip button */}
      {currentStep < onboardingSteps.length - 1 && (
        <TouchableOpacity 
          style={styles.skipButton} 
          onPress={handleSkip}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}
      
      {/* Onboarding content */}
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
      >
        {onboardingSteps.map((step, index) => (
          <View key={index} style={styles.slide}>
            <View style={styles.iconContainer}>
              <Ionicons name={step.icon} size={120} color="#0A7EA4" />
            </View>
            <Text style={styles.title}>{step.title}</Text>
            <Text style={styles.description}>{step.description}</Text>
          </View>
        ))}
      </Animated.ScrollView>
      
      {/* Pagination dots */}
      <View style={styles.pagination}>
        {onboardingSteps.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              currentStep === index && styles.paginationDotActive
            ]}
          />
        ))}
      </View>
      
      {/* Next/Get Started button */}
      <TouchableOpacity 
        style={styles.nextButton} 
        onPress={handleNext}
      >
        <Text style={styles.nextButtonText}>
          {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  skipButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  skipText: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  scrollContent: {
    flexGrow: 1,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 32,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4B5563',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: 'white',
  },
  nextButton: {
    backgroundColor: '#0A7EA4',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginHorizontal: 32,
    marginBottom: 32,
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
