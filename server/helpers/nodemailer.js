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
});

// Wrap in an async IIFE so we can use await.
const sendEmailBrevoVerify = async (to, code) => {
  const info = await transporter.sendMail({
    from: `EcoCollect NU <${process.env.SENDER_EMAIL}>`,
    to,
    subject: "Account Verification",
    text: `This is your verification code ${code}`, // plain‑text body
  });

  console.log("Message sent:", info.messageId);
};

module.exports = { sendEmailBrevoVerify };
