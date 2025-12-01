import AsyncStorage from '@react-native-async-storage/async-storage';

const FORM_DATA_PREFIX = 'form_data_';
const DOCUMENT_METADATA_PREFIX = 'doc_meta_';

export interface SavedFormData {
  documentId: string;
  formData: Record<string, any>;
  timestamp: number;
  documentName?: string;
}

/**
 * Save form data locally for autosave
 */
export const saveFormData = async (
  documentId: string,
  formData: Record<string, any>,
  documentName?: string
): Promise<boolean> => {
  try {
    const key = `${FORM_DATA_PREFIX}${documentId}`;
    const data: SavedFormData = {
      documentId,
      formData,
      timestamp: Date.now(),
      documentName,
    };
    
    await AsyncStorage.setItem(key, JSON.stringify(data));
    console.log('Form data saved:', documentId);
    return true;
  } catch (error) {
    console.error('Error saving form data:', error);
    return false;
  }
};

/**
 * Load saved form data
 */
export const loadFormData = async (documentId: string): Promise<SavedFormData | null> => {
  try {
    const key = `${FORM_DATA_PREFIX}${documentId}`;
    const data = await AsyncStorage.getItem(key);
    
    if (data) {
      return JSON.parse(data);
    }
    
    return null;
  } catch (error) {
    console.error('Error loading form data:', error);
    return null;
  }
};

/**
 * Delete saved form data
 */
export const deleteFormData = async (documentId: string): Promise<boolean> => {
  try {
    const key = `${FORM_DATA_PREFIX}${documentId}`;
    await AsyncStorage.removeItem(key);
    console.log('Form data deleted:', documentId);
    return true;
  } catch (error) {
    console.error('Error deleting form data:', error);
    return false;
  }
};

/**
 * Get all saved forms
 */
export const getAllSavedForms = async (): Promise<SavedFormData[]> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const formKeys = keys.filter(key => key.startsWith(FORM_DATA_PREFIX));
    
    const forms: SavedFormData[] = [];
    
    for (const key of formKeys) {
      const data = await AsyncStorage.getItem(key);
      if (data) {
        forms.push(JSON.parse(data));
      }
    }
    
    // Sort by timestamp (newest first)
    forms.sort((a, b) => b.timestamp - a.timestamp);
    
    return forms;
  } catch (error) {
    console.error('Error getting saved forms:', error);
    return [];
  }
};

/**
 * Save document metadata
 */
export const saveDocumentMetadata = async (
  documentId: string,
  metadata: any
): Promise<boolean> => {
  try {
    const key = `${DOCUMENT_METADATA_PREFIX}${documentId}`;
    await AsyncStorage.setItem(key, JSON.stringify(metadata));
    return true;
  } catch (error) {
    console.error('Error saving document metadata:', error);
    return false;
  }
};

/**
 * Load document metadata
 */
export const loadDocumentMetadata = async (documentId: string): Promise<any | null> => {
  try {
    const key = `${DOCUMENT_METADATA_PREFIX}${documentId}`;
    const data = await AsyncStorage.getItem(key);
    
    if (data) {
      return JSON.parse(data);
    }
    
    return null;
  } catch (error) {
    console.error('Error loading document metadata:', error);
    return null;
  }
};
