/**
 * Avatar component for the Pawket app
 * 
 * Learning curriculum:
 * - Creating reusable UI components in React Native
 * - Working with images and fallbacks
 * - Using TypeScript for props typing
 * - Implementing responsive design with dynamic sizing
 */

import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

interface AvatarProps {
  source: string;
  size?: 'small' | 'medium' | 'large';
  fallback?: string;
  bordered?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ 
  source, 
  size = 'medium', 
  fallback = '', 
  bordered = false 
}) => {
  // Get dimensions based on size
  const getDimensions = () => {
    switch (size) {
      case 'small':
        return { width: 32, height: 32 };
      case 'large':
        return { width: 96, height: 96 };
      case 'medium':
      default:
        return { width: 48, height: 48 };
    }
  };

  const dimensions = getDimensions();
  
  return (
    <View 
      style={[
        styles.container, 
        { width: dimensions.width, height: dimensions.height },
        bordered && styles.bordered
      ]}
    >
      {source ? (
        <Image 
          source={{ uri: source }} 
          style={styles.image} 
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.fallback, { backgroundColor: '#374151' }]}>
          <Text style={styles.fallbackText}>
            {fallback ? fallback.charAt(0).toUpperCase() : '?'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 9999,
    overflow: 'hidden',
  },
  bordered: {
    borderWidth: 2,
    borderColor: '#4B5563',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
