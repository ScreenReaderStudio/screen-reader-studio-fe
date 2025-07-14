'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  userId: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('http://localhost:8080/api/users/me', {
          credentials: 'include',
        });

        console.log('AuthContext: API response status', response.status);

        if (response.ok) {
          const userData = await response.json();
          console.log('AuthContext: User data received', userData);
          setUser(userData);
        } else {
          console.log('AuthContext: User not logged in or session expired');
          setUser(null);
        }
      } catch (error) {
        console.error('AuthContext: Failed to fetch user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
        console.log('AuthContext: isLoading set to false');
        console.log('AuthContext: Final isLoggedIn state', !isLoading && !!user);
      }
    }

    fetchUser();
  }, []);

  const value = {
    user,
    isLoggedIn: !isLoading && !!user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
