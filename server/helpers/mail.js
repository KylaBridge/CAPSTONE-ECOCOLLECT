const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const QRCode = require("qrcode"); // ADD THIS LINE

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);
oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const sendVerificationEmail = async (to, code) => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.GMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: `EcoCollect NU <${process.env.GMAIL_USER}>`,
      to: to,
      subject: "Account Verification",
      text: `This is your account verification code ${code}`,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
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
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.GMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

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
    return result;
  } catch (error) {
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
      validationUrl
    } = redemptionData;

    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.GMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    // Generate QR code as buffer for email attachment
    const qrCodeBuffer = await QRCode.toBuffer(validationUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    const subject = `🎁 Reward Redeemed Successfully - ${rewardName}`;
    
    const textBody = `
Hello ${userFirstName || 'EcoCollect User'}!

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

IMPORTANT: This redemption expires on ${new Date(expiryDate).toLocaleDateString()}. Make sure to claim it before the expiry date!

Thank you for using EcoCollect!

Best regards,
EcoCollect Team
    `;

    const htmlBody = `
      <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;max-width:600px;margin:0 auto;padding:20px;border:1px solid #ddd;border-radius:10px;">
        <div style="text-align:center;margin-bottom:30px;">
          <h1 style="color:#2E8B57;margin-bottom:10px;">🎁 Reward Redeemed!</h1>
          <p style="color:#666;margin:0;">Congratulations, ${userFirstName || 'EcoCollect User'}!</p>
        </div>
        
        <div style="background:#f9f9f9;padding:20px;border-radius:8px;margin:20px 0;">
          <h3 style="color:#2E8B57;margin-top:0;">Redemption Details:</h3>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;"><strong>Reward:</strong></td><td style="padding:8px 0;border-bottom:1px solid #eee;">${rewardName}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;"><strong>Points Used:</strong></td><td style="padding:8px 0;border-bottom:1px solid #eee;">${pointsSpent}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;"><strong>Redemption ID:</strong></td><td style="padding:8px 0;border-bottom:1px solid #eee;">${redemptionId}</td></tr>
            <tr><td style="padding:8px 0;"><strong>Expires:</strong></td><td style="padding:8px 0;">${new Date(expiryDate).toLocaleDateString()}</td></tr>
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
          <p style="color:#721c24;margin:0;"><strong>IMPORTANT:</strong> This redemption expires on ${new Date(expiryDate).toLocaleDateString()}. Make sure to claim it before the expiry date!</p>
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
          filename: 'qrcode.png',
          content: qrCodeBuffer,
          cid: 'qrcode', // Referenced in HTML as cid:qrcode
          contentType: 'image/png'
        }
      ]
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error('Error sending redemption email:', error);
    return error;
  }
};

module.exports = { sendVerificationEmail, sendContactEmail, sendRedemptionEmail };
