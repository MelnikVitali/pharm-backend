const MenuItem = require('../../../models/MenuItem');

module.exports = (app) => {
    app.put('/menus/:menuId/items/:id', async (req, res) => {

        const updatedMenuItem = {
            menuItemTitle: req.body.menuItemTitle,
            subMenu: req.body.subMenu,
            position: req.body.position
        };

        const options = {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
            runValidators: true
        };

        try {
            const result = await MenuItem.findByIdAndUpdate(req.params.id, updatedMenuItem, options);

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
