const passport = require("passport");

const Image = require('../../models/Image');

module.exports = (app) => {
    app.delete('/pictures/:id',
        passport.authenticate("jwt", { session: false }),
        async (req, res) => {
            try {
                const image = await Image.findById(req.params.id);

                if (image === null) {
                    const errorMessage = `Image with _id: ${req.params.id} not found!`;
                    console.error(errorMessage);

                    return res
                        .status(400)
                        .json({
                            status: 'Error',
                            error: errorMessage
                        });
                }

                const result = await Image.findByIdAndRemove(req.params.id);

                await res.send({
                    status: 'Success',
                    result: result,
                    message: `Изображение: ${image.name} успешно удалено!`
                });
            } catch (err) {
                res.send({
                    status: 'Error',
                    message: err
                });
            }
        });
};
