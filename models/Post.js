const mongoose = require("mongoose");

const Post = new mongoose.Schema({
  title: {
    type: String
  },
  text: {
    type: String
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Post", Post);
