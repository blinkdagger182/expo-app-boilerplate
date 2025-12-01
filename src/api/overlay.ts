import * as FileSystem from 'expo-file-system';

export interface OverlayResult {
  success: boolean;
  pdfUri?: string;
  message?: string;
}

/**
 * Send filled form data to backend for PDF overlay
 * Returns the final PDF with filled values
 */
export const overlayPDF = async (
  originalFileUri: string,
  originalFileName: string,
  documentId: string,
  formValues: Record<string, any>,
  fieldMap: Record<string, any>,
  apiEndpoint: string
): Promise<OverlayResult> => {
  try {
    const overlayUrl = `${apiEndpoint}/overlay`;
    console.log('Overlaying PDF:', documentId);
    console.log('Form values:', formValues);

    // Create FormData with original file and filled data
    const formData = new FormData();
    
    // Add original PDF/image file
    formData.append('file', {
      uri: originalFileUri,
      type: originalFileName.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
      name: originalFileName,
    } as any);

    // Add filled data as JSON string
    const filledData = {
      documentId: documentId,
      values: formValues,
      fieldMap: fieldMap,
    };
    formData.append('filled_data', JSON.stringify(filledData));

    const response = await fetch(overlayUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData: any = {};
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      return {
        success: false,
        message: errorData.detail || errorData.error || `Overlay failed with status ${response.status}`,
      };
    }

    // Get PDF as blob
    const blob = await response.blob();
    
    // Save to local file system
    const fileName = `filled_${originalFileName.replace(/\.[^.]+$/, '')}_${Date.now()}.pdf`;
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;
    
    // Convert blob to base64
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve, reject) => {
      reader.onloadend = () => {
        const base64 = reader.result as string;
        // Remove data URL prefix
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    const base64Data = await base64Promise;
    
    // Write to file system
    await FileSystem.writeAsStringAsync(fileUri, base64Data, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log('PDF saved to:', fileUri);

    return {
      success: true,
      pdfUri: fileUri,
    };
  } catch (error) {
    console.error('Overlay error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Share or open the filled PDF
 */
export const sharePDF = async (pdfUri: string): Promise<boolean> => {
  try {
    const { getContentUriAsync } = FileSystem;
    const contentUri = await getContentUriAsync(pdfUri);
    
    // Use expo-sharing if available
    try {
      const Sharing = require('expo-sharing');
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(contentUri);
        return true;
      }
    } catch (error) {
      console.log('Sharing not available');
    }

    return false;
  } catch (error) {
    console.error('Share error:', error);
    return false;
  }
};
