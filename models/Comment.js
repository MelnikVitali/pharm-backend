const mongoose = require("mongoose");

const Comment = new mongoose.Schema({
  text: {
    type: String
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  date: {
    type: Date,
    default: Date.now
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  }
});

module.exports = mongoose.model("Comment", Comment);
