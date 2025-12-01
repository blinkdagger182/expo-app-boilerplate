import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputComponentProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'number' | 'email' | 'date';
  placeholder?: string;
  multiline?: boolean;
}

export const InputComponent: React.FC<InputComponentProps> = ({ 
  label, 
  value, 
  onChange,
  type = 'text',
  placeholder,
  multiline = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getKeyboardType = () => {
    switch (type) {
      case 'number':
        return 'numeric';
      case 'email':
        return 'email-address';
      default:
        return 'default';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'email':
        return 'mail-outline';
      case 'number':
        return 'calculator-outline';
      case 'date':
        return 'calendar-outline';
      default:
        return 'create-outline';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Ionicons name={getIcon()} size={16} color="#6B7280" />
        <Text style={styles.label}>{label}</Text>
      </View>
      <TextInput
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          multiline && styles.inputMultiline,
        ]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        placeholderTextColor="#9CA3AF"
        keyboardType={getKeyboardType()}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#1F2937',
  },
  inputFocused: {
    borderColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
});
