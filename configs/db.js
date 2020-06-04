module.exports = {
    mongoURI: 'mongodb+srv://Bogdan:Mankubus1986@testproject-6aeov.mongodb.net/pharm?retryWrites=true&w=majority',
    jwt: {
        secret: 'secret',
        tokens: {
            access: {
                type: 'access',
                expiresIn: '1m'
            },
            refresh: {
                type: 'refresh',
                expiresIn: '120m'
            },
        },
    },
};
