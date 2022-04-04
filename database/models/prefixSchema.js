const mongoose = require('mongoose');

const prefixSchema = new mongoose.Schema({
    serverID: { type: String },
    serverName: { type: String },
    prefix: { type: String },
})

const model = mongoose.model('prefixModels', prefixSchema);

module.exports = model;