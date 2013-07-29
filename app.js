p = console.log

//----------------------------------------------------------------------
// Require
//----------------------------------------------------------------------

var config = require('./config'),
	express = require('express'),
	mongoose = require('mongoose');

var helpers = require(config.helpersFile);
var validate = require(config.validationFile);
	
mongoose.connect(config.dbURI);

//----------------------------------------------------------------------

var app = express();
app.use(express.bodyParser());

app.get('/api/:borough/month/:startDate/:endDate', function(req, res)
{
	var requestParams =
	{
		startDate: validate.buildDate(req.params.startDate),
		endDate: validate.buildDate(req.params.endDate),
		borough: validate.buildBorough(req.params.borough)
	};
//p(requestParams);
	var validation = validate.validateParams(requestParams);
	if(validation === true)
	{
		//process request
	}else{
		res.send(400, validation);		
	}
	
	res.send('success');

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