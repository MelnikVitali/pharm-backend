const Menu = require('../../models/Menu');

module.exports = (app) => {
    app.post('/menus', async (req, res) => {

        const menu = new Menu({
            menuTitle: req.body.menuTitle
        });

        try {
            const result = await menu.save();

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
