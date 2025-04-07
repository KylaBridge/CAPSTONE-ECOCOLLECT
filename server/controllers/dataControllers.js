const User = require('../models/user');

// GET all users
const getUserData = async (req, res) => {
    const data = await User.find({});
    res.status(200).json(data);
};

// DELETE user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
};

//

module.exports = {
    getUserData,
    deleteUser
};
