import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface TitleComponentProps {
  text: string;
}

export const TitleComponent: React.FC<TitleComponentProps> = ({ text }) => {
  return <Text style={styles.title}>{text}</Text>;
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
});
