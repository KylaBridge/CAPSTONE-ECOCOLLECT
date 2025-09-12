const jwt = require('jsonwebtoken');

// Sign a JWT returning a promise. Default no explicit expires unless provided.
function signToken(payload, { expiresIn } = {}) {
	return new Promise((resolve, reject) => {
		const options = {};
		if (expiresIn) options.expiresIn = expiresIn; // allow optional expiry
		jwt.sign(payload, process.env.JWT_SECRET, options, (err, token) => {
			if (err) return reject(err);
			resolve(token);
		});
	});
}

// Verify a JWT returning the decoded payload or throwing on error
function verifyToken(token) {
	return new Promise((resolve, reject) => {
		jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
			if (err) return reject(err);
			resolve(decoded);
		});
	});
}

module.exports = {
	signToken,
	verifyToken,
};
