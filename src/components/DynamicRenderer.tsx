import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TitleComponent } from './dynamic/TitleComponent';
import { ParagraphComponent } from './dynamic/ParagraphComponent';
import { TableComponent } from './dynamic/TableComponent';
import { InputComponent } from './dynamic/InputComponent';
import { ButtonComponent } from './dynamic/ButtonComponent';

export interface UISchema {
  type: 'title' | 'paragraph' | 'table' | 'input' | 'button';
  text?: string;
  label?: string;
  value?: string;
  columns?: string[];
  rows?: any[][];
  action?: string;
}

interface DynamicRendererProps {
  schema: UISchema[];
  onInputChange?: (index: number, value: string) => void;
  onButtonPress?: (action: string) => void;
}

export const DynamicRenderer: React.FC<DynamicRendererProps> = ({
  schema,
  onInputChange,
  onButtonPress,
}) => {
  const renderComponent = (item: UISchema, index: number) => {
    switch (item.type) {
      case 'title':
        return <TitleComponent key={index} text={item.text || ''} />;
      case 'paragraph':
        return <ParagraphComponent key={index} text={item.text || ''} />;
      case 'table':
        return (
          <TableComponent
            key={index}
            columns={item.columns || []}
            rows={item.rows || []}
          />
        );
      case 'input':
        return (
          <InputComponent
            key={index}
            label={item.label || ''}
            value={item.value || ''}
            onChange={(value) => onInputChange?.(index, value)}
          />
        );
      case 'button':
        return (
          <ButtonComponent
            key={index}
            label={item.label || ''}
            onPress={() => onButtonPress?.(item.action || '')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {schema.map((item, index) => renderComponent(item, index))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
