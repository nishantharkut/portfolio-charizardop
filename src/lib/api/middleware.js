// Shared API utilities: validation and simple rate limiter
const ipStore = new Map();

export function isRateLimited(key, max = 10, windowMs = 60 * 1000) {
  const now = Date.now();
  const entry = ipStore.get(key) || { timestamps: [] };
  // remove old timestamps
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);
  entry.timestamps.push(now);
  ipStore.set(key, entry);
  return entry.timestamps.length > max;
}

export function validateEmail(email) {
  if (!email || typeof email !== 'string') return 'Email is required';
  if (email.length > 200) return 'Email too long';
  if (!/^\S+@\S+\.\S+$/.test(email)) return 'Invalid email format';
  return null;
}

export function validateContact({ subject, message, from }) {
  if (!subject || !message || !from) return 'Missing required fields';
  if (typeof subject !== 'string' || typeof message !== 'string' || typeof from !== 'string') return 'Invalid input types';
  if (subject.length > 200) return 'Subject too long';
  if (message.length > 5000) return 'Message too long';
  const emailErr = validateEmail(from);
  if (emailErr) return emailErr;
  return null;
}

export function sanitizeText(s) {
  if (typeof s !== 'string') return '';
  // very small sanitizer: escape < and > to prevent trivial HTML injection in stored copies
  return s.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
