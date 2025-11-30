/**
 * File Upload Service
 * 
 * Service for uploading files (PDFs, images, documents) to your API
 * Replace the API_ENDPOINT with your actual endpoint
 */

interface UploadResponse {
  success: boolean;
  fileUrl?: string;
  message?: string;
  data?: any;
}

class FileUploadService {
  // TODO: Replace with your actual API endpoint
  private API_ENDPOINT = 'https://your-api.com/upload';
  
  /**
   * Upload a file to the server
   * @param fileUri - Local file URI from the device
   * @param fileName - Name of the file
   * @param additionalData - Any additional data to send with the upload
   * @returns Upload response
   */
  async uploadFile(
    fileUri: string,
    fileName: string,
    additionalData?: Record<string, any>
  ): Promise<UploadResponse> {
    try {
      // Create form data
      const formData = new FormData();
      
      // Get file extension and mime type
      const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
      const mimeType = this.getMimeType(fileExtension);
      
      // Append file to form data
      formData.append('file', {
        uri: fileUri,
        name: fileName,
        type: mimeType,
      } as any);
      
      // Append additional data if provided
      if (additionalData) {
        Object.keys(additionalData).forEach(key => {
          formData.append(key, additionalData[key]);
        });
      }
      
      // Make the upload request
      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          // Add any authentication headers here
          // 'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Upload failed');
      }
      
      return {
        success: true,
        fileUrl: result.fileUrl || result.url,
        data: result,
      };
    } catch (error) {
      console.error('File upload error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }
  
  /**
   * Upload multiple files
   * @param files - Array of file objects with uri and name
   * @returns Array of upload responses
   */
  async uploadMultipleFiles(
    files: Array<{ uri: string; name: string }>,
    additionalData?: Record<string, any>
  ): Promise<UploadResponse[]> {
    const uploadPromises = files.map(file =>
      this.uploadFile(file.uri, file.name, additionalData)
    );
    
    return Promise.all(uploadPromises);
  }
  
  /**
   * Get MIME type based on file extension
   * @param extension - File extension
   * @returns MIME type string
   */
  private getMimeType(extension: string): string {
    const mimeTypes: Record<string, string> = {
      // Documents
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ppt: 'application/vnd.ms-powerpoint',
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      txt: 'text/plain',
      
      // Images
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      svg: 'image/svg+xml',
      
      // Videos
      mp4: 'video/mp4',
      mov: 'video/quicktime',
      avi: 'video/x-msvideo',
      
      // Audio
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      
      // Archives
      zip: 'application/zip',
      rar: 'application/x-rar-compressed',
    };
    
    return mimeTypes[extension] || 'application/octet-stream';
  }
  
  /**
   * Set custom API endpoint
   * @param endpoint - Your API endpoint URL
   */
  setApiEndpoint(endpoint: string) {
    this.API_ENDPOINT = endpoint;
  }
}

// Export singleton instance
export const fileUploadService = new FileUploadService();

// Export types
export type { UploadResponse };
