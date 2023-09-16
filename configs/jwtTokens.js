module.exports = {
    jwt: {
        tokens: {
            accessEmailConfirm: {
                type: 'access',
                expiresIn: '24h' //24h
            },
            accessForgotPassword: {
                type: 'access',
                expiresIn: '3h' //3h
            },
            access: {
                type: 'access',
                expiresIn: '12h' //45m
            },
            refresh: {
                type: 'refresh',
                expiresIn: '24h' //12h
            },
        },
    }
};
