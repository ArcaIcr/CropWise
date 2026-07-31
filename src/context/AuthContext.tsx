import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface ICooperative {
  id: string;
  name: string;
  region: string;
  province: string;
  city: string;
  barangay: string;
  contactPerson: string;
  contactNumber: string;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
}

interface IAuthUser extends User {
  cooperativeId: string;
  role: 'admin' | 'coop_officer' | 'field_technician' | 'viewer' | 'farmer';
  cooperative?: ICooperative;
}

interface IAuthContext {
  user: IAuthUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IAuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      // Check for farmer session first
      const farmerSession = localStorage.getItem('farmer_session');
      if (farmerSession) {
        try {
          const farmerUser = JSON.parse(farmerSession);
          if (farmerUser.id && farmerUser.role === 'farmer') {
            const mockUser = {
              ...farmerUser,
              app_metadata: {},
              aud: '',
              created_at: new Date().toISOString()
            };
            setUser(mockUser);
            setLoading(false);
            return;
          }
        } catch (e) {
          localStorage.removeItem('farmer_session');
        }
      }

      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session?.user) {
        await fetchUserProfile(session.user);
      }
      setLoading(false);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session?.user) {
          await fetchUserProfile(session.user);
        } else {
          // If there is an active local farmer session, do not clear it
          const isFarmer = localStorage.getItem('farmer_session') !== null;
          if (!isFarmer) {
            setUser(null);
          }
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (authUser: User) => {
    try {
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profile) {
        // Fetch cooperative separately to avoid join issues
        let cooperative = null;
        if (profile.cooperative_id) {
          const { data: coop } = await supabase
            .from('cooperatives')
            .select('*')
            .eq('id', profile.cooperative_id)
            .single();
          cooperative = coop;
        }

        const authUserWithProfile: IAuthUser = {
          ...authUser,
          cooperativeId: profile.cooperative_id,
          role: profile.role,
          cooperative: cooperative ?? undefined,
        };
        setUser(authUserWithProfile);
      } else {
        setUser({ ...authUser, cooperativeId: '', role: 'viewer' });
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      setUser({ ...authUser, cooperativeId: '', role: 'viewer' });
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('farmer_session');
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}