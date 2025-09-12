const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);
oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.GMAIL_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});

const sendVerificationEmail = async (to, code) => {
  const at = await oAuth2Client.getAccessToken();
  transporter.options.auth.accessToken = at;

  return await transporter.sendMail({
    from: `EcoCollect NU ${process.env.GMAIL_USER}`,
    to,
    subject: "EcoCollect Account Verification",
    text: `This is the email verification code for your account ${code}`,
  });
};

module.exports = { sendVerificationEmail };
