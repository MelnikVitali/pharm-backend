module.exports = {
    jwt: {
        tokens: {
            accessEmailConfirm: {
                type: 'access',
                expiresIn: '24h' //24h
            },
            accessForgotPassword: {
                type: 'access',
                expiresIn: '1h' //1h
            },
            access: {
                type: 'access',
                expiresIn: '20m' //20m
            },
            refresh: {
                type: 'refresh',
                expiresIn: '12h' //12h
            },
        },
    },
};
