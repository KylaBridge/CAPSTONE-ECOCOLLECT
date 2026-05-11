const Bin = require("../models/Bin");
const ActivityLog = require("../models/activityLog");
const {
  buildObjectKey,
  uploadToS3,
  deleteFromS3,
  getKeyFromUrl,
  signUrlForPath,
} = require("../helpers/s3");

// Get all bins
exports.getAllBins = async (req, res) => {
  try {
    const bins = await Bin.find().lean();
    const signedBins = await Promise.all(
      bins.map(async (bin) => {
        if (!bin.image) return bin;
        const signedImage = await signUrlForPath(bin.image);
        return {
          ...bin,
          image: signedImage || bin.image,
        };
      }),
    );
    res.json(signedBins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get bin by ID
exports.getBinById = async (req, res) => {
  try {
    const bin = await Bin.findById(req.params.id).lean();
    if (!bin) return res.status(404).json({ error: "Bin not found" });
    if (bin.image) {
      const signedImage = await signUrlForPath(bin.image);
      bin.image = signedImage || bin.image;
    }
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
      const key = buildObjectKey("bins", req.file.originalname);
      const uploaded = await uploadToS3({
        buffer: req.file.buffer,
        contentType: req.file.mimetype,
        key,
      });
      image = uploaded.url;
    }
    const bin = new Bin({
      location,
      status,
      remarks,
      image,
      lastUpdated: new Date(),
    });
    await bin.save();

    // Log activity
    await ActivityLog.create({
      userId: req.user?._id || null,
      userEmail: req.user?.email || "Admin",
      userRole: req.user?.role,
      action: "Bin Added",
      details: `Added bin at ${location}`,
    });

    const binData = bin.toObject();
    if (binData.image) {
      const signedImage = await signUrlForPath(binData.image);
      binData.image = signedImage || binData.image;
    }
    res.status(201).json(binData);
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
      const key = buildObjectKey("bins", req.file.originalname);
      const uploaded = await uploadToS3({
        buffer: req.file.buffer,
        contentType: req.file.mimetype,
        key,
      });
      updateData.image = uploaded.url;

      const oldBin = await Bin.findById(req.params.id);
      if (oldBin && oldBin.image) {
        const oldKey = getKeyFromUrl(oldBin.image);
        if (oldKey) {
          await deleteFromS3(oldKey);
        }
      }
    }

    const bin = await Bin.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!bin) return res.status(404).json({ error: "Bin not found" });

    // Log activity
    await ActivityLog.create({
      userId: req.user?._id || null,
      userEmail: req.user?.email || "Admin",
      userRole: req.user?.role,
      action: "Bin Updated",
      details: `Updated bin at ${location}`,
    });

    const binData = bin.toObject();
    if (binData.image) {
      const signedImage = await signUrlForPath(binData.image);
      binData.image = signedImage || binData.image;
    }
    res.json(binData);
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
      const key = getKeyFromUrl(bin.image);
      if (key) {
        await deleteFromS3(key);
      }
    }

    // Log activity
    await ActivityLog.create({
      userId: req.user?._id || null,
      userEmail: req.user?.email || "Admin",
      userRole: req.user?.role,
      action: "Bin Deleted",
      details: `Deleted bin at ${bin.location}`,
    });

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
