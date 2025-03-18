import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import 'react-native-url-polyfill/auto';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';
import { decode } from 'base64-arraybuffer';
// SecureStore adapter for Supabase auth persistence
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    return SecureStore.deleteItemAsync(key);
  },
};

// Use environment variables in a production app
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://qqidxdmclegmqpnhqnqb.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxaWR4ZG1jbGVnbXFwbmhxbnFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyNzExOTAsImV4cCI6MjA1Nzg0NzE5MH0.j64Jm4SkzxWiVZWKs9o_od8YjwT3t8E3VeRaeVnCIuc';
// For debugging purposes
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseAnonKey ? 'Key exists' : 'Key missing');

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: Platform.OS !== 'web' ? ExpoSecureStoreAdapter : undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

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
  deleted: boolean;
  created_at: string;
}

export interface PremiumUser {
  user_id: string;
  active: boolean;
  expires_at: string | null;
  purchase_platform: 'ios' | 'android' | null;
  last_receipt: string | null;
}

export interface Detection {
  id: number;
  post_id: number;
  image_url: string;
  result: any | null;
  status: 'pending' | 'completed' | 'failed';
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
      const { data, error } = await supabase
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
          
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert(defaultProfile)
            .select()
            .single();
            
          if (insertError) {
            console.error('Error creating default profile:', insertError);
            throw insertError;
          }
          
          return newProfile as Profile;
        }
        
        throw error;
      }
      
      return data as Profile;
    } catch (error) {
      console.error('Error in getProfile:', error);
      throw error;
    }
  }

  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data as Profile;
  }

  async uploadAvatar(userId: string, uri: string) {
    const fileName = `${userId}/${Date.now()}.jpg`;
    
    // Convert uri to blob
    const response = await fetch(uri);
    const blob = await response.blob();
    
    const { data, error } = await supabase
      .storage
      .from('avatars')
      .upload(fileName, blob);
    
    if (error) throw error;
    
    // Get public URL
    const { data: publicUrlData } = supabase
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
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');
      
      const { data: friendsData, error: friendsError } = await supabase
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
          const { data, error } = await supabase
            .from('posts')
            .select('*')
            .in('user_id', friendIds)
            .eq('deleted', false)
            .order('created_at', { ascending: false });
          
          if (error) {
            console.error('Error fetching posts without profiles:', error);
            return [] as Post[]; // Return empty array if posts table doesn't exist
          }
          
          // For each post, fetch the profile separately
          const postsWithProfiles = await Promise.all(
            data.map(async (post) => {
              try {
                const profile = await this.getProfile(post.user_id);
                return { ...post, profiles: profile };
              } catch (error) {
                console.error('Error fetching profile for post:', error);
                return post; // Return post without profile if error
              }
            })
          );
          
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
        const { data, error } = await supabase
          .from('posts')
          .select('*, profiles(name, avatar_url)')
          .in('user_id', friendIds)
          .eq('deleted', false)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching posts with profiles join:', error);
          
          // If the join fails, try without it
          const { data: postsData, error: postsError } = await supabase
            .from('posts')
            .select('*')
            .in('user_id', friendIds)
            .eq('deleted', false)
            .order('created_at', { ascending: false });
          
          if (postsError) {
            console.error('Error fetching posts without join:', postsError);
            return [] as Post[];
          }
          
          // For each post, fetch the profile separately
          const postsWithProfiles = await Promise.all(
            postsData.map(async (post) => {
              try {
                const profile = await this.getProfile(post.user_id);
                return { ...post, profiles: profile };
              } catch (error) {
                console.error('Error fetching profile for post:', error);
                return post; // Return post without profile if error
              }
            })
          );
          
          return postsWithProfiles as Post[];
        }
        
        return data as Post[];
      } catch (error) {
        console.error('Error in getPosts:', error);
        return [] as Post[];
      }
    } catch (error) {
      console.error('Error in getPosts:', error);
      return [] as Post[];
    }
  }


async  createPost(imageUri: string, caption: string | null = null) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) throw new Error('User not authenticated');

  const fileName = `${userData.user.id}/${Date.now()}.jpg`;
  console.log('Uploading image:', fileName);
  console.log('Image URI:', imageUri);

  try {
    // Convert the image to an ArrayBuffer
    const arrayBuffer = await this.readFileAsArrayBuffer(imageUri);

    // Upload the ArrayBuffer to Supabase Storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from('posts')
      .upload(fileName, arrayBuffer, {
        contentType: 'image/jpeg',
      });

    if (storageError) throw storageError;

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('posts')
      .getPublicUrl(fileName);

    // Create post entry
    const { data, error } = await supabase
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
    const { data, error } = await supabase.rpc('increment_likes', {
      post_id: postId
    });
    
    if (error) throw error;
    return data;
  }

  async deletePost(postId: number) {
    const { data, error } = await supabase
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
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('friends')
      .select('*, profiles!friends_friend_id_fkey(name, avatar_url)')
      .eq('user_id', userData.user.id)
      .eq('status', 'accepted');
    
    if (error) throw error;
    return data as Friend[];
  }

  async getFriendRequests() {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('friends')
      .select('*, profiles!friends_user_id_fkey(name, avatar_url)')
      .eq('friend_id', userData.user.id)
      .eq('status', 'pending');
    
    if (error) throw error;
    return data as Friend[];
  }

  async sendFriendRequest(friendId: string) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('friends')
      .insert({
        user_id: userData.user.id,
        friend_id: friendId,
        status: 'pending',
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as Friend;
  }

  async acceptFriendRequest(requestId: number) {
    const { data, error } = await supabase
      .from('friends')
      .update({ status: 'accepted' })
      .eq('id', requestId)
      .select()
      .single();
    
    if (error) throw error;
    return data as Friend;
  }

  async rejectFriendRequest(requestId: number) {
    const { data, error } = await supabase
      .from('friends')
      .delete()
      .eq('id', requestId)
      .select()
      .single();
    
    if (error) throw error;
    return data as Friend;
  }

  async removeFriend(friendshipId: number) {
    const { data, error } = await supabase
      .from('friends')
      .delete()
      .eq('id', friendshipId)
      .select()
      .single();
    
    if (error) throw error;
    return data as Friend;
  }

  // Message methods
  async getMessages(userId: string) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userData.user.id},receiver_id.eq.${userData.user.id}`)
      .eq('deleted', false)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Message[];
  }

  async sendMessage(receiverId: string, content: string) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: userData.user.id,
        receiver_id: receiverId,
        content,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as Message;
  }

  async deleteMessage(messageId: number) {
    const { data, error } = await supabase
      .from('messages')
      .update({ deleted: true })
      .eq('id', messageId)
      .select()
      .single();
    
    if (error) throw error;
    return data as Message;
  }

  // Premium user methods
  async checkPremiumStatus() {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('premium_users')
      .select('active, expires_at')
      .eq('user_id', userData.user.id)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
      throw error;
    }
    
    // If no data or expired, user is not premium
    if (!data || (data.expires_at && new Date(data.expires_at) < new Date())) {
      return false;
    }
    
    return data.active;
  }

  // AI detection methods
  async triggerCatDetection(postId: number, imageUrl: string) {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) throw new Error('User not authenticated');
      
      // Create detection entry
      await supabase
        .from('detections')
        .insert({
          post_id: postId,
          image_url: imageUrl,
          status: 'pending',
        });
      
      // In a real app, you would call your Golang backend here
      // For now, we'll simulate a successful detection after 2 seconds
      setTimeout(async () => {
        const detectionResult = {
          cats: [
            {
              box: [100, 100, 200, 200],
              confidence: 0.95
            }
          ]
        };
        
        // Update detection status
        await supabase
          .from('detections')
          .update({
            result: detectionResult,
            status: 'completed',
          })
          .eq('post_id', postId);
        
        // Update post with detection result
        await supabase
          .from('posts')
          .update({
            detection_result: detectionResult,
          })
          .eq('id', postId);
      }, 2000);
      
      return true;
    } catch (error) {
      console.error('Error triggering cat detection:', error);
      return false;
    }
  }

  // Subscription methods
  subscribeToFriendRequests(callback: (payload: any) => void) {
    return supabase
      .channel('friends')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'friends',
          filter: `friend_id=eq.${supabase.auth.getUser().then(({ data }) => data.user?.id)}` 
        }, 
        callback
      )
      .subscribe();
  }

  subscribeToMessages(callback: (payload: any) => void) {
    return supabase
      .channel('messages')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `receiver_id=eq.${supabase.auth.getUser().then(({ data }) => data.user?.id)}` 
        }, 
        callback
      )
      .subscribe();
  }

  subscribeToPostDetections(postId: number, callback: (payload: any) => void) {
    return supabase
      .channel('detections')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'detections',
          filter: `post_id=eq.${postId}` 
        }, 
        callback
      )
      .subscribe();
  }
}

export const supabaseService = new SupabaseService();
