import React, { createContext, useContext, useState, ReactNode } from 'react';
import { generateRoomId } from '../utils/idGenerator';

interface RoomContextType {
  currentRoom: string | null;
  createRoom: () => string;
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);

  const createRoom = () => {
    const newRoomId = generateRoomId();
    setCurrentRoom(newRoomId);
    return newRoomId;
  };

  const joinRoom = (roomId: string) => {
    setCurrentRoom(roomId);
  };

  const leaveRoom = () => {
    setCurrentRoom(null);
  };

  return (
    <RoomContext.Provider value={{ currentRoom, createRoom, joinRoom, leaveRoom }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = (): RoomContextType => {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
};