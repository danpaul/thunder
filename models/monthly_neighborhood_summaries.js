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

var monthlyNeighborhoodSummarySchema = mongoose.Schema
({
  neighborhood: {type: String, index: true},
  date: {type: Date, index: true},
  totalSales: Number,
  salesSum: Number,
  averageSalePrice: Number,
  medianSalePrice: Number
});

var SalesRecord = require(config.salesRecordModelFile).model;
var MonthlyNeighborhood = exports.model = mongoose.model('monthlyNeighborhoodSummaries', monthlyNeighborhoodSummarySchema);

//--------------------------------------------------------------------------------
// Database construction/updating
//
//this will generate monthly summaries from startDate up to but not including end
//date. The day of each date should be (or will be converted to) the first day
//of the month and midnight.

exports.buildMonthlyNeighborhoodSummary = function(startDate, endDate, callback)
{
	startDate.setDate(1);
	startDate.setHours(0,0,0,0);
	endDate.setDate(1);
	endDate.setHours(0,0,0,0);

	var dateIter = new Date(startDate.getTime());
	dateArray = helpers.buildDateArray(startDate, endDate);
	
	Meta.findOne({key: config.key.neighborhood}, function(err, record)
	{
		if(err){console.log(err); callback();
		}else{
			var neighborhoods = record.value;
			async.forEachSeries(neighborhoods, function(neighborhood, callback)
			{
				async.forEachLimit(dateArray, config.concurrencyLimit, function(date, callback)
				{
					buildMonthSummary(new Date(date), helpers.getNextMonth(new Date(date)), neighborhood, callback);		
				}, function(){callback()});
			}, function(){callback()});
		}
	});
}

function buildMonthSummary(startDate, endDate, neighborhood, callback)
{
	SalesRecord.find
	({
		saleDate: {$gte: startDate, $lt: endDate},
		neighborhood: neighborhood
	}).exec(buildCallback(startDate.getTime(), neighborhood, callback));
}

function buildCallback(startDateIn, neighborhoodIn, callback)
{
	return function(err, records)
	{
		if(err){console.log(err);}
		else
		{
			if(!(records.length === 0))
			{
				var startDate = new Date(startDateIn);
				var neighborhood = neighborhoodIn;
				saveRecords(startDate, neighborhood, records, callback);
			}else{
				callback();
			}
		}
	}
}

function saveRecords(startDate, neighborhood, records, callback)
{
	var salesSum = 0.0;
	var totalSales = 0.0;
	var prices = [];
	_.each(records, function(element, index, list)
	{
		prices.push(element.salePrice);
		salesSum += element.salePrice;
		totalSales += 1.0;
	});
	upsertRecord 
	({
		neighborhood: neighborhood,
		date: startDate,
		medianSalePrice: helpers.getMedian(prices),
		salesSum: salesSum,
		totalSales: totalSales,
		averageSalePrice: salesSum/totalSales
	},
	callback);
}

function upsertRecord(record, callback)
{
	var query =
	{
		'date': record.date,
		'neighborhood': record.neighborhood
	};
//--------------------------------------------------------------------------------------
	MonthlyNeighborhood.update(query, record, {upsert: true}, function(err)
	{
		if(err){console.log(err);
		}else{
			callback();
		}
	});
}