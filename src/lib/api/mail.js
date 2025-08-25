import nodemailer from 'nodemailer';

let transporter;

export function getTransporter() {
  if (transporter) return transporter;
  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_PASS = process.env.EMAIL_PASS;
  const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
  const SMTP_PORT = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465;
  const SMTP_SECURE = typeof process.env.SMTP_SECURE !== 'undefined' ? process.env.SMTP_SECURE === 'true' : SMTP_PORT === 465;
  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error('Email credentials are not configured');
  }
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });
  return transporter;
}

export async function sendEmail({ to, subject, text, html, replyTo }) {
  const t = getTransporter();
  const mail = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };
  if (replyTo) mail.replyTo = replyTo;
  return t.sendMail(mail);
}
