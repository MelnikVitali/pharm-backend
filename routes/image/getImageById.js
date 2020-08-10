const passport = require("passport");

const Image = require('../../models/Image');

module.exports = (app) => {
    app.get('/pictures/:id',
        // passport.authenticate("jwt", { session: false }),
        async (req, res) => {
            try {
                const result = await Image.findById(req.params.id);

                if (result === null) {
                    const errorMessage = `Image with _id: ${req.params.id} not found!`;
                    console.error(errorMessage);

                    return res
                        .status(400)
                        .json({
                            status: 'Error',
                            error: errorMessage
                        });
                }

                res.send({
                    status: 'Success',
                    result: result
                });
            } catch (err) {
                res
                    .status(400)
                    .send({ error: 'Error while getting  image' });
            }
        });
};
