import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { generateAnonymousId } from '../utils/idGenerator';

interface UserContextType {
  userId: string;
  resetIdentity: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    // Generate a new anonymous ID if none exists
    if (!userId) {
      setUserId(generateAnonymousId());
    }
  }, [userId]);

  const resetIdentity = () => {
    setUserId(generateAnonymousId());
  };

  return (
    <UserContext.Provider value={{ userId, resetIdentity }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};