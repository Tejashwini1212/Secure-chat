import React, { useState } from 'react';
import { ArrowLeft, Copy, AlertTriangle } from 'lucide-react';
import { useRoom } from '../contexts/RoomContext';
import { useWebRTC } from '../hooks/useWebRTC';
import Button from '../components/UI/Button';
import VideoContainer from '../components/VideoCall/VideoContainer';
import VideoCallControls from '../components/VideoCall/VideoCallControls';

interface VideoCallPageProps {
  onBack: () => void;
}

const VideoCallPage: React.FC<VideoCallPageProps> = ({ onBack }) => {
  const { currentRoom, leaveRoom } = useRoom();
  const [showCopied, setShowCopied] = useState(false);
  const { 
    localStream, 
    remoteStream, 
    connectionEstablished,
    isCallActive,
    startCall,
    endCall,
    toggleAudio,
    toggleVideo,
    error
  } = useWebRTC();
  
  const handleBack = () => {
    if (isCallActive) {
      endCall();
    }
    leaveRoom();
    onBack();
  };
  
  const handleShareLink = () => {
    if (currentRoom) {
      // In a real implementation, this would create a shareable link
      const shareableLink = `securechat.app/join/${currentRoom}?video=true`;
      navigator.clipboard.writeText(shareableLink)
        .then(() => {
          setShowCopied(true);
          setTimeout(() => setShowCopied(false), 2000);
        })
        .catch(err => console.error('Failed to copy:', err));
    }
  };
  
  // Initialize call if not active
  React.useEffect(() => {
    if (currentRoom && !isCallActive) {
      startCall();
    }
    
    return () => {
      if (isCallActive) {
        endCall();
      }
    };
  }, [currentRoom]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <div className="border-b border-gray-800 p-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={handleBack} className="p-1">
          <ArrowLeft size={20} />
        </Button>
        
        {currentRoom && (
          <div className="flex items-center space-x-2">
            <div className="px-3 py-1.5 bg-gray-800 rounded-lg flex items-center">
              <span className="text-xs text-gray-300 font-mono mr-2">
                Video Room: {currentRoom}
              </span>
              <button 
                onClick={handleShareLink}
                className="text-gray-400 hover:text-white transition-colors"
                title="Copy room link"
              >
                <Copy size={14} />
              </button>
            </div>
            {showCopied && (
              <span className="text-xs text-teal-400 animate-fade-in-out">
                Copied!
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="flex-1 p-4 overflow-hidden relative">
        {error && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-900 text-white px-4 py-2 rounded-md flex items-center z-20">
            <AlertTriangle size={16} className="mr-2" />
            <span>{error}</span>
          </div>
        )}
        
        {!localStream && !error && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p className="mb-4">Camera access required for video calls</p>
            <Button variant="primary" onClick={startCall}>
              Start Video Call
            </Button>
          </div>
        )}
        
        {localStream && (
          <div className="relative w-full h-full">
            {/* Main video (remote or local) */}
            <div className="w-full h-full rounded-lg overflow-hidden">
              {remoteStream ? (
                <VideoContainer stream={remoteStream} />
              ) : (
                <VideoContainer stream={localStream} isMuted={true} isLocal={true} />
              )}
            </div>
            
            {/* Small self-view if remote stream exists */}
            {remoteStream && (
              <div className="absolute bottom-4 right-4 w-1/4 h-1/4 rounded-lg overflow-hidden border-2 border-gray-800 shadow-lg">
                <VideoContainer stream={localStream} isMuted={true} isLocal={true} />
              </div>
            )}
            
            {/* Connection status */}
            {!connectionEstablished && localStream && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-indigo-900 text-white px-4 py-2 rounded-md">
                Waiting for someone to join...
              </div>
            )}
          </div>
        )}
      </div>
      
      {localStream && (
        <VideoCallControls
          onToggleAudio={toggleAudio}
          onToggleVideo={toggleVideo}
          onEndCall={handleBack}
          onShareLink={handleShareLink}
        />
      )}
    </div>
  );
};

export default VideoCallPage;