import { isRateLimited, validateEmail, sanitizeText } from '../../../lib/api/middleware';
import { sendEmail } from '../../../lib/api/mail';

export async function POST(req) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (isRateLimited(ip, 6, 60 * 1000)) {
      return new Response(JSON.stringify({ error: 'Too many requests' }), { status: 429, headers: { 'content-type': 'application/json' } });
    }
    const { email } = await req.json();
    const validationError = validateEmail(email);
    if (validationError) return new Response(JSON.stringify({ error: validationError }), { status: 400, headers: { 'content-type': 'application/json' } });

    // send thank-you email
    const subject = 'Thanks for Connecting!';
    const text = `Welcome!\n\nThank you for sharing your email. If you’re interested in collaborating, have questions, or want to discuss creative tech, just reply to this email!\n\nLooking forward to connecting,\nNishant Harkut\nhttps://github.com/nishantharkut\nhttps://www.linkedin.com/in/nishant-harkut/`;
    const html = `<p>Welcome!</p><p>Thank you for sharing your email. If you’re interested in collaborating, have questions, or want to discuss creative tech, just reply to this email!</p><p>Looking forward to connecting,<br/>Nishant Harkut<br/><a href="https://github.com/nishantharkut">https://github.com/nishantharkut</a><br/><a href="https://www.linkedin.com/in/nishant-harkut/">https://www.linkedin.com/in/nishant-harkut/</a></p>`;

    // sanitize subject/text
    const result = await sendEmail({ to: sanitizeText(email), subject: sanitizeText(subject), text: sanitizeText(text), html, replyTo: process.env.EMAIL_USER });
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'content-type': 'application/json' } });
  } catch (err) {
    console.error('Subscribe API error', err);
    if (err && (err.code === 'EAUTH' || err.responseCode === 535)) {
      return new Response(JSON.stringify({ error: 'Email service authentication failed' }), { status: 502, headers: { 'content-type': 'application/json' } });
    }
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
}
