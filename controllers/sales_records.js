//------------------------------------------------------------------------------
// Require
//------------------------------------------------------------------------------

var config = require('../config');
var csv = require('csv');
var model = require(config.modelsDirectory).salesRecords;

//------------------------------------------------------------------------------
// build/update db
//------------------------------------------------------------------------------

function updateCollection(){ parseFile('update'); }

function upsertCollection(){ parseFile('upsert'); }

function refreshCollection(){ parseFile('refresh'); }

//saveMethodFlag can be: upsert, update, refresh
function parseFile(saveMethodFlag)
{
  var arrayLength = 0,
    header,
    newRecord = {},
    now = Date.now;

  csv().from(config.salesRecordsFile)
    .transform(function(row, index)
    {
      if(index === 0)
      {
        arrayLength = row.length;
        header = model.buildHeader(row);
      }else{
        newRecord = model.buildRecord(header, row);
        switch(saveMethodFlag)
        {
          case 'update':
            break;
          case 'upsert':
            model.upsertRecord(newRecord);
            break;
          case 'refresh':
            break;
        }
      }
      if(saveMethodFlag === 'refresh'){
//trigger loop to delete all records and pass callback to handle error
      }
    })
console.log("success!");
}

//------------------------------------------------------------------------------
// exports
//------------------------------------------------------------------------------

exports.updateCollection = updateCollection;
exports.upsertCollection = upsertCollection;
exports.refreshCollection = refreshCollection;