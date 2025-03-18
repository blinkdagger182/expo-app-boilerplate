import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase, supabaseService, Profile } from '@/services/supabase';
import { Session, User } from '@supabase/supabase-js';
import { router } from 'expo-router';

// Define the context type
interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
  refreshProfile: async () => {},
});

// Create the provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    // Get the initial session
    supabaseService.getCurrentSession()
      .then(session => {
        setSession(session);
        if (session?.user) {
          setUser(session.user);
          fetchProfile(session.user.id);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        
        // Handle auth events
        if (event === 'SIGNED_IN') {
          router.replace('/pawket');
        } else if (event === 'SIGNED_OUT') {
          router.replace('/');
        }
      }
    );

    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile
  const fetchProfile = async (userId: string) => {
    try {
      const profile = await supabaseService.getProfile(userId);
      setProfile(profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // Refresh user profile
  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  // Sign up
  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      await supabaseService.signUp(email, password, name);
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      await supabaseService.signInWithEmail(email, password);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await supabaseService.signInWithGoogle();
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    setLoading(true);
    try {
      await supabaseService.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Provide the context value
  const value = {
    session,
    user,
    profile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
