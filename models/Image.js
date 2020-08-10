const { Schema, model } = require('mongoose');

const imageSchema = new Schema({
    imageName: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    base64: {
        type: String,
    }
});

module.exports = model('Image', imageSchema);
