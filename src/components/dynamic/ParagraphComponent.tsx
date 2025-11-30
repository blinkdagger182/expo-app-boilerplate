import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface ParagraphComponentProps {
  text: string;
}

export const ParagraphComponent: React.FC<ParagraphComponentProps> = ({ text }) => {
  return <Text style={styles.paragraph}>{text}</Text>;
};

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 12,
    lineHeight: 24,
  },
});
