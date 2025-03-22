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

import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Avatar } from './Avatar';
import { Input } from './Input';
import { Button } from './Button';
import { Ionicons } from '@expo/vector-icons';
import { supabaseService, Message } from '@/services/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RealtimeChannel } from '@supabase/supabase-js';

interface MessagesPageProps {
  // Add any props needed
}

interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

export const MessagesPage: React.FC<MessagesPageProps> = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesSubscription = useRef<RealtimeChannel | null>(null);
  
  useEffect(() => {
    fetchConversations();
    
    // Set up real-time subscription for new messages
    const setupMessagesSubscription = async () => {
      if (messagesSubscription.current) {
        messagesSubscription.current.unsubscribe();
      }
      
      messagesSubscription.current = await supabaseService.subscribeToMessages((payload) => {
        // When a new message is received, update the conversations list
        fetchConversations();
        
        // If we're in a conversation with the sender, add the message to the current list
        if (selectedConversation === payload.new.sender_id) {
          setMessages(prev => [...prev, payload.new]);
        }
      });
    };
    
    setupMessagesSubscription();
    
    // Cleanup subscription on unmount
    return () => {
      if (messagesSubscription.current) {
        messagesSubscription.current.unsubscribe();
      }
    };
  }, [selectedConversation]);
  
  // Fetch conversations (people the user has messaged or received messages from)
  const fetchConversations = async () => {
    try {
      setLoading(true);
      if (!user) return;
      
      // Get all messages sent by or to the current user
      const allMessages = await supabaseService.getMessages(user.id, 100, 0);
      
      // Create a map of unique conversation partners
      const conversationMap = new Map<string, Conversation>();
      
      // Process all messages to create conversation entries
      for (const message of allMessages) {
        const isUserSender = message.sender_id === user.id;
        const partnerId = isUserSender ? message.receiver_id : message.sender_id;
        
        // Skip if we already have a more recent message for this conversation
        if (conversationMap.has(partnerId)) {
          const existing = conversationMap.get(partnerId)!;
          const existingDate = new Date(existing.timestamp);
          const messageDate = new Date(message.created_at);
          
          if (messageDate <= existingDate) continue;
        }
        
        // Get the profile of the conversation partner
        const partnerProfile = await supabaseService.getProfile(partnerId);
        
        // Create a conversation entry
        conversationMap.set(partnerId, {
          id: partnerId,
          name: partnerProfile?.name || 'Unknown User',
          avatar: partnerProfile?.avatar_url || undefined,
          lastMessage: message.content,
          timestamp: message.created_at,
          unread: !isUserSender && message.read === false
        });
      }
      
      // Convert map to array and sort by timestamp (newest first)
      const conversationList = Array.from(conversationMap.values())
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      setConversations(conversationList);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      Alert.alert('Error', 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };
  
  // Load messages for a specific conversation
  const loadConversationMessages = async (partnerId: string) => {
    try {
      if (!user) return;
      
      setSelectedConversation(partnerId);
      
      // Get messages between the current user and the selected partner
      const allMessages = await supabaseService.getMessages(user.id, 50, 0);
      
      // Filter messages to only include those between the current user and the partner
      const conversationMessages = allMessages.filter(
        (msg: Message) => (msg.sender_id === user.id && msg.receiver_id === partnerId) || 
               (msg.sender_id === partnerId && msg.receiver_id === user.id)
      );
      
      // Sort messages by timestamp (oldest first)
      const sortedMessages = conversationMessages.sort(
        (a: Message, b: Message) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      
      setMessages(sortedMessages);
      
      // Mark unread messages as read
      // This would require a new method in the supabaseService
    } catch (error) {
      console.error('Error loading conversation messages:', error);
      Alert.alert('Error', 'Failed to load messages');
    }
  };
  
  // Send a new message
  const sendMessage = async () => {
    try {
      if (!user || !selectedConversation || !newMessage.trim()) return;
      
      setSending(true);
      
      // Send the message
      await supabaseService.sendMessage(selectedConversation, newMessage.trim());
      
      // Clear the input
      setNewMessage('');
      
      // Refresh the conversation
      loadConversationMessages(selectedConversation);
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    } finally {
      setSending(false);
    }
  };
  
  // Filter conversations based on search query
  const filteredConversations = searchQuery
    ? conversations.filter(convo => 
        convo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        convo.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations;

  // Render each conversation item
  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity 
      style={[
        styles.conversationItem,
        item.unread && styles.unreadConversation
      ]}
      onPress={() => loadConversationMessages(item.id)}
    >
      <Avatar
        source={item.avatar ? { uri: item.avatar } : undefined}
        size={48}
        fallback={item.name.charAt(0)}
      />
      
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationName}>{item.name}</Text>
          <Text style={styles.conversationTime}>
            {new Date(item.timestamp).toLocaleDateString()}
          </Text>
        </View>
        
        <View style={styles.conversationFooter}>
          <Text 
            style={[
              styles.conversationMessage,
              item.unread && styles.unreadMessage
            ]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
          
          {item.unread && <View style={styles.unreadIndicator} />}
        </View>
      </View>
    </TouchableOpacity>
  );
  
  // Render each message in the conversation
  const renderMessageItem = ({ item }: { item: Message }) => {
    const isUserMessage = item.sender_id === user?.id;
    
    return (
      <View style={[
        styles.messageContainer,
        isUserMessage ? styles.userMessageContainer : styles.partnerMessageContainer
      ]}>
        <View style={[
          styles.messageBubble,
          isUserMessage ? styles.userMessageBubble : styles.partnerMessageBubble
        ]}>
          <Text style={styles.messageText}>{item.content}</Text>
        </View>
        <Text style={styles.messageTime}>
          {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {selectedConversation ? (
        // Conversation view
        <KeyboardAvoidingView 
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <View style={styles.messageHeaderContainer}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setSelectedConversation(null)}
            >
              <Ionicons name="arrow-back" size={24} color="#333333" />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>
              {conversations.find(c => c.id === selectedConversation)?.name || 'Chat'}
            </Text>
          </View>
          
          <FlatList
            data={messages}
            renderItem={renderMessageItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.messagesList}
            inverted={false}
          />
          
          <View style={styles.messageInputContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="Type a message..."
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
            />
            
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={sendMessage}
              disabled={sending || !newMessage.trim()}
            >
              {sending ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="send" size={20} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      ) : (
        // Conversations list view
        <>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Messages</Text>
          </View>
          
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Ionicons 
                name="search" 
                size={18} 
                color="#666666" 
                style={styles.searchIcon} 
              />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
                inputStyle={styles.searchInputText}
              />
            </View>
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3B82F6" />
            </View>
          ) : filteredConversations.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No conversations yet</Text>
              <Text style={styles.emptySubtext}>
                Messages from your friends will appear here
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredConversations}
              renderItem={renderConversationItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.conversationsList}
              showsVerticalScrollIndicator={false}
            />
          )}
          
          <View style={styles.newMessageButtonContainer}>
            <Button
              variant="primary"
              size="icon"
              style={styles.newMessageButton}
            >
              <Ionicons name="create" size={24} color="white" />
            </Button>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
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
    backgroundColor: '#EEEEEE',
    borderColor: '#DDDDDD',
  },
  searchInputText: {
    paddingLeft: 40,
    color: '#333333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  conversationsList: {
    paddingBottom: 80, // Space for bottom navigation
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  unreadConversation: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
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
  conversationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  conversationTime: {
    fontSize: 12,
    color: '#666666',
  },
  conversationMessage: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  unreadMessage: {
    color: '#333333',
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
  messageHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    marginRight: 16,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  partnerMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
  },
  userMessageBubble: {
    backgroundColor: '#3B82F6',
    borderBottomRightRadius: 4,
  },
  partnerMessageBubble: {
    backgroundColor: '#EEEEEE',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  messageTime: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#EEEEEE',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    color: '#333333',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
