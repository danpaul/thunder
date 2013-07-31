p = console.log

printRecord = function(e,r){if(e){p(e)}else{p(r)}};

//----------------------------------------------------------------------
// Require
//----------------------------------------------------------------------

var config = require('./config'),
	express = require('express'),
	mongoose = require('mongoose');
	//path = require('path');

var helpers = require(config.helpersFile);
var validate = require(config.validationFile);
var controller = require(config.controllersDirectory);
	
mongoose.connect(config.dbURI);

//----------------------------------------------------------------------

var app = express();
app.use(express.bodyParser());

app.get('/api/monthly/borough/:borough/:startDate/:endDate.:ext', function(req, res)
{
	validate.validateExention(req, res, req.params.ext);
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

app.get('/api/monthly/zip/:zipCode/:startDate/:endDate.:ext', function(req, res)
{
	validate.validateExention(req, res, req.params.ext);
	var requestParams =
	{
		startDate: validate.buildDate(req.params.startDate),
		endDate: validate.buildDate(req.params.endDate),
		zipCode: req.params.zipCode
	};
	var validation = validate.validateParams(requestParams);
	if(validation === true)
	{
		controller.monthlyZipSummaries.get(req, res, requestParams);
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

//require(config.salesRecordModelfile).buildCollection();

//p((" a b c ").trim().replace(/ /g, '-'));

var monthlyNeighborhood = require(config.modelsDirectory).monthlyNeighborhoodSummaries;

monthlyNeighborhood.buildMonthlyNeighborhoodSummary();

//var monthlyZip = require(config.modelsDirectory + '/monthly_zip_summaries');

//monthlyZip.buildMonthlyZipSummary(new Date(2000, 0, 1), new Date(2014, 9, 1));

//monthlyZip.model.findOne(printRecord)

//var monthlyZip = require(config.modelsDirectory + '/monthly_zip_summaries');

//monthlyZip.buildMonthlyZipSummary(new Date(2000, 0, 1), new Date(2014, 9, 1));

//monthlyZip.model.findOne(printRecord)