const bcrypt = require("bcrypt");

async function hashPassword(password) {
    return bcrypt.hash(password, 12);
}

function comparePassword(password, hashed) {
    return bcrypt.compare(password, hashed);
}

module.exports = {
    hashPassword,
    comparePassword
}