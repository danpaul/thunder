//------------------------------------------------------------------------------
// require/setup
//------------------------------------------------------------------------------

var config = require('../config'),
	mongoose = require('mongoose'),
	_ = require('underscore'),
	async = require('async');

var salesRecord = require(config.salesRecordModelFile);
var helpers = require(config.helpersFile);
var db = config.dbURI;

var salesRecordModel = require(config.salesRecordModelFile).model;

//------------------------------------------------------------------------------
// schema
//------------------------------------------------------------------------------

var metaSchema = mongoose.Schema
({
  key: {type: String,  index: true},
  value: {type: mongoose.Schema.Types.Mixed},
});

var Meta = exports.model = mongoose.model('meta', metaSchema);

exports.buildZipList = function(callback)
{
	Meta.findOne({key: config.key.zip}, function(err, record)
	{
		if(err){console.log(err)
		}else{
			var zipList = {};
			var zipArray = [];
			if(record){zipArray = record.value;}
		}
		salesRecordModel.find().distinct('zipCode', function(err, records)
		{
			Meta.update({key: config.key.zip}, {value: records}, function(err)
			{
				if(err){console.log(err); callback();
				}else{callback();}
			});
		});
	});
};

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