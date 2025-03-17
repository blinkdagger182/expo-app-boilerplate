/**
 * Input component for the Pawket app
 * 
 * Learning curriculum:
 * - Creating reusable form components in React Native
 * - Handling text input in React Native
 * - Using TypeScript for props typing
 * - Implementing accessible form components
 * - Working with React Native's TextInput component
 */

import React, { useState } from 'react';
import { 
  TextInput, 
  View, 
  StyleSheet, 
  StyleProp, 
  ViewStyle,
  TextStyle,
  NativeSyntheticEvent,
  TextInputFocusEventData
} from 'react-native';

interface InputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  placeholderTextColor?: string;
  secureTextEntry?: boolean;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outline';
  disabled?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  multiline?: boolean;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  placeholderTextColor = '#6B7280',
  secureTextEntry = false,
  style,
  inputStyle,
  leftIcon,
  rightIcon,
  variant = 'default',
  disabled = false,
  autoCapitalize = 'none',
  keyboardType = 'default',
  onFocus,
  onBlur,
  multiline = false
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Get container style based on variant
  const getContainerStyle = () => {
    switch (variant) {
      case 'filled':
        return styles.filledContainer;
      case 'outline':
        return styles.outlineContainer;
      case 'default':
      default:
        return styles.defaultContainer;
    }
  };

  // Handle focus event
  const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(true);
    if (onFocus) {
      onFocus(e);
    }
  };

  // Handle blur event
  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(false);
    if (onBlur) {
      onBlur(e);
    }
  };

  // Calculate input style based on icons
  const getInputPaddingStyle = (): StyleProp<TextStyle> => {
    const paddingStyle: TextStyle = {};
    
    if (leftIcon) {
      paddingStyle.paddingLeft = 8;
    }
    
    if (rightIcon) {
      paddingStyle.paddingRight = 8;
    }
    
    return paddingStyle;
  };

  return (
    <View 
      style={[
        styles.container,
        getContainerStyle(),
        isFocused && styles.focusedContainer,
        disabled && styles.disabledContainer,
        style
      ]}
    >
      {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
      
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        secureTextEntry={secureTextEntry}
        style={[
          styles.input,
          getInputPaddingStyle(),
          inputStyle
        ]}
        editable={!disabled}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        onFocus={handleFocus}
        onBlur={handleBlur}
        multiline={multiline}
      />
      
      {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
  },
  defaultContainer: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#4B5563',
  },
  filledContainer: {
    backgroundColor: '#374151',
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  focusedContainer: {
    borderColor: '#0A7EA4',
  },
  disabledContainer: {
    opacity: 0.5,
  },
  input: {
    flex: 1,
    color: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  leftIconContainer: {
    paddingLeft: 16,
  },
  rightIconContainer: {
    paddingRight: 16,
  },
});
