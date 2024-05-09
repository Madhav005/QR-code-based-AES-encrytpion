const crypto = require('crypto');

// Generate a random key for encryption
const generateKey = () => {
  return crypto.randomBytes(32); // 32 bytes = 256 bits
};
// Decrypt text using Fernet AES algorithm
const decryptText = (encryptedText, key) => {
  // Extract IV from the encrypted text
  const iv = Buffer.from(encryptedText.slice(0, 32), 'hex'); // IV size is 16 bytes (32 hex characters)

  // Extract the encrypted text
  const encrypted = encryptedText.slice(32);

  // Create a decipher using AES-256-CBC algorithm
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

  // Decrypt the text
  let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');

  return decrypted;
};

// Example usage
//const key = generateKey();
//const textToEncrypt = 'Hello, World!';
//const encryptedText = encryptText(textToEncrypt, key);
//console.log('Encrypted:', encryptedText);

//const decryptedText = decryptText(encryptedText, key);
//console.log('Decrypted:', decryptedText);

