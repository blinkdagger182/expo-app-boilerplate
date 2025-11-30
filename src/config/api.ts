/**
 * API Configuration
 * 
 * Connected to Cloudflare Worker backend
 */

export const API_CONFIG = {
  // Production endpoint
  endpoint: 'https://document-ai-backend.azhanrizhan.workers.dev',
  
  // Local development endpoint (uncomment to use)
  // endpoint: 'http://localhost:8787',
  
  // API routes
  routes: {
    process: '/process',
    result: '/result',
    health: '/health',
  },
  
  // Timeout settings
  timeout: 60000, // 60 seconds for OCR processing
};

// Helper to get full API URL
export const getApiUrl = (route: keyof typeof API_CONFIG.routes): string => {
  return `${API_CONFIG.endpoint}${API_CONFIG.routes[route]}`;
};
