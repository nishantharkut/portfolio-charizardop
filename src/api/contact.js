import { sendMail } from './index.js';
import validateContact from './validateContact.js';
import rateLimit from './rateLimit.js';
import runMiddleware from './runMiddleware.js';



export default async function handler(req, res) {
  try {
    // Run rate limiting middleware
    await runMiddleware(req, res, [rateLimit]);
    if (res.headersSent) return;

    // Footer subscription: only email
    if (req.body && req.body.email && !req.body.subject && !req.body.message) {
      const userEmail = req.body.email;
      // Improved email format check
      if (typeof userEmail !== 'string' || !/^\S+@\S+\.\S+$/.test(userEmail) || userEmail.length > 100) {
        return res.status(400).json({ error: 'Invalid email format.' });
      }
      // Send automated mail to user
      const result = await sendMail({
        subject: 'Thanks for Connecting!',
        message: `
          <h2>Welcome!</h2>
          <p>Thank you for sharing your email. If you’re interested in collaborating, have questions, or want to discuss creative tech, just reply to this email!</p>
          <p>Looking forward to connecting,<br/>Nishant</p>
        `,
        from: process.env.EMAIL_USER,
        to: userEmail,
      });
      if (result.success) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(500).json({ success: false, error: 'Failed to send email.' });
      }
    }

    // Contact form: subject, message, from
    await runMiddleware(req, res, [validateContact]);
    if (res.headersSent) return;
    const { subject, message, from } = req.body;
    // Extra validation
    if (
      typeof subject !== 'string' || subject.length < 3 || subject.length > 200 ||
      typeof message !== 'string' || message.length < 10 || message.length > 2000 ||
      typeof from !== 'string' || !/^\S+@\S+\.\S+$/.test(from) || from.length > 100
    ) {
      return res.status(400).json({ error: 'Invalid input.' });
    }
    const result = await sendMail({ subject, message, from });
    if (result.success) {
      res.status(200).json({ success: true });
    } else {
      res.status(500).json({ success: false, error: 'Failed to send message.' });
    }
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
}
