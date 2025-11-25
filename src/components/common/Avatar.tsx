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
import { View, Image, Text, StyleSheet, ImageSourcePropType } from 'react-native';

interface AvatarProps {
  source?: ImageSourcePropType;
  size?: 'small' | 'medium' | 'large' | number;
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
    if (typeof size === 'number') {
      return { width: size, height: size };
    }
    
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
          source={source}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.fallbackContainer, { backgroundColor: generateColorFromString(fallback) }]}>
          <Text style={styles.fallbackText}>
            {fallback.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
    </View>
  );
};

// Generate a color based on a string (for fallback avatars)
const generateColorFromString = (str: string): string => {
  if (!str) return '#6B7280'; // Default gray
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  
  return color;
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 9999,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
  bordered: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallbackContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
