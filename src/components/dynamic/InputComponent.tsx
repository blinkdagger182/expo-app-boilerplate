import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface InputComponentProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const InputComponent: React.FC<InputComponentProps> = ({ label, value, onChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
});
