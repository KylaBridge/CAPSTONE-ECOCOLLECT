const express = require("express");
const router = express.Router();
const {
	sanitizeFilePaths,
	validateUrlParameters,
} = require("../middleware/securityMiddleware");
const { getSignedApkUrl } = require("../controllers/downloadApkController");

router.use(sanitizeFilePaths);
router.use(validateUrlParameters);

router.get("/apk-url", getSignedApkUrl);

module.exports = router;
