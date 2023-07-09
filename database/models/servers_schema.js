const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
    serverID: { type: String },
    serverName: { type: String },
    prefix: { type: String },
    owner: { type: String },
    members: { type: String },
    updates: { type: String },
    preferredLocale: { type: String },
    categoryID: { type: String },
    channelId: { type: String },
    cmdId: { type: String },
    helpId: { type: String },
})

const model = mongoose.model('serversModels', serverSchema);

module.exports = model;