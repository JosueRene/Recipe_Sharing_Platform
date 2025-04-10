const mongoose = require('mongoose')

const revokedTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 
    }
}, {timestamps: true})

const RevokedToken = mongoose.model('RevokedToken', revokedTokenSchema)

module.exports = RevokedToken