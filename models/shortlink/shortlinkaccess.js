const mongoose = require('mongoose');

const ShortlinkAccessSchema = new mongoose.Schema({
    shortlink: { type: mongoose.Schema.Types.ObjectId, ref: 'Shortlink' },
    timestamp: { type: Date },
    ip: { type: String },
    location: { type: String },
    device: { type: String },
    browser: { type: String },
    coordinates: { type: [String] }
})
module.exports = mongoose.model('ShortlinkAccess', ShortlinkAccessSchema);