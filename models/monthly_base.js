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

//--------------------------------------------------------------------------------
//

function buildRecord(startDate, key, value, records, callback)
{
	var saleSum = 0.0;
	var totalSales = 0.0;
	var prices = [];
	var squareFootagePrices = [];
	var averageSquareFootagePrice = 0.0;
	var medianSquareFootagePrice = 0.0;
	
	_.each(records, function(element, index, list)
	{
		prices.push(element.salePrice);
		saleSum += element.salePrice;
		totalSales += 1.0;
		if(element.grossSquareFeet > 0)
		{
			squareFootagePrices.push(element.salePrice / element.gross);
		}
	});

	var record =
	{
		date: startDate,
		medianSalePrice: helpers.getMedian(prices),
		salesSum: saleSum,
		totalSales: totalSales,
		averageSalePrice: saleSum/totalSales,
		averageSquareFootagePrice: helpers.getAverage(squareFootagePrices),
		medianSquareFootagePrice: helpers.getMedian(squareFootagePrices)
	}
	record[key] = value;
	return(record);
}


// exports.buildMonthlySummary = function(startDate, 
										  // endDate,
										  // iterable,
										  // matchQuery,
										  // key,
										  // callback)
// {
	// helpers.zeroDate(startDate);
	// helpers.zeroDate(endDate);

	// var dateIter = new Date(startDate.getTime());
	// dateArray = helpers.buildDateArray(startDate, endDate);

	// async.forEachSeries(iterable, function(item, callback)
	// {
		// async.forEachLimit(dateArray, config.concurrencyLimit, function(date, callback)
		// {
			// buildMonthSummary(new Date(date), 
							  // helpers.getNextMonth(new Date(date)), 
							  // key, 
							  // item, 
							  // matchQuery, 
							  // callback);
				// }, function(){callback()});
			// }, function(){callback()});
		// }
	// });
// }

// function buildMonthSummary(startDate, endDate, key, value, matchQuery, callback)
// {
	// var query = {};
	// _.each(matchQuery, function(v, k){query[k] = v;}
	// query[saleDate] = {$gte: startDate, $lt: endDate};
	// query[key] = value;
	// SalesRecord.find(query).exec(buildCallback(startDate.getTime(), value, callback));
// }

// function buildCallback(startDateIn, key, value, callback)
// {
	// return function(err, records)
	// {
		// if(err){console.log(err);}
		// else
		// {
			// if(!(records.length === 0))
			// {
				// var startDate = new Date(startDateIn);
				// var value = valueIn;
				// saveRecord(startDate, key, value, records, callback);
			// }else{
				// callback();
			// }
		// }
	// }
// }

// function upsertRecord(record, callback)
// {
	// var query =
	// {
		// 'date': record.date,
		// 'zipCode': record.zipCode
	// };
	// MonthlyZip.update(query, record, {upsert: true}, function(err)
	// {
		// if(err){console.log(err);
		// }else{
			// callback();
		// }
	// });
// }