// Secure middleware for validating and sanitizing contact form input
module.exports = function validateContact(req, res, next) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { subject, message, from } = req.body || {};
  if (!subject || !message || !from) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  // Basic sanitization
  if (typeof subject !== 'string' || typeof message !== 'string' || typeof from !== 'string') {
    return res.status(400).json({ error: 'Invalid input type' });
  }
  if (subject.length > 200 || message.length > 2000 || from.length > 100) {
    return res.status(400).json({ error: 'Input too long' });
  }
  // Simple email format check
  if (!/^\S+@\S+\.\S+$/.test(from)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  next();
};
