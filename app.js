//npm install to insall packages
var THUNDER_DB_URI = "mongodb://localhost:27017/exampleDb";

var thunder = {};

////////////////////////////////////////////////////////////////////////////////////////
var csv = require('./csv');
csv.testFunction();

var express = require('express');
var thunderExpress = express();

thunderExpress.use(express.bodyParser());
thunderExpress.locals.title = 'textNIL'
thunderExpress.set('views', __dirname + '/views')
thunderExpress.set('view engine', 'jade')
thunderExpress.use(express.static(__dirname + '/public'))

// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect(THUNDER_DB_URI, function(err, db) {
  if(!err) {
    console.log("We are connected");
  }
});

// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect(THUNDER_DB_URI, function(err, db) {
  if(err) { return console.dir(err); }

  db.collection('test', function(err, collection) {});

});

thunderExpress.get('*', function (req, res) {
  res.send('test');
})

//console.log(thunder.csvImport.testFunction());

//thunder.csvImport.csvParse();

//thunderExpress.listen(3000);