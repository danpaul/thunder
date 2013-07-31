p = console.log

//----------------------------------------------------------------------
// Require
//----------------------------------------------------------------------

var config = require('./config'),
	express = require('express'),
	mongoose = require('mongoose');

var helpers = require(config.helpersFile);
var validate = require(config.validationFile);
var controller = require(config.controllersDirectory);
	
mongoose.connect(config.dbURI);

//----------------------------------------------------------------------

var app = express();
app.use(express.bodyParser());

app.get('/api/monthly/borough/:borough/:startDate/:endDate', function(req, res)
{
	var requestParams =
	{
		startDate: validate.buildDate(req.params.startDate),
		endDate: validate.buildDate(req.params.endDate),
		borough: validate.buildBorough(req.params.borough)
	};
	var validation = validate.validateParams(requestParams);
	if(validation === true)
	{
		controller.monthlyBoroughSummaries.get(req, res, requestParams);
	}else{
		res.send(400, validation);		
	}
});

app.get('*', function (req, res)
{
  res.status(404);
  res.send('not found');
});

app.listen(3000);

//----------------------------------------------------------------------
// Testing
//----------------------------------------------------------------------

//var meta = require(config.modelsDirectory + '/meta');
var meta = require(config.modelsDirectory).meta;

//salesRecordModel = require(config.modelsDirectory).salesRecords;
var salesRecord = require(config.modelsDirectory).salesRecords;
//salesRecord.buildCollection();
//salesRecord.model.findOne(function(e,r){p(r)});

//p(salesRecordModel);
//meta.buildZipList();

// var m = require(config.modelsDirectory).monthlyBoroughSummaries.model;

// m.find({
	// date:{$gte: new Date(2004, 0, 1), $lt: new Date(2004, 11, 1)}},
	// function(err, record)
// {
	// console.log(record);

// });

		// .find(
		// {
			// saleDate: {$gte: startDate.getTime(), $lte: endDate.getTime()},
			// borough: borough
		// })

// var boroughSummary = require(config.modelsDirectory + '/monthly_borough_summaries');
// var startDate = new Date(2004, 0, 1);
// var endDate = new Date(2005, 0, 1);

// boroughSummary.buildMonthlyBoroughSummary(startDate, endDate);

//--------------------------------------------------------------------

// var controller = require(config.controllersDirectory).salesRecords;
// controller.upsertCollection();

// var salesRecordModel = require(config.modelsDirectory + '/sales_records').model;

// salesRecordModel.findOne(function(err, doc) {
	// console.log(doc);
// });