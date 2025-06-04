const Bin = require('../models/Bin');
const fs = require('fs');
const path = require('path');

// Get all bins
exports.getAllBins = async (req, res) => {
    try {
        const bins = await Bin.find();
        res.json(bins);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get bin by ID
exports.getBinById = async (req, res) => {
    try {
        const bin = await Bin.findById(req.params.id);
        if (!bin) return res.status(404).json({ error: "Bin not found" });
        res.json(bin);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add new bin
exports.addBin = async (req, res) => {
    try {
        const { location, status, remarks } = req.body;
        let image = null;
        if (req.file) {
            image = `/uploads/bins/${req.file.filename}`;
        }
        const bin = new Bin({
            location,
            status,
            remarks,
            image,
            lastUpdated: new Date()
        });
        await bin.save();
        res.status(201).json(bin);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update bin
exports.updateBin = async (req, res) => {
    try {
        const { location, status, remarks } = req.body;
        let updateData = { location, status, remarks, lastUpdated: new Date() };

        if (req.file) {
            updateData.image = `/uploads/bins/${req.file.filename}`;
            // Optionally: remove old image file
            const oldBin = await Bin.findById(req.params.id);
            if (oldBin && oldBin.image) {
                const oldImagePath = path.join(__dirname, '..', '..', oldBin.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        }

        const bin = await Bin.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!bin) return res.status(404).json({ error: "Bin not found" });
        res.json(bin);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete bin
exports.deleteBin = async (req, res) => {
    try {
        const bin = await Bin.findByIdAndDelete(req.params.id);
        if (!bin) return res.status(404).json({ error: "Bin not found" });
        // Remove image file if exists
        if (bin.image) {
            // Remove leading slash if present for path.join
            const imagePath = path.join(__dirname, '..', bin.image.startsWith('/') ? bin.image.slice(1) : bin.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        res.json({ message: "Bin deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get bin count
exports.getBinCount = async (req, res) => {
    try {
        const count = await Bin.countDocuments();
        res.json({ count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
