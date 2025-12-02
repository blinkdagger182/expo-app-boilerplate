import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { uploadDocument, UploadProgress } from '../api/upload';
import { AnimatedGradientBackground } from '../components/AnimatedGradientBackground';

const API_ENDPOINT = 'https://your-api-endpoint.com'; // Replace with actual endpoint

export const DocumentScreen: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const router = useRouter();

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedFile(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      Alert.alert('No File', 'Please select a file first');
      return;
    }

    setUploading(true);
    setProgress(0);

    const result = await uploadDocument(
      selectedFile.uri,
      selectedFile.name,
      API_ENDPOINT,
      (progressData: UploadProgress) => {
        setProgress(progressData.percentage);
      }
    );

    setUploading(false);

    if (result.success) {
      Alert.alert('Success', 'Document uploaded successfully');
      // Navigate to result screen with document data
      router.push({
        pathname: '/result',
        params: { documentId: result.data?.id },
      });
    } else {
      Alert.alert('Error', result.message || 'Upload failed');
    }
  };

  return (
    <View style={styles.container}>
      <AnimatedGradientBackground />

      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="document-text" size={64} color="#8B5CF6" />
          <Text style={styles.title}>documentAI</Text>
          <Text style={styles.subtitle}>Upload & Process Documents</Text>
        </View>

        <View style={styles.uploadBox}>
          {selectedFile ? (
            <View style={styles.fileInfo}>
              <Ionicons name="document" size={48} color="#8B5CF6" />
              <Text style={styles.fileName}>{selectedFile.name}</Text>
              <Text style={styles.fileSize}>
                {selectedFile.size ? (selectedFile.size / 1024).toFixed(2) : '0'} KB
              </Text>
            </View>
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={64} color="#8B5CF6" />
              <Text style={styles.uploadText}>Tap to select a document</Text>
              <Text style={styles.uploadSubtext}>PDF or Image files</Text>
            </>
          )}

          <TouchableOpacity
            style={styles.selectButton}
            onPress={handlePickDocument}
            disabled={uploading}
          >
            <Ionicons name="folder-open-outline" size={20} color="#FFFFFF" />
            <Text style={styles.selectButtonText}>
              {selectedFile ? 'Change File' : 'Select File'}
            </Text>
          </TouchableOpacity>
        </View>

        {selectedFile && (
          <TouchableOpacity
            style={[styles.uploadButton, uploading && styles.uploadButtonDisabled]}
            onPress={handleUpload}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.uploadButtonText}>{progress}%</Text>
              </>
            ) : (
              <>
                <Ionicons name="cloud-upload" size={20} color="#FFFFFF" />
                <Text style={styles.uploadButtonText}>Upload & Process</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {uploading && (
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
  },
  uploadBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8B5CF6',
    borderStyle: 'dashed',
  },
  uploadText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
  },
  uploadSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  fileInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 12,
    textAlign: 'center',
  },
  fileSize: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  selectButton: {
    flexDirection: 'row',
    backgroundColor: '#6B7280',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 8,
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginTop: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
  },
});
