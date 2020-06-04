const Menu = require("../../models/Menu");

module.exports = (app) => {
    app.get('/menus', async (req, res) => {

        try {
            const result = await Menu.find(req.query);

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
