import React, { useState } from 'react';
import { ArrowLeft, Copy, Flag } from 'lucide-react';
import { useRoom } from '../contexts/RoomContext';
import Button from '../components/UI/Button';
import ChatWindow from '../components/Chat/ChatWindow';
import MessageInput from '../components/Chat/MessageInput';
import ReportModal from '../components/Moderation/ReportModal';
import { reportContent } from '../utils/moderationUtils';

interface ChatPageProps {
  onBack: () => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ onBack }) => {
  const { currentRoom, leaveRoom } = useRoom();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportedMessageId, setReportedMessageId] = useState<string | null>(null);
  const [showCopied, setShowCopied] = useState(false);
  
  const handleBack = () => {
    leaveRoom();
    onBack();
  };
  
  const handleReport = (messageId: string) => {
    setReportedMessageId(messageId);
    setIsReportModalOpen(true);
  };
  
  const handleSubmitReport = (reason: string) => {
    if (reportedMessageId) {
      reportContent(reportedMessageId, reason);
    }
    setIsReportModalOpen(false);
    setReportedMessageId(null);
  };
  
  const copyRoomLink = () => {
    if (currentRoom) {
      // In a real implementation, this would create a shareable link
      const shareableLink = `securechat.app/join/${currentRoom}`;
      navigator.clipboard.writeText(shareableLink)
        .then(() => {
          setShowCopied(true);
          setTimeout(() => setShowCopied(false), 2000);
        })
        .catch(err => console.error('Failed to copy:', err));
    }
  };

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
                Room: {currentRoom}
              </span>
              <button 
                onClick={copyRoomLink}
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
      
      <div className="flex-1 overflow-hidden flex flex-col">
        <ChatWindow onReport={handleReport} />
        <MessageInput />
      </div>
      
      <ReportModal 
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleSubmitReport}
      />
    </div>
  );
};

export default ChatPage;