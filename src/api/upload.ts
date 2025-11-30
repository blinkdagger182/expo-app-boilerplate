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
 * Upload and process document with Cloudflare Worker backend
 * Combines upload + OCR processing in single request
 */
export const uploadAndProcessDocument = async (
  fileUri: string,
  fileName: string,
  mimeType: string,
  apiEndpoint: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
  try {
    const formData = new FormData();
    
    // Determine file type from URI or mime type
    let fileType = mimeType;
    if (!fileType) {
      if (fileName.toLowerCase().endsWith('.pdf')) {
        fileType = 'application/pdf';
      } else if (fileName.toLowerCase().match(/\.(jpg|jpeg)$/)) {
        fileType = 'image/jpeg';
      } else if (fileName.toLowerCase().endsWith('.png')) {
        fileType = 'image/png';
      } else if (fileName.toLowerCase().endsWith('.heic')) {
        fileType = 'image/heic';
      }
    }
    
    formData.append('file', {
      uri: fileUri,
      type: fileType,
      name: fileName,
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
                  documentId: response.documentId,
                  ui: response.ui,
                  text: response.text,
                  metadata: response.metadata,
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
              message: errorResponse.error || `Upload failed with status ${xhr.status}`,
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
        reject({
          success: false,
          message: 'Network error occurred',
        });
      });

      xhr.open('POST', `${apiEndpoint}/process`);
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
