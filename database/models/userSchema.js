const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    memberId: { type: String },
    blacklist: { type: Array },
    closeList: { type: Array },
    name: { type: String },
    limit: { type: Number },
})

const model = mongoose.model('profileModels', userSchema);

module.exports = model;