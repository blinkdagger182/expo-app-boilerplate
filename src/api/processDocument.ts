import { UISchema } from '../components/DynamicRenderer';

export interface ProcessDocumentResult {
  success: boolean;
  schema?: UISchema[];
  text?: string;
  metadata?: any;
  message?: string;
}

/**
 * Retrieve previously processed document result
 */
export const getDocumentResult = async (
  documentId: string,
  apiEndpoint: string
): Promise<ProcessDocumentResult> => {
  try {
    const response = await fetch(`${apiEndpoint}/result/${documentId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      return {
        success: false,
        message: `Failed to retrieve result: ${response.status}`,
      };
    }

    const data = await response.json();
    
    if (!data.success) {
      return {
        success: false,
        message: data.error || 'Result not found',
      };
    }

    // Convert backend UI schema to our component schema
    const schema = convertBackendUIToSchema(data.ui);
    
    return {
      success: true,
      schema,
      text: data.text,
      metadata: data.metadata,
    };
  } catch (error) {
    console.error('Get document result error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Convert backend UI component format to our UISchema format
 */
function convertBackendUIToSchema(backendUI: any): UISchema[] {
  if (!backendUI || !backendUI.components) {
    return [];
  }

  const schema: UISchema[] = [];

  function processComponent(component: any): UISchema | UISchema[] | null {
    switch (component.type) {
      case 'section':
        // Add section title as a title component
        const sectionComponents: UISchema[] = [];
        if (component.title) {
          sectionComponents.push({
            type: 'title',
            text: component.title,
          });
        }
        // Process nested components
        if (component.components) {
          component.components.forEach((child: any) => {
            const processed = processComponent(child);
            if (Array.isArray(processed)) {
              sectionComponents.push(...processed);
            } else if (processed) {
              sectionComponents.push(processed);
            }
          });
        }
        return sectionComponents;

      case 'input':
      case 'number':
      case 'email':
        return {
          type: 'input',
          label: component.label || '',
          value: component.value || '',
        };

      case 'date':
        return {
          type: 'input',
          label: component.label || '',
          value: component.value || '',
        };

      case 'select':
        return {
          type: 'input',
          label: component.label || '',
          value: component.value || '',
        };

      case 'checkbox':
        return {
          type: 'input',
          label: component.label || '',
          value: component.value || '',
        };

      case 'table':
        return {
          type: 'table',
          columns: component.columns || [],
          rows: component.rows || [],
        };

      case 'text':
        return {
          type: 'paragraph',
          text: component.content || '',
        };

      case 'button':
        return {
          type: 'button',
          label: component.label || 'Submit',
          action: component.action || 'submit',
        };

      default:
        return null;
    }
  }

  backendUI.components.forEach((component: any) => {
    const processed = processComponent(component);
    if (Array.isArray(processed)) {
      schema.push(...processed);
    } else if (processed) {
      schema.push(processed);
    }
  });

  return schema;
}
