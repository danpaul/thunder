p = console.log

//----------------------------------------------------------------------
// Require
//----------------------------------------------------------------------

var config = require('./config'),
	express = require('express'),
	mongoose = require('mongoose');

var helpers = require(config.helpersFile);
var validate = require(config.validationFile).validateRequest;
	
mongoose.connect(config.dbURI);

//----------------------------------------------------------------------

var app = express();
app.use(express.bodyParser());

app.get('/api/:borough/month/:startDate/:endDate', function(req, res)
{
	var requestParams =
	{
		startDate: helpers.buildDate(req.params.startDate),
		endDate: helpers.buildDate(req.params.endDate),
		borough: helpers.buildBorough(req.params.borough)
	};
p(requestParams);
	var validation = validate(requestParams);
	if(validation === true)
	{
		//process request
	}else{
		res.status(400);
		res.send(validation);				
	}
//p(req.params.borough);
// p(buildDate(req.params.startDate));
// p(req.params.endDate);
res.send('foo bar');

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