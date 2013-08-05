//----------------------------------------------------------------------
// db build order
//----------------------------------------------------------------------

//time to wait to see if the salesrecord db is done generating
var TIMEOUT_DELAY = 10000;

var config = require('../config');
	async = require('async'),
	mongoose = require('mongoose');

mongoose.connect(config.dbURI);

var salesRecord = require(config.salesRecordModelFile);
var meta = require(config.metaModelFile);
var monthlyZip = require(config.monthlyZipSummaryModelFile);
	

async.series(
[
	//initiate build of `salesrecord` collection
	function(callback)
	{
		salesRecord.buildCollection();
		callback();
	},
	//wait until `sailssrecord` collection is finished building
	function(callback)
	{
callback();
return;
		var buildInfo = {};
		buildInfo.recordCount = 0;
		buildInfo.firstCheck = true;
		var buildCheck = function(){
			salesRecord.model.count({}, function(err, record)
			{
				if(err){console.log(err)
				}else{
console.log(record);
					if(buildInfo.recordCount === record)
					{
console.log('salesrecord collection built');
						callback();
					}else{
						buildInfo.recordCount = record;
						takeTimeout();
					}
				}
			});		
		}
		function takeTimeout()
		{
			setTimeout(buildCheck, TIMEOUT_DELAY);
		}
		takeTimeout();
	},
	//build `ziplist`
	function(callback)
	{
callback();
return;
		meta.buildZipList(callback);
	},
	//build 'ziplistsummary' collection
	function(callback)
	{
console.log('ziplist generated');
		//var monthlyZip = require(config.modelsDirectory + '/monthly_zip_summaries');
		monthlyZip.buildMonthlyZipSummary(config.startDate, new Date(), callback);
//monthlyZip.model.findOne(printRecord);
		//callback();
	},
	function(callback)
	{
		console.log('zip summaries complete');
	}
], 
function(err)
{
	if(err){throw err;
	}else{
		console.log("db build complete!")
	}
})
	


//1
//require(config.salesRecordModelfile).buildCollection();

//2
//require(config.metaModelfile).buildZipList();

//3
//var monthlyZip = require(config.modelsDirectory + '/monthly_zip_summaries');
//monthlyZip.buildMonthlyZipSummary(new Date(2000, 0, 1), new Date(2014, 9, 1));
//monthlyZip.model.findOne(printRecord);

//4
//var monthlyBorough = require(config.modelsDirectory + '/monthly_borough_summaries');
//monthlyBorough.buildMonthlyBoroughSummary(new Date(2000, 0, 1), new Date(2014, 9, 1));

//...
//var monthlyNeighborhood = require(config.modelsDirectory).monthlyNeighborhoodSummaries;
//monthlyNeighborhood.buildMonthlyNeighborhoodSummary();