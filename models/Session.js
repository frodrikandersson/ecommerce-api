const mongoose = require('mongoose');

const SessionSchema = mongoose.Schema({
    session: [String],
    expiresAt: { type: Date, expires: 60, default: Date.now}
});

module.exports = mongoose.model('Session', SessionSchema);