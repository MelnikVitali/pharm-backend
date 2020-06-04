const File = require('../../models/File');

module.exports = (app) => {
    app.get('/files', async (req, res) => {

        try {
            const result = await File.find(req.query);

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
