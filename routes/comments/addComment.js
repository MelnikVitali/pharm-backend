const passport = require("passport");

const Post = require('../../models/Post');
const Comment = require('../../models/Comment');

module.exports = (app) => {
    app.post(
        "/comment/:id",
        passport.authenticate("jwt", { session: false }),
        async (req, res) => {
            const { text } = req.body;

            console.log(req.user._id);

            let newComment = new Comment({
                text,
                author: req.user._id
            });

            newComment = await newComment.save();

            const post = await Post.findOneAndUpdate(
                { _id: req.params.id },
                { $push: { comments: newComment } },
                { new: true }
            );

            const comment = await Comment.findOneAndUpdate(
                {
                    _id: newComment._id
                },
                {
                    $set: { post }
                },
                {
                    new: true
                }
            );

            const newPost = await Post.findOne({ _id: req.params.id })
                .populate({
                    path: "author",
                    select: "name"
                })
                .populate({
                    path: "comment",
                    populate: {
                        path: "author",
                        select: "name"
                    }
                });

            return res.json(newPost);
        }
    );
};