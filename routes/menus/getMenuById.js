const Menu = require('../../models/Menu');

module.exports = (app) => {
    app.get('/menus/:id', async (req, res) => {

        try {
            const result = await Menu.findById(req.params.id);

            res.send({
                status: 'Success',
                result: result
            });
        } catch (err) {
            res.send({
                status: 'Error',
                message: err.message
            });
        }
    });
};
