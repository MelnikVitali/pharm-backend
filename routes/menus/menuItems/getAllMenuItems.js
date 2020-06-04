const MenuItem = require('../../../models/MenuItem');

module.exports = (app) => {
    app.get('/menus/:id/items', async (req, res) => {

        try {
            const result = await MenuItem.find({ menuId: req.params.id });

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
