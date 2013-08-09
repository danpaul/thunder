//----------------------------------------------------------------------
// Require

var config = require('./config'),
	express = require('express'),
	mongoose = require('mongoose');

mongoose.connect(config.dbURI);

var config = require('./config'),
	express = require('express'),
	mongoose = require('mongoose');
	//path = require('path');

var helpers = require(config.helpersFile);
var validate = require(config.validationFile);
var controller = require(config.controllersDirectory);

//----------------------------------------------------------------------
// App

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

app.get('/api/monthly/neighborhood/:neighborhood/:startDate/:endDate.:ext', function(req, res)
{
	validate.validateExention(req, res, req.params.ext);
	var requestParams =
	{
		startDate: validate.buildDate(req.params.startDate),
		endDate: validate.buildDate(req.params.endDate),
		neighborhood: req.params.neighborhood
	};
//this is currently just checking that nothing is blank
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
  res.send(404, 'not found');
});

app.listen(3000);