import React, { useRef, useEffect } from 'react';

interface VideoContainerProps {
  stream: MediaStream | null;
  isMuted?: boolean;
  isLocal?: boolean;
}

const VideoContainer: React.FC<VideoContainerProps> = ({
  stream,
  isMuted = false,
  isLocal = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!stream) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg">
        <p className="text-gray-400">No video</p>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-lg ${isLocal ? 'w-1/4 h-1/4' : 'w-full h-full'}`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isMuted}
        className={`w-full h-full object-cover bg-gray-900 ${isLocal ? 'transform scale-x-[-1]' : ''}`}
      />
      {isLocal && (
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 px-2 py-0.5 rounded text-white text-xs">
          You
        </div>
      )}
    </div>
  );
};

export default VideoContainer;