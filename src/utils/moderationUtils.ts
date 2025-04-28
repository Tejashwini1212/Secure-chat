// Basic moderation tools

// List of common inappropriate words to filter
const inappropriateWords = [
  'bad1', 'bad2', 'bad3', 'bad4', 'bad5'
  // In a real application, this would be a comprehensive list
];

// Check if a message contains inappropriate content
export const containsInappropriateContent = (text: string): boolean => {
  const lowercaseText = text.toLowerCase();
  
  return inappropriateWords.some(word => 
    lowercaseText.includes(word.toLowerCase())
  );
};

// Filter inappropriate content
export const filterMessage = (text: string): string => {
  let filteredText = text;
  
  inappropriateWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    filteredText = filteredText.replace(regex, '*'.repeat(word.length));
  });
  
  return filteredText;
};

// Simple spam detection based on repetition
export const isSpam = (messages: string[], timeWindow: number = 10000): boolean => {
  const recentMessages = messages.filter(
    msg => Date.now() - parseInt(msg.split('|')[0]) < timeWindow
  );
  
  // If more than 5 messages in the last 10 seconds, it's considered spam
  return recentMessages.length > 5;
};

// Report content
export const reportContent = (contentId: string, reason: string): void => {
  // In a real application, this would send a report to the server
  console.log(`Reported content ${contentId} for reason: ${reason}`);
};