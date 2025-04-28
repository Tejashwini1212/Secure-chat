import CryptoJS from 'crypto-js';

// Simple encryption using AES
export const encryptMessage = (message: string, key: string): string => {
  return CryptoJS.AES.encrypt(message, key).toString();
};

// Decrypt message
export const decryptMessage = (ciphertext: string, key: string): string => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Generate random encryption key
export const generateKey = (length: number = 32): string => {
  return CryptoJS.lib.WordArray.random(length).toString();
};

// Hash function for anonymizing data
export const hashData = (data: string): string => {
  return CryptoJS.SHA256(data).toString();
};