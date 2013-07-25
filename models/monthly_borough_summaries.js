//------------------------------------------------------------------------------
// require/setup
//------------------------------------------------------------------------------

var config = require('../config');
var mongoose = require('mongoose');
var _ = require('underscore');
var salesRecord = require(config.salesRecordModelfile);


var db = config.dbURI;
//var monthlySummaryModelName = config.mothlyBoroughSummariesModelName;

//------------------------------------------------------------------------------
// schema
//------------------------------------------------------------------------------

var monthlyBoroughSummarySchema = mongoose.Schema
({
//String
  borough: {type: Number, index: true},
//Number
  month: {type: Number, index: true},
  year: {type: Number, index: true},
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
exports.buildMonthlyBoroughSummary = function(startDate, endDate)
{
	startDate.setDate(1)
	startDate.setHours(0,0,0,0);
	endDate.setDate(1)
	endDate.setHours(0,0,0,0);	

	while(startDate.getTime() < endDate.getTime())
	{
		buildMonthSummary(startDate, endDate);
		if(startDate.getMonth == 11)
		{
			startDate.setMonth(1);
			startDate.setYear(startDate.getYear() + 1);
		}else{
			startDate.setMonth(startDate.getMonth() + 1);
		}
	}
};

function buildMonthSummary(startDate, endDate)
{
	//generate query gte start date, lte start date + 1
	//generate summary record and save
	//salesRecordModel.find
	salesRecord.dateRangeEachDo(startDate, endDate, function(err, records)
	{
		if(err){console.log(err);}
		else
		{
			_.each(records, function(element, index, list)
			{
				console.log(element.salePrice);			
			});
		}
	});
}