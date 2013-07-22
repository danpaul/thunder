//------------------------------------------------------------------------------
// require/setup
//------------------------------------------------------------------------------

var config = require('../config');

var mongoose = require('mongoose');
var csv = require('csv');

var db = config.dbURI;
mongoose.connect(config.dbURI);

//collection will be this name pluralized
var salseRecordModelName = 'salesRecord';


//------------------------------------------------------------------------------
// schema
//------------------------------------------------------------------------------

var salesRecordSchemaObject =
{
//String
  neighborhood: String,
  buildingClassCategory: String,
  easement: String,
  buildingClassAtPresent: String,
  address: String,
  apartmentNumber: String,
  zipCode: String,
  taxClassAtTimeOfSale: String,
  buildingClassAtTimeOfSale: String,
//Number
  borough: Number,
  taxClassAtPresent: Number,
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
  saleDate: Date,
//Note in data file
  lastUpdate: {type: Date, default: Date.now}
};

//------------------------------------------------------------------------------
// schema conversion
//------------------------------------------------------------------------------

var headerConversionTypes = 
{
  borough: "int",
  taxClassAtPresent: "int",
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

//------------------------------------------------------------------------------
// match query builder
//  this is the query that will be used to determine if a given new record
//  matches an existing record (it is schema depenedent)
//------------------------------------------------------------------------------

function matchQueryBuilder(mongooseModel)
{
  return
  ({
    'address': mongooseModel.address,
      'apartmentNumber': mongooseModel.apartmentNumber,
      'saleDate': mongooseModel.saleDate
    });
}

//------------------------------------------------------------------------------
// build collection
//------------------------------------------------------------------------------

var salesRecordSchema = mongoose.Schema(salesRecordSchemaObject);
var salesRecordModel = mongoose.model(salseRecordModelName, salesRecordSchema);

//saveMethodFlag can be: upsert, update, refresh
var buildCollection = exports.buildCollection = function(saveMethodFlag)
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
        switch(saveMethodFlag)
        {
          case 'update':
            break;
          case 'upsert':
            upsertRecord(newRecord);
            break;
          case 'refresh':
            break;
        }
      }
      if(saveMethodFlag === 'refresh'){
//trigger loop to delete all records and pass callback to handle error
      }
    })
}

var create = exports.createModel = function() 
{ 
  return(mongoose.model(salseRecordModelName, salesRecordSchema));
}

function upsertRecord(salesRecordObject)
{
  var salesRecord = new salesRecordModel(salesRecordObject);
  query = matchQueryBuilder(salesRecord);

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
// helpers
//------------------------------------------------------------------------------

function buildHeader(headerRow)
{
  var arrayLength = headerRow.length;
  var header = new Array(arrayLength);
  for(var i = 0; i < arrayLength; i++) { header[i] = camelCase(headerRow[i]); }
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

function camelCase(input)
{ 
   return input
    .toLowerCase()
    .replace(/^\s+|\s+$/g,'')
    .replace(/\s(.)/g, function(match, g){ return g.toUpperCase(); });
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