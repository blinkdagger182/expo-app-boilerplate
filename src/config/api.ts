/**
 * API Configuration
 * Connected to GCP Cloud Run PaddleOCR service
 */

const GCP_OCR_URL = process.env.EXPO_PUBLIC_GCP_OCR_URL || 'https://paddleocr-ui-builder-824241800977.us-central1.run.app';

export const API_CONFIG = {
  endpoint: GCP_OCR_URL,
  routes: {
    process: '/ui/generate',
    ocrProcess: '/ocr/process',
    result: '/result',
    health: '/health',
  },
  timeout: 60000,
};

// Helper to get full API URL
export const getApiUrl = (route: keyof typeof API_CONFIG.routes): string => {
  return `${API_CONFIG.endpoint}${API_CONFIG.routes[route]}`;
};
