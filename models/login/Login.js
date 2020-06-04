const { Schema, model } = require("mongoose");

const loginSchema = new Schema({
    name: {
        type: String
    },
    login: {
        type: String,
        required: [ true, 'This field should not be empty' ],
        unique: [ true, 'Такой login уже существует' ]
    },
    password: {
        type: String,
        min: 6,
        max: 50,
        required: [true, 'This field should not be empty']
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = model("Login", loginSchema);
