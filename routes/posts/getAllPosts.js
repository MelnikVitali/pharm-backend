const passport = require("passport");

const Post = require('../../models/Post');

const apiError = "Ошибка при запросе к API";

module.exports = (app) => {
    app.get("/posts",
        passport.authenticate("jwt", { session: false }),
        async (req, res) => {
            try {
                const posts = await Post.find()
                    .populate({
                        path: "comments",
                        populate: {
                            path: "author",
                            select: "name"
                        }
                    })
                    .sort({ date: -1 });

                return res.json(posts);
            } catch (e) {
                const errors = { error: apiError };

                return res
                    .status(400)
                    .json(errors);
            }
        });
};