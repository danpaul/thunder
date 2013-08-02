//------------------------------------------------------------------------------
// require/setup
//------------------------------------------------------------------------------

var config = require('../config'),
	mongoose = require('mongoose'),
	_ = require('underscore');

var salesRecord = require(config.salesRecordModelfile);
var helpers = require(config.helpersFile);
var db = config.dbURI;

var salesRecordModel = require(config.salesRecordModelfile).model;

//------------------------------------------------------------------------------
// schema
//------------------------------------------------------------------------------

var metaSchema = mongoose.Schema
({
  key: {type: String,  index: true},
  value: {type: mongoose.Schema.Types.Mixed},
});

var Meta = exports.model = mongoose.model('meta', metaSchema);

exports.buildZipList = function()
{
	Meta.findOne({key: config.key.zip}, function(err, record)
	{
		if(err){console.log(err)
		}else{
			var zipList = {};
			var zipArray = [];
			if(record){zipArray = record.value;}
			salesRecordModel.find({borough: 5}, function(err, records)
			{
				_.each(records, function(record)
				{
					zipList[record.zipCode] = null;	
				});
				_.each(zipList, function(value, key)
				{
					zipArray.push(key);
				});
				zipArray = _.uniq(zipArray);
				Meta.update({key: config.key.zip}, {value: zipArray}, {upsert: true}, function(err)
				{
					if(err){console.log(err);}
				});
			});
		}
	});
	console.log('zipList generated!')
};

// exports.buildNeighborhoodList = function()
// {
	// Meta.findOne({key: config.key.neighborhood}, function(err, record)
	// {
		// var neighborhoodArray = [];
		// if(err){console.log(err);
		// }else{
			// if(record){neighborhoodArray = record}else{neighborhoodArray = []}
		// }
	// });
// }

exports.buildNeighborhoodList = function()
{
	Meta.update({key: config.key.neighborhood}, function(err, record)
	{
		if(err){console.log(err)
		}else{
			var neighborhoodList = {};
			neighborhoodArray = record.value || [];
			salesRecordModel.find(function(err, records)
			{
				_.each(records, function(record)
				{
					neighborhoodList[record.neighborhood] = null;	
				});
				_.each(neighborhoodList, function(value, key)
				{
					neighborhoodArray.push(key);
				});
				neighborhoodArray = _.uniq(neighborhoodArray);
				Meta.update({key: config.key.neighborhood}, {value: neighborhoodArray}, {upsert: true}, function(err)
				{
					if(err){console.log(err);}
				});
p(neighborhoodArray);
			});
		}
	});
}