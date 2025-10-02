# Backend QR Email Implementation Checklist

## 🎯 Overview

Complete step-by-step checklist for implementing QR code email system with node-cron expiry handling for reward redemptions.

## 📦 Required Packages

### ✅ Already Installed:

- `qrcode` - ✅ Installed for QR code generation

### 📋 Install Additional Packages:

```bash
cd server
npm install node-cron
```

## 🗄️ Database Schema Updates

### 1. Update Redemption Model

**File:** `server/models/redemption.js`

**Add these fields to the schema:**

```javascript
const redemptionSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rewardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reward",
    required: true,
  },
  rewardName: {
    type: String,
    required: true,
  },
  // ADD THESE NEW FIELDS:
  pointsSpent: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Issued", "Claimed", "Expired"],
    default: "Issued",
  },
  redemptionId: {
    type: String,
    unique: true,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  claimedAt: {
    type: Date,
  },
  // EXISTING FIELDS:
  redemptionDate: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
```

## 📧 Email Implementation

### 2. Update Mail Helper

**File:** `server/helpers/mail.js`

**Add QR import:**

```javascript
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const QRCode = require("qrcode"); // ADD THIS LINE
```

**Add sendRedemptionEmail function:**

```javascript
// Add this complete function to mail.js
const sendRedemptionEmail = async (to, redemptionData) => {
  try {
    const { redemptionId, rewardName, pointsSpent, expiryDate, userFirstName } = redemptionData;
    const validationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/redemption/validate/${redemptionId}`;

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

    // Generate QR code as base64 data URL
    const qrCodeDataURL = await QRCode.toDataURL(validationUrl, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#2c5530',
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

    const htmlBody = \`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reward Redemption</title>
    </head>
    <body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f5f5f5;">
      <div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);">

        <!-- Header -->
        <div style="background:linear-gradient(135deg,#2c5530,#4a7c59);color:#ffffff;padding:30px;text-align:center;">
          <h1 style="margin:0;font-size:28px;font-weight:bold;">🎁 Reward Redeemed!</h1>
          <p style="margin:10px 0 0 0;font-size:16px;opacity:0.9;">Congratulations \${userFirstName || 'EcoCollect User'}!</p>
        </div>

        <!-- Content -->
        <div style="padding:30px;">
          <div style="background-color:#f8f9fa;border-radius:8px;padding:20px;margin-bottom:25px;">
            <h2 style="margin:0 0 15px 0;color:#2c5530;font-size:20px;">Redemption Details</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:8px 0;font-weight:bold;color:#495057;">Reward:</td>
                <td style="padding:8px 0;color:#2c5530;">\${rewardName}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-weight:bold;color:#495057;">Points Used:</td>
                <td style="padding:8px 0;color:#2c5530;">\${pointsSpent}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-weight:bold;color:#495057;">Redemption ID:</td>
                <td style="padding:8px 0;color:#2c5530;font-family:monospace;">\${redemptionId}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-weight:bold;color:#495057;">Expires:</td>
                <td style="padding:8px 0;color:#dc3545;font-weight:bold;">\${new Date(expiryDate).toLocaleDateString()}</td>
              </tr>
            </table>
          </div>

          <!-- QR Code Section -->
          <div style="text-align:center;margin-bottom:25px;padding:20px;background-color:#e8f5e8;border-radius:8px;">
            <h3 style="margin:0 0 15px 0;color:#2c5530;">QR Code for Validation</h3>
            <div style="display:inline-block;padding:15px;background-color:#ffffff;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1);">
              <img src="cid:qrcode" alt="Redemption QR Code" style="width:200px;height:200px;border:none;">
            </div>
            <p style="margin:10px 0 0 0;font-size:12px;color:#6c757d;">Show this QR code to store staff</p>
          </div>

          <!-- Instructions -->
          <div style="background-color:#fff3cd;border:1px solid #ffeaa7;border-radius:8px;padding:20px;margin-bottom:25px;">
            <h3 style="margin:0 0 15px 0;color:#856404;">How to Claim Your Reward:</h3>
            <ol style="margin:0;padding-left:20px;color:#856404;">
              <li style="margin-bottom:8px;">Visit the partner store</li>
              <li style="margin-bottom:8px;">Show this email with the QR code to staff</li>
              <li style="margin-bottom:8px;">Staff will scan the code to validate</li>
              <li style="margin-bottom:8px;">Staff will enter the store password to confirm</li>
              <li>Your reward will be marked as claimed!</li>
            </ol>
          </div>

          <!-- Warning -->
          <div style="background-color:#f8d7da;border:1px solid #f5c6cb;border-radius:8px;padding:15px;margin-bottom:25px;">
            <p style="margin:0;color:#721c24;font-weight:bold;">⚠️ Important:</p>
            <p style="margin:5px 0 0 0;color:#721c24;">This redemption expires on <strong>\${new Date(expiryDate).toLocaleDateString()}</strong>. Make sure to claim it before the expiry date!</p>
          </div>

          <!-- Manual Link -->
          <div style="text-align:center;padding:20px;background-color:#f8f9fa;border-radius:8px;">
            <p style="margin:0 0 10px 0;color:#495057;font-size:14px;">If QR code doesn't work, staff can visit:</p>
            <a href="\${validationUrl}" style="color:#2c5530;font-weight:bold;text-decoration:none;word-break:break-all;">\${validationUrl}</a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color:#2c5530;color:#ffffff;padding:20px;text-align:center;">
          <p style="margin:0;font-size:14px;">Thank you for using EcoCollect!</p>
          <p style="margin:5px 0 0 0;font-size:12px;opacity:0.8;">Making e-waste collection rewarding and sustainable.</p>
        </div>
      </div>
    </body>
    </html>
    \`;

    const mailOptions = {
      from: \`EcoCollect NU <\${process.env.GMAIL_USER}>\`,
      to: to,
      subject: subject,
      text: textBody,
      html: htmlBody,
      attachments: [
        {
          filename: 'qr-code.png',
          content: qrCodeDataURL.split(',')[1],
          encoding: 'base64',
          cid: 'qrcode'
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
```

**Update module.exports:**

```javascript
module.exports = {
  sendVerificationEmail,
  sendContactEmail,
  sendRedemptionEmail,
};
```

## 🎮 Controller Updates

### 3. Update userController.js

**File:** `server/controllers/userController.js`

**Add import:**

```javascript
const { sendRedemptionEmail } = require("../helpers/mail");
```

**Replace the redeemReward function:**

```javascript
// Redeem reward :user
const redeemReward = async (req, res) => {
  try {
    const { userId, rewardId } = req.body;

    // Find the user and reward
    const user = await User.findById(userId);
    const reward = await Reward.findById(rewardId);

    if (!user || !reward) {
      return res.status(404).json({ message: "User or reward not found" });
    }

    // Check if user has enough points
    if (user.points < reward.points) {
      return res.status(400).json({ message: "Insufficient points" });
    }

    // Generate unique redemption ID
    const redemptionId = \`ECO-\${Date.now()}-\${Math.random().toString(36).substr(2, 9).toUpperCase()}\`;

    // Set expiry date (3 days from now)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);

    // Create redemption record
    const redemption = new Redemption({
      userId,
      rewardId,
      rewardName: reward.name,
      pointsSpent: reward.points,
      redemptionId,
      expiresAt: expiryDate,
      status: 'Issued'
    });

    // Update user points
    user.points -= reward.points;

    // Save both redemption and updated user points
    await Promise.all([redemption.save(), user.save()]);

    // Send redemption email with QR code
    try {
      await sendRedemptionEmail(user.email, {
        redemptionId: redemption._id, // Use MongoDB _id for URL
        rewardName: reward.name,
        pointsSpent: reward.points,
        expiryDate: expiryDate,
        userFirstName: user.firstName || user.name
      });
    } catch (emailError) {
      console.error('Failed to send redemption email:', emailError);
      // Don't fail the redemption if email fails
    }

    // Log activity
    await ActivityLog.create({
      userId,
      userEmail: user.email,
      userRole: req.user?.role,
      action: "Reward Redeemed",
      details: \`Redeemed \${reward.name} for \${reward.points} points\`,
    });

    res.status(201).json({
      message: "Reward redeemed successfully",
      remainingPoints: user.points,
      redemptionId: redemption._id,
      expiresAt: expiryDate
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to redeem reward" });
  }
};
```

### 4. Update redemptionController.js

**File:** `server/controllers/redemptionController.js`

**Add imports:**

```javascript
const Redemption = require("../models/redemption");
const User = require("../models/user");
const Reward = require("../models/rewards");
```

**Add validation functions:**

```javascript
// Get redemption details for validation (QR code scanning)
const getRedemptionForValidation = async (req, res) => {
  try {
    const { id } = req.params;

    const redemption = await Redemption.findById(id)
      .populate('userId', 'email firstName name')
      .populate('rewardId', 'name image');

    if (!redemption) {
      return res.status(404).json({ message: "Redemption not found" });
    }

    // Check if expired
    if (new Date() > new Date(redemption.expiresAt)) {
      return res.status(410).json({ message: "Redemption has expired" });
    }

    // Return redemption data for validation page
    const validationData = {
      _id: redemption._id,
      rewardName: redemption.rewardName,
      rewardImage: redemption.rewardId?.image ?
        \`\${process.env.BASE_URL || 'http://localhost:8000'}/\${redemption.rewardId.image.path}\` : null,
      redemptionId: redemption.redemptionId,
      pointsSpent: redemption.pointsSpent,
      redemptionDate: redemption.redemptionDate,
      expiresAt: redemption.expiresAt,
      status: redemption.status,
      claimedAt: redemption.claimedAt,
      userEmail: redemption.userId?.email
    };

    res.status(200).json(validationData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch redemption details" });
  }
};

// Confirm redemption (store staff validation)
const confirmRedemption = async (req, res) => {
  try {
    const { id } = req.params;
    const { storePassword } = req.body;

    // Check store password (you should set this in environment variables)
    const validStorePassword = process.env.STORE_PASSWORD || 'ecocollect2024';
    if (storePassword !== validStorePassword) {
      return res.status(401).json({ message: "Invalid store password" });
    }

    const redemption = await Redemption.findById(id);
    if (!redemption) {
      return res.status(404).json({ message: "Redemption not found" });
    }

    // Check if already claimed
    if (redemption.status === 'Claimed') {
      return res.status(409).json({ message: "Redemption already claimed" });
    }

    // Check if expired
    if (new Date() > new Date(redemption.expiresAt)) {
      return res.status(410).json({ message: "Redemption has expired" });
    }

    // Update redemption status
    redemption.status = 'Claimed';
    redemption.claimedAt = new Date();
    await redemption.save();

    res.status(200).json({
      message: "Redemption confirmed successfully",
      redemption: {
        _id: redemption._id,
        status: redemption.status,
        claimedAt: redemption.claimedAt
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to confirm redemption" });
  }
};
```

**Update module.exports:**

```javascript
module.exports = {
  getAllRedemptions,
  getUserRedemptions,
  getRedemptionCount,
  getRedemptionForValidation,
  confirmRedemption,
};
```

## 🛣️ Routes Setup

### 5. Update controllerRoutes.js

**File:** `server/routes/controllerRoutes.js`

**Add imports to controller imports section:**

```javascript
const {
  getUserRedemptions,
  getRedemptionCount,
  getAllRedemptions,
  getRedemptionForValidation, // ADD THIS
  confirmRedemption, // ADD THIS
} = require("../controllers/redemptionController");
```

**Add routes:**

```javascript
// --- Redemption Management ---
router.get("/redeem/user/:userId", authMiddleware, getUserRedemptions);
router.get("/redeem/all", authMiddleware, getAllRedemptions);
router.get("/redeem/validate/:id", getRedemptionForValidation); // Public route for QR validation
router.post("/redeem/confirm/:id", confirmRedemption); // Public route for store confirmation
```

## ⏰ Node-Cron Implementation

### 6. Create Cron Job File

**File:** `server/services/cronJobs.js` (NEW FILE)

```javascript
const cron = require('node-cron');
const Redemption = require('../models/redemption');
const User = require('../models/user');
const ActivityLog = require('../models/activityLog');

// Run daily at midnight to check for expired redemptions
const checkExpiredRedemptions = cron.schedule('0 0 * * *', async () => {
  try {
    console.log('Running expired redemptions check...');

    const now = new Date();

    // Find all issued redemptions that have expired
    const expiredRedemptions = await Redemption.find({
      status: 'Issued',
      expiresAt: { $lt: now }
    }).populate('userId', 'email name firstName');

    console.log(\`Found \${expiredRedemptions.length} expired redemptions\`);

    for (const redemption of expiredRedemptions) {
      try {
        // Update redemption status to expired
        redemption.status = 'Expired';
        await redemption.save();

        // Refund points to user
        const user = await User.findById(redemption.userId);
        if (user) {
          user.points += redemption.pointsSpent;
          await user.save();

          // Log the refund activity
          await ActivityLog.create({
            userId: user._id,
            userEmail: user.email,
            userRole: 'user',
            action: 'Redemption Expired - Points Refunded',
            details: \`Redemption \${redemption.redemptionId} expired. \${redemption.pointsSpent} points refunded for \${redemption.rewardName}\`,
          });

          console.log(\`Refunded \${redemption.pointsSpent} points to user \${user.email} for expired redemption \${redemption.redemptionId}\`);
        }
      } catch (error) {
        console.error(\`Error processing expired redemption \${redemption._id}:\`, error);
      }
    }

    console.log('Expired redemptions check completed');
  } catch (error) {
    console.error('Error in expired redemptions cron job:', error);
  }
}, {
  scheduled: false // Don't start automatically
});

// Optional: Run every hour during business hours for more frequent checks
const checkExpiredRedemptionsHourly = cron.schedule('0 8-22 * * *', async () => {
  try {
    console.log('Running hourly expired redemptions check...');

    const now = new Date();

    // Find redemptions that expired in the last hour
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const recentlyExpiredRedemptions = await Redemption.find({
      status: 'Issued',
      expiresAt: { $lt: now, $gte: oneHourAgo }
    }).populate('userId', 'email name firstName');

    console.log(\`Found \${recentlyExpiredRedemptions.length} recently expired redemptions\`);

    for (const redemption of recentlyExpiredRedemptions) {
      try {
        redemption.status = 'Expired';
        await redemption.save();

        const user = await User.findById(redemption.userId);
        if (user) {
          user.points += redemption.pointsSpent;
          await user.save();

          await ActivityLog.create({
            userId: user._id,
            userEmail: user.email,
            userRole: 'user',
            action: 'Redemption Expired - Points Refunded',
            details: \`Redemption \${redemption.redemptionId} expired. \${redemption.pointsSpent} points refunded for \${redemption.rewardName}\`,
          });

          console.log(\`Refunded \${redemption.pointsSpent} points to user \${user.email} for expired redemption \${redemption.redemptionId}\`);
        }
      } catch (error) {
        console.error(\`Error processing expired redemption \${redemption._id}:\`, error);
      }
    }
  } catch (error) {
    console.error('Error in hourly expired redemptions cron job:', error);
  }
}, {
  scheduled: false
});

// Function to start all cron jobs
const startCronJobs = () => {
  checkExpiredRedemptions.start();
  checkExpiredRedemptionsHourly.start();
  console.log('Cron jobs started:');
  console.log('- Daily expired redemptions check: 00:00');
  console.log('- Hourly expired redemptions check: 08:00-22:00');
};

// Function to stop all cron jobs
const stopCronJobs = () => {
  checkExpiredRedemptions.stop();
  checkExpiredRedemptionsHourly.stop();
  console.log('All cron jobs stopped');
};

module.exports = {
  startCronJobs,
  stopCronJobs,
  checkExpiredRedemptions,
  checkExpiredRedemptionsHourly
};
```

### 7. Update Main Server File

**File:** `server/index.js`

**Add cron job startup:**

```javascript
// Add this import at the top
const { startCronJobs } = require("./services/cronJobs");

// Add this after successful database connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");

    // Start cron jobs after successful DB connection
    startCronJobs();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
```

## 🌍 Environment Variables

### 8. Update .env File

**Add these variables:**

```env
# QR Email System
FRONTEND_URL=http://localhost:5173
STORE_PASSWORD=ecocollect2024
BASE_URL=http://localhost:8000

# Optional: Customize expiry period (in days)
REDEMPTION_EXPIRY_DAYS=3
```

## ✅ Implementation Checklist

### Database & Models

- [ ] Install node-cron package
- [ ] Update redemption model with new fields
- [ ] Test database schema changes

### Email System

- [ ] Update mail.js with QR code functionality
- [ ] Add sendRedemptionEmail function
- [ ] Test email sending with QR codes

### Controllers & Routes

- [ ] Update userController redeemReward function
- [ ] Add validation endpoints to redemptionController
- [ ] Add new routes for validation
- [ ] Test redemption flow

### Cron Jobs

- [ ] Create cronJobs.js service file
- [ ] Add cron job startup to main server file
- [ ] Test expiry checking functionality

### Environment Setup

- [ ] Add required environment variables
- [ ] Test configuration in development
- [ ] Prepare for production deployment

### Testing

- [ ] Test complete redemption flow
- [ ] Verify email sending with QR codes
- [ ] Test QR code validation page
- [ ] Test expiry and refund system
- [ ] Test store staff validation

## 🚀 Deployment Considerations

### Production Setup

1. **Environment Variables**: Set proper FRONTEND_URL for production
2. **Email Service**: Ensure Gmail OAuth is configured for production
3. **Cron Jobs**: Verify cron jobs start properly on server restart
4. **Store Password**: Set secure store password
5. **Database Indexes**: Add indexes for performance on status and expiresAt fields

### Monitoring

- Add logging for cron job executions
- Monitor email sending success rates
- Track redemption statistics
- Alert on failed refund operations

---

**Status:** 📋 Ready for Implementation
**Estimated Time:** 4-6 hours
**Dependencies:** qrcode package (✅ installed), node-cron package
**Next Step:** Start with database model updates
