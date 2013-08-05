//----------------------------------------------------------------------
// db build order
//----------------------------------------------------------------------

var config = require('./config');
mongoose.connect(config.dbURI);
require(config.salesRecordModelfile).buildCollection();

//	async = require('async');


//require('./models/sales_records').buildCollection();

//console.log(config);

// var s = require(config.salesRecordModelFile);

// s.buildCollection();
	
// async.series(
// 
	// function(callback)
	// {
		// require(config.salesRecordModelfile).buildCollection();
		// //function(err, record){if(err) throw err});
		// callback();		
	// },
	// function(callback)
	// {
// //console.log('second');
	// }

// ], 
// function(err)
// {
	// if(err){throw err;
	// }else{
		// console.log("db build complete!")
	// }
// })
	


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