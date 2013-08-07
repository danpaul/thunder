var config = require('../config');
	async = require('async'),
	mongoose = require('mongoose');

mongoose.connect(config.dbURI);

var salesRecord = require(config.salesRecordModelFile);
var meta = require(config.metaModelFile);
var monthlyZip = require(config.monthlyZipSummaryModelFile);
var monthlyBorough = require(config.monthlyBoroughSummaryModelFile);

meta.buildZipList(function(){console.log('done')});