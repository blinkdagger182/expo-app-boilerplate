import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TitleComponent } from './dynamic/TitleComponent';
import { ParagraphComponent } from './dynamic/ParagraphComponent';
import { TableComponent } from './dynamic/TableComponent';
import { InputComponent } from './dynamic/InputComponent';
import { ButtonComponent } from './dynamic/ButtonComponent';
import { DropdownComponent } from './dynamic/DropdownComponent';
import { CheckboxComponent } from './dynamic/CheckboxComponent';

export interface UIComponent {
  id: string;
  type: 'input' | 'checkbox' | 'dropdown' | 'button' | 'paragraph' | 'title';
  label?: string;
  value?: any;
  options?: string[];
  bbox?: number[];
  page?: number;
}

interface DynamicRendererProps {
  components: UIComponent[];
  formData: Record<string, any>;
  onInputChange?: (fieldId: string, value: any) => void;
  onButtonPress?: (action: string) => void;
}

export const DynamicRenderer: React.FC<DynamicRendererProps> = ({
  components,
  formData,
  onInputChange,
  onButtonPress,
}) => {
  const renderComponent = (component: UIComponent) => {
    const fieldId = component.id;
    const currentValue = formData[fieldId] ?? component.value;

    switch (component.type) {
      case 'title':
        return <TitleComponent key={fieldId} text={component.label || ''} />;
      
      case 'paragraph':
        return <ParagraphComponent key={fieldId} text={component.label || ''} />;
      
      case 'input':
        return (
          <InputComponent
            key={fieldId}
            label={component.label || ''}
            value={currentValue || ''}
            onChange={(value) => onInputChange?.(fieldId, value)}
            type="text"
          />
        );
      
      case 'dropdown':
        return (
          <DropdownComponent
            key={fieldId}
            label={component.label || ''}
            value={currentValue || ''}
            options={component.options || []}
            onChange={(value) => onInputChange?.(fieldId, value)}
          />
        );
      
      case 'checkbox':
        return (
          <CheckboxComponent
            key={fieldId}
            label={component.label || ''}
            checked={currentValue === true || currentValue === 'true'}
            onChange={(checked) => onInputChange?.(fieldId, checked)}
          />
        );
      
      case 'button':
        return (
          <ButtonComponent
            key={fieldId}
            label={component.label || ''}
            onPress={() => onButtonPress?.('submit')}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {components.map((component) => renderComponent(component))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
