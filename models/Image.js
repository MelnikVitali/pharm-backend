const { Schema, model } = require('mongoose');

const imageSchema = new Schema({
    imageName: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    }
});

module.exports = model('Image', imageSchema);
