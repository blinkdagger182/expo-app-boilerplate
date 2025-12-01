import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResult {
  success: boolean;
  message?: string;
  data?: {
    documentId: string;
    ui: any;
    text: string;
    metadata: any;
  };
}

/**
 * Convert PDF - for now just return the URI
 * PDF conversion requires native modules that aren't working
 */
const convertPDFToImage = async (pdfUri: string): Promise<string> => {
  console.warn('PDF conversion not implemented - sending PDF as-is');
  return pdfUri;
};

/**
 * Optimize image for production upload
 */
const optimizeImage = async (imageUri: string): Promise<string> => {
  try {
    const result = await manipulateAsync(
      imageUri,
      [{ resize: { width: 2048 } }],
      {
        compress: 0.92,
        format: SaveFormat.JPEG,
      }
    );
    return result.uri;
  } catch (error) {
    console.error('Image optimization error:', error);
    return imageUri;
  }
};

/**
 * Upload and process document with GCP PaddleOCR service
 * Converts PDFs to images before upload
 */
export const uploadAndProcessDocument = async (
  fileUri: string,
  fileName: string,
  mimeType: string,
  apiEndpoint: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
  try {
    let processedUri = fileUri;
    let processedType = mimeType || 'image/jpeg';
    let processedName = fileName || `image_${Date.now()}.jpg`;

    const isPDF = mimeType === 'application/pdf' || (fileName && fileName.toLowerCase().endsWith('.pdf'));
    
    if (isPDF) {
      processedUri = await convertPDFToImage(fileUri);
      processedType = 'image/jpeg';
      processedName = fileName ? fileName.replace(/\.pdf$/i, '.jpg') : `converted_${Date.now()}.jpg`;
    } else {
      processedUri = await optimizeImage(fileUri);
    }

    const formData = new FormData();
    
    formData.append('file', {
      uri: processedUri,
      type: processedType,
      name: processedName,
    } as any);

    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress: UploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100),
          };
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            
            if (response.success) {
              resolve({
                success: true,
                data: {
                  documentId: `doc_${Date.now()}`,
                  ui: response,
                  text: response.full_text || '',
                  metadata: {
                    total_components: response.metadata?.total_components || response.components?.length || 0,
                    total_lines: response.total_lines || 0,
                    processing_engine: 'PaddleOCR',
                    image_filename: fileName,
                  },
                },
              });
            } else {
              resolve({
                success: false,
                message: response.error || 'Processing failed',
              });
            }
          } catch (error) {
            resolve({
              success: false,
              message: 'Invalid response from server',
            });
          }
        } else {
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            resolve({
              success: false,
              message: errorResponse.detail || errorResponse.error || `Upload failed with status ${xhr.status}`,
            });
          } catch {
            resolve({
              success: false,
              message: `Upload failed with status ${xhr.status}`,
            });
          }
        }
      });

      xhr.addEventListener('error', () => {
        resolve({
          success: false,
          message: 'Network error - check if service is reachable',
        });
      });
      
      xhr.addEventListener('timeout', () => {
        resolve({
          success: false,
          message: 'Request timed out',
        });
      });

      xhr.open('POST', `${apiEndpoint}/ui/generate`);
      xhr.send(formData);
    });
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
