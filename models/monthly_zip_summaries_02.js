//------------------------------------------------------------------------------
// require/setup
//------------------------------------------------------------------------------

var config = require('../config');

var mongoose = require('mongoose')
	_ = require('underscore'),
	async = require('async');

var salesRecord = require(config.salesRecordModelFile);
var Meta = require(config.metaModelFile).model;
var helpers = require(config.helpersFile);

var monthlyBase = require(config.monthlyModelBaseFile);

var db = config.dbURI;

//------------------------------------------------------------------------------
// schema
//------------------------------------------------------------------------------

var monthlyZipSummarySchema02 = mongoose.Schema
({
  zip: {type: String, index: true},
  date: {type: Date, index: true},
  totalSales: Number,
  salesSum: Number,
  averageSalePrice: Number,
  medianSalePrice: Number
});

var SalesRecord = require(config.salesRecordModelFile).model;
var MonthlyZip = exports.model = mongoose.model('monthlyZipSummaries02', monthlyZipSummarySchema02);

//--------------------------------------------------------------------------------
// Database construction/updating
//
//this will generate monthly summaries from startDate up to but not including end
//date. The day of each date should be (or will be converted to) the first day
//of the month and midnight.

exports.buildMonthlyZipSummary = function(startDate, endDate, callback)
{
//console.log(helpers.zeroDate(new Date(Date.now())))
	var startDate = helpers.zeroDate(startDate);
	var endDate = helpers.zeroDate(endDate);
	var dateIter = new Date(startDate.getTime());
	dateArray = helpers.buildDateArray(startDate, endDate);

//console.log(dateArray);
	Meta.findOne({key: config.key.zip}, function(err, record)
	{
		if(err){console.log(err); callback();
		}else{
			var zips = record.value;
			async.forEachSeries(zips, function(zip, callback)
			{
				async.forEachLimit(dateArray, config.concurrencyLimit, function(date, callback)
				{
console.log(new Date(date));
					buildMonthSummary(new Date(date), helpers.getNextMonth(new Date(date)), zip, callback);		
				}, function(){callback()});
			}, function(){callback()});
		}
	});
}

function buildMonthSummary(startDate, endDate, zip, callback)
{
//console.log(startDate);
	SalesRecord.find
	({
		saleDate: {$gte: startDate, $lt: endDate},
		zipCode: zip
	}).exec(buildCallback(startDate.getTime(), zip, callback));
}

function buildCallback(startDateIn, zipIn, callback)
{
	return function(err, records)
	{
if (records.length !== 0){console.log(records);}
		if(err){console.log(err);}
		else
		{
			if(!(records.length === 0))
			{
				var startDate = new Date(startDateIn);
				var zip = zipIn;
				upsertRecord()
				saveRecords(startDate, zip, records, callback);
			}else{
				callback(monthlyBase.buildRecord(records, startDate, 'zip', zip), callback);
			}
		}
	}
}

function upsertRecord(record, callback)
{
	var query =
	{
		'date': record.date,
		'zipCode': record.zipCode
	};
	MonthlyZip.update(query, record, {upsert: true}, function(err)
	{
		if(err){console.log(err);
		}else{
			callback();
		}
	});
}