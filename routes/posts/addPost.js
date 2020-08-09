const passport = require("passport");

const Post = require('../../models/Post');

module.exports = (app) => {
    app.post(
        "/posts",
        passport.authenticate("jwt", { session: false }),
        async (req, res) => {
            let newPost = new Post({
                title: req.body.title,
                text: req.body.text,
                author: req.user
            });

            try {
                newPost = await newPost.save();

                return res.json(newPost);
            } catch (err) {
                const errors = { error: "Ошибка при создании поста" };

                return res
                    .status(400)
                    .json(errors);
            }
        }
    );
};