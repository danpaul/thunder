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
	dateArray = [];

	//build an array of start dates ranging from `startDate` to `endDate`
	while(dateIter.getTime() < endDate.getTime())
	{
		dateIter = getNextMonth(dateIter);
		dateArray.push(dateIter.getTime());
	}
	Meta.findOne({key: config.key.zip}, function(err, record)
	{
		if(err){console.log(err); callback();
		}else{
			var zips = record.value;
			async.forEachSeries(zips, function(zip, callback)
			{
//console.log(zip);
				async.forEachLimit(dateArray, config.concurrencyLimit, function(date, callback)
				{
					buildMonthSummary(new Date(date), getNextMonth(new Date(date)), zip, callback);			
				}, function(){callback()});
				//callback();
			}, function(){console.log('done'); callback()});
			//callback();
		}
		//callback();
	});
}

function buildMonthSummary(startDate, endDate, zip, callback)
{
// console.log(startDate);
// console.log(endDate);
//console.log(zip);
	SalesRecord.find
	({
		saleDate: {$gte: startDate, $lt: endDate},
		zipCode: zip
	}).exec(buildCallback(startDate.getTime(), zip, callback));
}

function buildCallback(startDateIn, zipIn, callback)
{
//console.log('buildCallback');
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
//console.log('length 0');
			}
		}
	}
}

function saveRecords(startDate, zip, records, callback)
{
//console.log('saveRecords');
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

//------------------------------------------------------------------------------
// Helpers

function getNextMonth(date)
{
	var newDate = new Date(date.getTime());
	if(newDate.getMonth == 11)
	{
		newDate.setMonth(0);
		newDate.setYear(newDate.getYear() + 1);
	}else{
		newDate.setMonth(newDate.getMonth() + 1);
	}
	return newDate;
}

//------------------------------------------------------------------------------
// Debugging

function printRecords()
{
	monthlyBoroughSummaryModel.find(function(err, records){console.log(records)});
}

// //------------------------------------------------------------------------------
// // require/setup
// //------------------------------------------------------------------------------

// var config = require('../config');

// var mongoose = require('mongoose')
	// _ = require('underscore');

// var salesRecord = require(config.salesRecordModelFile);
// var Meta = require(config.metaModelFile).model;
// var helpers = require(config.helpersFile);

// var db = config.dbURI;

// //------------------------------------------------------------------------------
// // schema
// //------------------------------------------------------------------------------

// var monthlyZipSummarySchema = mongoose.Schema
// ({
  // zip: {type: String, index: true},
  // date: {type: Date, index: true},
  // totalSales: Number,
  // salesSum: Number,
  // averageSalePrice: Number,
  // medianSalePrice: Number
// });

// var SalesRecord = require(config.salesRecordModelFile).model;
// var MonthlyZip = exports.model = mongoose.model('monthlyZipSummaries', monthlyZipSummarySchema);

// //--------------------------------------------------------------------------------
// // Database construction/updating
// //
// //this will generate monthly summaries from startDate up to but not including end
// //date. The day of each date should be (or will be converted to) the first day
// //of the month and midnight.
// //
// exports.buildMonthlyZipSummary = function(startDate, endDate)
// {
	// startDate.setDate(1);
	// startDate.setHours(0,0,0,0);
	// endDate.setDate(1);
	// endDate.setHours(0,0,0,0);
	
	// var dateIter = new Date(startDate.getTime());
	
	// Meta.findOne({key: config.key.zip}, function(err, record)
	// {
		// var zips = record.value;
		// _.each(zips, function(zip)
		// {
			// while(dateIter.getTime() < endDate.getTime())
			// {
				// buildMonthSummary(dateIter, endDate, zip);
				// if(dateIter.getMonth == 11)
				// {
					// dateIter.setMonth(1);
					// sdateIter.setYear(dateIter.getYear() + 1);
				// }else{
					// dateIter.setMonth(dateIter.getMonth() + 1);
				// }
			// }
			// dateIter = new Date(startDate.getTime());
		// });
	// });
// };

// function buildMonthSummary(startDate, endDate, zip)
// {
	// SalesRecord.find
	// ({
		// saleDate: {$gte: startDate.getTime(), $lt: endDate.getTime()},
		// zipCode: zip
	// }).exec(buildCallback(startDate.getTime(), zip));
// }

// function saveRecords(startDate, zip, records)
// {
	// var saleSum = 0.0;
	// var totalSales = 0.0;
	// var prices = [];
	// _.each(records, function(element, index, list)
	// {
		// prices.push(element.salePrice);
		// saleSum += element.salePrice;
		// totalSales += 1.0;
	// });
	// upsertRecord 
	// ({
		// zipCode: zip,
		// date: startDate,
		// medianSalePrice: helpers.getMedian(prices),
		// salesSum: saleSum,
		// totalSales: totalSales,
		// averageSalePrice: saleSum/totalSales
	// });
// }

// function buildCallback(startDateIn, zipIn)
// {
	// return function(err, records)
	// {
		// if(err){console.log(err);}
		// else
		// {
			// if(!(records.length === 0))
			// {
				// var startDate = new Date(startDateIn);
				// var zip = zipIn;
				// saveRecords(startDate, zip, records);
			// }
		// }
	// }
// }

// function upsertRecord(record)
// {
	// var query =
	// {
		// 'date': record.date,
		// 'zipCode': record.zipCode
	// };
// //p(record);
	// MonthlyZip.update(query, record, {upsert: true}, function(err)
	// {
		// if(err){console.log(err);}
	// });
// }

// //------------------------------------------------------------------------------
// // Debugging

// function printRecords()
// {
	// monthlyBoroughSummaryModel.find(function(err, records){console.log(records)});
// }