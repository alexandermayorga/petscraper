const mongoose = require('mongoose');

//DB Schema
const petLinkSchema = mongoose.Schema({
    petId: {
        type: String,
        required: true,
        trim: true
    },
    petURI: {
        type: String,
        required: true,
        trim: true
    },
    domain: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

const petLink = mongoose.model('petLink', petLinkSchema);

//Export the model
module.exports = { petLink }