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
  borough: {type: Number, index: true},
  date: {type: Date, index: true},
  totalSales: Number,
  salesSum: Number,
  averageSalePrice: Number,
  medianSalePrice: Number
});

///////////////////////fix this
var salesRecordModel = require(config.salesRecordModelfile).createModel();
var monthlyBoroughSummaryModel = mongoose.model(config.mothlyBoroughSummariesModelName, monthlyBoroughSummarySchema);

//--------------------------------------------------------------------------------
// Generate Monthly summaries
//
//this will generate monthly summaries from startDate up to but not including end
//date. The day of each date should be (or will be converted to) the first day
//of the month and midnight.
//
exports.buildMonthlyBoroughSummary = function(startDate, endDate)
{
	startDate.setDate(1);
	startDate.setHours(0,0,0,0);
	endDate.setDate(1);
	endDate.setHours(0,0,0,0);
	
	_.each(config.boroughs, function(element, index, list)
	{
		while(startDate.getTime() < endDate.getTime())
		{
			buildMonthSummary(startDate, endDate, element);
			if(startDate.getMonth == 11)
			{
				startDate.setMonth(1);
				startDate.setYear(startDate.getYear() + 1);
			}else{
				startDate.setMonth(startDate.getMonth() + 1);
			}
		}
	});
};

function buildMonthSummary(startDate, endDate, borough)
{
	salesRecordModel
		.find(
		{
			saleDate: {$gte: startDate.getTime(), $lte: endDate.getTime()},
			borough: borough
		})
		.exec(buildCallback(startDate.getTime(), borough));
}

function saveRecords(startDate, borough, records)
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
	});
}

function buildCallback(startDateIn, boroughIn)
{
	return function(err, records)
	{
		if(err){console.log(err);}
		else
		{
			var startDate = new Date(startDateIn);
			var borough = boroughIn;
			saveRecords(startDate, borough, records);
		}
	}
}

function upsertRecord(record)
{
	var query =
	{
		'date': record.date,
		'borough': record.borough
	};
	
	monthlyBoroughSummaryModel.update(query, record, {upsert: true}, function(err)
	{
		if(err){console.log(err);}
	});
}

//------------------------------------------------------------------------------
// Debugging

function printRecords()
{
	monthlyBoroughSummaryModel.find(function(err, records){console.log(records)});
}