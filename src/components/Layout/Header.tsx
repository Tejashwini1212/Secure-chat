import React from 'react';
import { Lock, User, Moon, Sun, Shield } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import Button from '../UI/Button';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode }) => {
  const { userId, resetIdentity } = useUser();

  return (
    <header className="bg-gray-900 border-b border-gray-800 py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Lock className="text-indigo-500" size={24} />
          <h1 className="text-xl font-bold text-white">SecureChat</h1>
          <div className="hidden sm:flex items-center ml-2">
            <Shield size={14} className="text-teal-500 mr-1" />
            <span className="text-xs text-teal-500">End-to-End Encrypted</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center px-3 py-1 bg-gray-800 rounded-full">
            <User size={14} className="text-gray-400 mr-2" />
            <span className="text-xs text-gray-300 font-mono">{userId.substring(0, 8)}...</span>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleDarkMode}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-full"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={resetIdentity}
          >
            New Identity
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;