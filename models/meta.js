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

var Meta = exports.meta = mongoose.model('meta', metaSchema);

exports.buildZipList = function()
{
	Meta.findOne({key: 'zipList'}, function(err, record)
	{
		if(err){console.log(err)
		}else{
			var zipList = {};
			var zipArray = record.value;
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
				Meta.update({key: 'zipList'}, {value: zipArray}, {upsert: true}, function(err)
				{
					if(err){console.log(err);}
				});
				
			});
		}
	});	
};