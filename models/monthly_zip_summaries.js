//------------------------------------------------------------------------------
// require/setup
//------------------------------------------------------------------------------

var config = require('../config');

var mongoose = require('mongoose')
	_ = require('underscore');

var salesRecord = require(config.salesRecordModelfile);
var Meta = require(config.metaModelfile).model;
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

var SalesRecord = require(config.salesRecordModelfile).model;
var MonthlyZip = exports.model = mongoose.model('monthlyZipSummaries', monthlyZipSummarySchema);

//--------------------------------------------------------------------------------
// Database construction/updating
//
//this will generate monthly summaries from startDate up to but not including end
//date. The day of each date should be (or will be converted to) the first day
//of the month and midnight.
//
exports.buildMonthlyZipSummary = function(startDate, endDate)
{
	startDate.setDate(1);
	startDate.setHours(0,0,0,0);
	endDate.setDate(1);
	endDate.setHours(0,0,0,0);
	
	var dateIter = new Date(startDate.getTime());
	
	Meta.findOne({key: config.key.zip}, function(err, record)
	{
		var zips = record.value;
		_.each(zips, function(zip)
		{
			while(dateIter.getTime() < endDate.getTime())
			{
				buildMonthSummary(dateIter, endDate, zip);
				if(dateIter.getMonth == 11)
				{
					dateIter.setMonth(1);
					sdateIter.setYear(dateIter.getYear() + 1);
				}else{
					dateIter.setMonth(dateIter.getMonth() + 1);
				}
			}
			dateIter = new Date(startDate.getTime());
		});
	});
};

function buildMonthSummary(startDate, endDate, zip)
{
// p(zip);
// p(startDate);
// p(endDate);
	SalesRecord.find
	({
		saleDate: {$gte: startDate.getTime(), $lt: endDate.getTime()},
		zipCode: zip
	}).exec(buildCallback(startDate.getTime(), zip));
}

function saveRecords(startDate, zip, records)
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
	});
}

function buildCallback(startDateIn, zipIn)
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
				saveRecords(startDate, zip, records);
			}
		}
	}
}

function upsertRecord(record)
{
	var query =
	{
		'date': record.date,
		'zipCode': record.zipCode
	};
//p(record);
	MonthlyZip.update(query, record, {upsert: true}, function(err)
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