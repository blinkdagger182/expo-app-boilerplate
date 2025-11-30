# File Upload Service

## Overview
This service handles file uploads (PDFs, images, documents) to your API endpoint.

## Setup

### 1. Configure Your API Endpoint

Open `src/services/fileUpload.ts` and update the API endpoint:

```typescript
private API_ENDPOINT = 'https://your-api.com/upload';
```

Or set it dynamically:

```typescript
import { fileUploadService } from '@/src/services/fileUpload';

fileUploadService.setApiEndpoint('https://your-api.com/upload');
```

### 2. Add Authentication (if needed)

In `fileUpload.ts`, update the headers section:

```typescript
headers: {
  'Content-Type': 'multipart/form-data',
  'Authorization': `Bearer ${yourAuthToken}`,
  // Add any other headers your API requires
},
```

## Usage

### Basic Upload

```typescript
import { fileUploadService } from '@/src/services/fileUpload';

const result = await fileUploadService.uploadFile(
  fileUri,           // Local file URI
  'document.pdf',    // File name
  {                  // Optional additional data
    userId: '123',
    category: 'documents'
  }
);

if (result.success) {
  console.log('File uploaded:', result.fileUrl);
} else {
  console.error('Upload failed:', result.message);
}
```

### Multiple Files Upload

```typescript
const files = [
  { uri: 'file://path1.pdf', name: 'doc1.pdf' },
  { uri: 'file://path2.jpg', name: 'image1.jpg' }
];

const results = await fileUploadService.uploadMultipleFiles(files, {
  userId: '123'
});

results.forEach((result, index) => {
  if (result.success) {
    console.log(`File ${index + 1} uploaded:`, result.fileUrl);
  }
});
```

## API Response Format

Your API should return a JSON response:

```json
{
  "success": true,
  "fileUrl": "https://your-cdn.com/files/abc123.pdf",
  "message": "File uploaded successfully",
  "data": {
    "fileId": "abc123",
    "size": 1024000,
    "mimeType": "application/pdf"
  }
}
```

## Supported File Types

- **Documents**: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT
- **Images**: JPG, JPEG, PNG, GIF, WEBP, SVG
- **Videos**: MP4, MOV, AVI
- **Audio**: MP3, WAV
- **Archives**: ZIP, RAR

## Error Handling

```typescript
try {
  const result = await fileUploadService.uploadFile(uri, name);
  
  if (!result.success) {
    // Handle upload failure
    Alert.alert('Error', result.message);
  }
} catch (error) {
  // Handle network or other errors
  console.error('Upload error:', error);
}
```

## Integration in HomeScreen

The upload functionality is already integrated in `HomeScreen.tsx`:

1. User taps "Choose File" button
2. File picker opens
3. User selects a file
4. File is uploaded via `fileUploadService`
5. Success/error message is shown

## Customization

### Change Allowed File Types

In `handleFileUpload` function:

```typescript
const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.All, // or .Images, .Videos
  allowsEditing: false,
  quality: 1,
});
```

### Add Progress Tracking

Modify the service to track upload progress:

```typescript
const xhr = new XMLHttpRequest();
xhr.upload.addEventListener('progress', (event) => {
  const progress = (event.loaded / event.total) * 100;
  console.log(`Upload progress: ${progress}%`);
});
```

## Testing

Before deploying, test with a mock endpoint:

```typescript
// In fileUpload.ts
private API_ENDPOINT = 'https://httpbin.org/post'; // Test endpoint
```

This will echo back your request for testing purposes.
