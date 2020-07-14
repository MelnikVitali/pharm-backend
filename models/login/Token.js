const { Schema, model } = require("mongoose");

const TokenSchema = new Schema({
    tokenId: String,
    userId: String,
});

module.exports = model("Token", TokenSchema);
