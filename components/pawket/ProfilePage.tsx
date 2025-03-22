/**
 * ProfilePage component for the Pawket app
 * 
 * Learning curriculum:
 * - Creating screen components in React Native
 * - Working with layout and styling in React Native
 * - Implementing user profile UI patterns
 * - Using FlatList for grid layouts
 * - Working with mock data
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Avatar } from './Avatar';
import { Button } from './Button';
import { Ionicons } from '@expo/vector-icons';
import { supabaseService } from '@/services/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ProfilePageProps {
  // Add any props needed
}

interface Post {
  id: number;
  user_id: string;
  image_url: string;
}

interface Friend {
  id: number;
  user_id: string;
  friend_id: string;
}

export const ProfilePage: React.FC<ProfilePageProps> = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState({
    posts: 0,
    friends: 0,
    likes: 0
  });

  useEffect(() => {
    fetchUserProfile();
    fetchUserPosts();
    fetchUserStats();
  }, []);

  // Fetch user profile from Supabase
  const fetchUserProfile = async () => {
    try {
      if (!user) return;
      const userData = await supabaseService.getProfile(user.id);
      setProfile(userData);
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile');
    }
  };

  // Fetch user posts from Supabase
  const fetchUserPosts = async () => {
    try {
      if (!user) return;
      setLoading(true);
      const data = await supabaseService.getPosts();
      // Filter posts to only show the current user's posts
      const userPosts = data.filter((post: Post) => post.user_id === user.id);
      setPosts(userPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      Alert.alert('Error', 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user stats from Supabase
  const fetchUserStats = async () => {
    try {
      if (!user) return;
      // Get post count from filtered posts
      const data = await supabaseService.getPosts();
      const userPosts = data.filter((post: Post) => post.user_id === user.id);
      
      // Get friends count
      const friends = await supabaseService.getFriends();
      const userFriends = friends.filter((friend: Friend) => 
        friend.user_id === user.id || friend.friend_id === user.id
      );
      
      // Set stats
      setStats({
        posts: userPosts.length,
        friends: userFriends.length,
        likes: 0 // This would need a separate query
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Render each photo item
  const renderPhotoItem = ({ item }: { item: Post }) => (
    <TouchableOpacity style={styles.photoItem}>
      <Image
        source={{ uri: item.image_url }}
        style={styles.photo}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  if (loading && !profile) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={24} color="#333333" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileSection}>
          <Avatar 
            source={profile?.avatar_url || undefined} 
            size={80} 
            fallback={profile?.name?.charAt(0) || "U"}
            bordered 
          />
          <Text style={styles.username}>{profile?.name || 'User'}</Text>
          <Text style={styles.handle}>@{profile?.username || 'username'}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.posts}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.friends}</Text>
              <Text style={styles.statLabel}>Friends</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.likes}</Text>
              <Text style={styles.statLabel}>Likes</Text>
            </View>
          </View>
          
          <Button 
            variant="outline"
            style={styles.editButton}
          >
            Edit Profile
          </Button>
        </View>
        
        <View style={styles.photosSection}>
          <Text style={styles.sectionTitle}>Photos</Text>
          
          {loading ? (
            <ActivityIndicator size="small" color="#3B82F6" style={styles.loadingIndicator} />
          ) : posts.length === 0 ? (
            <Text style={styles.emptyText}>No photos yet</Text>
          ) : (
            <FlatList
              data={posts}
              renderItem={renderPhotoItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              scrollEnabled={false}
              contentContainerStyle={styles.photosGrid}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    paddingBottom: 80, // Space for bottom navigation
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 16,
  },
  handle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 24,
    paddingHorizontal: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  editButton: {
    marginTop: 24,
    borderColor: '#3B82F6',
  },
  photosSection: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  photosGrid: {
    gap: 8,
  },
  photoItem: {
    flex: 1,
    aspectRatio: 1,
    margin: 4,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#EEEEEE',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  loadingIndicator: {
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666666',
    marginTop: 20,
  },
});
