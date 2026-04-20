// backend/utils/moderation.js
const User = require('../models/userModel');

const BANNED_WORDS = [
  'spam', 'scam', 'fake', 'abuse', 'offensive', 'hate', 'badword1', 'badword2'
]; // Add more as needed

/**
 * Checks if text contains any banned words.
 * @param {string} text 
 * @returns {boolean}
 */
const hasBannedWords = (text) => {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return BANNED_WORDS.some(word => lowerText.includes(word));
};

/**
 * Handles user moderation logic (warning/blocking).
 * @param {string} userId 
 * @returns {Promise<{warning: boolean, blocked: boolean}>}
 */
const moderateUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return { warning: false, blocked: false };

  user.warningCount += 1;
  
  if (user.warningCount >= 2) {
    user.isBlocked = true;
    await user.save();
    return { warning: false, blocked: true };
  }

  await user.save();
  return { warning: true, blocked: false };
};

module.exports = { hasBannedWords, moderateUser, BANNED_WORDS };
