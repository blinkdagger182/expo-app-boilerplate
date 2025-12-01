# GCP PaddleOCR Integration

## Overview

Document processing uses GCP Cloud Run PaddleOCR service for OCR and UI component detection.

## Configuration

**Endpoint**: Set in `.env`
```
EXPO_PUBLIC_GCP_OCR_URL=https://paddleocr-ui-builder-824241800977.us-central1.run.app
```

**API Config**: `src/config/api.ts`
```typescript
endpoint: process.env.EXPO_PUBLIC_GCP_OCR_URL
```

## Flow

1. User uploads image via `HomeScreen`
2. Image sent to `/ui/generate` endpoint
3. PaddleOCR detects UI components
4. Components converted to UISchema format
5. Dynamic form rendered

## Component Mapping

| PaddleOCR Type | UISchema Type |
|----------------|---------------|
| heading        | title         |
| input          | input         |
| button         | button        |
| text           | paragraph     |
| checkbox       | input         |
| link           | paragraph     |

## Files

- `src/config/api.ts` - API configuration
- `src/api/upload.ts` - Upload handler
- `src/api/processDocument.ts` - Component converter
- `src/screens/HomeScreen.tsx` - Upload UI

## Testing

```bash
# Health check
curl https://paddleocr-ui-builder-824241800977.us-central1.run.app/health

# Test upload
curl -X POST \
  https://paddleocr-ui-builder-824241800977.us-central1.run.app/ui/generate \
  -F "file=@image.jpg"
```

## Restart After Changes

```bash
npm start -- --clear
```
