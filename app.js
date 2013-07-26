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

var boroughSummary = require(config.modelsDirectory + '/monthly_borough_summaries');
var startDate = new Date(2004, 0, 1);
var endDate = new Date(2005, 0, 1);

boroughSummary.buildMonthlyBoroughSummary(startDate, endDate);

//var p = console.log;

// function getMedian(dataArray)
// {
	// dataArray.sort(function(x, y){return x-y});
	// if(dataArray.length % 2 == 0)
	// {
		// return((data[dataArray.length/2-1] + data[dataArray.length/2]) / 2.0);
	// }else{
		// return(data[Math.floor(dataArray.length/2)]);
	// }
// }

// var data = [10, 6.2, 4.1, 2.2, 1.3];

// p(getMedian(data));
// p(data);





//var salesRecordModel = require(config.modelsDirectory + '/sales_records');

// salesRecordModel.getEarliestRecord(function(err, record)
  // {
    // if(err)
    // {
      // console.log(err);
    // }else{
      // console.log(record);
    // }
  // });


//--------------------------------------------------------------------

// var controller = require(config.controllersDirectory).salesRecords;
// controller.upsertCollection();

// var salesRecordModel = require(config.modelsDirectory + '/sales_records').createModel();

// salesRecordModel.findOne(function(err, doc) {
	// console.log(doc);
// });