var config = require('../config');
	async = require('async'),
	mongoose = require('mongoose'),
	fs = require('fs');

mongoose.connect(config.dbURI);

var salesRecord = require(config.salesRecordModelFile);
var meta = require(config.metaModelFile);
var monthlyZip = require(config.monthlyZipSummaryModelFile);
var monthlyBorough = require(config.monthlyBoroughSummaryModelFile);

var files = fs.readdirSync(config.dataDirectory);
var TIMEOUT_DELAY = 10000;

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
console.log('salesrecord collection built');
						callback();
					}else{
						buildInfo.recordCount = record;
console.log(buildInfo.recordCount);
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
	}//);//, function(){callback();})
	buildFromFile(file, callback);
},function(){console.log('done')});