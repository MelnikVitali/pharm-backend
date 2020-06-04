const MenuItem = require('../../../models/MenuItem');

module.exports = (app) => {
    app.post('/menus/:menuId/items', async (req, res) => {

        const menuItem = new MenuItem({
            menuItemTitle: req.body.menuItemTitle,
            menuId: req.params.menuId,
            subMenu: req.body.subMenu,
            position: req.body.position
        });

        try {
            const result = await menuItem.save();

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
