const { Schema, model } = require('mongoose');

const imageSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    base64: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('Image', imageSchema);
