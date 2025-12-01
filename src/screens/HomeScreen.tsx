import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StatusBar,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../contexts/AuthContext';
import { uploadAndProcessDocument, UploadProgress } from '../api/upload';
import { getDocumentResult } from '../api/processDocument';
import { DynamicRenderer, UISchema } from '../components/DynamicRenderer';
import { API_CONFIG } from '../config/api';

const { height: screenHeight } = Dimensions.get('window');

interface HomePageProps {}

export const HomeScreen: React.FC<HomePageProps> = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [schema, setSchema] = useState<UISchema[]>([]);
  const [formData, setFormData] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedFile(result.assets[0]);
        setShowResults(false);
        setSchema([]);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedFile(result.assets[0]);
        setShowResults(false);
        setSchema([]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      Alert.alert('No File', 'Please select a file first');
      return;
    }

    setUploading(true);
    setProgress(0);

    const result = await uploadAndProcessDocument(
      selectedFile.uri,
      selectedFile.name,
      selectedFile.mimeType || selectedFile.type,
      API_CONFIG.endpoint,
      (progressData: UploadProgress) => {
        setProgress(progressData.percentage);
      }
    );

    setUploading(false);

    if (result.success && result.data) {
      // Convert backend UI schema to our format
      setProcessing(true);
      
      try {
        // Convert the UI components
        const convertedSchema = convertBackendUIToSchema(result.data.ui);
        setSchema(convertedSchema);
        setShowResults(true);
      } catch (error) {
        console.error('Schema conversion error:', error);
        Alert.alert('Error', 'Failed to process document schema');
      } finally {
        setProcessing(false);
      }
    } else {
      Alert.alert('Error', result.message || 'Upload and processing failed');
    }
  };

  // Convert backend UI schema to our component format
  const convertBackendUIToSchema = (backendUI: any): UISchema[] => {
    if (!backendUI || !backendUI.components) {
      return [];
    }

    const schema: UISchema[] = [];

    function processComponent(component: any): UISchema | UISchema[] | null {
      switch (component.type) {
        case 'section':
          const sectionComponents: UISchema[] = [];
          if (component.title) {
            sectionComponents.push({
              type: 'title',
              text: component.title,
            });
          }
          if (component.components) {
            component.components.forEach((child: any) => {
              const processed = processComponent(child);
              if (Array.isArray(processed)) {
                sectionComponents.push(...processed);
              } else if (processed) {
                sectionComponents.push(processed);
              }
            });
          }
          return sectionComponents;

        case 'input':
        case 'number':
        case 'email':
        case 'date':
        case 'select':
        case 'checkbox':
          return {
            type: 'input',
            label: component.label || '',
            value: component.value || component.placeholder || '',
          };

        case 'table':
          return {
            type: 'table',
            columns: component.columns || [],
            rows: component.rows || [],
          };

        case 'text':
          return {
            type: 'paragraph',
            text: component.content || '',
          };

        case 'button':
          return {
            type: 'button',
            label: component.label || 'Submit',
            action: component.action || 'submit',
          };

        default:
          return null;
      }
    }

    backendUI.components.forEach((component: any) => {
      const processed = processComponent(component);
      if (Array.isArray(processed)) {
        schema.push(...processed);
      } else if (processed) {
        schema.push(processed);
      }
    });

    return schema;
  };

  const handleInputChange = (index: number, value: string) => {
    setFormData((prev) => ({ ...prev, [index]: value }));
  };

  const handleButtonPress = (action: string) => {
    console.log('Button pressed:', action, formData);
    Alert.alert('Success', `Form submitted successfully!`, [
      { text: 'Upload Another', onPress: () => {
        setSelectedFile(null);
        setShowResults(false);
        setSchema([]);
        setFormData({});
      }},
    ]);
  };

  if (showResults) {
    return (
      <View style={styles.container}>
        <Image
          source={require('../../assets/images/gradient-background.gif')}
          style={styles.background}
          resizeMode="cover"
        />
        
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity onPress={() => setShowResults(false)} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Document Results</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.resultsContent}>
          <DynamicRenderer
            schema={schema}
            onInputChange={handleInputChange}
            onButtonPress={handleButtonPress}
          />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/gradient-background.gif')}
        style={styles.background}
        resizeMode="cover"
      />
      
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      <ScrollView 
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/icon.png')}
            style={styles.appIcon}
            resizeMode="contain"
          />
          <Text style={styles.title}>documentAI</Text>
          <Text style={styles.subtitle}>Upload & Process Documents with AI</Text>
        </View>

        <View style={styles.uploadBox}>
          {selectedFile ? (
            <View style={styles.fileInfo}>
              <Ionicons 
                name={selectedFile.mimeType?.includes('pdf') ? 'document' : 'image'} 
                size={64} 
                color="#8B5CF6" 
              />
              <Text style={styles.fileName} numberOfLines={2}>
                {selectedFile.name}
              </Text>
              <Text style={styles.fileSize}>
                {selectedFile.size ? (selectedFile.size / 1024).toFixed(2) : '0'} KB
              </Text>
              
              <View style={styles.fileActions}>
                <TouchableOpacity
                  style={styles.changeButton}
                  onPress={handlePickDocument}
                  disabled={uploading || processing}
                >
                  <Ionicons name="swap-horizontal" size={20} color="#6B7280" />
                  <Text style={styles.changeButtonText}>Change</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={80} color="#8B5CF6" />
              <Text style={styles.uploadText}>Upload Your Document</Text>
              <Text style={styles.uploadSubtext}>PDF, Images, or Scanned Documents</Text>
              
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={handlePickDocument}
                >
                  <Ionicons name="document-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.selectButtonText}>Document</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.selectButton, styles.imageButton]}
                  onPress={handlePickImage}
                >
                  <Ionicons name="image-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.selectButtonText}>Image</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {selectedFile && (
          <>
            <TouchableOpacity
              style={[styles.uploadButton, (uploading || processing) && styles.uploadButtonDisabled]}
              onPress={handleUpload}
              disabled={uploading || processing}
            >
              {uploading || processing ? (
                <>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.uploadButtonText}>
                    {uploading ? `Uploading ${progress}%` : 'Processing...'}
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons name="cloud-upload" size={20} color="#FFFFFF" />
                  <Text style={styles.uploadButtonText}>Upload & Process</Text>
                </>
              )}
            </TouchableOpacity>

            {uploading && (
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
            )}
          </>
        )}

        <View style={styles.features}>
          <Text style={styles.featuresTitle}>Features</Text>
          <View style={styles.featureItem}>
            <Ionicons name="scan" size={24} color="#8B5CF6" />
            <Text style={styles.featureText}>Multi-page scanning</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="analytics" size={24} color="#8B5CF6" />
            <Text style={styles.featureText}>AI-powered extraction</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="create" size={24} color="#8B5CF6" />
            <Text style={styles.featureText}>Editable forms</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  appIcon: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  uploadBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8B5CF6',
    borderStyle: 'dashed',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
  },
  uploadText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
  },
  uploadSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  selectButton: {
    flexDirection: 'row',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  imageButton: {
    backgroundColor: '#10B981',
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  fileInfo: {
    alignItems: 'center',
    width: '100%',
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  fileSize: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  fileActions: {
    marginTop: 16,
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  changeButtonText: {
    color: '#6B7280',
    fontSize: 14,
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
    gap: 8,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
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
    overflow: 'hidden',
    marginBottom: 24,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
  },
  features: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 24,
    marginTop: 8,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#4B5563',
  },
  scrollView: {
    flex: 1,
  },
  resultsContent: {
    padding: 16,
    paddingBottom: 40,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
});
