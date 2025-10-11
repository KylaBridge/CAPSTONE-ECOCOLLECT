const Redemption = require('../models/redemption');
const User = require('../models/user');
const Reward = require('../models/rewards');
const { comparePassword } = require('../helpers/auth');

//
// ------------------ REDEMPTION MANAGEMENT ------------------
//

// Get all redemptions with populated user and reward details
const getAllRedemptions = async (req, res) => {
  try {
    const redemptions = await Redemption.find()
      .populate('userId', 'email role')
      .populate('rewardId', 'name points')
      .sort({ redemptionDate: -1 });
    res.status(200).json(redemptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch redemptions" });
  }
};

// Get redemption history for user
const getUserRedemptions = async (req, res) => {
    try {
        const { userId } = req.params;
        const redemptions = await Redemption.find({ userId })
            .sort({ redemptionDate: -1 })
            .populate('rewardId', 'name points');
        res.status(200).json(redemptions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch redemption history" });
    }
};

// Get total redemption count
const getRedemptionCount = async (req, res) => {
  try {
    const count = await Redemption.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get redemption count" });
  }
};

// Get redemption details for validation (QR code scanning)
const getRedemptionForValidation = async (req, res) => {
  try {
    const { id } = req.params;
    
    const redemption = await Redemption.findOne({ redemptionId: id })
      .populate('userId', 'email firstName lastName')
      .populate('rewardId', 'name image description');

    if (!redemption) {
      return res.status(404).json({ 
        message: "Redemption not found or invalid QR code." 
      });
    }

    // Check if redemption has expired
    if (redemption.status === 'Expired' || new Date() > new Date(redemption.expiresAt)) {
      return res.status(410).json({ 
        message: "This redemption has expired." 
      });
    }

    // Return redemption data for validation page
    const validationData = {
      redemptionId: redemption.redemptionId,
      rewardName: redemption.rewardName,
      rewardImage: redemption.rewardId?.image,
      rewardDescription: redemption.rewardId?.description,
      pointsSpent: redemption.pointsSpent,
      status: redemption.status,
      redemptionDate: redemption.redemptionDate,
      expiresAt: redemption.expiresAt,
      claimedAt: redemption.claimedAt,
      userEmail: redemption.userId?.email,
      userName: `${redemption.userId?.firstName || ''} ${redemption.userId?.lastName || ''}`.trim()
    };

    res.status(200).json(validationData);
  } catch (error) {
    console.error('Error fetching redemption for validation:', error);
    res.status(500).json({ message: "Failed to load redemption details." });
  }
};

// Confirm redemption (store staff validation)
const confirmRedemption = async (req, res) => {
  try {
    const { id } = req.params;
    const { storePassword, storeEmail } = req.body;

    // Find store admin account
    const storeAdmin = await User.findOne({ 
      email: storeEmail, 
      role: 'admin' || "superadmin" // Changed to 'admin' role
    });

    if (!storeAdmin) {
      return res.status(401).json({ 
        message: "Invalid store account credentials." 
      });
    }

    // Validate store admin password using auth helper
    const isValidPassword = await comparePassword(storePassword, storeAdmin.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        message: "Invalid store account credentials." 
      });
    }

    const redemption = await Redemption.findOne({ redemptionId: id });

    if (!redemption) {
      return res.status(404).json({ 
        message: "Redemption not found." 
      });
    }

    // Check if already claimed
    if (redemption.status === 'Claimed') {
      return res.status(409).json({ 
        message: "This reward has already been claimed." 
      });
    }

    // Check if expired
    if (redemption.status === 'Expired' || new Date() > new Date(redemption.expiresAt)) {
      return res.status(410).json({ 
        message: "This redemption has expired." 
      });
    }

    // Update redemption status to claimed
    redemption.status = 'Claimed';
    redemption.claimedAt = new Date();
    redemption.updatedAt = new Date();
    redemption.note = `Claimed by ${storeAdmin.name || storeAdmin.email} at ${new Date().toISOString()}`;
    
    await redemption.save();

    res.status(200).json({ 
      message: "Reward successfully redeemed!",
      redemption: {
        redemptionId: redemption.redemptionId,
        status: redemption.status,
        claimedAt: redemption.claimedAt
      }
    });
  } catch (error) {
    console.error('Error confirming redemption:', error);
    res.status(500).json({ message: "Failed to confirm redemption." });
  }
};

module.exports = {
  getAllRedemptions,
  getUserRedemptions,
  getRedemptionCount,
  getRedemptionForValidation,
  confirmRedemption,
};