const mongoose = require('mongoose');

const ShortlinkSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    shortenedURLelement: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    destinationURL: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
})

module.exports = mongoose.model('Shortlink', ShortlinkSchema);

const ShortlinkAccessSchema = new mongoose.Schema({
    shortlink_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Shortlink' },
    timestamp: { type: Date },
    ip: { type: String },
    country: { type: String },
    device: { type: String },
    browser: { type: String },
    userAgent: { type: String },
    hostname: { type: String },
    isp: { type: String }
})

module.exports = mongoose.model('ShortlinkAccess', ShortlinkAccessSchema);