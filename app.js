var config = require('./config');

//----------------------------------------------------------------------
// Require
//----------------------------------------------------------------------

var express = require('express');
var mongoose = require('mongoose');
mongoose.connect(config.dbURI);

//----------------------------------------------------------------------

var app = express();
app.use(express.bodyParser());

app.get('*', function (req, res) {
  res.send('test');
})

//----------------------------------------------------------------------
// Testing
//----------------------------------------------------------------------

// var boroughSummary = require(config.modelsDirectory + '/monthly_borough_summaries');
// var startDate = new Date(2004, 0, 1);
// var endDate = new Date(2005, 0, 1);

// boroughSummary.buildMonthlyBoroughSummary(startDate, endDate);

//--------------------------------------------------------------------

var controller = require(config.controllersDirectory).salesRecords;
controller.upsertCollection();

var salesRecordModel = require(config.modelsDirectory + '/sales_records').model;

salesRecordModel.findOne(function(err, doc) {
	console.log(doc);
});