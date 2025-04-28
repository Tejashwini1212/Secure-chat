# SecureChat - Secure Anonymous Communication

A modern, secure messaging application built with React that provides end-to-end encrypted chat and video calls with self-destructing messages.

## Features

- 🔒 End-to-end encryption for all messages
- 🎥 Secure video calls
- 💥 Self-destructing messages
- 🕶️ Anonymous communication
- 🌓 Dark/Light mode
- 📱 Responsive design
- 🛡️ Content moderation
- 🔗 Shareable room links

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- WebRTC for video calls
- CryptoJS for encryption
- Lucide React for icons

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Security Features

- End-to-end encryption using AES
- No data storage - messages exist only in memory
- Self-destructing messages with customizable timers
- Anonymous user identities
- Secure WebRTC video connections

## Usage

### Chat

1. Create a new chat room or join an existing one
2. Share the room ID with your conversation partner
3. Send encrypted messages
4. Set self-destruct timers for sensitive messages

### Video Calls

1. Create a new video room
2. Share the room link
3. Grant camera/microphone permissions
4. Enjoy secure video communication
5.NO required to log in

SO, how does this work? Go ahead,
For Chat:

First user: Click "New Chat Room" on the homepage
Copy the Room ID that appears at the top
Share this Room ID with the second user
Second user: Click "Join an existing room" and paste the Room ID
For Video Call:

First user: Click "New Video Room" on the homepage
Copy the Video Room ID that appears at the top
Share this Room ID with the second user
Second user: Click "Join an existing room" and paste the Room ID
Both users will need to grant camera/microphone permissions when prompted
If you're testing locally, you can open the app in two different browser windows to simulate two users.

Note: The video call feature requires:

A working camera and microphone
HTTPS in production (for security reasons)
Both users to be online and in the same room
Browser permissions for camera/microphone access

Thanks:)




