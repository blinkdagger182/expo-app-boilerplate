# 📱 Backend Integration Guide

## Overview
This guide explains how the React Native app integrates with the GCP FastAPI backend.

---

## 🔗 API Configuration

### Update Backend URL
Edit `src/config/api.ts`:

```typescript
const GCP_OCR_URL = 'https://your-backend-url.run.app';

export const API_CONFIG = {
  endpoint: GCP_OCR_URL,
  routes: {
    process: '/ui/generate',  // Main upload endpoint
    ocrProcess: '/ocr/process',
    result: '/result',
    health: '/health',
  },
  timeout: 60000,
};
```

---

## 📤 Upload Flow

### 1. User Selects Document
```typescript
// HomeScreen.tsx
const handlePickDocument = async () => {
  const result = await DocumentPicker.getDocumentAsync({
    type: ['application/pdf', 'image/*'],
  });
  
  if (!result.canceled) {
    setSelectedFile(result.assets[0]);
  }
};
```

### 2. Upload to Backend
```typescript
// Calls: POST /ui/generate
const result = await uploadAndProcessDocument(
  selectedFile.uri,
  selectedFile.name,
  selectedFile.mimeType,
  API_CONFIG.endpoint,
  (progress) => setProgress(progress.percentage)
);
```

### 3. Backend Response
```json
{
  "success": true,
  "components": [
    {
      "id": "field_001_001",
      "type": "input",
      "label": "Name",
      "value": "",
      "bbox": [100, 100, 200, 100, 200, 120, 100, 120],
      "page": 1
    },
    {
      "id": "field_001_002",
      "type": "checkbox",
      "label": "Agree to terms",
      "value": false,
      "bbox": [100, 150, 120, 150, 120, 170, 100, 170],
      "page": 1
    }
  ],
  "fieldMap": {
    "field_001_001": {
      "bbox": [100, 100, 200, 100, 200, 120, 100, 120],
      "page": 1,
      "type": "text_field"
    },
    "field_001_002": {
      "bbox": [100, 150, 120, 150, 120, 170, 100, 170],
      "page": 1,
      "type": "checkbox"
    }
  },
  "metadata": {
    "pages": [{ "page": 1, "width": 595, "height": 842 }],
    "total_pages": 1,
    "total_fields": 2
  }
}
```

### 4. Store in State
```typescript
setComponents(result.data.components);
setFieldMap(result.data.fieldMap);

// Initialize form data
const initialFormData = {};
result.data.components.forEach(comp => {
  initialFormData[comp.id] = comp.value;
});
setFormData(initialFormData);
```

---

## 📝 Form Rendering

### DynamicRenderer Component
```typescript
<DynamicRenderer
  components={components}
  formData={formData}
  onInputChange={(fieldId, value) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  }}
  onButtonPress={handleSubmit}
/>
```

### Component Types Supported
- ✅ `input` - Text input fields
- ✅ `checkbox` - Boolean checkboxes
- ✅ `dropdown` - Select dropdowns
- ✅ `button` - Action buttons
- ✅ `paragraph` - Text content
- ✅ `title` - Section headers

### Form State Structure
```typescript
// Field ID → Value mapping
formData = {
  "field_001_001": "John Doe",
  "field_001_002": true,
  "field_001_003": "john@example.com"
}
```

---

## 📤 Submit & Overlay

### 1. User Submits Form
```typescript
const handleSubmitForm = async () => {
  const result = await overlayPDF(
    selectedFile.uri,        // Original file
    selectedFile.name,       // File name
    documentId,              // Document ID
    formData,                // Form values
    fieldMap,                // Field map with bbox
    API_CONFIG.endpoint      // Backend URL
  );
  
  if (result.success) {
    // PDF saved to result.pdfUri
    handleViewPDF(result.pdfUri);
  }
};
```

### 2. Overlay API Call
```typescript
// Calls: POST /overlay
const formData = new FormData();

// Add original file
formData.append('file', {
  uri: originalFileUri,
  type: 'application/pdf',
  name: originalFileName,
});

// Add filled data
formData.append('filled_data', JSON.stringify({
  documentId: documentId,
  values: formValues,
  fieldMap: fieldMap,
}));

const response = await fetch(`${apiEndpoint}/overlay`, {
  method: 'POST',
  body: formData,
});
```

### 3. Backend Processes
- Receives original file + filled data
- Looks up bbox from fieldMap for each field
- Draws text or checkmarks on PDF
- Returns filled PDF

### 4. Save PDF Locally
```typescript
// Convert blob to base64
const base64Data = await blobToBase64(blob);

// Save to device
const fileUri = `${FileSystem.documentDirectory}filled_${Date.now()}.pdf`;
await FileSystem.writeAsStringAsync(fileUri, base64Data, {
  encoding: FileSystem.EncodingType.Base64,
});
```

---

## 💾 Auto-Save Feature

### Saves Form Progress Every 5 Seconds
```typescript
useEffect(() => {
  if (documentId && Object.keys(formData).length > 0) {
    const timer = setTimeout(() => {
      saveFormData(documentId, formData, selectedFile?.name);
    }, 5000);
    
    return () => clearTimeout(timer);
  }
}, [formData, documentId]);
```

### Load Saved Data
```typescript
const savedData = await loadFormData(documentId);
if (savedData) {
  setFormData(savedData.formData);
  Alert.alert('Restored', 'Previously saved form data restored');
}
```

---

## 🔍 Debugging

### Enable Logging
```typescript
// In upload.ts
console.log('Uploading to:', uploadUrl);
console.log('File:', processedName, 'Type:', processedType);
console.log('Response:', xhr.responseText);

// In HomeScreen.tsx
console.log('Components:', components);
console.log('Form data:', formData);
console.log('Field map:', fieldMap);
```

### Common Issues

#### 1. Upload Fails
- Check `API_CONFIG.endpoint` is correct
- Verify backend is running: `curl http://backend/health`
- Check file size (max 32MB on Cloud Run)

#### 2. Components Not Rendering
- Verify `components` array is not empty
- Check component types are supported
- Inspect `test_response.json` from backend

#### 3. Overlay Fails
- Ensure `fieldMap` is passed correctly
- Verify original file URI is still valid
- Check bbox coordinates are valid

#### 4. PDF Not Saving
- Check file system permissions
- Verify `FileSystem.documentDirectory` exists
- Check blob to base64 conversion

---

## 🧪 Testing

### Test Upload
```typescript
// 1. Select a test PDF
// 2. Click "Upload & Process"
// 3. Check console for response
// 4. Verify components render
```

### Test Form Filling
```typescript
// 1. Fill in all fields
// 2. Check formData state updates
// 3. Verify auto-save works
// 4. Close and reopen app
// 5. Check data restored
```

### Test Overlay
```typescript
// 1. Fill form completely
// 2. Click "Submit & Generate PDF"
// 3. Check PDF is created
// 4. Verify fields are filled
// 5. Test View/Share buttons
```

---

## 📊 Data Flow Diagram

```
┌─────────────┐
│ User Selects│
│   Document  │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ POST /ui/generate   │
│ (Upload & OCR)      │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Backend Returns:    │
│ - components[]      │
│ - fieldMap          │
│ - metadata          │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Render Dynamic Form │
│ (DynamicRenderer)   │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ User Fills Form     │
│ (Auto-save enabled) │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ POST /overlay       │
│ (Original + Values) │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Backend Returns:    │
│ Filled PDF          │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Save to Device      │
│ View / Share        │
└─────────────────────┘
```

---

## 🚀 Deployment Checklist

- [ ] Update `API_CONFIG.endpoint` with production URL
- [ ] Test with real documents
- [ ] Verify error handling
- [ ] Test on iOS and Android
- [ ] Check file size limits
- [ ] Test offline behavior
- [ ] Verify auto-save works
- [ ] Test PDF viewing/sharing
- [ ] Check memory usage with large PDFs
- [ ] Test with various document types

---

## 📚 Related Files

### Frontend
- `src/config/api.ts` - API configuration
- `src/api/upload.ts` - Upload logic
- `src/api/overlay.ts` - Overlay logic
- `src/components/DynamicRenderer.tsx` - Form renderer
- `src/screens/HomeScreen.tsx` - Main screen
- `src/utils/storage.ts` - Auto-save logic

### Backend
- `main.py` - FastAPI endpoints
- `/ui/generate` - Upload & OCR
- `/overlay` - PDF overlay
- `/health` - Health check

---

## 💡 Tips

1. **Use Field IDs**: Always use field IDs, not indices
2. **Keep fieldMap**: Required for overlay to work
3. **Auto-save**: Saves user progress automatically
4. **Error Handling**: Always check `result.success`
5. **File Validation**: Check file type before upload
6. **Progress Tracking**: Show upload progress to user
7. **PDF Preview**: Consider adding PDF preview before submission

---

## 🆘 Support

If you encounter issues:
1. Check console logs
2. Verify backend is running
3. Test with `test_integration.sh`
4. Review `INTEGRATION_COMPLETE.md`
5. Check backend logs on Cloud Run
