const Image = require('../../models/Image');

module.exports = (app) => {
    app.get('/images/:id', async (req, res) => {
        try {
            const result = await Image.findById(req.params.id);

            if (result === null) {
                const errorMessage = `Image with _id: ${req.params.id} not found!`;
                console.log(errorMessage);

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
            res.send({
                status: 'Error',
                message: err
            });
        }

    });
};
