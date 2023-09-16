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
                expiresIn: '15s' //45m
            },
            refresh: {
                type: 'refresh',
                expiresIn: '12h' //12h
            },
        },
    }
};
