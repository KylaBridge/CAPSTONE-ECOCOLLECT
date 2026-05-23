const { signUrlForPath } = require("../helpers/s3");

const getRequiredEnv = (key) => {
	const value = process.env[key];
	if (!value || !String(value).trim()) {
		throw new Error(`Missing required environment variable: ${key}`);
	}
	return String(value).trim();
};

const parseRequiredPositiveInt = (key) => {
	const value = getRequiredEnv(key);
	const parsed = Number.parseInt(value, 10);
	if (!Number.isInteger(parsed) || parsed <= 0) {
		throw new Error(`Environment variable ${key} must be a positive integer.`);
	}
	return parsed;
};

const getSignedApkUrl = async (req, res) => {
	try {
		const apkPath = getRequiredEnv("APK_S3_KEY");
		const fileName = getRequiredEnv("APK_FILE_NAME");
		const expiresIn = parseRequiredPositiveInt("APK_SIGNED_URL_TTL_SECONDS");

		const signedUrl = await signUrlForPath(apkPath, expiresIn);
		if (!signedUrl) {
			return res.status(500).json({
				message: "Failed to generate APK download URL.",
			});
		}

		return res.status(200).json({
			message: "APK download URL generated successfully.",
			signedUrl,
			fileName,
			expiresIn,
		});
	} catch (error) {
		console.error("Error generating signed APK URL:", error);
		return res.status(500).json({
			message: "Failed to generate APK download URL.",
		});
	}
};

module.exports = {
	getSignedApkUrl,
};
