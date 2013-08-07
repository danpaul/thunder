//------------------------------------------------------------------------------
// require/setup
//------------------------------------------------------------------------------

var config = require('../config');

var mongoose = require('mongoose'),
	_ = require('underscore'),
	async = require('async');
	
var salesRecord = require(config.salesRecordModelFile);
//config.salesRecordModelFile

var helpers = require(config.helpersFile);

var db = config.dbURI;

var p = console.log;

//------------------------------------------------------------------------------
// schema
//------------------------------------------------------------------------------

var monthlyBoroughSummarySchema = mongoose.Schema
({
  borough: {type: Number, index: true},
  date: {type: Date, index: true},
  totalSales: Number,
  salesSum: Number,
  averageSalePrice: Number,
  medianSalePrice: Number
});

var salesRecordModel = salesRecord.model;
var monthlyBoroughSummaryModel = exports.model = mongoose.model('monthlyBoroughSummaries', monthlyBoroughSummarySchema);

//--------------------------------------------------------------------------------
// Database construction/updating
//
//this will generate monthly summaries from startDate up to but not including end
//date. The day of each date should be (or will be converted to) the first day
//of the month and midnight.
exports.buildMonthlyBoroughSummary = function(startDate, endDate, callback)
{
	startDate.setDate(1);
	startDate.setHours(0,0,0,0);
	endDate.setDate(1);
	endDate.setHours(0,0,0,0);
	
	var dateIter = new Date(startDate.getTime());
	var dateArray = helpers.buildDateArray(startDate, endDate);

	async.forEachSeries(config.boroughs, function(borough, callback)
	{
		async.forEachLimit(dateArray, config.concurrencyLimit, function(date, callback)
		{
			buildMonthSummary(new Date(date), helpers.getNextMonth(new Date(date)), borough, callback);	
		}, function(){callback()})
	
	}, function(){callback()});
};

function buildMonthSummary(startDate, endDate, borough, callback)
{
	salesRecordModel
		.find(
		{
			saleDate: {$gte: startDate.getTime(), $lt: endDate.getTime()},
			borough: borough
		})
		.exec(buildCallback(startDate.getTime(), borough, callback));
}

function buildCallback(startDateIn, boroughIn, callback)
{
	return function(err, records)
	{
		if(err){console.log(err); callback();}
		else
		{
			if(!(records.length === 0))
			{
				var startDate = new Date(startDateIn);
				var borough = boroughIn;
				saveRecords(startDate, borough, records, callback);
			}else{callback();}
		}
	}
}

function saveRecords(startDate, borough, records, callback)
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
		borough: borough,
		date: startDate,
		medianSalePrice: helpers.getMedian(prices),
		salesSum: saleSum,
		totalSales: totalSales,
		averageSalePrice: saleSum/totalSales
	}, callback);
}

function upsertRecord(record, callback)
{
	var query =
	{
		'date': record.date,
		'borough': record.borough
	};
	
	monthlyBoroughSummaryModel.update(query, record, {upsert: true}, function(err)
	{
		if(err){console.log(err); callback();
		}else{callback();}
	});
}

//------------------------------------------------------------------------------
// Debugging

function printRecords()
{
	monthlyBoroughSummaryModel.find(function(err, records){console.log(records)});
}