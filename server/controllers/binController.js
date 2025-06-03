const Bin = require('../models/bin');
const path = require("path");
const fs = require("fs");

//
// ------------------ BIN MANAGEMENT ------------------
//

// Get all bins
const getAllBins = async (req, res) => {
    try {
        const bins = await Bin.find();
        res.status(200).json(bins);
    } catch (error) {
        console.error("Error fetching bins:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Add a new bin
const addBin = async (req, res) => {
    try {
        const { name, location, remarks, status } = req.body;
        const newBin = new Bin({ name, location, remarks, status });

        if (req.file) {
            newBin.image = req.file.path; // Store the path of the uploaded image
        }

        await newBin.save();
        res.status(201).json(newBin);
    } catch (error) {
        console.error("Error adding bin:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Update an existing bin
const updateBin = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, location, remarks, status } = req.body;

        const bin = await Bin.findById(id);
        if (!bin) {
            return res.status(404).json({ message: "Bin not found" });
        }

        // Update fields
        bin.name = name || bin.name;
        bin.location = location || bin.location;
        bin.remarks = remarks || bin.remarks;
        bin.status = status || bin.status;

        if (req.file) {
            // If there's a new image file, update it
            if (bin.image) {
                const oldImagePath = path.join(__dirname, "..", bin.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath); // Delete old image file
                }
            }
            bin.image = req.file.path; // Store the new image path
        }

        await bin.save();
        res.status(200).json(bin);
    } catch (error) {
        console.error("Error updating bin:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Delete a bin
const deleteBin = async (req, res) => {
    try {
        const { id } = req.params;
        const bin = await Bin.findByIdAndDelete(id);
        if (!bin) {
            return res.status(404).json({ message: "Bin not found" });
        }

        // Delete the image file if it exists
        if (bin.image) {
            const imagePath = path.join(__dirname, "..", bin.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        res.status(200).json({ message: "Bin deleted successfully" });
    } catch (error) {
        console.error("Error deleting bin:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Get bin count
const getBinCount = async (req, res) => {
    try {
        const count = await Bin.countDocuments();
        res.status(200).json({ count });
    } catch (error) {
        console.error("Error counting bins:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    getAllBins,
    addBin,
    updateBin,
    deleteBin,
    getBinCount
};