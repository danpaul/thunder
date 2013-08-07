//------------------------------------------------------------------------------
// require/setup
//------------------------------------------------------------------------------

var config = require('../config');

var mongoose = require('mongoose');
var _ = require('underscore');
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

///////////////////////fix this
//var salesRecordModel = require(config.salesRecordModelfile).createModel();
var salesRecordModel = salesRecord.model;
var monthlyBoroughSummaryModel = exports.model = mongoose.model('monthlyBoroughSummaries', monthlyBoroughSummarySchema);

//--------------------------------------------------------------------------------
// Database construction/updating
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
	
	var dateIter = new Date(startDate.getTime());
	var dateArray = helpers.buildDateArray(startDate, endDate);
	
	_.each(config.boroughs, function(element, index, list)
	{
		// while(dateIter.getTime() < endDate.getTime())
		// {
			// // buildMonthSummary(dateIter, endDate, element);
			// // if(dateIter.getMonth == 11)
			// // {
				// // dateIter.setMonth(1);
				// // sdateIter.setYear(dateIter.getYear() + 1);
			// // }else{
				// // dateIter.setMonth(dateIter.getMonth() + 1);
			// // }
		// }
		// dateIter = new Date(startDate.getTime());
	});
};

function buildMonthSummary(startDate, endDate, borough)
{
	salesRecordModel
		.find(
		{
			saleDate: {$gte: startDate.getTime(), $lt: endDate.getTime()},
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
			if(!(records.length === 0))
			{
				var startDate = new Date(startDateIn);
				var borough = boroughIn;
				saveRecords(startDate, borough, records);
			}
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