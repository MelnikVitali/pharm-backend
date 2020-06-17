const passport = require("passport");

const Post = require('../../models/Post');
const Comments = require('../../models/Comment');

module.exports = (app) => {
    app.delete(
        "/comment/:id",
        passport.authenticate("jwt", { session: false }),
        async (req, res) => {
            const comment = await Comments.findOne({
                _id: req.params.id
            });

            if (comment) {
                if (comment.author._id.toString() === req.user._id) {
                    await Comments.findOneAndDelete({ _id: req.params.id });

                    await Post.findOneAndUpdate(
                        { _id: comment.post },
                        { $pull: { comments: req.params.id } }
                    );

                    const newPost = await Post.findOne({ _id: comment.post })
                        .populate({
                            path: "author",
                            select: "name"
                        })
                        .populate({
                            path: "comments",
                            populate: {
                                path: "author",
                                select: "name"
                            }
                        });

                    return res.json(newPost);
                } else {
                    return res.json({
                        error: "You don't have permissions on deleteing this comment"
                    });
                }
            } else {
                return res.json({ error: "Comment not found" });
            }
        }
    );
};