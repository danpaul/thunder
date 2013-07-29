//------------------------------------------------------------------------------
// require/setup
//------------------------------------------------------------------------------

var config = require('../config'),
	csv = require('csv'),
	mongoose = require('mongoose');

var helpers = require(config.helpersFile);
var db = config.dbURI;

var salseRecordModelName = config.salseRecordModelName;

//------------------------------------------------------------------------------
// schema
//------------------------------------------------------------------------------

var salesRecordSchema = mongoose.Schema
({
//From imported data file:
//String
  neighborhood: String,
  buildingClassCategory: String,
  easement: String,
  buildingClassAtPresent: String,
  address: String,
  apartmentNumber: String,
  zipCode: {type: String, index: true},
  taxClassAtTimeOfSale: String,
  taxClassAtPresent: String,
  buildingClassAtTimeOfSale: String,
//Number
  borough: {type: Number, index: true},
  block: Number,
  lot: Number,
  residentialUnits: Number,
  commercialUnits: Number,
  totalUnits: Number,
  landSquareFeet: Number,
  squreFeet: Number,
  grossSquareFeet: Number,
  salePrice: Number,
  yearBuilt: Number,
//Date
  saleDate: {type: Date, index: true}
});

var headerConversionTypes = 
{
  borough: "int",
  block: "int",
  lot: "int",
  residentialUnits: "int",
  commercialUnits: "int",
  totalUnits: "int",
  landSquareFeet: "int",
  squreFeet: "int",
  grossSquareFeet: "int",
  salePrice: "int",
  yearBuilt: "int",
  saleDate: "date"
};

var salesRecordModel = exports.model = mongoose.model(config.salseRecordModelName, salesRecordSchema);

//------------------------------------------------------------------------------
// match query builder
//  this is the query that will be used to determine if a given new record
//  matches an existing record (it is schema depenedent)
//------------------------------------------------------------------------------

function matchQueryBuilder(record)
{
  return
  ({
      'address': record.address,
	  'apartmentNumber': record.apartmentNumber,
	  'saleDate': record.saleDate
    });
}

//------------------------------------------------------------------------------
// build collection
//------------------------------------------------------------------------------

exports.buildCollection = function()
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
        header = buildHeader(row);
      }else{
        newRecord = buildRecord(header, row);
		upsertRecord(newRecord);
	  }
    });
}

function upsertRecord(salesRecord)
{
  var query = matchQueryBuilder(salesRecord);
//p(salesRecord);
//monthlyBoroughSummaryModel.update(query, record, {upsert: true}


  

  new salesRecordModel(salesRecord).save(function(err)
  {
	if(err){console.log(err)};
  });


  // salesRecordModel.update(query, salesRecord, {upsert: true}, function(err)
  // {
	// if(err){console.log(err)};
  // });
}

//------------------------------------------------------------------------------
// getters and setters
//------------------------------------------------------------------------------

// exports.dateRangeEachDo = function(startDate, endDate, callback)
// {
	// salesRecordModel
		// .find({ saleDate: {$gte: startDate.getTime(), $lte: endDate.getTime()}})
		// .exec(callback);
// }

exports.getEarliestRecord = function(callback)
{
  salesRecordModel.find({}, 'saleDate')  
                  .sort({saleDate: 1})
                  .limit(1)
                  .exec(callback);
}

exports.getLatestRecord = function(callback)
{
  salesRecordModel.find()  
                  .sort({saleDate: -1})
                  .limit(1)
                  .exec(callback);
}

//------------------------------------------------------------------------------
// helpers
//------------------------------------------------------------------------------

function buildHeader(headerRow)
{
  var arrayLength = headerRow.length;
  var header = new Array(arrayLength);
  for(var i = 0; i < arrayLength; i++) { header[i] = helpers.camelCase(headerRow[i]); }
  return(header);
}

function buildRecord(header, row)
{
//console.log(header);
  var newRecord = {};
  for(var i = 0; i < header.length; i++)
  {
    newRecord[header[i]] = typeConvert(headerConversionTypes, 
                                       header[i], 
                                       row[i]);
  }
  return newRecord;
}

function typeConvert(conversionObject, key, value){
  if(conversionObject.hasOwnProperty(key))
  {
    switch(conversionObject[key])
    {
      case "int":
        return helpers.sanitizeNumberString(value);
      case "date":
        return new Date(value.replace('/', '.'));
      default: //should not reach here
        console.log("error: unknown type in typeConvert()");
    }
  }else{ //type is string
    return value.trim().toLowerCase();
  }
}