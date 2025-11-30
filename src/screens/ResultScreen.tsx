import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { DynamicRenderer, UISchema } from '../components/DynamicRenderer';
import { processDocument } from '../api/processDocument';

const API_ENDPOINT = 'https://your-api-endpoint.com'; // Replace with actual endpoint

export const ResultScreen: React.FC = () => {
  const { documentId } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [schema, setSchema] = useState<UISchema[]>([]);
  const [formData, setFormData] = useState<Record<number, string>>({});

  useEffect(() => {
    loadDocumentData();
  }, [documentId]);

  const loadDocumentData = async () => {
    if (!documentId) {
      Alert.alert('Error', 'No document ID provided');
      return;
    }

    setLoading(true);
    const result = await processDocument(documentId as string, API_ENDPOINT);
    setLoading(false);

    if (result.success && result.schema) {
      setSchema(result.schema);
    } else {
      Alert.alert('Error', result.message || 'Failed to process document');
    }
  };

  const handleInputChange = (index: number, value: string) => {
    setFormData((prev) => ({ ...prev, [index]: value }));
  };

  const handleButtonPress = (action: string) => {
    console.log('Button pressed:', action, formData);
    Alert.alert('Action', `${action} triggered`, [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Processing document...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Document Results</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <DynamicRenderer
          schema={schema}
          onInputChange={handleInputChange}
          onButtonPress={handleButtonPress}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
});
