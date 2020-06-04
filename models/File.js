const { Schema, model } = require('mongoose');

const fileSchema = new Schema({
    fileName: {
        type: String,
        trim: true,
        required: [true, 'The file name must be specified.']
    },
    originalName: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    }
});

module.exports = model('File', fileSchema);
