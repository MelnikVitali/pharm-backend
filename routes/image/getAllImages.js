const Image = require("../../models/Image");

module.exports = (app) => {
    app.get('/images', async (req, res) => {

        try {
            const result = await Image.find(req.query);

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
