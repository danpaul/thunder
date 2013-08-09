//--------------------------------------------------------------------------------------
// Debug

p = console.log


var config = require('../config');
	async = require('async'),
	mongoose = require('mongoose'),
	fs = require('fs');

mongoose.connect(config.dbURI);

var salesRecord = require(config.salesRecordModelFile);
var meta = require(config.metaModelFile);
var monthlyZip = require(config.monthlyZipSummaryModelFile);
var monthlyBorough = require(config.monthlyBoroughSummaryModelFile);
var monthlyNeighborhood = require(config.monthlyNeighborhoodSummaryModelFile);

var files = fs.readdirSync(config.dataDirectory);
var TIMEOUT_DELAY = 10000;

//meta.model.find({key: 'neighborhood'}, function(e,r){console.log(r)});