const cron = require('node-cron');
const Redemption = require('./models/redemption');
const User = require('./models/user');
const ActivityLog = require('./models/activityLog');

// Function to handle expired redemptions
const handleExpiredRedemptions = async () => {
  try {
    console.log('🔄 Running expired redemption check...');
    
    const now = new Date();
    
    // Find all redemptions that are issued but expired
    const expiredRedemptions = await Redemption.find({
      status: 'Issued',
      expiresAt: { $lt: now }
    }).populate('userId', 'email firstName lastName points');

    console.log(`Found ${expiredRedemptions.length} expired redemptions to process`);

    for (const redemption of expiredRedemptions) {
      try {
        // Update redemption status to expired
        redemption.status = 'Expired';
        redemption.updatedAt = new Date();
        redemption.note = `Auto-expired on ${now.toISOString()}, ${redemption.pointsSpent} points refunded`;

        // Refund points to user
        const user = redemption.userId;
        if (user) {
          user.points += redemption.pointsSpent;
          user.updatedAt = new Date();
          
          // Save both redemption and user
          await Promise.all([redemption.save(), user.save()]);

          // Log the expiry and refund activity
          await ActivityLog.create({
            userId: user._id,
            userEmail: user.email,
            userRole: 'user',
            action: 'Redemption Expired',
            details: `Redemption ${redemption.redemptionId} for "${redemption.rewardName}" expired. ${redemption.pointsSpent} points refunded.`
          });

          console.log(`✅ Expired redemption ${redemption.redemptionId}, refunded ${redemption.pointsSpent} points to ${user.email}`);
        } else {
          // Just update redemption if user not found
          await redemption.save();
          console.log(`⚠️ Expired redemption ${redemption.redemptionId}, but user not found for refund`);
        }
      } catch (error) {
        console.error(`❌ Error processing expired redemption ${redemption.redemptionId}:`, error);
      }
    }

    if (expiredRedemptions.length > 0) {
      console.log(`✅ Processed ${expiredRedemptions.length} expired redemptions`);
    } else {
      console.log('✅ No expired redemptions to process');
    }
  } catch (error) {
    console.error('❌ Error in handleExpiredRedemptions:', error);
  }
};

// Function to start all cron jobs
const startCronJobs = () => {
  console.log('🚀 Starting cron jobs...');

  // Run every day at 2:00 AM
  cron.schedule('0 2 * * *', () => {
    console.log('🕐 Daily cron job triggered at 2:00 AM');
    handleExpiredRedemptions();
  });

  // Optional: Run every hour for more frequent checks (uncomment if needed)
  // cron.schedule('0 * * * *', () => {
  //   console.log('🕐 Hourly cron job triggered');
  //   handleExpiredRedemptions();
  // });

  // Optional: Run every 10 minutes for testing (uncomment for development)
  // cron.schedule('*/10 * * * *', () => {
  //   console.log('🕐 Test cron job triggered every 10 minutes');
  //   handleExpiredRedemptions();
  // });

  console.log('✅ Cron jobs scheduled successfully');
  console.log('📅 Expired redemption check: Daily at 2:00 AM');
};

// Function to manually trigger expiry check (for testing)
const triggerExpiryCheck = () => {
  console.log('🔧 Manually triggering expiry check...');
  return handleExpiredRedemptions();
};

module.exports = {
  startCronJobs,
  triggerExpiryCheck,
  handleExpiredRedemptions
};