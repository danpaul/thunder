//------------------------------------------------------------------------------
// Require
//------------------------------------------------------------------------------

var config = require('../config');
var model = require(config.modelsDirectory).salesRecords;

//------------------------------------------------------------------------------
// build/update db
//------------------------------------------------------------------------------

var updateCollection = exports.updateCollection = function ()
{
  model.buildCollection('update');
}

var upsertCollection = exports.upsertCollection = function()
{ 
  model.buildCollection('upsert'); 
}

var refreshCollection = exports.refreshCollection = function()
{ 
  model.buildCollection('refresh');
}