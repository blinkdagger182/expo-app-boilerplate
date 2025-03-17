/**
 * Utility functions for the Pawket app
 * 
 * Learning curriculum:
 * - TypeScript type definitions for React Native
 * - Creating reusable utility functions
 * - Working with React Native's styling system
 */

import { Dimensions } from 'react-native';

// Get screen dimensions
export const getScreenDimensions = () => {
  return {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  };
};

// Calculate swipe distance threshold based on screen width
export const getSwipeThreshold = () => {
  const { width } = getScreenDimensions();
  return width * 0.2; // 20% of screen width
};

// Post type definition
export interface Post {
  id: number;
  user: string;
  avatar: string;
  image: string;
  caption: string;
  time: string;
}

// Conversation type definition
export interface Conversation {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: boolean;
}

// Mock data for posts
export const mockPosts: Post[] = [
  {
    id: 1,
    user: "Jessica",
    avatar: "https://i.pravatar.cc/150?img=1",
    image: "https://picsum.photos/id/237/300/300",
    caption: "I swear this wasn't planned! ✨",
    time: "36m",
  },
  {
    id: 2,
    user: "Kyle",
    avatar: "https://i.pravatar.cc/150?img=2",
    image: "https://picsum.photos/id/238/300/300",
    caption: "Perfect day for a hike 🌲",
    time: "1h",
  },
  {
    id: 3,
    user: "Ava",
    avatar: "https://i.pravatar.cc/150?img=3",
    image: "https://picsum.photos/id/239/300/300",
    caption: "Coffee break ☕",
    time: "2h",
  },
  {
    id: 4,
    user: "Irfan",
    avatar: "https://i.pravatar.cc/150?img=4",
    image: "https://picsum.photos/id/240/300/300",
    caption: "Homemade dinner",
    time: "4h",
  },
  {
    id: 5,
    user: "Britney",
    avatar: "https://i.pravatar.cc/150?img=5",
    image: "https://picsum.photos/id/241/300/300",
    caption: "Best pizza in town!",
    time: "5h",
  },
];

// Mock data for conversations
export const mockConversations: Conversation[] = [
  {
    id: 1,
    name: "Jessica",
    avatar: "https://i.pravatar.cc/150?img=1",
    lastMessage: "See you tomorrow!",
    time: "2m",
    unread: true,
  },
  {
    id: 2,
    name: "Kyle",
    avatar: "https://i.pravatar.cc/150?img=2",
    lastMessage: "Thanks for the photos!",
    time: "1h",
    unread: false,
  },
  {
    id: 3,
    name: "Ava",
    avatar: "https://i.pravatar.cc/150?img=3",
    lastMessage: "Let's meet up this weekend",
    time: "3h",
    unread: false,
  },
  {
    id: 4,
    name: "Britney",
    avatar: "https://i.pravatar.cc/150?img=4",
    lastMessage: "Did you see that?",
    time: "5h",
    unread: false,
  },
  {
    id: 5,
    name: "Sabrina",
    avatar: "https://i.pravatar.cc/150?img=5",
    lastMessage: "I'll send you the details",
    time: "1d",
    unread: false,
  },
];

// User profile stats
export const userProfileStats = [
  { label: "Posts", value: "24" },
  { label: "Friends", value: "142" },
  { label: "Likes", value: "987" },
];
