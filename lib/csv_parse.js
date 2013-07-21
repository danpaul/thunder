//------------------------------------------------------------------------------
// Require
//------------------------------------------------------------------------------

var csv = require('csv');
var mongoose = require('mongoose');
var config = require('../config');

//------------------------------------------------------------------------------
// Mongoose
//------------------------------------------------------------------------------

mongoose.connect(config.dbURI);

var salesRecordSchema = mongoose.Schema(config.salesRecordSchemaObject);
var salesRecordModel = mongoose.model(config.salseRecordModelName, salesRecordSchema);

function saveFunction(salesRecordIn)
{
  var salesRecord = new salesRecordModel(salesRecordIn);
  query = config.matchQueryBuilder(salesRecord);

  salesRecordModel.findOne(query, function(error, doc)
  {   
    if(!(doc)) //no match(new record)
    {
      salesRecord.save(function (error, record)
      {
        if(error)
        {
          console.log("unable to save");
        }
      });
    }
  });
}

//------------------------------------------------------------------------------
// Driver
//------------------------------------------------------------------------------

function csvParse()
{
  var arrayLength = 0,
    header,
    newRecord = {};

  csv().from(config.csvFile)
    .transform(function(row, index)
    {
      if(index === 0)
      {
        arrayLength = row.length;
        header = new Array(arrayLength);
        for(var i = 0; i < arrayLength; i++) { header[i] = camelCase(row[i]); }
      }else{
        var newRecord = {};
        for(var i = 0; i < arrayLength; i++)
        {
          newRecord[header[i]] = typeConvert(config.headerConversionTypes, 
                                             header[i],
                                             row[i]);
        }
        saveFunction(newRecord);
      }
    })
console.log("success!");
}

//------------------------------------------------------------------------------
// Helper functions
//------------------------------------------------------------------------------


function camelCase(input)
{ 
   return input
    .toLowerCase()
    .replace(/^\s+|\s+$/g,'')
    .replace(/\s(.)/g, function(match, group1)
    {
      return group1.toUpperCase();
    });
}

function typeConvert(conversionObject, key, value){
  if(conversionObject.hasOwnProperty(key))
  {
    switch(conversionObject[key])
    {
      case "int":
        return parseInt(value.replace(',',''));
      case "date":
        return new Date(value.replace('/', '.'));
      default: //should not reach here
        console.log("error: unknown type in typeConvert()");
    }
  }else{ //type is string
    return value.trim().toLowerCase();
  }
}

module.exports = csvParse;

// csvParse();

// salesRecordModel.findOne( {'yearBuilt': 1962}, function(error, document)
// {
//   console.log(document);
// });
