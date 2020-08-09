const passport = require("passport");

const Post = require('../../models/Post');

module.exports = (app) => {
    app.delete(
        "/posts/:id",
        passport.authenticate("jwt", { session: false }),
        async (req, res) => {
            const post = await Post.findOne({ _id: req.params.id });

            if (post) {
                await Post.findOneAndDelete({ _id: req.params.id });

                return res.json(post);
            } else {
                return res.json({ error: "Пост не найден" });
            }
        }
    );
}