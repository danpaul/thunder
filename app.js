var config = require('./config');

//----------------------------------------------------------------------
// Require
//----------------------------------------------------------------------

var express = require('express');
var mongoose = require('mongoose');

//----------------------------------------------------------------------

var app = express();
app.use(express.bodyParser());

app.get('*', function (req, res) {
  res.send('test');
})

//----------------------------------------------------------------------
// Testing
//----------------------------------------------------------------------

var controller = require(config.controllersDirectory).salesRecords;
controller.upsertCollection();

var salesRecordModel = require(config.modelsDirectory + '/sales_records').createModel();

salesRecordModel.findOne(function(err, doc) {
	console.log(doc);
});