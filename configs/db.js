module.exports = {
    mongoURI: 'mongodb+srv://vitaliy:vitali@cluster0.nlnwp.mongodb.net/final-pharm?retryWrites=true&w=majority',
    jwt: {
        secret: 'secret',
        tokens: {
            accessSignUp:{
                type: 'access',
                expiresIn:'15m'
            },
            access: {
                type: 'access',
                expiresIn: '5m'
            },
            refresh: {
                type: 'refresh',
                expiresIn: '360m'
            },
        },
    },
};
