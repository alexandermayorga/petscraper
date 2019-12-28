const mongoose = require('mongoose');

//DB Schema
const petSchema = mongoose.Schema({
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
    name: {
        type: String,
        required: true,
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
    img: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        required: true,
        default: "Active"
    }
}, { timestamps: true });

const petModel = mongoose.model('petModel', petSchema);

//Export the model
module.exports = { petModel }