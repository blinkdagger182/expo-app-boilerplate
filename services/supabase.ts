import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import { AppState, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';
import { decode } from 'base64-arraybuffer';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Custom storage adapter using AsyncStorage as a fallback when SecureStore isn't available
const createStorageAdapter = () => {
  try {
    // Try to import SecureStore dynamically
    const SecureStore = require('expo-secure-store');
    
    return {
      getItem: async (key: string): Promise<string | null> => {
        try {
          const value = await SecureStore.getItemAsync(key);
          return value;
        } catch (error) {
          console.log('Falling back to AsyncStorage for getItem');
          return AsyncStorage.getItem(key);
        }
      },
      setItem: async (key: string, value: string): Promise<void> => {
        try {
          await SecureStore.setItemAsync(key, value);
        } catch (error) {
          console.log('Falling back to AsyncStorage for setItem');
          await AsyncStorage.setItem(key, value);
        }
      },
      removeItem: async (key: string): Promise<void> => {
        try {
          await SecureStore.deleteItemAsync(key);
        } catch (error) {
          console.log('Falling back to AsyncStorage for removeItem');
          await AsyncStorage.removeItem(key);
        }
      }
    };
  } catch (error) {
    console.log('SecureStore not available, using AsyncStorage instead');
    // Fallback to AsyncStorage if SecureStore is not available
    return {
      getItem: (key: string): Promise<string | null> => AsyncStorage.getItem(key),
      setItem: (key: string, value: string): Promise<void> => AsyncStorage.setItem(key, value),
      removeItem: (key: string): Promise<void> => AsyncStorage.removeItem(key)
    };
  }
};

// Use environment variables in a production app
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://qqidxdmclegmqpnhqnqb.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxaWR4ZG1jbGVnbXFwbmhxbnFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyNzExOTAsImV4cCI6MjA1Nzg0NzE5MH0.j64Jm4SkzxWiVZWKs9o_od8YjwT3t8E3VeRaeVnCIuc';

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: createStorageAdapter(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseAnonKey ? 'Key exists' : 'Key missing');

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground
const appStateSubscription = AppState.addEventListener('change', (state: string) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const URL_CACHE_PREFIX = 'signed_url_';
const PROFILE_CACHE_PREFIX = 'profile_';
const POSTS_CACHE_KEY = 'recent_posts';
const FRIENDS_CACHE_KEY = 'friends_list';

// Helper function to create a signed URL for an image with caching
export const createSignedUrl = async (bucket: string, path: string, expiresIn: number = 3600) => {
  try {
    const cacheKey = `${URL_CACHE_PREFIX}${bucket}_${path}`;
    
    // Try to get from cache first
    const cachedUrl = await AsyncStorage.getItem(cacheKey);
    if (cachedUrl) {
      const { url, expiry } = JSON.parse(cachedUrl);
      if (Date.now() < expiry) {
        return url;
      }
      // Cache expired, remove it
      await AsyncStorage.removeItem(cacheKey);
    }
    
    // If not in cache or expired, create a new signed URL
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);
    
    if (error) {
      console.error('Error creating signed URL:', error);
      return null;
    }
    
    // Cache the URL with expiry time (slightly shorter than the actual expiry)
    const cacheExpiry = Date.now() + (expiresIn * 1000 * 0.9); // 90% of the actual expiry time
    await AsyncStorage.setItem(cacheKey, JSON.stringify({
      url: data.signedUrl,
      expiry: cacheExpiry
    }));
    
    return data.signedUrl;
  } catch (error) {
    console.error('Error in createSignedUrl:', error);
    return null;
  }
};

// Helper function to extract file path from a Supabase storage URL
export const extractFilePathFromUrl = (url: string): { bucket: string, path: string } | null => {
  try {
    if (!url) return null;
    
    // Remove query parameters if present
    const baseUrl = url.split('?')[0];
    
    // The URL format is typically: https://[project-ref].supabase.co/storage/v1/object/public/[bucket]/[path]
    const urlParts = baseUrl.split('/');
    const publicIndex = urlParts.findIndex((part: string) => part === 'public');
    
    if (publicIndex > 0 && publicIndex < urlParts.length - 1) {
      const bucket = urlParts[publicIndex + 1];
      
      // Get all parts after the bucket to form the path
      const pathParts = urlParts.slice(publicIndex + 2);
      const path = pathParts.join('/');
      
      return { bucket, path };
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting file path from URL:', error);
    return null;
  }
};

// Cache for authenticated client to reduce API calls
let cachedAuthSession: any = null;
let lastAuthCheck = 0;
const AUTH_CACHE_DURATION = 60 * 1000; // 1 minute

// Helper function to get authenticated client
const getAuthenticatedClient = async () => {
  // Check if we have a recent cached session
  const now = Date.now();
  if (cachedAuthSession && (now - lastAuthCheck < AUTH_CACHE_DURATION)) {
    console.log('Using cached session');
    return supabase;
  }
  
  // Get current session
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error);
      throw error;
    }
    
    cachedAuthSession = data.session;
    lastAuthCheck = now;
    console.log('Session found, token exists:', !!cachedAuthSession?.access_token);
    return supabase;
  } catch (error) {
    console.error('Error in getAuthenticatedClient:', error);
    throw error;
  }
};

// Types for database tables
export interface Profile {
  id: string;
  name: string;
  avatar_url: string | null;
  updated_at: string;
}

export interface Post {
  id: number;
  user_id: string;
  image_url: string;
  caption: string | null;
  likes: number;
  detection_result: any | null;
  deleted: boolean;
  created_at: string;
  profiles?: Profile;
}

export interface Friend {
  id: number;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted';
  created_at: string;
  profiles?: Profile;
}

export interface Message {
  id: number;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

export interface Detection {
  id: number;
  post_id: number;
  image_url: string;
  status: 'pending' | 'completed' | 'failed';
  result: any | null;
  created_at: string;
}

export interface PremiumUser {
  id: number;
  user_id: string;
  active: boolean;
  subscription_id: string;
  expires_at: string;
  created_at: string;
}

// Supabase service class
class SupabaseService {
  // Auth methods
  async signUp(email: string, password: string, name: string) {
    try {
      // Step 1: Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name, // Store name in auth metadata as well
          },
        },
      });

      if (authError) throw authError;
      
      // Log success for debugging
      console.log('User signed up successfully:', authData.user?.id);
      
      // Even if we can't create the profile due to RLS, return the auth data
      return authData;
    } catch (error) {
      console.error('Error in signup process:', error);
      throw error;
    }
  }

  async signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  }

  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'com.yourcompany.pawket://auth/callback',
      },
    });
    
    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  }

  async getCurrentSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  }

  // Profile methods
  async getProfile(userId: string) {
    try {
      // Try to get from cache first
      const cacheKey = `${PROFILE_CACHE_PREFIX}${userId}`;
      const cachedProfile = await AsyncStorage.getItem(cacheKey);
      if (cachedProfile) {
        return JSON.parse(cachedProfile);
      }
      
      const client = await getAuthenticatedClient();
      const { data, error } = await client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        // If the profile doesn't exist, create a default one
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating default profile');
          const defaultProfile: Partial<Profile> = {
            id: userId,
            name: 'New User',
            avatar_url: null,
          };
          
          const { data: newProfile, error: insertError } = await client
            .from('profiles')
            .insert(defaultProfile)
            .select()
            .single();
            
          if (insertError) {
            console.error('Error creating default profile:', insertError);
            throw insertError;
          }
          
          // Cache the new profile
          await AsyncStorage.setItem(cacheKey, JSON.stringify(newProfile));
          return newProfile as Profile;
        }
        
        throw error;
      }
      
      // Cache the profile
      await AsyncStorage.setItem(cacheKey, JSON.stringify(data));
      return data as Profile;
    } catch (error) {
      console.error('Error in getProfile:', error);
      throw error;
    }
  }

  async updateProfile(userId: string, updates: Partial<Profile>) {
    const client = await getAuthenticatedClient();
    const { data, error } = await client
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    
    // Update the cached profile
    const cacheKey = `${PROFILE_CACHE_PREFIX}${userId}`;
    const cachedProfile = await AsyncStorage.getItem(cacheKey);
    if (cachedProfile) {
      const updatedProfile = { ...JSON.parse(cachedProfile), ...updates };
      await AsyncStorage.setItem(cacheKey, JSON.stringify(updatedProfile));
    }
    
    return data as Profile;
  }

  async uploadAvatar(userId: string, uri: string) {
    const client = await getAuthenticatedClient();
    const fileName = `${userId}/${Date.now()}.jpg`;
    
    // Convert uri to blob
    const response = await fetch(uri);
    const blob = await response.blob();
    
    const { data, error } = await client
      .storage
      .from('avatars')
      .upload(fileName, blob);
    
    if (error) throw error;
    
    // Get public URL
    const { data: publicUrlData } = client
      .storage
      .from('avatars')
      .getPublicUrl(fileName);
    
    // Update profile with avatar URL
    await this.updateProfile(userId, {
      avatar_url: publicUrlData.publicUrl,
    } as Partial<Profile>);
    
    return publicUrlData.publicUrl;
  }

  // Post methods
  async getPosts() {
    try {
      // Try to get from cache first
      const cachedPosts = await AsyncStorage.getItem(POSTS_CACHE_KEY);
      if (cachedPosts) {
        return JSON.parse(cachedPosts);
      }
      
      const client = await getAuthenticatedClient();
      const { data: userData } = await client.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');
      
      console.log('Fetching posts for user:', userData.user.id);
      
      const { data: friendsData, error: friendsError } = await client
        .from('friends')
        .select('friend_id')
        .eq('user_id', userData.user.id)
        .eq('status', 'accepted');
      
      if (friendsError) {
        console.error('Error fetching friends:', friendsError);
        // If friends table doesn't exist, just show the user's own posts
        const friendIds = [userData.user.id];
        
        try {
          // Try to fetch posts without the profiles join first
          const { data, error } = await client
            .from('posts')
            .select('*')
            .in('user_id', friendIds)
            .eq('deleted', false)
            .order('created_at', { ascending: false });
          
          if (error) {
            console.error('Error fetching posts without profiles:', error);
            return [] as Post[]; // Return empty array if posts table doesn't exist
          }
          
          // For each post, fetch the profile separately and generate signed URL
          const postsWithProfiles = await Promise.all(
            data.map(async (post) => {
              try {
                const profile = await this.getProfile(post.user_id);
                // Generate signed URL for the post image
                const signedImageUrl = await this.getPostImageUrl(post.image_url);
                return { 
                  ...post, 
                  profiles: profile,
                  image_url: signedImageUrl // Replace with signed URL
                };
              } catch (error) {
                console.error('Error processing post:', error);
                return post; // Return post without profile if error
              }
            })
          );
          
          // Cache the posts
          await AsyncStorage.setItem(POSTS_CACHE_KEY, JSON.stringify(postsWithProfiles));
          return postsWithProfiles as Post[];
        } catch (error) {
          console.error('Error in alternative posts fetch:', error);
          return [] as Post[];
        }
      }
      
      const friendIds = friendsData.map(f => f.friend_id);
      friendIds.push(userData.user.id); // Include user's own posts
      
      try {
        // Try with the join first
        const { data, error } = await client
          .from('posts')
          .select('*, profiles(name, avatar_url)')
          .in('user_id', friendIds)
          .eq('deleted', false)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching posts with profiles join:', error);
          
          // If the join fails, try without it
          const { data: postsData, error: postsError } = await client
            .from('posts')
            .select('*')
            .in('user_id', friendIds)
            .eq('deleted', false)
            .order('created_at', { ascending: false });
          
          if (postsError) {
            console.error('Error fetching posts without join:', postsError);
            return [] as Post[];
          }
          
          // For each post, fetch the profile separately and generate signed URL
          const postsWithProfiles = await Promise.all(
            postsData.map(async (post) => {
              try {
                const profile = await this.getProfile(post.user_id);
                // Generate signed URL for the post image
                const signedImageUrl = await this.getPostImageUrl(post.image_url);
                return { 
                  ...post, 
                  profiles: profile,
                  image_url: signedImageUrl // Replace with signed URL
                };
              } catch (error) {
                console.error('Error processing post:', error);
                return post; // Return post without profile if error
              }
            })
          );
          
          // Cache the posts
          await AsyncStorage.setItem(POSTS_CACHE_KEY, JSON.stringify(postsWithProfiles));
          return postsWithProfiles as Post[];
        }
        
        // Generate signed URLs for posts that were fetched with the join
        const postsWithSignedUrls = await Promise.all(
          data.map(async (post) => {
            try {
              // Generate signed URL for the post image
              const signedImageUrl = await this.getPostImageUrl(post.image_url);
              return {
                ...post,
                image_url: signedImageUrl // Replace with signed URL
              };
            } catch (error) {
              console.error('Error generating signed URL for post:', error);
              return post; // Return post with original URL if error
            }
          })
        );
        
        // Cache the posts
        await AsyncStorage.setItem(POSTS_CACHE_KEY, JSON.stringify(postsWithSignedUrls));
        return postsWithSignedUrls as Post[];
      } catch (error) {
        console.error('Error in getPosts:', error);
        return [] as Post[];
      }
    } catch (error) {
      console.error('Error in getPosts:', error);
      return [] as Post[];
    }
  }

  // Get a signed URL for a post image
  async getPostImageUrl(imageUrl: string, expiresIn: number = 3600) {
    try {
      console.log('Getting signed URL for:', imageUrl);
      
      const fileInfo = extractFilePathFromUrl(imageUrl);
      if (!fileInfo) {
        console.error('Could not extract file path from URL:', imageUrl);
        return imageUrl; // Return the original URL if we can't parse it
      }
      
      console.log(`Attempting to create signed URL for bucket: ${fileInfo.bucket}, path: ${fileInfo.path}`);
      
      const signedUrl = await createSignedUrl(fileInfo.bucket, fileInfo.path, expiresIn);
      
      if (signedUrl) {
        console.log('Successfully created signed URL');
        return signedUrl;
      } else {
        console.warn('Failed to create signed URL, falling back to original URL');
        return imageUrl; // Fall back to original URL if signing fails
      }
    } catch (error) {
      console.error('Error getting signed URL for post image:', error);
      return imageUrl; // Return the original URL on error
    }
  }

  async createPost(imageUri: string, caption: string | null = null) {
    const client = await getAuthenticatedClient();
    const { data: userData } = await client.auth.getUser();
    if (!userData?.user) throw new Error('User not authenticated');

    const fileName = `${userData.user.id}/${Date.now()}.jpg`;
    console.log('Uploading image:', fileName);
    console.log('Image URI:', imageUri);

    try {
      // Convert the image to an ArrayBuffer
      const arrayBuffer = await this.readFileAsArrayBuffer(imageUri);

      // Upload the ArrayBuffer to Supabase Storage
      const { data: storageData, error: storageError } = await client.storage
        .from('posts')
        .upload(fileName, arrayBuffer, {
          contentType: 'image/jpeg',
        });

      if (storageError) throw storageError;

      // Get public URL
      const { data: publicUrlData } = client.storage
        .from('posts')
        .getPublicUrl(fileName);

      // Create post entry
      const { data, error } = await client
        .from('posts')
        .insert({
          user_id: userData.user.id,
          image_url: publicUrlData.publicUrl,
          caption,
        })
        .select()
        .single();

      if (error) throw error;

      // Trigger AI detection
      this.triggerCatDetection(data.id, publicUrlData.publicUrl);

      // Remove cached posts to refresh
      await AsyncStorage.removeItem(POSTS_CACHE_KEY);
      return data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  async readFileAsArrayBuffer(uri: string) {
    // Read the file as a base64 string
    const base64String = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    // Decode the base64 string to an ArrayBuffer
    return decode(base64String);
  }

  async likePost(postId: number) {
    const client = await getAuthenticatedClient();
    const { data, error } = await client.rpc('increment_likes', {
      post_id: postId
    });
    
    if (error) throw error;
    return data;
  }

  async deletePost(postId: number) {
    const client = await getAuthenticatedClient();
    const { data, error } = await client
      .from('posts')
      .update({ deleted: true })
      .eq('id', postId)
      .select()
      .single();
    
    if (error) throw error;
    return data as Post;
  }

  // Friend methods
  async getFriends() {
    try {
      // Try to get from cache first
      const cachedFriends = await AsyncStorage.getItem(FRIENDS_CACHE_KEY);
      if (cachedFriends) {
        return JSON.parse(cachedFriends);
      }
      
      const client = await getAuthenticatedClient();
      const { data: userData } = await client.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');
      
      const { data, error } = await client
        .from('friends')
        .select('*, profiles!friends_friend_id_fkey(name, avatar_url)')
        .eq('user_id', userData.user.id)
        .eq('status', 'accepted');
      
      if (error) throw error;
      
      // Cache the friends
      await AsyncStorage.setItem(FRIENDS_CACHE_KEY, JSON.stringify(data));
      return data as Friend[];
    } catch (error) {
      console.error('Error in getFriends:', error);
      throw error;
    }
  }

  async getFriendRequests() {
    const client = await getAuthenticatedClient();
    const { data: userData } = await client.auth.getUser();
    if (!userData.user) throw new Error('User not authenticated');
    
    const { data, error } = await client
      .from('friends')
      .select('*, profiles!friends_user_id_fkey(name, avatar_url)')
      .eq('friend_id', userData.user.id)
      .eq('status', 'pending');
    
    if (error) throw error;
    return data as Friend[];
  }

  async sendFriendRequest(friendId: string) {
    try {
      const client = await getAuthenticatedClient();
      const { data: userData } = await client.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');
      
      // Check if request already exists
      const { data: existingRequests, error: checkError } = await client
        .from('friends')
        .select('*')
        .or(`and(user_id.eq.${userData.user.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userData.user.id})`)
        .limit(1);
      
      if (checkError) throw checkError;
      
      if (existingRequests && existingRequests.length > 0) {
        throw new Error('Friend request already exists');
      }
      
      const { data, error } = await client
        .from('friends')
        .insert({
          user_id: userData.user.id,
          friend_id: friendId,
          status: 'pending',
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Invalidate friends cache
      await AsyncStorage.removeItem(FRIENDS_CACHE_KEY);
      
      return data as Friend;
    } catch (error) {
      console.error('Error in sendFriendRequest:', error);
      throw error;
    }
  }

  async acceptFriendRequest(requestId: number) {
    try {
      const client = await getAuthenticatedClient();
      
      const { data, error } = await client
        .from('friends')
        .update({ status: 'accepted' })
        .eq('id', requestId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Invalidate friends cache
      await AsyncStorage.removeItem(FRIENDS_CACHE_KEY);
      
      return data as Friend;
    } catch (error) {
      console.error('Error in acceptFriendRequest:', error);
      throw error;
    }
  }

  async rejectFriendRequest(requestId: number) {
    try {
      const client = await getAuthenticatedClient();
      
      const { data, error } = await client
        .from('friends')
        .delete()
        .eq('id', requestId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Invalidate friends cache
      await AsyncStorage.removeItem(FRIENDS_CACHE_KEY);
      
      return data as Friend;
    } catch (error) {
      console.error('Error in rejectFriendRequest:', error);
      throw error;
    }
  }

  async removeFriend(friendshipId: number) {
    try {
      const client = await getAuthenticatedClient();
      
      const { data, error } = await client
        .from('friends')
        .delete()
        .eq('id', friendshipId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Invalidate friends cache
      await AsyncStorage.removeItem(FRIENDS_CACHE_KEY);
      
      return data as Friend;
    } catch (error) {
      console.error('Error in removeFriend:', error);
      throw error;
    }
  }

  // Message methods with pagination and optimistic updates
  async getMessages(userId: string, limit = 50, offset = 0) {
    try {
      // Try to get from cache first
      const cacheKey = `messages_${userId}_${limit}_${offset}`;
      const cachedMessages = await AsyncStorage.getItem(cacheKey);
      
      if (cachedMessages) {
        return JSON.parse(cachedMessages);
      }
      
      const client = await getAuthenticatedClient();
      const { data: userData } = await client.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');
      
      const { data, error } = await client
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${userData.user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${userData.user.id})`)
        .eq('deleted', false)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      
      // Cache messages with a short expiry
      await AsyncStorage.setItem(cacheKey, JSON.stringify(data));
      
      return data as Message[];
    } catch (error: unknown) {
      console.error('Error in getMessages:', error);
      throw error;
    }
  }

  async sendMessage(receiverId: string, content: string) {
    try {
      const client = await getAuthenticatedClient();
      const { data: userData } = await client.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');
      
      const { data, error } = await client
        .from('messages')
        .insert({
          sender_id: userData.user.id,
          receiver_id: receiverId,
          content,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Clear message cache for this conversation
      const cacheKeyPattern = `messages_${userData.user.id}_${receiverId}`;
      const keys = await AsyncStorage.getAllKeys();
      const messageCacheKeys = keys.filter(key => key.startsWith(cacheKeyPattern));
      
      await Promise.all(messageCacheKeys.map(key => AsyncStorage.removeItem(key)));
      
      return data as Message;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      throw error;
    }
  }

  async subscribeToMessages(callback: (payload: any) => void) {
    try {
      const client = await getAuthenticatedClient();
      const { data: userData } = await client.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');
      
      const channel = client
        .channel('messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `receiver_id=eq.${userData.user.id}`,
          },
          callback
        );
      
      // Add error handling with reconnection logic
      channel.subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          console.error('Channel error for messages');
          // Attempt to reconnect after a delay
          setTimeout(() => {
            channel.subscribe();
          }, 5000);
        }
      });
      
      return channel;
    } catch (error) {
      console.error('Error in subscribeToMessages:', error);
      throw error;
    }
  }

  async markMessagesAsRead(messageIds: number[]) {
    try {
      const client = await getAuthenticatedClient();
      
      const { error } = await client
        .from('messages')
        .update({ read: true })
        .in('id', messageIds);
      
      if (error) {
        console.error('Error marking messages as read:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in markMessagesAsRead:', error);
      return false;
    }
  }

  // AI detection methods
  async triggerCatDetection(postId: number, imageUrl: string) {
    try {
      const client = await getAuthenticatedClient();
      
      const { data, error } = await client
        .from('detections')
        .insert({
          post_id: postId,
          image_url: imageUrl,
          status: 'pending',
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as Detection;
    } catch (error) {
      console.error('Error triggering cat detection:', error);
      // Don't throw here, as this is a background process
      return null;
    }
  }

  // Premium user methods
  async checkPremiumStatus() {
    try {
      const client = await getAuthenticatedClient();
      const { data: userData } = await client.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');
      
      const cacheKey = `premium_${userData.user.id}`;
      const cachedStatus = await AsyncStorage.getItem(cacheKey);
      
      if (cachedStatus) {
        return JSON.parse(cachedStatus);
      }
      
      const { data, error } = await client
        .from('premium_users')
        .select('*')
        .eq('user_id', userData.user.id)
        .eq('active', true)
        .single();
      
      if (error) {
        // If no premium subscription found
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      
      // Cache premium status for 1 hour
      await AsyncStorage.setItem(cacheKey, JSON.stringify(data));
      
      return data as PremiumUser;
    } catch (error) {
      console.error('Error checking premium status:', error);
      return null;
    }
  }

  // Subscription methods with improved error handling and reconnection logic
  async subscribeToFriendRequests(callback: (payload: any) => void) {
    try {
      const client = await getAuthenticatedClient();
      const { data: userData } = await client.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');
      
      const channel = client
        .channel('friend-requests')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'friends',
            filter: `friend_id=eq.${userData.user.id}`,
          },
          callback
        );
      
      // Add error handling with reconnection logic
      channel.subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          console.error('Channel error for friend requests');
          // Attempt to reconnect after a delay
          setTimeout(() => {
            channel.subscribe();
          }, 5000);
        }
      });
      
      return channel;
    } catch (error) {
      console.error('Error in subscribeToFriendRequests:', error);
      throw error;
    }
  }

  async subscribeToPostDetections(postId: number, callback: (payload: any) => void) {
    try {
      const client = await getAuthenticatedClient();
      
      const channel = client
        .channel(`post-${postId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'detections',
            filter: `post_id=eq.${postId}`,
          },
          callback
        );
      
      // Add error handling with reconnection logic
      channel.subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          console.error(`Channel error for post detection ${postId}`);
          // Attempt to reconnect after a delay
          setTimeout(() => {
            channel.subscribe();
          }, 5000);
        }
      });
      
      return channel;
    } catch (error) {
      console.error('Error in subscribeToPostDetections:', error);
      throw error;
    }
  }
  
  // Cache management methods
  async clearCache() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => 
        key.startsWith(URL_CACHE_PREFIX) || 
        key.startsWith(PROFILE_CACHE_PREFIX) || 
        key === POSTS_CACHE_KEY ||
        key === FRIENDS_CACHE_KEY ||
        key.startsWith('messages_')
      );
      
      await AsyncStorage.multiRemove(cacheKeys);
      console.log(`Cleared ${cacheKeys.length} cache items`);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
  
  // Method to handle app startup
  async initializeApp() {
    try {
      // Start session refresh
      supabase.auth.startAutoRefresh();
      
      // Prefetch user profile
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        // Prefetch user's own profile
        this.getProfile(userData.user.id).catch(err => console.error('Error prefetching profile:', err));
        
        // Prefetch friends list
        this.getFriends().catch(err => console.error('Error prefetching friends:', err));
        
        // Prefetch recent posts
        this.getPosts().catch(err => console.error('Error prefetching posts:', err));
      }
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  }
}

export const supabaseService = new SupabaseService();
