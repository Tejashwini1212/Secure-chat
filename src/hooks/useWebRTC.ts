import { useState, useEffect, useRef } from 'react';
import { useRoom } from '../contexts/RoomContext';
import { useUser } from '../contexts/UserContext';

interface RTCState {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  connectionEstablished: boolean;
  isCallActive: boolean;
}

export const useWebRTC = () => {
  const [state, setState] = useState<RTCState>({
    localStream: null,
    remoteStream: null,
    connectionEstablished: false,
    isCallActive: false
  });
  
  const [error, setError] = useState<string | null>(null);
  
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const { currentRoom } = useRoom();
  const { userId } = useUser();

  // Initialize media and peer connection
  const initializeMedia = async (video: boolean = true, audio: boolean = true) => {
    try {
      // Request user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video,
        audio
      });
      
      setState(prev => ({ ...prev, localStream: stream }));
      return stream;
    } catch (err) {
      console.error('Error accessing media devices:', err);
      setError('Could not access camera or microphone');
      throw err;
    }
  };

  // Create and initialize the peer connection
  const initializePeerConnection = (stream: MediaStream) => {
    // Configure STUN servers for NAT traversal
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    // Add local stream tracks to peer connection
    stream.getTracks().forEach(track => {
      peerConnection.addTrack(track, stream);
    });

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      setState(prev => ({ 
        ...prev, 
        remoteStream: event.streams[0],
        connectionEstablished: true
      }));
    };

    peerConnectionRef.current = peerConnection;
    return peerConnection;
  };

  // Start a call
  const startCall = async () => {
    try {
      if (!currentRoom) {
        throw new Error('You must be in a room to start a call');
      }

      const stream = await initializeMedia();
      const peerConnection = initializePeerConnection(stream);
      
      // Create and send offer (would send to signaling server in real implementation)
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      
      // In a real implementation, this would send the offer to a signaling server
      console.log('Created offer:', offer);
      
      setState(prev => ({ ...prev, isCallActive: true }));
    } catch (err) {
      console.error('Error starting call:', err);
      setError('Failed to start call');
    }
  };

  // Answer a call
  const answerCall = async (offer: RTCSessionDescriptionInit) => {
    try {
      if (!currentRoom) {
        throw new Error('You must be in a room to answer a call');
      }

      const stream = await initializeMedia();
      const peerConnection = initializePeerConnection(stream);
      
      // Set remote description from offer
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      
      // Create and send answer
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      
      // In a real implementation, this would send the answer to a signaling server
      console.log('Created answer:', answer);
      
      setState(prev => ({ ...prev, isCallActive: true }));
    } catch (err) {
      console.error('Error answering call:', err);
      setError('Failed to answer call');
    }
  };

  // End the call
  const endCall = () => {
    // Stop all tracks in the local stream
    if (state.localStream) {
      state.localStream.getTracks().forEach(track => track.stop());
    }
    
    // Close and clean up the peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    setState({
      localStream: null,
      remoteStream: null,
      connectionEstablished: false,
      isCallActive: false
    });
  };

  // Toggle audio
  const toggleAudio = () => {
    if (state.localStream) {
      const audioTrack = state.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        return audioTrack.enabled;
      }
    }
    return false;
  };

  // Toggle video
  const toggleVideo = () => {
    if (state.localStream) {
      const videoTrack = state.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        return videoTrack.enabled;
      }
    }
    return false;
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (state.localStream) {
        state.localStream.getTracks().forEach(track => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, [state.localStream]);

  return {
    ...state,
    error,
    startCall,
    answerCall,
    endCall,
    toggleAudio,
    toggleVideo
  };
};