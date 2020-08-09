const passport = require('passport');

module.exports = (app) => {
    app.get(
        "/current",
        passport.authenticate('jwt', { session: false }),
        (req, res) => {
            res.json({
                'results':
                    {
                        'status': 'Success',
                        'message': ' You are Authorized user'
                    },
                id: req.user.id,
                name: req.user.name,
                login: req.user.login,
                date: req.user.date.getTime()
            });
        }
    );
};
