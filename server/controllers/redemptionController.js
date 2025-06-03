const Redemption = require('../models/redemption');

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

module.exports = {
  getAllRedemptions,
  getUserRedemptions,
  getRedemptionCount,
};