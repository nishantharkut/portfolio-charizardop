import nodemailer from 'nodemailer';

// Simple in-memory rate limiter per IP (sliding window)
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 6; // max requests per window
const ipMap = new Map();

function isRateLimited(key) {
  const now = Date.now();
  const entry = ipMap.get(key) || { count: 0, ts: now };
  if (now - entry.ts > RATE_LIMIT_WINDOW_MS) {
    // reset window
    entry.count = 1;
    entry.ts = now;
    ipMap.set(key, entry);
    return false;
  }
  entry.count += 1;
  ipMap.set(key, entry);
  return entry.count > RATE_LIMIT_MAX;
}

function validateInput({ subject, message, from }) {
  if (!subject || !message || !from) return 'Missing required fields';
  if (typeof subject !== 'string' || typeof message !== 'string' || typeof from !== 'string') return 'Invalid input types';
  if (subject.length > 200) return 'Subject too long';
  if (message.length > 5000) return 'Message too long';
  if (from.length > 200) return 'Email too long';
  if (!/^\S+@\S+\.\S+$/.test(from)) return 'Invalid email format';
  return null;
}

export async function POST(req) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (isRateLimited(ip)) {
      return new Response(JSON.stringify({ error: 'Too many requests' }), { status: 429, headers: { 'content-type': 'application/json' } });
    }

    const body = await req.json();
    const { subject, message, from } = body || {};
    const validationError = validateInput({ subject, message, from });
    if (validationError) {
      return new Response(JSON.stringify({ error: validationError }), { status: 400, headers: { 'content-type': 'application/json' } });
    }

    // ensure env vars are present
    const EMAIL_USER = process.env.EMAIL_USER;
    const EMAIL_PASS = process.env.EMAIL_PASS;
    const EMAIL_TO = process.env.EMAIL_TO || process.env.EMAIL_USER;
    if (!EMAIL_USER || !EMAIL_PASS) {
      console.error('Missing EMAIL_USER or EMAIL_PASS env vars');
      return new Response(JSON.stringify({ error: 'Email service not configured' }), { status: 500, headers: { 'content-type': 'application/json' } });
    }

    // Allow custom SMTP settings (useful for providers like SendGrid, Mailgun, etc.)
    const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
    const SMTP_PORT = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465;
    const SMTP_SECURE = typeof process.env.SMTP_SECURE !== 'undefined' ? process.env.SMTP_SECURE === 'true' : SMTP_PORT === 465;

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    // send mail
    const mailOptions = {
      from: `${from} <${EMAIL_USER}>`, // show sender name but route through configured account
      replyTo: from,
      to: EMAIL_TO,
      subject,
      text: message,
      html: `<p>${message.replace(/\n/g, '<br/>')}</p><hr/><p>From: ${from}</p>`,
    };

    try {
      await transporter.sendMail(mailOptions);
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'content-type': 'application/json' } });
    } catch (err) {
      // Nodemailer's Gmail auth failures surface as EAUTH with 535 response
      console.error('Mail send error: code=', err && err.code, 'responseCode=', err && err.responseCode);
      if (err && (err.code === 'EAUTH' || err.responseCode === 535)) {
        // Return a helpful but non-sensitive message to the client
        return new Response(JSON.stringify({ error: 'Email authentication failed. Check EMAIL_USER and EMAIL_PASS (use an app password if using Gmail with 2FA).' }), { status: 502, headers: { 'content-type': 'application/json' } });
      }
      return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 500, headers: { 'content-type': 'application/json' } });
    }
  } catch (err) {
    console.error('Contact API error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
}
