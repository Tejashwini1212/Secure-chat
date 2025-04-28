import React, { useEffect, useRef } from 'react';
import { Clock, AlertTriangle, Shield } from 'lucide-react';
import { useMessages, Message } from '../../contexts/MessageContext';
import { useUser } from '../../contexts/UserContext';
import MessageItem from './MessageItem';
import Badge from '../UI/Badge';

interface ChatWindowProps {
  onReport: (messageId: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onReport }) => {
  const { messages, markAsRead } = useMessages();
  const { userId } = useUser();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read when they appear in view
  useEffect(() => {
    messages.forEach(message => {
      if (!message.isRead && message.senderId !== userId) {
        markAsRead(message.id);
      }
    });
  }, [messages, markAsRead, userId]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
        <Shield size={48} className="text-gray-700 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Secure, Private Messaging</h3>
        <p className="max-w-md text-sm">
          All messages are end-to-end encrypted and can be set to self-destruct. 
          No data is stored on our servers.
        </p>
        <div className="flex space-x-3 mt-6">
          <Badge variant="info">Zero Storage</Badge>
          <Badge variant="success">End-to-End Encrypted</Badge>
          <Badge variant="warning">Self-Destructing</Badge>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          isMine={message.senderId === userId}
          onReport={() => onReport(message.id)}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow;