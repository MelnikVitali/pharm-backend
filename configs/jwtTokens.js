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
                expiresIn: '15m' //15m
            },
            refresh: {
                type: 'refresh',
                expiresIn: '12h' //12h
            },
        },
    },
};