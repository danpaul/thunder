//----------------------------------------------------------------------
// db build order
//----------------------------------------------------------------------

var config = require('../config');
	async = require('async'),
	mongoose = require('mongoose'),
	fs = require('fs');

mongoose.connect(config.dbURI);

var salesRecord = require(config.salesRecordModelFile);
var meta = require(config.metaModelFile);
var monthlyZip = require(config.monthlyZipSummaryModelFile);
var monthlyBorough = require(config.monthlyBoroughSummaryModelFile);
var monthlyNeighborhood = require(config.monthlyNeighborhoodSummaryModelFile);

async.series(
[
	function(callback)
	{
		var files = fs.readdirSync(config.dataDirectory);

		async.forEachSeries(files, function(file, callback)
		{
			function buildFromFile(file, callback)
			{
				salesRecord.buildCollection_2(config.dataDirectory + '/' + file, function(){});	
				var buildInfo = {};
				buildInfo.recordCount = 0;
				buildInfo.firstCheck = true;

				var buildCheck = function(){
					salesRecord.model.count({}, function(err, record)
					{
						if(err){console.log(err)
						}else{
							if(buildInfo.recordCount === record)
							{
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
					setTimeout(buildCheck, config.dbBuildTimeout);
				}
				takeTimeout();
			}
			buildFromFile(file, callback);
		},function(){console.log('base records complete'); callback();});
	},
	function(callback)
	{
		meta.buildZipList(callback);
	},
	//build 'ziplistsummary' collection
	function(callback)
	{
console.log('ziplist generated');
		monthlyZip.buildMonthlyZipSummary(config.startDate, new Date(), callback);
	},
	//build monthly borough summary
	function(callback)
	{
console.log('zip summaries complete');
		monthlyBorough.buildMonthlyBoroughSummary(config.startDate, new Date(), callback);
	},
	//build neighborhood list
	function(callback)
	{
		meta.buildNeighborhoodList(callback);
	},
	function(callback)
	{
console.log('neighborhood list built');
		monthlyNeighborhood.buildMonthlyNeighborhoodSummary(config.startDate, 
			new Date(), callback);
	}
], 
function(err)
{
	if(err){throw err;
	}else{
console.log('neighborhood summaries complete');
console.log("db build complete!")
	}
})