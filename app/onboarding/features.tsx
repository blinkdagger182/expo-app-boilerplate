import { StyleSheet, View, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Feature = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

const features: Feature[] = [
  {
    id: '1',
    title: 'Share Pet Photos',
    description: 'Capture and share adorable moments of your pets with friends and family',
    icon: 'camera',
  },
  {
    id: '2',
    title: 'Connect with Friends',
    description: 'Find and connect with other pet lovers around the world',
    icon: 'account-group',
  },
  {
    id: '3',
    title: 'Automatic Detection',
    description: 'Our AI automatically detects cats in your photos',
    icon: 'cat',
  },
  {
    id: '4',
    title: 'Library View',
    description: 'View your posts in a beautiful grid layout or as a feed',
    icon: 'view-grid',
  },
];

export default function FeaturesScreen() {
  const router = useRouter();

  const handleNext = () => {
    router.push('/onboarding/final');
  };

  const renderFeatureItem = ({ item }: { item: Feature }) => (
    <View style={styles.featureItem}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name={item.icon as any} size={32} color="#0A7EA4" />
      </View>
      <View style={styles.featureTextContainer}>
        <ThemedText type="defaultSemiBold" style={styles.featureTitle}>
          {item.title}
        </ThemedText>
        <ThemedText style={styles.featureDescription}>
          {item.description}
        </ThemedText>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Key Features
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Discover what makes Pawket special
            </ThemedText>
          </View>

          <FlatList
            data={features}
            renderItem={renderFeatureItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.featuresList}
          />

          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>
              Continue
            </ThemedText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0A7EA4',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginTop: 8,
  },
  featuresList: {
    paddingBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E6F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#0A7EA4',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});