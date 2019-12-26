const mongoose = require('mongoose');

//DB Schema
const searchResultSchema = mongoose.Schema({
    petId: {
        type: String,
        required: true,
        trim: true
    },
    petURI: {
        type: String,
        // required: true,
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
    img: {
        type: String,
        trim: true
    }
}, { timestamps: true });

const searchResult = mongoose.model('searchResult', searchResultSchema);

//Export the model
module.exports = { searchResult }