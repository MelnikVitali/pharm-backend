//See settings in https://console.cloud.google.com/apis/credentials
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
//See settings in  https://developers.facebook.com/
const fetch = require('node-fetch');

const authHelper = require('../../helpers/authHelper');
const User = require('../../models/User');

const googleLogin = async (req, res) => {
    const { tokenId } = req.body;

    await client
        .verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID
        })
        .then(response => {
            const { email_verified, name, email } = response.payload;

            if (email_verified) {
                return authHelper.socialAuth(res, User, name, email);
            }
        });
};

const facebookLogin = async (req, res) => {
    const { userID, accessToken } = req.body;

    const urlGraphFacebook = `https://graph.facebook.com/${userID}?fields=name,email&access_token=${accessToken}`;

    await fetch(urlGraphFacebook, { method: 'GET' })
        .then(response => response.json())
        .then(response => {
            const { email, name } = response;

            if (!email) {

                return res
                    .status(400)
                    .json({
                        error: 'В аккаунте Facebook не найден Ваш email.\n\nПожалуйста пройдите регистрацию на сайте, либо выполните вход через Google!'

                    });
            }

            return authHelper.socialAuth(res, User, name, email);
        });
};

module.exports = {
    facebookLogin,
    googleLogin,
};
