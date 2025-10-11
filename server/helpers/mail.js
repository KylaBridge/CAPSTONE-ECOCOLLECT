const nodemailer = require("nodemailer");
const QRCode = require("qrcode");

// Simple Gmail transporter using App Password (more reliable for unverified apps)
const createGmailTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD, // App password instead of OAuth
    },
  });
};

const sendVerificationEmail = async (to, code) => {
  try {
    const transport = createGmailTransporter();

    const textBody = `Welcome to EcoCollect!

Your account verification code is: ${code}

This code will expire in 5 minutes for security reasons.

If you didn't create an account with EcoCollect, please ignore this email.

Best regards,
The EcoCollect Team`;

    const htmlBody = `
      <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;">
        <div style="background:#28a745;color:white;padding:20px;text-align:center;">
          <h1 style="margin:0;">Welcome to EcoCollect!</h1>
        </div>
        <div style="padding:20px;background:#f9f9f9;">
          <p>Thank you for signing up with EcoCollect! You're one step away from joining our eco-friendly community.</p>
          
          <div style="background:white;padding:20px;border-radius:8px;margin:20px 0;text-align:center;border:2px dashed #28a745;">
            <p style="margin:0;font-size:18px;color:#666;">Your verification code is:</p>
            <h2 style="margin:10px 0;color:#28a745;font-size:32px;letter-spacing:4px;">${code}</h2>
          </div>
          
          <p><strong>⏰ This code will expire in 5 minutes</strong> for security reasons.</p>
          <p>Enter this code in the registration form to complete your account setup.</p>
          <p>If you didn't create an account with EcoCollect, please ignore this email.</p>
          
          <div style="margin-top:30px;padding-top:20px;border-top:1px solid #ddd;">
            <p style="color:#666;font-size:14px;">Best regards,<br>The EcoCollect Team</p>
          </div>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `EcoCollect NU <${process.env.GMAIL_USER}>`,
      to: to,
      subject: "Complete Your EcoCollect Registration",
      text: textBody,
      html: htmlBody,
    };

    const result = await transport.sendMail(mailOptions);
    console.log(`Verification email sent successfully to: ${to}`);
    return result;
  } catch (error) {
    console.error("Error sending verification email:", error);
    return error;
  }
};

// Send a contact email to the site inbox
// params: { fromName, fromEmail, phone?, company?, message, to? }
const sendContactEmail = async ({
  fromName,
  fromEmail,
  phone,
  company,
  message,
}) => {
  const recipient = process.env.GMAIL_USER;
  try {
    const transport = createGmailTransporter();

    const subject = `New Contact Message from ${fromName}`;
    const textBody = `You have received a new message from the EcoCollect Contact form.

Name: ${fromName}
Email: ${fromEmail}
Phone: ${phone || "-"}
Company: ${company || "-"}

Message:
${message}
`;

    const htmlBody = `
      <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6">
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${fromName}</p>
        <p><strong>Email:</strong> ${fromEmail}</p>
        <p><strong>Phone:</strong> ${phone || "-"}</p>
        <p><strong>Company:</strong> ${company || "-"}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap">${message}</p>
      </div>
    `;

    const mailOptions = {
      from: `EcoCollect NU <${process.env.GMAIL_USER}>`,
      to: recipient,
      replyTo: fromEmail,
      subject,
      text: textBody,
      html: htmlBody,
    };

    const result = await transport.sendMail(mailOptions);
    console.log(`Contact email sent successfully to: ${recipient}`);
    return result;
  } catch (error) {
    console.error("Error sending contact email:", error);
    return error;
  }
};

// Send redemption email with QR code
const sendRedemptionEmail = async (to, redemptionData) => {
  try {
    const {
      userFirstName,
      rewardName,
      pointsSpent,
      redemptionId,
      expiryDate,
      validationUrl,
    } = redemptionData;

    const transport = createGmailTransporter();

    // Generate QR code as buffer for email attachment
    const qrCodeBuffer = await QRCode.toBuffer(validationUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    const subject = `🎁 Reward Redeemed Successfully - ${rewardName}`;

    const textBody = `
Hello ${userFirstName || "EcoCollect User"}!

Congratulations! You have successfully redeemed your reward.

REDEMPTION DETAILS:
- Reward: ${rewardName}
- Points Used: ${pointsSpent}
- Redemption ID: ${redemptionId}
- Expires: ${new Date(expiryDate).toLocaleDateString()}

To claim your reward:
1. Visit the partner store
2. Show this email to the staff
3. Staff will scan the QR code or visit: ${validationUrl}
4. Staff will confirm the redemption

IMPORTANT: This redemption expires on ${new Date(
      expiryDate
    ).toLocaleDateString()}. Make sure to claim it before the expiry date!

Thank you for using EcoCollect!

Best regards,
EcoCollect Team
    `;

    const htmlBody = `
      <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;max-width:600px;margin:0 auto;padding:20px;border:1px solid #ddd;border-radius:10px;">
        <div style="text-align:center;margin-bottom:30px;">
          <h1 style="color:#2E8B57;margin-bottom:10px;">🎁 Reward Redeemed!</h1>
          <p style="color:#666;margin:0;">Congratulations, ${
            userFirstName || "EcoCollect User"
          }!</p>
        </div>
        
        <div style="background:#f9f9f9;padding:20px;border-radius:8px;margin:20px 0;">
          <h3 style="color:#2E8B57;margin-top:0;">Redemption Details:</h3>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;"><strong>Reward:</strong></td><td style="padding:8px 0;border-bottom:1px solid #eee;">${rewardName}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;"><strong>Points Used:</strong></td><td style="padding:8px 0;border-bottom:1px solid #eee;">${pointsSpent}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;"><strong>Redemption ID:</strong></td><td style="padding:8px 0;border-bottom:1px solid #eee;">${redemptionId}</td></tr>
            <tr><td style="padding:8px 0;"><strong>Expires:</strong></td><td style="padding:8px 0;">${new Date(
              expiryDate
            ).toLocaleDateString()}</td></tr>
          </table>
        </div>

        <div style="text-align:center;margin:30px 0;">
          <h3 style="color:#2E8B57;">Scan this QR Code at the store:</h3>
          <img src="cid:qrcode" alt="QR Code for Redemption" style="border:2px solid #2E8B57;border-radius:8px;max-width:300px;"/>
          <p style="margin-top:10px;font-size:12px;color:#666;">Or visit: <a href="${validationUrl}" style="color:#2E8B57;">${validationUrl}</a></p>
        </div>

        <div style="background:#fff3cd;border:1px solid #ffeaa7;padding:15px;border-radius:8px;margin:20px 0;">
          <h4 style="color:#856404;margin-top:0;">How to claim your reward:</h4>
          <ol style="color:#856404;margin:0;">
            <li>Visit the partner store</li>
            <li>Show this email to the staff</li>
            <li>Staff will scan the QR code</li>
            <li>Staff will confirm the redemption</li>
          </ol>
        </div>

        <div style="background:#f8d7da;border:1px solid #f5c6cb;padding:15px;border-radius:8px;margin:20px 0;">
          <p style="color:#721c24;margin:0;"><strong>IMPORTANT:</strong> This redemption expires on ${new Date(
            expiryDate
          ).toLocaleDateString()}. Make sure to claim it before the expiry date!</p>
        </div>

        <div style="text-align:center;margin-top:30px;padding-top:20px;border-top:1px solid #eee;">
          <p style="color:#666;">Thank you for using EcoCollect!</p>
          <p style="color:#2E8B57;font-weight:bold;">EcoCollect Team</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `EcoCollect NU <${process.env.GMAIL_USER}>`,
      to: to,
      subject: subject,
      text: textBody,
      html: htmlBody,
      attachments: [
        {
          filename: "qrcode.png",
          content: qrCodeBuffer,
          cid: "qrcode", // Referenced in HTML as cid:qrcode
          contentType: "image/png",
        },
      ],
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error("Error sending redemption email:", error);
    return error;
  }
};

// Send password reset email with verification code
const sendPasswordResetEmail = async (to, code, userName) => {
  try {
    const transport = createGmailTransporter();

    const textBody = `Hi ${userName || "there"},

You requested to reset your password for your EcoCollect account.

Your password reset verification code is: ${code}

This code will expire in 15 minutes for security reasons.

If you didn't request this password reset, please ignore this email.

Best regards,
The EcoCollect Team`;

    const htmlBody = `
      <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;">
        <div style="background:#28a745;color:white;padding:20px;text-align:center;">
          <h1 style="margin:0;">EcoCollect Password Reset</h1>
        </div>
        <div style="padding:20px;background:#f9f9f9;">
          <p>Hi ${userName || "there"},</p>
          <p>You requested to reset your password for your EcoCollect account.</p>
          
          <div style="background:white;padding:20px;border-radius:8px;margin:20px 0;text-align:center;border:2px dashed #28a745;">
            <p style="margin:0;font-size:18px;color:#666;">Your verification code is:</p>
            <h2 style="margin:10px 0;color:#28a745;font-size:32px;letter-spacing:4px;">${code}</h2>
          </div>
          
          <p><strong>⏰ This code will expire in 15 minutes</strong> for security reasons.</p>
          <p>If you didn't request this password reset, please ignore this email and your password will remain unchanged.</p>
          
          <div style="margin-top:30px;padding-top:20px;border-top:1px solid #ddd;">
            <p style="color:#666;font-size:14px;">Best regards,<br>The EcoCollect Team</p>
          </div>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `EcoCollect NU <${process.env.GMAIL_USER}>`,
      to: to,
      subject: "Reset Your EcoCollect Password",
      text: textBody,
      html: htmlBody,
    };

    const result = await transport.sendMail(mailOptions);
    console.log(`Password reset email sent successfully to: ${to}`);
    return result;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return error;
  }
};

module.exports = {
  sendVerificationEmail,
  sendContactEmail,
  sendRedemptionEmail,
  sendPasswordResetEmail,
};
