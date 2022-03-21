const mongoose = require('mongoose');

const ShortlinkSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    newURL: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    destinationURL: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})
module.exports = mongoose.model('Shortlink', ShortlinkSchema);