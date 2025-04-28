import React, { useState } from 'react';
import { Send, Clock, Shield, X } from 'lucide-react';
import { useMessages } from '../../contexts/MessageContext';
import Button from '../UI/Button';
import { containsInappropriateContent } from '../../utils/moderationUtils';

const MessageInput: React.FC = () => {
  const [text, setText] = useState('');
  const [selfDestructTime, setSelfDestructTime] = useState<number | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const { sendMessage } = useMessages();

  const handleSend = () => {
    if (text.trim() === '') return;
    
    // Check for inappropriate content
    if (containsInappropriateContent(text)) {
      setShowWarning(true);
      return;
    }
    
    // Send message with optional self-destruct timer
    sendMessage(text, selfDestructTime || undefined);
    
    // Reset state
    setText('');
    setSelfDestructTime(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Self-destruct options in seconds
  const selfDestructOptions = [5, 10, 30, 60];

  return (
    <div className="border-t border-gray-800 p-4 bg-gray-900">
      {showWarning && (
        <div className="bg-red-900 text-white p-3 mb-3 rounded-md flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle size={16} className="mr-2" />
            <span>This message may contain inappropriate content</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowWarning(false)} 
            className="text-white"
          >
            <X size={16} />
          </Button>
        </div>
      )}
      
      {selfDestructTime && (
        <div className="flex items-center text-amber-400 text-xs mb-2 border border-amber-800 bg-amber-950 rounded p-2">
          <Clock size={14} className="mr-1" />
          <span>Message will self-destruct {selfDestructTime} seconds after being read</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSelfDestructTime(null)} 
            className="ml-auto text-amber-400"
          >
            <X size={14} />
          </Button>
        </div>
      )}
      
      <div className="flex">
        <div className="flex-1 bg-gray-800 rounded-l-md">
          <textarea
            className="w-full p-3 bg-transparent text-white outline-none resize-none"
            placeholder="Type a secure message..."
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="flex">
          <div className="flex flex-col justify-center bg-gray-800 border-l border-gray-700">
            <Button 
              variant="ghost" 
              size="sm" 
              className="px-3 py-3 rounded-none text-gray-400 hover:text-amber-400" 
              onClick={() => setSelfDestructTime(prev => prev === null ? 10 : null)} 
              title="Set self-destruct timer"
            >
              <Clock size={20} />
            </Button>
          </div>
          <Button
            variant="primary"
            className="rounded-l-none px-4"
            onClick={handleSend}
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
      
      {/* Self-destruct options */}
      {selfDestructTime === null && (
        <div className="flex mt-2 space-x-2 justify-end">
          <span className="text-xs text-gray-500 self-center mr-1">Self-destruct after:</span>
          {selfDestructOptions.map(seconds => (
            <button
              key={seconds}
              className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded"
              onClick={() => setSelfDestructTime(seconds)}
            >
              {seconds}s
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageInput;