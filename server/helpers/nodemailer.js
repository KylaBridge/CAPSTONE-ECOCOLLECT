const nodemailer = require("nodemailer");

// Pull and validate environment variables early for clearer diagnostics.
const {
  SMTP_HOST = "smtp-relay.brevo.com",
  SMTP_PORT = "587",
  SMTP_SECURE = "false",
  SMTP_USER,
  SMTP_PASSWORD,
  SENDER_EMAIL,
  NODE_ENV,
} = process.env;

const missing = [
  ["SMTP_USER", SMTP_USER],
  ["SMTP_PASSWORD", SMTP_PASSWORD],
  ["SENDER_EMAIL", SENDER_EMAIL],
].filter(([, v]) => !v);
if (missing.length) {
  console.error(
    "[Mail] Missing required environment variables:",
    missing.map(([k]) => k).join(", ")
  );
}

// Single cached transporter instance.
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: parseInt(SMTP_PORT, 10),
  secure: SMTP_SECURE === "true", // allow override
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
  // Extra logging outside production to help diagnose issues on deploy.
  logger: NODE_ENV !== "production",
  debug: NODE_ENV !== "production",
});

// Proactive connection / auth verification (async). Will not crash app.
transporter
  .verify()
  .then(() => console.log("[Mail] SMTP transporter verified successfully"))
  .catch((err) =>
    console.error("[Mail] SMTP transporter verification failed:", err.message)
  );

/**
 * Send verification email with 6-digit code.
 * Throws a descriptive error so caller can log context.
 * @param {string} to - Recipient email
 * @param {string} code - 6 digit verification code
 */
const sendEmailBrevoVerify = async (to, code) => {
  if (!to) throw new Error("Recipient address missing");
  if (!code) throw new Error("Verification code missing");
  if (!SENDER_EMAIL) throw new Error("SENDER_EMAIL not configured");

  try {
    const info = await transporter.sendMail({
      from: `EcoCollect NU <${SENDER_EMAIL}>`,
      to,
      subject: "EcoCollect Account Verification Code",
      text: `Your EcoCollect verification code is: ${code}\n\nThis code will expire in 5 minutes. If you did not request it, you can ignore this email.`,
      html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:16px;border:1px solid #e2e8f0;border-radius:8px;">
              <h2 style="color:#16a34a;margin-top:0;">EcoCollect Verification</h2>
              <p style="font-size:14px;color:#334155;">Use the code below to complete your registration. It expires in <strong>5 minutes</strong>.</p>
              <p style="font-size:32px;letter-spacing:4px;font-weight:600;text-align:center;color:#111827;margin:24px 0;">${code}</p>
              <p style="font-size:12px;color:#64748b;">If you did not request this, you can safely ignore this email.</p>
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
              <p style="font-size:11px;color:#94a3b8;text-align:center;">&copy; ${new Date().getFullYear()} EcoCollect</p>
            </div>`,
    });

    console.log("[Mail] Verification email sent:", info.messageId);
    return info;
  } catch (err) {
    // Attach SMTP response if present for easier debugging.
    const meta = err.response || err.message;
    console.error("[Mail] Failed to send verification email:", meta);
    throw err; // propagate so controller can decide response
  }
};

module.exports = { sendEmailBrevoVerify, transporter };
