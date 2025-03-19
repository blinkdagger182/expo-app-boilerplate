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
  Alert,
  TextInput,
  ActivityIndicator,
  Platform
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from './Avatar';
import { Button } from './Button';
import { Input } from './Input';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useSuperwall } from '@/hooks/useSuperwall';
import { SUPERWALL_TRIGGERS } from '@/config/superwall';
import { useAuth } from '@/contexts/AuthContext';
import { supabaseService, Post as PostType } from '@/services/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

const { height: screenHeight } = Dimensions.get('window');

interface HomePageProps {
  // Add any props needed
}

export const HomePage: React.FC<HomePageProps> = () => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'front' | 'back'>('back');
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [messageText, setMessageText] = useState('');
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [visiblePostIndex, setVisiblePostIndex] = useState(-1); // -1 means camera view is visible

  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const cameraRef = useRef<any>(null);
  const { showPaywall: showSuperwallPaywall } = useSuperwall();
  const [permission, requestPermission] = useCameraPermissions();
  const scrollViewRef = useRef<ScrollView>(null);
  const { user, profile } = useAuth();
  const insets = useSafeAreaInsets();
  
  // Calculate dynamic heights based on insets
  const headerHeight = 60; // Height of the header
  const footerHeight = 70; // Height of the footer
  const pageHeight = screenHeight; // Full screen height for each page
  const availableHeight = screenHeight - (insets.top + insets.bottom + headerHeight + footerHeight);

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
    
    // Set up real-time subscription for new posts
    const subscription = supabaseService.subscribeToFriendRequests((payload) => {
      // Refresh posts when a new post is added
      fetchPosts();
    });
    
    return () => {
      // Clean up subscription
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);
  
  // Fetch posts from Supabase
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await supabaseService.getPosts();
      // Limit to only the 4 most recent posts
      setPosts(data.slice(0, 4));
    } catch (error) {
      console.error('Error fetching posts:', error);
      Alert.alert('Error', 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };
  
  // Toggle between grid and timeline view
  const toggleLibrary = () => {
    setShowLibrary(!showLibrary);
  };

  // Handle scroll events to update the current page index
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / screenHeight);
    
    if (index !== currentPageIndex) {
      setCurrentPageIndex(index);
    }
  };

  // Render a library item
  const renderLibraryItem = ({ item }: { item: PostType }) => {
    return (
      <TouchableOpacity style={styles.libraryItem}>
        <Image
          source={{ uri: item.image_url }}
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
        setCapturedImage(photo.uri); // Set the captured image
        
        // Show caption input dialog
        Alert.prompt(
          'Add Caption',
          'Add a caption to your cat photo',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Post',
              onPress: (captionText) => uploadPost(photo.uri, captionText || null),
            },
          ],
          'plain-text'
        );
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
        console.error(error);
      }
    } else {
      Alert.alert('Camera not ready', 'Please wait for the camera to initialize');
    }
  };
  const handlePost = () => {
    if (capturedImage) {
      uploadPost(capturedImage, caption);
      setCapturedImage(null);
      setCaption('');
    }
  };
  
  // Upload post to Supabase
  const uploadPost = async (imageUri: string, captionText: string | null) => {
    try {
      setUploading(true);
      
      // Check if user is premium for unlimited uploads
      const isPremium = await supabaseService.checkPremiumStatus();
      
      // If not premium and has more than 5 posts, show paywall
      if (!isPremium && posts.filter(p => p.user_id === user?.id).length >= 50) {
        showSuperwallPaywall(SUPERWALL_TRIGGERS.FEATURE_UNLOCK);
        setUploading(false);
        return;
      }
      
      // Upload post
      await supabaseService.createPost(imageUri, captionText);
      
      // Refresh posts
      fetchPosts();
      
      // Scroll to first post
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: screenHeight, animated: true });
      }
      
      Alert.alert('Success', 'Your cat photo has been posted!');
    } catch (error) {
      console.error('Error uploading post:', error);
      Alert.alert('Error', 'Failed to upload post');
    } finally {
      setUploading(false);
    }
  };

  // Pick image from library
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        // Show caption input dialog
        Alert.prompt(
          'Add Caption',
          'Add a caption to your cat photo',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Post',
              onPress: (captionText) => uploadPost(result.assets[0].uri, captionText || null),
            },
          ],
          'plain-text'
        );
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  // Show upload paywall
  const showUploadPaywall = () => {
    setShowPaywall(true);
  };

  // Navigate to messages
  const navigateToMessages = () => {
    // Navigate to Messages tab (index 2)
    router.push('/pawket');
  };

  // Function to scroll to a specific page
  const scrollToPage = (index: number) => {
    scrollViewRef.current?.scrollTo({
      y: index * screenHeight,
      animated: true,
    });
  };

  // Render camera view with buttons
  const renderCameraView = () => {
    if (currentPageIndex !== 0) return null;
    
    if (!permission) {
      return (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            We need camera permission to take pictures
          </Text>
          <Button 
            rounded
            onPress={requestPermission}
          >
            Request Permission
          </Button>
        </View>
      );
    }
    
    return (
      <View style={styles.cameraViewContainer}>
        {capturedImage ? (
          // Overlay captured image with caption input
          <View style={styles.contentContainer}>
            <View style={styles.cameraContainer}>
              <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
              <TextInput
                style={styles.captionInput}
                placeholder="Add a caption..."
                placeholderTextColor="#aaa"
                value={caption}
                onChangeText={setCaption}
              />
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.retakeButton} onPress={() => setCapturedImage(null)}>
                  <Text style={styles.buttonText}>Retake</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.postButton} onPress={handlePost}>
                  <Text style={styles.buttonText}>Post</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.contentContainer}>
            <View style={styles.cameraContainer}>
              {/* Live Camera View */}
              <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing={cameraFacing}
                onCameraReady={onCameraReady}
              />
              
              {/* Flash button on left */}
              <TouchableOpacity style={styles.flashButton}>
                <Ionicons name="flash-outline" size={24} color="#333333" />
              </TouchableOpacity>
              
              {/* Zoom button on right */}
              <TouchableOpacity style={styles.zoomButton}>
                <Text style={styles.zoomText}>1×</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
    
        {/* Camera Controls - Bottom row */}
        <View style={styles.cameraControls}>
          <TouchableOpacity style={styles.galleryButton} onPress={showUploadPaywall}>
            <Ionicons name="images-outline" size={30} color="#333333" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse-outline" size={30} color="#333333" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Render the feed with all posts
  const renderFeedView = () => {
    if (loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
    
    if (posts.length === 0) {
      return (
        <View style={styles.container}>
          <Text style={styles.emptyText}>No posts yet</Text>
        </View>
      );
    }
    
    // Return null as we're now rendering posts directly in the main render function
    return null;
  };

  // Main render function
  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.container}>
      {/* Fixed header that stays at the top with safe area padding */}
      <View style={[styles.fixedHeaderSafeArea, { paddingTop: 0 }]}>
        <View style={styles.fixedHeader}>
          <View style={styles.postHeaderLeft}>
            <Avatar size={32} />
          </View>
          <View style={styles.postHeaderCenter}>
            <Text style={styles.postHeaderText}>Everyone</Text>
            <Ionicons name="chevron-down" size={16} color="#333333" />
          </View>
          <View style={styles.postHeaderRight}>
            <Ionicons name="chatbubble-outline" size={24} color="#333333" />
          </View>
        </View>
      </View>

      {/* Vertical scrolling feed */}
      <ScrollView
        ref={scrollViewRef}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Camera view is always the first page */}
        <View style={[styles.pageContainer, { height: screenHeight }]}>
          <View style={styles.contentPositioner}>
            {renderCameraView()}
          </View>
        </View>

        {/* Post containers - each post is centered individually */}
        {posts.map((post, index) => (
          <View key={post.id} style={[styles.pageContainer, { height: screenHeight }]}>
            <View style={styles.contentPositioner}>
              <View style={styles.postWrapper}>
                <View style={styles.postAuthorSection}>
                  <Avatar size={24} source={post.profiles?.avatar_url ? { uri: post.profiles.avatar_url } : undefined} />
                  <Text style={styles.authorNameText}>{post.profiles?.name || 'Irfan'}</Text>
                  <Text style={styles.postTimeText}>4h</Text>
                </View>
                <View style={styles.postContainer}>
                  {/* Post image */}
                  <Image
                    source={{ uri: post.image_url }}
                    style={styles.postImage}
                    resizeMode="cover"
                  />
                  <View style={styles.postOverlay}>
                    <Text style={styles.postCaption}>{post.caption}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Fixed footer with message input and navigation - only show message input when not on camera view */}
      <View style={[styles.fixedFooterSafeArea, { paddingBottom: 0 }]}>
        {currentPageIndex !== 0 && (
          <View style={styles.floatingMessageInputWrapper}>
            <TextInput
              style={styles.messageInputField}
              placeholder="Send message..."
              placeholderTextColor="#999"
              value={messageText}
              onChangeText={setMessageText}
            />
            <View style={styles.emojiButtonsRow}>
              <TouchableOpacity style={styles.emojiButtonItem}>
                <Text style={styles.emojiText}>❤️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.emojiButtonItem}>
                <Text style={styles.emojiText}>😍</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.emojiButtonItem}>
                <Text style={styles.emojiText}>🔥</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.emojiButtonItem}>
                <Ionicons name="happy-outline" size={24} color="#999" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        <View style={styles.bottomNavBar}>
          <TouchableOpacity style={styles.navButtonItem}>
            <Ionicons name="grid-outline" size={24} color="#333333" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navButtonItem, styles.centerButtonItem]}>
            <View style={styles.centerButtonCircleItem} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButtonItem}>
            <Ionicons name="arrow-up-outline" size={24} color="#333333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Page indicators on right side */}
      <View style={styles.pageIndicators}>
        {[0, ...posts.map((_, i) => i + 1)].map((index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.pageIndicator,
              currentPageIndex === index && styles.activePageIndicator,
            ]}
            onPress={() => scrollToPage(index)}
          />
        ))}
      </View>

      {/* Library toggle button */}
      <TouchableOpacity 
        style={styles.libraryToggleButton} 
        onPress={() => setShowLibrary(true)}
      >
        <Ionicons name="images-outline" size={24} color="#333333" />
      </TouchableOpacity>

      {/* Library view (conditionally rendered) */}
      {showLibrary && (
        <View style={styles.libraryOverlay}>
          <View style={styles.libraryHeader}>
            <Text style={styles.libraryTitle}>Your Library</Text>
            <TouchableOpacity onPress={() => setShowLibrary(false)}>
              <Ionicons name="close" size={24} color="#333333" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={Array(20).fill(0)}
            numColumns={3}
            renderItem={renderLibraryItem}
            keyExtractor={(_, index) => `library-${index}`}
            contentContainerStyle={styles.libraryGridContainer}
          />
        </View>
      )}
    </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  fixedHeaderSafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#FAF9F6',
  },
  fixedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FAF9F6',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  fixedFooterSafeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#FAF9F6',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  scrollViewContent: {
    // No additional padding needed as we're using full screen height
  },
  pageContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60, // Account for header
    paddingBottom: 70, // Account for footer
  },
  contentPositioner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -100, // Move content slightly up
  },
  postWrapper: {
    width: '100%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraViewContainer: {
    width: '100%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingMessageInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 10,
    marginTop: 5,
    backgroundColor: '#EEEEEE',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  postAuthorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    paddingHorizontal: 16,
    width: '90%',
  },
  messageInputWrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  messageInputField: {
    flex: 1,
    height: 40,
    color: '#333333',
  },
  emojiButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emojiButtonItem: {
    paddingHorizontal: 8,
  },
  emojiText: {
    fontSize: 20,
  },
  bottomNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 20,
  },
  navButtonItem: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButtonItem: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  centerButtonCircleItem: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#CCCCCC',
  },
  // Library toggle button
  libraryToggleButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  // Grid container for library
  libraryGridContainer: {
    padding: 2,
  },
  postOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 12,
  },
  postCaption: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  pageIndicators: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -50 }],
    zIndex: 5,
  },
  pageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    marginVertical: 4,
  },
  activePageIndicator: {
    backgroundColor: '#333333',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    color: '#333333',
  },
  cameraContainer: {
    width: '90%',
    aspectRatio: 1,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    alignSelf: 'center',
  },
  camera: {
    flex: 1,
  },
  flashButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    padding: 8,
  },
  zoomButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    padding: 8,
  },
  zoomText: {
    fontSize: 14,
    fontWeight: '500',
  },
  cameraControls: {
    width: '80%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderRadius: '16px',
    paddingBottom: 20,
    paddingTop: 20,
  },
  galleryButton: {
    padding: 12,
  },
  captureButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#CCCCCC',
  },
  captureButtonInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
  },
  flipButton: {
    padding: 12,
  },
  postContainer: {
    width: '90%',
    aspectRatio: 1,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  postHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FAF9F6',
    width: '90%',
    marginBottom: 10,
    alignSelf: 'center',
  },
  postHeaderLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  postHeaderCenter: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postHeaderRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  postHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
    color: '#333333',
  },
  libraryItem: {
    flex: 1,
    margin: 2,
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  libraryItemImage: {
    width: '100%',
    height: '100%',
  },
  libraryOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FAF9F6',
    zIndex: 10,
  },
  libraryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  libraryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  paywallOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  paywallContent: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  paywallCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  paywallTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  paywallDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666666',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  captionInput: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  buttonRow: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  retakeButton: {
    backgroundColor: '#CCCCCC',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  postButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  overlayContainer: {
    flex: 1,
    position: 'relative',
  },
  capturedImage: {
    width: '100%',
    height: '100%',
  },
  authorNameText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginLeft: 8,
  },
  postTimeText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 'auto',
  },
});
