// Generate a random anonymous ID for users
export const generateAnonymousId = (): string => {
  const randomId = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15);
  return randomId;
};

// Generate a random room ID
export const generateRoomId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Generate a unique message ID
export const generateMessageId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
};