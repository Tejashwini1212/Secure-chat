import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { generateMessageId } from '../utils/idGenerator';
import { encryptMessage, decryptMessage, generateKey } from '../utils/encryption';
import { useRoom } from './RoomContext';
import { useUser } from './UserContext';

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  selfDestruct?: {
    duration: number;
    readAt?: number;
  };
  isRead: boolean;
  encrypted: boolean;
}

interface MessageContextType {
  messages: Message[];
  sendMessage: (text: string, selfDestructDuration?: number) => void;
  markAsRead: (messageId: string) => void;
  clearMessages: () => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [encryptionKey, setEncryptionKey] = useState<string>('');
  const { currentRoom } = useRoom();
  const { userId } = useUser();

  // Generate new encryption key when room changes
  useEffect(() => {
    if (currentRoom) {
      setEncryptionKey(generateKey());
      setMessages([]);
    }
  }, [currentRoom]);

  // Check for messages that need to self-destruct
  useEffect(() => {
    const checkSelfDestructMessages = () => {
      setMessages(prevMessages => 
        prevMessages.filter(message => {
          if (!message.selfDestruct || !message.isRead) return true;
          
          const expirationTime = message.selfDestruct.readAt! + message.selfDestruct.duration;
          return Date.now() < expirationTime;
        })
      );
    };

    const interval = setInterval(checkSelfDestructMessages, 1000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = (text: string, selfDestructDuration?: number) => {
    if (!currentRoom) return;

    const encryptedText = encryptMessage(text, encryptionKey);
    
    const newMessage: Message = {
      id: generateMessageId(),
      senderId: userId,
      text: encryptedText,
      timestamp: Date.now(),
      isRead: false,
      encrypted: true,
      ...(selfDestructDuration ? { 
        selfDestruct: { 
          duration: selfDestructDuration * 1000 
        } 
      } : {})
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  const markAsRead = (messageId: string) => {
    setMessages(prevMessages => 
      prevMessages.map(message => {
        if (message.id === messageId && !message.isRead) {
          const updatedMessage = { 
            ...message, 
            isRead: true,
            text: message.encrypted ? decryptMessage(message.text, encryptionKey) : message.text,
            encrypted: false
          };
          
          if (message.selfDestruct && !message.selfDestruct.readAt) {
            updatedMessage.selfDestruct = {
              ...message.selfDestruct,
              readAt: Date.now()
            };
          }
          
          return updatedMessage;
        }
        return message;
      })
    );
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <MessageContext.Provider value={{ messages, sendMessage, markAsRead, clearMessages }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = (): MessageContextType => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};