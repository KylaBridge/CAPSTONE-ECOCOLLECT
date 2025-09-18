const nodemailer = require("nodemailer");

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  connectionTimeout: 10000,
  greetingTimeout: 8000,
  socketTimeout: 15000,
  logger: true,
  debug: true,
  tls: {
    rejectUnauthorized: true,
  },
});

async function verifySmtpConnection() {
  try {
    await transporter.verify();
    console.log("[SMTP] Brevo connection OK");
  } catch (err) {
    console.error("[SMTP] Verification failed", {
      code: err.code,
      command: err.command,
      message: err.message,
    });
  }
}

// Wrap in an async IIFE so we can use await.
async function sendEmailBrevoVerify(to, code, attempt = 1) {
  try {
    const info = await transporter.sendMail({
      from: `EcoCollect NU <${process.env.SENDER_EMAIL}>`,
      to,
      subject: "Account Verification",
      text: `This is your verification code ${code}`,
    });
    console.log("[SMTP] Message sent:", info.messageId);
    return true;
  } catch (err) {
    console.error(`[SMTP] Send failed (attempt ${attempt})`, {
      code: err.code,
      command: err.command,
      message: err.message,
    });
    if (
      ["ETIMEDOUT", "ECONNECTION", "ECONNRESET"].includes(err.code) &&
      attempt < 3
    ) {
      await new Promise((r) => setTimeout(r, attempt * 1500));
      return sendEmailBrevoVerify(to, code, attempt + 1);
    }
    throw err;
  }
}

module.exports = { sendEmailBrevoVerify, verifySmtpConnection };
