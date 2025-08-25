"use strict";
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendMail({ subject, message, from }) {
  try {
    const info = await transporter.sendMail({
      from: from || process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject,
      text: message,
      html: `<p>${message}</p>`,
    });
    console.log("✅ Message sent: ", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("❌ Error:", error);
    return { success: false, error };
  }
}

module.exports = { sendMail };
  "kanikasin216@gmail.com",
