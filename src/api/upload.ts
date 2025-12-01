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
    components: any[];
    fieldMap: Record<string, any>;
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
        compress: 1, // No compression for clarity
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
      // Send PDF as-is - backend handles PDF processing
      processedUri = fileUri;
      processedType = 'application/pdf';
      processedName = fileName || `document_${Date.now()}.pdf`;
      console.log('Sending PDF directly to backend');
    } else {
      // Optimize image and ensure it's JPEG
      processedUri = await optimizeImage(fileUri);
      processedType = 'image/jpeg'; // Always JPEG after optimization
      processedName = fileName ? fileName.replace(/\.(png|jpg|jpeg)$/i, '.jpg') : `image_${Date.now()}.jpg`;
    }

    const uploadUrl = `${apiEndpoint}/ui/generate`;
    console.log('Uploading to:', uploadUrl);
    console.log('File:', processedName, 'Type:', processedType);

    const formData = new FormData();
    formData.append('file', {
      uri: processedUri,
      type: processedType,
      name: processedName,
    } as any);

    const xhr = new XMLHttpRequest();

    return new Promise((resolve) => {
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
        console.log('Response status:', xhr.status);
        console.log('Response text:', xhr.responseText);

        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            
            if (data.success) {
              resolve({
                success: true,
                data: {
                  documentId: `doc_${Date.now()}`,
                  components: data.components || [],
                  fieldMap: data.fieldMap || {},
                  metadata: data.metadata || {},
                },
              });
            } else {
              resolve({
                success: false,
                message: data.error || 'Processing failed',
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
            const errorData = JSON.parse(xhr.responseText);
            resolve({
              success: false,
              message: errorData.detail || errorData.error || `Upload failed with status ${xhr.status}`,
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
        console.error('XHR Network error');
        resolve({
          success: false,
          message: 'Network error - check connection',
        });
      });

      xhr.addEventListener('timeout', () => {
        resolve({
          success: false,
          message: 'Request timed out',
        });
      });

      xhr.open('POST', uploadUrl);
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
