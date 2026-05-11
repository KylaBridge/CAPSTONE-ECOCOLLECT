const User = require("../models/user");
const EWaste = require("../models/ewaste");
const { updateUserRank } = require("./userController");
const ActivityLog = require("../models/activityLog");
const { sendEwasteStatusEmail } = require("../helpers/mail");
const {
  deleteFromS3,
  getKeyFromUrl,
  signUrlForPath,
} = require("../helpers/s3");

const deleteAttachment = async (attachment) => {
  if (!attachment || !attachment.path) return;

  const key = getKeyFromUrl(attachment.path);
  if (key) {
    await deleteFromS3(key);
  }
};

//
// ------------------ E-WASTE SUBMISSIONS ------------------
//

// Get counts of approved ewaste items by category
const getEwastes = async (req, res) => {
  try {
    const telephoneCount = await EWaste.countDocuments({
      category: "Telephone",
      status: "Approved",
    });
    const routerCount = await EWaste.countDocuments({
      category: "Router",
      status: "Approved",
    });
    const mobileCount = await EWaste.countDocuments({
      category: "Mobile Phone",
      status: "Approved",
    });
    const tabletCount = await EWaste.countDocuments({
      category: "Tablet",
      status: "Approved",
    });
    const laptopCount = await EWaste.countDocuments({
      category: "Laptop",
      status: "Approved",
    });
    const chargerCount = await EWaste.countDocuments({
      category: "Charger",
      status: "Approved",
    });
    const batteryCount = await EWaste.countDocuments({
      category: "Batteries",
      status: "Approved",
    });
    const cordCount = await EWaste.countDocuments({
      category: "Cords",
      status: "Approved",
    });
    const powerbankCount = await EWaste.countDocuments({
      category: "Powerbank",
      status: "Approved",
    });
    const usbCount = await EWaste.countDocuments({
      category: "USB",
      status: "Approved",
    });
    const othersCount = await EWaste.countDocuments({
      category: "others",
      status: "Approved",
    });

    res.status(200).json({
      telephoneCount,
      routerCount,
      mobileCount,
      tabletCount,
      laptopCount,
      chargerCount,
      batteryCount,
      cordCount,
      powerbankCount,
      usbCount,
      othersCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed fetching ewastes" });
  }
};

// Get all e-waste submissions with user details populated
const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await EWaste.find().populate("user").lean();
    const signedSubmissions = await Promise.all(
      submissions.map(async (submission) => {
        if (!Array.isArray(submission.attachments)) {
          return submission;
        }

        const attachments = await Promise.all(
          submission.attachments.map(async (file) => {
            const signedPath = await signUrlForPath(file.path);
            return {
              ...file,
              path: signedPath || file.path,
            };
          }),
        );

        return {
          ...submission,
          attachments,
        };
      }),
    );

    res.status(200).json(signedSubmissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching submissions" });
  }
};

// Update submission status and manage related user points and image files
const updateSubmissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, points } = req.body;

    const submission = await EWaste.findById(id);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Delete images if status changed from "Pending"
    if (status !== "Pending" && submission.attachments.length > 0) {
      // Store original attachment count before clearing
      if (!submission.originalAttachmentCount) {
        submission.originalAttachmentCount = submission.attachments.length;
      }

      for (const file of submission.attachments) {
        await deleteAttachment(file);
      }
      submission.attachments = [];
    }

    submission.status = status;
    await submission.save();

    // Fetch submitter for email/points and attribute activity to the current admin
    const submitter = await User.findById(submission.user);
    const submitterIdentifier = submitter
      ? submitter.name || submitter.email || submitter.name || "Unknown"
      : "Unknown";

    await ActivityLog.create({
      userId: req.user?._id || null,
      userEmail: req.user?.email || "Admin",
      userRole: req.user?.role || "admin",
      action:
        status === "Approved"
          ? "EWaste Approved"
          : status === "Rejected"
            ? "EWaste Rejected"
            : "EWaste Updated",
      details: `Submission ${submission.category} marked as ${status} for ${submitterIdentifier}`,
    });

    let totalPoints = 0;

    if (status === "Approved") {
      if (submitter) {
        if (submission.category === "others" && points) {
          // Add manually specified points for "others" category
          totalPoints = parseInt(points);
        } else {
          // Define points per category per submission
          const categoryPoints = {
            Laptop: 20,
            Tablet: 15,
            "Mobile Phone": 10,
            Telephone: 8,
            Router: 8,
            Charger: 5,
            Batteries: 5,
            Cords: 5,
            Powerbank: 10,
            USB: 5,
          };
          totalPoints = categoryPoints[submission.category] || 0;
        }

        if (totalPoints > 0) {
          submitter.points += totalPoints;
          submitter.exp += totalPoints * 2; // exp is 2x points
          await submitter.save();
          await updateUserRank(submitter._id);
        }
      }
    }

    // send email notification
    if (
      submitter &&
      submitter.email &&
      (status === "Approved" || status === "Rejected")
    ) {
      const emailData = {
        userFirstName: submitter.firstName || submitter.name?.split(" ")[0],
        category: submission.category,
        status,
        submissionId: submission._id.toString(),
        pointsEarned: status === "Approved" ? totalPoints : 0,
      };

      try {
        await sendEwasteStatusEmail(submitter.email, emailData);
      } catch (emailError) {
        console.error("Failed to send e-waste status email:", emailError);
        // Don't fail the request if email fails
      }
    }

    res
      .status(200)
      .json({ message: "Status and image data updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update status" });
  }
};

// Delete e-waste submission and its image files
const deleteEWaste = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await EWaste.findById(id);

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    for (const file of submission.attachments) {
      await deleteAttachment(file);
    }

    await EWaste.findByIdAndDelete(id);

    // Log activity attributed to the current admin
    await ActivityLog.create({
      userId: req.user?._id || null,
      userEmail: req.user?.email || "Admin",
      userRole: req.user?.role || "admin",
      action: "EWaste Deleted",
      details: `Deleted submission of ${submission.category} by ${req.user?.name || "Admin"}`,
    });

    res
      .status(200)
      .json({ message: "E-waste submission deleted successfully" });
  } catch (err) {
    console.error("Error deleting e-waste submission:", err);
    res.status(500).json({ message: "Server error while deleting submission" });
  }
};

module.exports = {
  getEwastes,
  getAllSubmissions,
  updateSubmissionStatus,
  deleteEWaste,
};
