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
//String
  borough: {type: Number, index: true},
//Number
  date: {type: Date, index: true},
  totalSales: Number,
  averageSalePrice: Number,
  medianSalePrice: Number
});

///////////////////////fix this
var salesRecordModel = require(config.salesRecordModelfile).createModel();
var monthlyBoroughSummaryModel = mongoose.model(config.mothlyBoroughSummariesModelName, monthlyBoroughSummarySchema);

//this will generate monthly summaries from startDate up to but not including end
//date. The day of each date should be (or will be converted to) the first day
//of the month and midnight.

//this will need to iterate boroughs
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
		totalSales: totalSales,
		averageSalePrice: saleSum/totalSales,
		medianSalePrice: helpers.getMedian(prices)
	});
}

function upsertRecord(record)
{
	var record = new monthlyBoroughSummaryModel(record);
	var query =
	{
		'date': record.date,
		'borough': record.borough
	};
	
	monthlyBoroughSummaryModel.findOne(query, function(error, doc)
	{
		if(error){console.log(error);
		}else{
			if(!(doc)) //no match(new record)
			{
console.log('saving');
				record.save(function(error, record){if(error){console.log(error);}});
			}else{
console.log('found record');
			///////////update record////////////////////////
			}
		}
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