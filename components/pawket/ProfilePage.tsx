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

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, FlatList } from 'react-native';
import { Avatar } from './Avatar';
import { Button } from './Button';
import { userProfileStats } from './utils';

interface ProfilePageProps {
  // Add any props needed
}

export const ProfilePage: React.FC<ProfilePageProps> = () => {
  // Generate mock photo data for the grid
  const photos = Array.from({ length: 9 }).map((_, i) => ({
    id: i.toString(),
    uri: `https://picsum.photos/id/${242 + i}/300/300`,
  }));

  // Render each photo item
  const renderPhotoItem = ({ item, index }: { item: { id: string, uri: string }, index: number }) => (
    <View style={styles.photoItem}>
      <Image
        source={{ uri: item.uri }}
        style={styles.photo}
        resizeMode="cover"
      />
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.profileSection}>
        <Avatar 
          source="https://i.pravatar.cc/150?img=10" 
          size="large" 
          fallback="R"
          bordered 
        />
        
        <Text style={styles.username}>Robby</Text>
        <Text style={styles.handle}>@robby_designs</Text>

        <View style={styles.statsContainer}>
          {userProfileStats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <Button 
          variant="secondary" 
          fullWidth 
          style={styles.editButton}
        >
          Edit Profile
        </Button>
      </View>

      <View style={styles.photosSection}>
        <Text style={styles.sectionTitle}>Your Photos</Text>
        <FlatList
          data={photos}
          renderItem={renderPhotoItem}
          keyExtractor={item => item.id}
          numColumns={3}
          scrollEnabled={false}
          contentContainerStyle={styles.photosGrid}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  contentContainer: {
    paddingBottom: 80, // Space for bottom navigation
  },
  header: {
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
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
    color: 'white',
    marginTop: 16,
  },
  handle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  editButton: {
    marginTop: 24,
  },
  photosSection: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
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
    backgroundColor: '#374151',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
});
