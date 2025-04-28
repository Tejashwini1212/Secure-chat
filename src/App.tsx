import React, { useState } from 'react';
import { UserProvider } from './contexts/UserContext';
import { RoomProvider } from './contexts/RoomContext';
import { MessageProvider } from './contexts/MessageContext';
import Header from './components/Layout/Header';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import VideoCallPage from './pages/VideoCallPage';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [currentPage, setCurrentPage] = useState<'home' | 'chat' | 'videoCall'>('home');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const goToHome = () => {
    setCurrentPage('home');
  };

  const goToChat = () => {
    setCurrentPage('chat');
  };

  const goToVideoCall = () => {
    setCurrentPage('videoCall');
  };

  return (
    <UserProvider>
      <RoomProvider>
        <MessageProvider>
          <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            {currentPage !== 'home' && (
              <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            )}
            
            {currentPage === 'home' && (
              <HomePage onStartChat={goToChat} onStartVideoCall={goToVideoCall} />
            )}
            
            {currentPage === 'chat' && (
              <ChatPage onBack={goToHome} />
            )}
            
            {currentPage === 'videoCall' && (
              <VideoCallPage onBack={goToHome} />
            )}
          </div>
        </MessageProvider>
      </RoomProvider>
    </UserProvider>
  );
}

export default App;