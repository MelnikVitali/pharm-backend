const { Schema, model } = require('mongoose');

const { title } = require('../utils/validatorPattern');
const createValidate = require('../utils/createValidate');

const { nameValid } = createValidate(title);

const menuSchema = new Schema({
    menuTitle: {
        type: String,
        trim: true,
        required: [ true, title.required ],
        validate: nameValid
    }
});

module.exports = model('Menu', menuSchema);
