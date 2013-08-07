var config = require('../config');
	async = require('async'),
	mongoose = require('mongoose'),
	fs = require('fs');

mongoose.connect(config.dbURI);

var salesRecord = require(config.salesRecordModelFile);
var meta = require(config.metaModelFile);
var monthlyZip = require(config.monthlyZipSummaryModelFile);
var monthlyBorough = require(config.monthlyBoroughSummaryModelFile);

//get files iterate all
var files = fs.readdirSync(config.dataDirectory);
console.log(config.dataDirectory + files[0]);

async.forEachSeries(files, function(file, callback)
{
	salesRecord.buildCollection_2(file, callback);
})
	// function(callback)
	// {
		// salesRecord.buildCollection();
		// callback();
	// },
	// //wait until `sailssrecord` collection is finished building
	// function(callback)
	// {
		// var buildInfo = {};
		// buildInfo.recordCount = 0;
		// buildInfo.firstCheck = true;
		// var buildCheck = function(){
			// salesRecord.model.count({}, function(err, record)
			// {
				// if(err){console.log(err)
				// }else{
					// if(buildInfo.recordCount === record)
					// {
// console.log('salesrecord collection built');
						// callback();
					// }else{
						// buildInfo.recordCount = record;
						// takeTimeout();
					// }
				// }
			// });		
		// }
		// function takeTimeout()
		// {
			// setTimeout(buildCheck, TIMEOUT_DELAY);
		// }
		// takeTimeout();
	// },