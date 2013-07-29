//------------------------------------------------------------------------------
// require/setup
//------------------------------------------------------------------------------

var config = require('../config');

var mongoose = require('mongoose');
var _ = require('underscore');
var salesRecord = require(config.salesRecordModelfile);
var helpers = require(config.helpersFile);
var db = config.dbURI;
var p = console.log;

//------------------------------------------------------------------------------
// schema
//------------------------------------------------------------------------------

var monthlyBoroughSummarySchema = mongoose.Schema
({
  key: {type: String,  index: true},
  value: {type: mongoose.Schema.Types.Mixed},
});

var salesRecordModel = require(config.salesRecordModelfile).model;

exports.buildZipList = function()
{
	var zipList = {};
	salesRecordModel.find({borough: 5}, function(err, records)
	{
p(records.length)
		_.each(records, function(record)
		{
		//	if(record.zipCode == '10301'){p(record.zipCode)}
			zipList[record.zipCode] = null;		
		});
	//	p(zipList);
	});
};