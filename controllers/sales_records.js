//------------------------------------------------------------------------------
// Require
//------------------------------------------------------------------------------

var config = require('../config');
var model = require(config.modelsDirectory).salesRecords;

//------------------------------------------------------------------------------
// build/update db
//------------------------------------------------------------------------------

exports.updateCollection = function ()
{
  model.buildCollection('update');
}

exports.upsertCollection = function()
{ 
  model.buildCollection('upsert'); 
}

exports.refreshCollection = function()
{ 
  model.buildCollection('refresh');
}