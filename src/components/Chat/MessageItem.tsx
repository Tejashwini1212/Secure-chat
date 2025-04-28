import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, Shield, Check } from 'lucide-react';
import { Message } from '../../contexts/MessageContext';
import Button from '../UI/Button';

interface MessageItemProps {
  message: Message;
  isMine: boolean;
  onReport: () => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isMine, onReport }) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isDestroying, setIsDestroying] = useState(false);
  
  // Calculate time left for self-destructing messages
  useEffect(() => {
    if (message.selfDestruct && message.selfDestruct.readAt) {
      const expirationTime = message.selfDestruct.readAt + message.selfDestruct.duration;
      const updateTimeLeft = () => {
        const remaining = Math.max(0, expirationTime - Date.now());
        setTimeLeft(remaining);
        
        // Add animation class when 3 seconds are left
        if (remaining < 3000 && remaining > 0) {
          setIsDestroying(true);
        }
      };
      
      updateTimeLeft();
      const interval = setInterval(updateTimeLeft, 100);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [message.selfDestruct]);

  const formatTimeLeft = (ms: number): string => {
    if (ms < 1000) return '<1s';
    return `${Math.ceil(ms / 1000)}s`;
  };

  return (
    <div 
      className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-4 relative`}
    >
      <div 
        className={`relative max-w-md px-4 py-2 rounded-lg shadow ${
          isMine 
            ? 'bg-indigo-600 text-white rounded-br-none' 
            : 'bg-gray-800 text-gray-100 rounded-bl-none'
        } ${isDestroying ? 'animate-pulse' : ''}`}
      >
        {message.encrypted && (
          <div className="flex items-center justify-center absolute inset-0 bg-gray-900 bg-opacity-90 rounded-lg z-10">
            <div className="flex items-center text-teal-500 text-sm">
              <Shield size={14} className="mr-1" />
              <span>Encrypted</span>
            </div>
          </div>
        )}
        
        <div className="text-sm relative z-0">
          {message.text}
        </div>
        
        <div className={`flex items-center text-xs mt-1 ${isMine ? 'text-indigo-200' : 'text-gray-400'}`}>
          {message.isRead && isMine && (
            <span className="flex items-center mr-2">
              <Check size={12} className="mr-0.5" />
              Read
            </span>
          )}
          
          {message.selfDestruct && message.selfDestruct.readAt && timeLeft !== null && (
            <span className="flex items-center text-amber-400">
              <Clock size={12} className="mr-0.5" />
              {formatTimeLeft(timeLeft)}
            </span>
          )}
          
          {!isMine && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onReport} 
              className="ml-2 p-0 text-xs text-gray-500 hover:text-red-400"
            >
              <AlertTriangle size={12} className="mr-0.5" />
              Report
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;