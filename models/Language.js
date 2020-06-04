const {Schema, model} = require("mongoose");

const LanguageShema = new Schema({
    language: String
});

module.exports = model('Language', LanguageShema);
