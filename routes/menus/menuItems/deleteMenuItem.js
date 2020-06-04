const MenuItem = require('../../../models/MenuItem');

module.exports = (app) => {
    app.delete('/menus/:menuId/items/:id', async (req, res) => {

        try {
            const result = await MenuItem.findByIdAndDelete(req.params.id);

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
