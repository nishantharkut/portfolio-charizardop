import { sendMail } from './index.js';
import validateContact from './validateContact.js';

export default async function handler(req, res) {
  // Use secure middleware
  validateContact(req, res, async () => {
    const { subject, message, from } = req.body;
    const result = await sendMail({ subject, message, from });
    if (result.success) {
      res.status(200).json({ success: true });
    } else {
      res.status(500).json({ success: false, error: 'Failed to send message' });
    }
  });
}
