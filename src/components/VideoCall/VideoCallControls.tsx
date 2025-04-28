import React, { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Users } from 'lucide-react';
import Button from '../UI/Button';

interface VideoCallControlsProps {
  onToggleAudio: () => boolean;
  onToggleVideo: () => boolean;
  onEndCall: () => void;
  onShareLink: () => void;
}

const VideoCallControls: React.FC<VideoCallControlsProps> = ({
  onToggleAudio,
  onToggleVideo,
  onEndCall,
  onShareLink
}) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  const handleToggleAudio = () => {
    const newState = onToggleAudio();
    setIsAudioEnabled(newState);
  };

  const handleToggleVideo = () => {
    const newState = onToggleVideo();
    setIsVideoEnabled(newState);
  };

  return (
    <div className="bg-gray-900 border-t border-gray-800 p-4 flex justify-center items-center space-x-4">
      <Button
        variant={isAudioEnabled ? 'ghost' : 'secondary'}
        className="p-3 rounded-full"
        onClick={handleToggleAudio}
        aria-label={isAudioEnabled ? 'Mute microphone' : 'Unmute microphone'}
        title={isAudioEnabled ? 'Mute microphone' : 'Unmute microphone'}
      >
        {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
      </Button>
      
      <Button
        variant={isVideoEnabled ? 'ghost' : 'secondary'}
        className="p-3 rounded-full"
        onClick={handleToggleVideo}
        aria-label={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
        title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
      >
        {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
      </Button>
      
      <Button
        variant="danger"
        className="p-3 rounded-full"
        onClick={onEndCall}
        aria-label="End call"
        title="End call"
      >
        <PhoneOff size={20} />
      </Button>
      
      <Button
        variant="ghost"
        className="p-3 rounded-full"
        onClick={onShareLink}
        aria-label="Share link"
        title="Share link"
      >
        <Users size={20} />
      </Button>
    </div>
  );
};

export default VideoCallControls;