const mongoose = require('mongoose');

const tempSchema = new mongoose.Schema({
    memberId: { type: String },
    serverID: { type: String },
    serverName: { type: String },
    channelId: { type: String },
    isInChannel: { type: Boolean },
    isFriendsPermit: { type: Boolean },
})

const model = mongoose.model('tempModels', tempSchema);

module.exports = model;