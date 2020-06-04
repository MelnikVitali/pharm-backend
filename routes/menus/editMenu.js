const Menu = require('../../models/Menu');

module.exports = (app) => {
    app.put('/menus/:id', async (req, res) => {

        const updatedMenu = {
            menuTitle: req.body.menuTitle
        };

        const options = {
            new: true,
            runValidators: true
        };

        try {
            const result = await Menu.findByIdAndUpdate(req.params.id, updatedMenu, options);

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
