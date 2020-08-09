const passport = require("passport");

const Post = require('../../models/Post');

const apiError = "Ошибка при запросе к API";

module.exports = (app) => {
    app.put(
        "/posts/:id",
        passport.authenticate("jwt", { session: false }),
        async (req, res) => {
            try {
                let post = await Post.findOne({ _id: req.params.id });

                if (post) {
                    post = await Post.findOneAndUpdate(
                        {
                            _id: post._id
                        },
                        {
                            $set: {
                                title: req.body.title,
                                text: req.body.text
                            }
                        },
                        {
                            new: true
                        }
                    );

                    return res.json(post);
                } else {
                    const errors = { error: "Пост не найден" };

                    return res
                        .status(404)
                        .json({ errors });
                }
            } catch (e) {
                const errors = { error: apiError };

                return res
                    .status(404)
                    .json({ errors });
            }
        }
    );
};
