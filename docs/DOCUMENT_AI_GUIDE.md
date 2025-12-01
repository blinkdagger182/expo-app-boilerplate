# Document AI - Complete Implementation Guide

## Overview

This Document AI app allows users to upload PDFs or images, extract form fields using AI-powered OCR, fill in the forms dynamically, and generate filled PDFs with overlayed values.

## Features

### 1. **Upload Flow**
- Pick PDF documents using `expo-document-picker`
- Pick images using `expo-image-picker`
- Upload to backend `/ui/generate` endpoint
- Receive UI schema with field definitions and bounding boxes

### 2. **Dynamic Form Renderer**
The app renders forms dynamically based on the backend schema:

**Supported Field Types:**
- **Text Input** - Single-line text fields
- **Multiline Input** - Text areas for longer content
- **Number Input** - Numeric fields
- **Email Input** - Email validation
- **Date Input** - Date selection
- **Dropdown** - Select from options (auto-detected from 3+ checkboxes)
- **Checkbox** - Boolean fields
- **Table** - Editable grid data
- **Title** - Section headers
- **Paragraph** - Static text content
- **Button** - Action triggers

### 3. **State Management**
Form data is stored in a key-value structure:
```typescript
const [formData, setFormData] = useState<Record<number, string>>({});
```

Each field index maps to its value, enabling easy updates and autosave.

### 4. **Autosave**
- Form data is automatically saved to local storage every 5 seconds
- Uses AsyncStorage for persistence
- Restored when reopening the same document
- Includes document metadata (name, timestamp)

### 5. **Submission Flow**
1. User fills in form fields
2. Clicks "Submit & Generate PDF"
3. App sends filled values to `/overlay` endpoint
4. Backend overlays values onto original PDF
5. PDF binary is returned and saved locally
6. User can view or share the filled PDF

## Architecture

### Components

#### **HomeScreen** (`src/screens/HomeScreen.tsx`)
Main screen handling:
- Document/image selection
- Upload progress tracking
- Form display and submission
- PDF generation and saving

#### **DynamicRenderer** (`src/components/DynamicRenderer.tsx`)
Renders form fields based on schema:
```typescript
interface UISchema {
  type: 'title' | 'paragraph' | 'table' | 'input' | 'button' | 'dropdown' | 'checkbox';
  text?: string;
  label?: string;
  value?: string;
  columns?: string[];
  rows?: any[][];
  action?: string;
  options?: string[];
  inputType?: 'text' | 'number' | 'email' | 'date';
  multiline?: boolean;
  checked?: boolean;
}
```

#### **Dynamic Components**
- `InputComponent` - Enhanced text inputs with icons and focus states
- `DropdownComponent` - Modal-based select with search
- `CheckboxComponent` - Styled checkbox with label
- `TableComponent` - Editable grid with cell editing
- `TitleComponent` - Section headers
- `ParagraphComponent` - Static text
- `ButtonComponent` - Action buttons

### API Integration

#### **Upload API** (`src/api/upload.ts`)
```typescript
uploadAndProcessDocument(
  fileUri: string,
  fileName: string,
  mimeType: string,
  apiEndpoint: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult>
```

Features:
- Image optimization (resize to 2048px width)
- PDF to image conversion (placeholder)
- Progress tracking
- Error handling

#### **Overlay API** (`src/api/overlay.ts`)
```typescript
overlayPDF(
  pdfId: string,
  filledValues: Record<string, any>,
  apiEndpoint: string
): Promise<OverlayResult>
```

Features:
- Sends filled form data to backend
- Receives PDF binary
- Saves to local file system
- Returns file URI for viewing/sharing

### Storage Utilities (`src/utils/storage.ts`)

**Functions:**
- `saveFormData()` - Save form progress
- `loadFormData()` - Restore saved form
- `deleteFormData()` - Clear saved data
- `getAllSavedForms()` - List all saved forms
- `saveDocumentMetadata()` - Store document info
- `loadDocumentMetadata()` - Retrieve document info

## Backend Integration

### Expected Endpoints

#### **POST /ui/generate**
Upload document and receive UI schema.

**Request:**
```
Content-Type: multipart/form-data
file: <image/pdf binary>
```

**Response:**
```json
{
  "success": true,
  "components": [
    {
      "type": "heading",
      "text": "Application Form"
    },
    {
      "type": "input",
      "label": "Full Name",
      "placeholder": "Enter your name"
    },
    {
      "type": "button",
      "text": "Submit",
      "action": "submit"
    }
  ],
  "metadata": {
    "pages": 1,
    "confidence": 0.95
  }
}
```

#### **POST /overlay**
Generate filled PDF with overlayed values.

**Request:**
```json
{
  "pdf_id": "doc_1234567890",
  "filled_values": {
    "0": "John Doe",
    "1": "john@example.com",
    "2": "555-1234"
  }
}
```

**Response:**
```
Content-Type: application/pdf
<PDF binary data>
```

## UI/UX Design

### Notion-Style Clean Look
- **Colors:**
  - Primary: `#8B5CF6` (Purple)
  - Success: `#10B981` (Green)
  - Text: `#1F2937` (Dark Gray)
  - Background: Gradient with transparency
  
- **Typography:**
  - Headers: Bold, 18-36px
  - Body: Regular, 14-16px
  - Labels: Semi-bold, 14px

- **Spacing:**
  - Component margin: 20px
  - Padding: 14-16px
  - Border radius: 10-12px

- **Shadows:**
  - Elevation: 4-8
  - Opacity: 0.1-0.3
  - Color: Component-specific

### Screens

1. **Upload Screen**
   - App icon and title
   - Upload box with dashed border
   - Document/Image picker buttons
   - Features list

2. **Form Screen**
   - Back button
   - Dynamic form fields
   - Submit button
   - Save progress button
   - Loading overlay during submission

3. **Success Screen**
   - Confirmation message
   - View PDF button
   - Share button
   - Upload another button

## Advanced Features

### Dropdown Auto-Detection
If 3+ checkboxes are detected in the same vertical region, they're automatically converted to a dropdown for better UX.

### Offline Support
- Forms are saved locally
- Can be filled offline
- Submitted when connection is restored

### Debug Mode
Add a debug view to show:
- Bounding boxes overlayed on page preview
- Field detection confidence scores
- OCR raw text output

## Installation & Setup

### Dependencies
All required dependencies are already in `package.json`:
- `expo-document-picker` - PDF/document selection
- `expo-image-picker` - Image selection
- `expo-file-system` - Local file storage
- `expo-image-manipulator` - Image optimization
- `@react-native-async-storage/async-storage` - Local storage

### Configuration

Update `src/config/api.ts` with your backend URL:
```typescript
const GCP_OCR_URL = 'https://your-backend-url.com';
```

### Running the App

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Testing

### Manual Testing Checklist
- [ ] Upload PDF document
- [ ] Upload image document
- [ ] Fill in all field types
- [ ] Test autosave (close and reopen)
- [ ] Submit form
- [ ] View generated PDF
- [ ] Share PDF
- [ ] Test offline mode
- [ ] Test error handling

### Test Documents
Use various document types:
- Simple forms (1-2 pages)
- Complex forms (5+ pages)
- Scanned documents
- Low-quality images
- Multi-column layouts

## Troubleshooting

### Common Issues

**Upload fails:**
- Check network connection
- Verify backend URL in config
- Check file size limits
- Ensure proper MIME type

**Form not rendering:**
- Check backend response format
- Verify schema conversion logic
- Check console for errors

**PDF not saving:**
- Check file system permissions
- Verify storage space
- Check PDF binary format

**Autosave not working:**
- Check AsyncStorage permissions
- Verify document ID is set
- Check storage quota

## Future Enhancements

1. **Multi-page PDF Support**
   - Page navigation
   - Per-page form fields
   - Page thumbnails

2. **Advanced Field Types**
   - Signature capture
   - Photo upload
   - File attachments
   - Rich text editor

3. **Collaboration**
   - Share forms with others
   - Real-time co-editing
   - Comments and annotations

4. **Templates**
   - Save form templates
   - Reuse common forms
   - Template marketplace

5. **Analytics**
   - Form completion rates
   - Field-level analytics
   - Error tracking

## API Reference

See individual component files for detailed prop types and usage examples:
- `src/components/DynamicRenderer.tsx`
- `src/components/dynamic/*.tsx`
- `src/api/*.ts`
- `src/utils/storage.ts`

## Support

For issues or questions:
1. Check console logs for errors
2. Verify backend connectivity
3. Review this documentation
4. Check component diagnostics
