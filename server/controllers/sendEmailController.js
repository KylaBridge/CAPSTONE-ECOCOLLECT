const { sendContactEmail } = require("../helpers/mail");

// Controller to handle Contact Us form submissions
// Expects body: { name, email, phone?, company?, message }
const sendContactMessage = async (req, res) => {
	try {
		const { name, email, phone, company, message } = req.body || {};

		// Basic validations mirroring client-side
		if (!name || !name.trim()) {
			return res.status(400).json({ error: "Name is required" });
		}
		if (!email || !email.trim()) {
			return res.status(400).json({ error: "Email is required" });
		}
		const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({ error: "Invalid email address" });
		}
		if (!message || !message.trim()) {
			return res.status(400).json({ error: "Message is required" });
		}

		const result = await sendContactEmail({
			fromName: name.trim(),
			fromEmail: email.trim(),
			phone: phone?.toString().trim(),
			company: company?.toString().trim(),
			message: message.trim(),
		});

		if (result && result.accepted && result.accepted.length > 0) {
			return res.status(200).json({ message: "Message sent" });
		}

		// If nodemailer returned an error object
		if (result instanceof Error) {
			return res.status(500).json({ error: result.message });
		}

		// Fallback generic response if we couldn't verify delivery
		return res
			.status(202)
			.json({ message: "Message queued for delivery" });
	} catch (error) {
		return res.status(500).json({ error: "Failed to send message" });
	}
};

module.exports = { sendContactMessage };
