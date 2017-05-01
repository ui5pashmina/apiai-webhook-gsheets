var fs         = require('fs');
var readline   = require('readline');
var google     = require('googleapis');
var googleAuth = require('google-auth-library');

// Add Express and Body-Parser dependencies
const express = require('express');
const bodyParser = require('body-parser');
const restService = express();

restService.use(bodyParser.urlencoded({
    extended: true
}));

restService.use(bodyParser.json());

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json
var SCOPES = [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/spreadsheets.readonly'
    ];

// var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
//     process.env.USERPROFILE) + '/.credentials/';

// var TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-nodejs-webhook.json';
   var TOKEN_PATH = "./tokenAPI.json";
  
// Load client secrets from a local file.
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the
  // Google Sheets API.

  authorize(JSON.parse(content), createTicket);
  authorize(JSON.parse(content), getTicketList);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'online',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Print the ticket classified from API.AI in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1zqJZwZCFB3YNxNh4NBGh1-O1A39XDqtm_HstBOFyJO8/edit
 */
function createTicket(auth) {
  var sheets = google.sheets('v4');
  
  restService.post('/create_ticket', (req, res)=>{
    var res_speech = req.body.result && req.body.result.parameters && req.body.result.parameters.issue_type ? req.body.result.parameters.echoText : "Seems like some problem. Speak again.";

    sheets.spreadsheets.values.append({
        auth: auth,
        spreadsheetId: '1zqJZwZCFB3YNxNh4NBGh1-O1A39XDqtm_HstBOFyJO8',
        range: 'PA Ticket!all',
        valueInputOption: 'USER_ENTERED',
        includeValuesInResponse: true,
        resource: {
            values:  [[req.body.result.resolvedQuery, req.body.result.parameters.issue_module]]
        }

    }, function(err, response) {
        if (err) {
         console.log('The API returned an error: ' + err);
        return;
    }
        var res_text = "Ticket Classificato! Puoi controllare l'inserimento all'indirizzo: https://docs.google.com/spreadsheets/d/1zqJZwZCFB3YNxNh4NBGh1-O1A39XDqtm_HstBOFyJO8/edit"
        return res.json({
         speech: res_text,
         displayText: res_text,
         source: 'apiai-google-sheets-webhook'   
        });

    });
  });
  
}

/**
 * Print the ticket classified from API.AI in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1zqJZwZCFB3YNxNh4NBGh1-O1A39XDqtm_HstBOFyJO8/edit
 */
function getTicketList(auth) {
  var sheets = google.sheets('v4');

  restService.get('/get_ticket', (req, res)=>{
    sheets.spreadsheets.values.get({
        auth: auth,
        spreadsheetId: '1zqJZwZCFB3YNxNh4NBGh1-O1A39XDqtm_HstBOFyJO8',
        range: 'PA Ticket!A:B',
    }, function(err, response) {
        if (err) {
        console.log('The API returned an error: ' + err);
        return;
        }
        var rows = response.values;
        if (rows.length == 0) {
        console.log('No data found.');
        } else {
        //console.log('Name, Major:');
        res.send(response.values.map(([intent, action, module])=>({intent, action, module})));
        // for (var i = 0; i < rows.length; i++) {
        //     var row = rows[i];
        //     // Print columns A and E, which correspond to indices 0 and 4.
        //     console.log('%s, %s, %s', row[0], row[1], row[2]);
        // }
        }
    });   
  });

}

// Setup HTTP listener
restService.listen((process.env.PORT || 5000), function() {
    console.log("Server up and listening");
});


