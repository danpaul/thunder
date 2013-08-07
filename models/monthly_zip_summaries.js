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

var db = config.dbURI;

//------------------------------------------------------------------------------
// schema
//------------------------------------------------------------------------------

var monthlyZipSummarySchema = mongoose.Schema
({
  zip: {type: String, index: true},
  date: {type: Date, index: true},
  totalSales: Number,
  salesSum: Number,
  averageSalePrice: Number,
  medianSalePrice: Number
});

var SalesRecord = require(config.salesRecordModelFile).model;
var MonthlyZip = exports.model = mongoose.model('monthlyZipSummaries', monthlyZipSummarySchema);

//--------------------------------------------------------------------------------
// Database construction/updating
//
//this will generate monthly summaries from startDate up to but not including end
//date. The day of each date should be (or will be converted to) the first day
//of the month and midnight.

exports.buildMonthlyZipSummary = function(startDate, endDate, callback)
{
	startDate.setDate(1);
	startDate.setHours(0,0,0,0);
	endDate.setDate(1);
	endDate.setHours(0,0,0,0);

	var dateIter = new Date(startDate.getTime());
	dateArray = helpers.buildDateArray(startDate, endDate);
	Meta.findOne({key: config.key.zip}, function(err, record)
	{
		if(err){console.log(err); callback();
		}else{
			var zips = record.value;
			async.forEachSeries(zips, function(zip, callback)
			{
				async.forEachLimit(dateArray, config.concurrencyLimit, function(date, callback)
				{
					buildMonthSummary(new Date(date), helpers.getNextMonth(new Date(date)), zip, callback);		
				}, function(){callback()});
			}, function(){console.log('done'); callback()});
		}
	});
}

function buildMonthSummary(startDate, endDate, zip, callback)
{
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
		if(err){console.log(err);}
		else
		{
			if(!(records.length === 0))
			{
				var startDate = new Date(startDateIn);
				var zip = zipIn;
				saveRecords(startDate, zip, records, callback);
			}else{
				callback();
			}
		}
	}
}

function saveRecords(startDate, zip, records, callback)
{
	var saleSum = 0.0;
	var totalSales = 0.0;
	var prices = [];
	_.each(records, function(element, index, list)
	{
		prices.push(element.salePrice);
		saleSum += element.salePrice;
		totalSales += 1.0;
	});
	upsertRecord 
	({
		zipCode: zip,
		date: startDate,
		medianSalePrice: helpers.getMedian(prices),
		salesSum: saleSum,
		totalSales: totalSales,
		averageSalePrice: saleSum/totalSales
	},
	callback);
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