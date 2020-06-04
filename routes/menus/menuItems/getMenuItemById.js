const MenuItem = require('../../../models/MenuItem');

module.exports = (app) => {
    app.get("/menus/:id/items/:key", async (req, res) => {

        try {
            const result = await MenuItem.findById(req.params.key);

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
