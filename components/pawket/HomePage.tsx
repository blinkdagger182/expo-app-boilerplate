/**
 * HomePage component for the Pawket app
 * 
 * Learning curriculum:
 * - Implementing vertical swipe navigation in React Native
 * - Working with gesture handling in React Native
 * - Creating a photo feed UI
 * - Managing component state with useState
 * - Implementing UI transitions and animations
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  FlatList,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Alert
} from 'react-native';
import { Avatar } from './Avatar';
import { Button } from './Button';
import { Input } from './Input';
import { Post, mockPosts } from './utils';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useSuperwall } from '@/hooks/useSuperwall';
import { SUPERWALL_TRIGGERS } from '@/config/superwall';

const { width, height } = Dimensions.get('window');
const PAGE_HEIGHT = height - 100; // Adjust for header and safe areas

interface HomePageProps {
  // Add any props needed
}

export const HomePage: React.FC<HomePageProps> = () => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [showLibrary, setShowLibrary] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'front' | 'back'>('front');
  const [isCameraReady, setIsCameraReady] = useState(false);
  const cameraRef = useRef<any>(null);
  const { showPaywall } = useSuperwall();
  const [permission, requestPermission] = useCameraPermissions();
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Toggle between grid and timeline view
  const toggleLibrary = () => {
    setShowLibrary(!showLibrary);
  };

  // Handle scroll events to track current page
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = event.nativeEvent;
    const pageIndex = Math.round(contentOffset.y / PAGE_HEIGHT);
    setCurrentPageIndex(pageIndex);
  };

  // Render a library item
  const renderLibraryItem = ({ item }: { item: Post }) => {
    return (
      <TouchableOpacity style={styles.libraryItem}>
        <Image
          source={{ uri: item.image }}
          style={styles.libraryItemImage}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  };

  // Toggle between front and back camera
  const toggleCameraFacing = () => {
    setCameraFacing(current => current === 'front' ? 'back' : 'front');
  };

  // Handle camera ready state
  const onCameraReady = () => {
    setIsCameraReady(true);
  };

  // Take a picture
  const takePicture = async () => {
    if (cameraRef.current && isCameraReady) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });
        
        Alert.alert('Success', 'Photo captured!');
        // Here you could add logic to save the photo or add it to posts
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
        console.error(error);
      }
    } else {
      Alert.alert('Camera not ready', 'Please wait for the camera to initialize');
    }
  };

  // Show upload paywall
  const showUploadPaywall = () => {
    showPaywall(SUPERWALL_TRIGGERS.FEATURE_UNLOCK);
  };

  // Navigate to messages
  const navigateToMessages = () => {
    // Navigate to Messages tab (index 2)
    router.push('/pawket');
  };

  // Render camera view with buttons
  const renderCameraView = () => {
    if (!permission) {
      return (
        <View style={styles.cameraPage}>
          <Text style={styles.cameraText}>Requesting camera permission...</Text>
        </View>
      );
    }
    
    if (!permission.granted) {
      return (
        <View style={styles.cameraPage}>
          <Text style={styles.cameraText}>No access to camera</Text>
          <Button
            variant="outline"
            size="small"
            rounded
            onPress={requestPermission}
          >
            Request Permission
          </Button>
        </View>
      );
    }
    
    return (
      <View style={styles.cameraPage}>
        <View style={styles.cameraContainer}>
          {/* Live Camera View - Always in capturing mode */}
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={cameraFacing}
            onCameraReady={onCameraReady}
          >
            {/* Camera Controls - Overlay on top of camera */}
            <View style={styles.cameraControlsOverlay}>
              <TouchableOpacity 
                style={styles.cameraControlButton}
                onPress={showUploadPaywall}
              >
                <Ionicons name="images" size={28} color="#FFFFFF" />
                <Text style={styles.buttonText}>Upload</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.snapButton}
                onPress={takePicture}
              >
                <View style={styles.snapButtonInner} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.cameraControlButton}
                onPress={toggleCameraFacing}
              >
                <Ionicons name="camera-reverse" size={28} color="#FFFFFF" />
                <Text style={styles.buttonText}>Flip</Text>
              </TouchableOpacity>
            </View>
          </CameraView>
        </View>
        <View style={styles.swipeIndicator}>
          <Ionicons name="chevron-down" size={24} color="#FFFFFF" />
          <Text style={styles.swipeText}>Swipe down to see posts</Text>
        </View>
      </View>
    );
  };

  // Render a single post as a full page
  const renderPostPage = (item: Post) => {
    return (
      <View style={styles.postPage} key={item.id}>
        <View style={styles.postImageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.postImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.postInfo}>
          <Avatar
            source={item.avatar}
            size="small"
            fallback={item.user.charAt(0)}
          />
          <Text style={styles.postUsername}>{item.user}</Text>
          <Text style={styles.postTime}>{item.time}</Text>
        </View>
        
        <Text style={styles.postCaption}>{item.caption}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pawket</Text>
        <TouchableOpacity onPress={toggleLibrary}>
          <Ionicons
            name={showLibrary ? "grid-outline" : "images-outline"}
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      {showLibrary ? (
        <FlatList
          data={mockPosts}
          renderItem={renderLibraryItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          contentContainerStyle={styles.libraryContainer}
        />
      ) : (
        // Vertical paging scroll view with camera at top followed by posts
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          pagingEnabled
          snapToInterval={PAGE_HEIGHT}
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {/* Camera View as First Page */}
          {renderCameraView()}
          
          {/* Post Pages */}
          {mockPosts.map(post => renderPostPage(post))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  cameraPage: {
    height: PAGE_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1F2937',
  },
  cameraContainer: {
    width: width - 32,
    height: width - 32,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  cameraText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  cameraControlsOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 16,
    marginHorizontal: 16,
  },
  cameraControlButton: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 8,
  },
  snapButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4B5563',
    justifyContent: 'center',
    alignItems: 'center',
  },
  snapButtonInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6B7280',
  },
  buttonText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 4,
  },
  swipeIndicator: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
  },
  swipeText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
  },
  libraryContainer: {
    padding: 4,
  },
  libraryItem: {
    flex: 1/3,
    aspectRatio: 1,
    margin: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  libraryItemImage: {
    width: '100%',
    height: '100%',
  },
  postPage: {
    height: PAGE_HEIGHT,
    padding: 16,
    justifyContent: 'center',
  },
  postImageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  postInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  postUsername: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  postTime: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 'auto',
  },
  postCaption: {
    fontSize: 14,
    color: '#E5E7EB',
    lineHeight: 20,
  },
});
