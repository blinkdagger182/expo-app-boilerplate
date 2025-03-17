/**
 * MessagesPage component for the Pawket app
 * 
 * Learning curriculum:
 * - Creating a messaging UI in React Native
 * - Working with lists and FlatList in React Native
 * - Implementing search functionality
 * - Styling list items with conditional formatting
 * - Creating reusable UI components
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity 
} from 'react-native';
import { Avatar } from './Avatar';
import { Input } from './Input';
import { Button } from './Button';
import { Conversation, mockConversations } from './utils';
import { Ionicons } from '@expo/vector-icons';

interface MessagesPageProps {
  // Add any props needed
}

export const MessagesPage: React.FC<MessagesPageProps> = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter conversations based on search query
  const filteredConversations = searchQuery
    ? mockConversations.filter(convo => 
        convo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        convo.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockConversations;

  // Render each conversation item
  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity 
      style={[
        styles.conversationItem,
        item.unread && styles.unreadConversation
      ]}
    >
      <Avatar
        source={item.avatar}
        size="medium"
        fallback={item.name.charAt(0)}
      />
      
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationName}>{item.name}</Text>
          <Text style={styles.conversationTime}>{item.time}</Text>
        </View>
        
        <Text 
          style={[
            styles.conversationMessage,
            item.unread && styles.unreadMessage
          ]}
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
      </View>
      
      {item.unread && <View style={styles.unreadIndicator} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={18} color="#9CA3AF" style={styles.searchIcon} />
          <Input
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search messages..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            inputStyle={styles.searchInputText}
            variant="filled"
          />
        </View>
      </View>
      
      <FlatList
        data={filteredConversations}
        renderItem={renderConversationItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.conversationsList}
        showsVerticalScrollIndicator={false}
      />
      
      <View style={styles.newMessageButtonContainer}>
        <Button
          variant="primary"
          size="icon"
          style={styles.newMessageButton}
        >
          <Ionicons name="create" size={24} color="white" />
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  searchContainer: {
    padding: 16,
  },
  searchInputContainer: {
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    top: 12,
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: '#1F2937',
    borderColor: '#374151',
  },
  searchInputText: {
    paddingLeft: 40,
    color: 'white',
  },
  conversationsList: {
    paddingBottom: 80, // Space for bottom navigation
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  unreadConversation: {
    backgroundColor: 'rgba(55, 65, 81, 0.3)',
  },
  conversationContent: {
    flex: 1,
    marginLeft: 12,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  conversationTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  conversationMessage: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  unreadMessage: {
    color: 'white',
    fontWeight: '500',
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginLeft: 8,
  },
  newMessageButtonContainer: {
    position: 'absolute',
    bottom: 80, // Above bottom navigation
    right: 16,
  },
  newMessageButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
  },
});
