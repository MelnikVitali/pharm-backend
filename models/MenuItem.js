const { Schema, model } = require('mongoose');

const { title, integerPosition } = require('../utils/validatorPattern');
const createValidate = require('../utils/createValidate');

const { integerPositionValid, nameValid } = createValidate(integerPosition, title);

const menuItemSchema = new Schema({
    menuItemTitle: {
        type: String,
        trim: true,
        required: [ true, title.required ],
        validate: nameValid
    },
    menuId: {
        type: Schema.Types.ObjectId,
        ref: 'Menu'
    },
    subMenu: {
        type: Schema.Types.ObjectId,
        ref: 'MenuItem',
        default: null
    },
    position: {
        type: Number,
        required: [ true, integerPosition.required ],
        validate: integerPositionValid
    }
});

module.exports = model('MenuItem', menuItemSchema);
