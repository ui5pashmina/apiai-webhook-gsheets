var googleapis = require('googleapis'),
    OAuth2Client = googleapis.OAuth2Client,
    client = '319581784556-s0g3ado0l1ipbl88avtkn0f81b6mr77u.apps.googleusercontent.com',
    secret = 'dCFxkJfrrrRULcyZD6Og81M0',
    redirect = 'urn:ietf:wg:oauth:2.0:oob',
    oauth2Client = new OAuth2Client(client, secret, redirect);

exports.ping = function() {
    console.log('pong');
};