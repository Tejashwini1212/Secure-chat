import React, { useState } from 'react';
import { ArrowRight, Plus, Video, MessageSquare } from 'lucide-react';
import { useRoom } from '../contexts/RoomContext';
import Button from '../components/UI/Button';

interface HomePageProps {
  onStartChat: () => void;
  onStartVideoCall: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStartChat, onStartVideoCall }) => {
  const [roomId, setRoomId] = useState('');
  const [joinError, setJoinError] = useState('');
  const { createRoom, joinRoom } = useRoom();

  const handleCreateRoom = () => {
    createRoom();
    onStartChat();
  };
  
  const handleCreateVideoRoom = () => {
    createRoom();
    onStartVideoCall();
  };

  const handleJoinRoom = () => {
    if (!roomId) {
      setJoinError('Please enter a room ID');
      return;
    }
    
    // Basic validation of room ID format
    if (roomId.length < 5) {
      setJoinError('Invalid room ID format');
      return;
    }
    
    joinRoom(roomId);
    onStartChat();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">SecureChat</h1>
            <p className="text-gray-400">
              Anonymous, encrypted, self-destructing communication
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 mb-8">
            <h2 className="text-xl font-semibold mb-4">Start a new conversation</h2>
            
            <div className="space-y-4">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleCreateRoom}
                className="flex items-center justify-center"
              >
                <MessageSquare className="mr-2" size={20} />
                New Chat Room
              </Button>
              
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                onClick={handleCreateVideoRoom}
                className="flex items-center justify-center"
              >
                <Video className="mr-2" size={20} />
                New Video Room
              </Button>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Join an existing room</h2>
            
            <div className="space-y-3">
              <div>
                <label htmlFor="roomId" className="block text-sm font-medium text-gray-300 mb-1">
                  Room ID
                </label>
                <input
                  type="text"
                  id="roomId"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter room ID"
                  value={roomId}
                  onChange={(e) => {
                    setRoomId(e.target.value);
                    setJoinError('');
                  }}
                />
                {joinError && <p className="mt-1 text-sm text-red-500">{joinError}</p>}
              </div>
              
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleJoinRoom}
                className="flex items-center justify-center"
              >
                Join Room
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="border-t border-gray-800 py-6 text-center text-gray-500 text-sm">
        <p>SecureChat • End-to-End Encrypted • No Data Storage</p>
      </footer>
    </div>
  );
};

export default HomePage;