const mongoose = require('mongoose');

//DB Schema
const petSchema = mongoose.Schema({
    petId: {
        type: String,
        required: true,
        trim: true
    },
    petUUID: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    domain: {
        type: String,
        required: true,
        trim: true
    },
    petURI: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        trim: true
    },
    breed: {
        type: String,
        trim: true
    },
    sex: {
        type: String,
        trim: true
    },
    age: {
        type: String,
        trim: true
    },
    imgs: {
        type: [String]
    },
    status: {
        type: String,
        required: true,
        default: "Active"
    }
}, { timestamps: true });

const Pet = mongoose.model('Pet', petSchema);

//Export the model
module.exports = Pet