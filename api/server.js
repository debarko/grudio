
// TODO: Find a better way to load different configs in different env
var dbConfig;
try {
    // Look for dev conf for local development
    dbConfig = require('./config/db.dev.conf.js');
} catch(e) {
    try {
        // production conf?
        dbConfig = require('./config/db.conf.js');
    } catch(e) {
        console.log('Startup failed.  No db config file found.');
        return false;
    }
}


var knex = require('knex')({
        client: 'mysql',
        connection: dbConfig
    }), 
    express = require('express'),
    bodyParser = require('body-parser'),
    expressValidator = require('express-validator'),
    passport = require('passport'),
    crypto = require('crypto'),
    Bookshelf = require('bookshelf'),
    messages = require('./util/messages');

var app = express();

Bookshelf.mysqlAuth = Bookshelf(knex);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(expressValidator());
app.use(passport.initialize());

require('./util/auth')(passport);
require('./routes')(app, passport);

app.listen(process.env.PORT || 8989);

console.log('Listening on port 8989');
