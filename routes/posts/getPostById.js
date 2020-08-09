const passport = require("passport");

const Post = require('../../models/Post');

module.exports = (app) => {
    app.get("/posts/:id",
        passport.authenticate("jwt", { session: false }),
        async (req, res) => {
            try {
                const post = await Post.findOne({ _id: req.params.id })
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

                if (post) {
                    return res.json(post);
                } else {
                    const errors = { error: "Пост не найден" };

                    return res
                        .status(404)
                        .json(errors);
                }
            } catch (err) {
                const errors = { error: "Ошибка при запросе к API" };

                return res
                    .status(400)
                    .json(errors);
            }
        });
};