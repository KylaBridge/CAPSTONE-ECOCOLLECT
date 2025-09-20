const nodemailer = require("nodemailer");
const { google } = require("googleapis");

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

module.exports = { sendVerificationEmail, sendContactEmail };
