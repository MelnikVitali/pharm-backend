//link to https://console.cloud.google.com/apis/credentials
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
//Link to https://developers.facebook.com/
const fetch = require('node-fetch');

const authHelper = require('../../helpers/authHelper');
const User = require('../../models/User');

const googleLogin = (req, res) => {
    const { tokenId } = req.body;

    client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.GOOGLE_CLIENT_ID
    })
        .then(response => {
            const { email_verified, name, email } = response.payload;

            if (email_verified) {
                authHelper.socialAuth(res, User, name, email);
            }
        });
};

const facebookLogin = (req, res) => {
    const { userID, accessToken } = req.body;
    const urlGraphFacebook = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;

    fetch(urlGraphFacebook, { method: 'GET' })
        .then(response => response.json())
        .then(response => {
            const { email, name } = response;

            authHelper.socialAuth(res, User, name, email);
        });
};

module.exports = {
    facebookLogin,
    googleLogin,
};