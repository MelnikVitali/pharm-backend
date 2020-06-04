const File = require('../../models/File');

module.exports = (app) => {
    app.get('/files/:id', async (req, res) => {

        try {
            const result = await File.findById(req.params.id);

            if (result === null) {
                const errorMessage = `File with _id: ${req.params.id} not found!`;
                console.log(errorMessage);

                return res
                    .status(400)
                    .json({
                        status: 'Error',
                        error: errorMessage
                    })
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
