const fs = require('fs');
const path = require('path');

const Image = require('../../models/Image');

module.exports = (app) => {
    app.delete('/images/:id', async (req, res) => {
        try {
            const image = await Image.findById(req.params.id);

            if (image === null) {
                const errorMessage = `File with _id: ${req.params.id} not found!`;
                console.log(errorMessage);

                return res
                    .status(400)
                    .json({
                        status: 'Error',
                        error: errorMessage
                    });
            }

            const webpImage = `${image.imageName}.webp`;
            const pngImage = `${image.imageName}.png`;

            await fs.unlink(
                path.join(__dirname, '/../../public/uploads/images', webpImage),
                (err) => {
                    if (err) {
                        console.log(err.message);

                        return res
                            .status(400)
                            .json({
                                status: 'Error',
                                error: err.message
                            });
                    }

                    console.log(`Successfully deleted local image ${webpImage}`);
                });

            await fs.unlink(
                path.join(__dirname, '/../../public/uploads/images', pngImage),
                (err) => {
                    if (err) {
                        console.log(err.message);

                        return res
                            .status(400)
                            .json({
                                status: 'Error',
                                error: err.message
                            });
                    }

                    console.log(`Successfully deleted local image ${pngImage}`);
                });

            const result = await Image.findByIdAndRemove(req.params.id);

            await res.send({
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
