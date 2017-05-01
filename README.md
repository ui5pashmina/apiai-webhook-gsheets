# apiai-webhook-gsheets - Integrate Google Sheets API v4 with NodeJS consuming webhook via API.ai

A barebones Node.js app using [Express 4](http://expressjs.com/).

This application supports the [Getting Started with Node on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs) article - check it out.

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku CLI](https://cli.heroku.com/) installed.

```sh
$ git clone git@github.com:ui5pashmina/apiai-webhook-gsheets.git # or clone your own fork
$ cd apiai-webhook-gsheets
$ npm install
$ npm start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku

```
$ heroku create
$ git push heroku master
$ heroku open
```
or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

## How it works?

For more information about how to write Google Spreadsheets using API.ai consuming WebHook Node.js on Heroku, see these prerequisites:

- [Google Consle Developer -> Enable Google Sheets API and get credential for NodeJS Application](https://console.developers.google.com)
- [Google Console Developer -> How to get OAuth 2.0 Playground](https://developers.google.com/oauthplayground)
- [Google Sheets -> Fetch "spreadsheetID" from your Sheet](https://docs.google.com/spreadsheets/u/0/)
- [Github -> Deploy NodeJS Google Spreadsheets Data API Code application](https://github.com/ui5pashmina/API.ai-Heroku-NodeJS-GSheets)
- [Heroku -> Push NodeJS application on Heroku (PaaS) to run the Web Server](https://www.heroku.com/)
- [API.AI -> Create Virtual Agent](https://console.api.ai)
- [API.AI -> Activate Webhook and your Web Service will receive a POST request from API.AI](https://console.api.ai)

## Documentation

For more information about using Node.js on Heroku, see these Dev Center articles:

- [Getting Started with Node.js on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
- [Using WebSockets on Heroku with Node.js](https://devcenter.heroku.com/articles/node-websockets)
