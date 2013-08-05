//------------------------------------------------------------------------------
// require/setup
//------------------------------------------------------------------------------

var config = require('../config'),
	csv = require('csv'),
	mongoose = require('mongoose'),
	async = require('async');

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
  address: {type: String, index: true},
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

salesRecordSchema.methods.getEarliestRecord = function(callback)
{
  SalesRecord.findOne({}, 'saleDate')  
                  .sort({saleDate: 1})
                  .limit(1)
                  .exec(callback);
}

salesRecordSchema.methods.getLastRecord = function(callback)
{
  SalesRecord.findOne()  
                  .sort({saleDate: -1})
                  .limit(1)
                  .exec(callback);
}

var SalesRecord = exports.model = mongoose.model(config.salseRecordModelName, salesRecordSchema);

//------------------------------------------------------------------------------
// match query builder
//  this is the query that will be used to determine if a given new record
//  matches an existing record (it is schema depenedent)
//	these should be indexed!
//------------------------------------------------------------------------------

function matchQueryBuilder(record)
{
  return new Object
  ({
      'address': record.address,
	  'apartmentNumber': record.apartmentNumber,
	  'saleDate': record.saleDate
    });
}

//------------------------------------------------------------------------------
// build collection
//------------------------------------------------------------------------------

// var buildCollection = exports.buildCollection = function()
// {
  // var arrayLength = 0,
    // header,
    // newRecord = {},
    // now = Date.now;
	
	// console.log(csv().from(config.salesRecordsFile).to.array());
	
		// // .transform(function(row, index)
		// // {
		  // // if(index === 0)
		  // // {
			// // arrayLength = row.length;
			// // header = buildHeader(row);
		  // // }else{
			// // newRecord = buildRecord(header, row);
			// // upsertRecord(newRecord);
		  // // }
		// // })
		// // .on('end', function(){console.log('done')});
// }

var buildCollection = exports.buildCollection = function()
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
//console.log(row);
			arrayLength = row.length;
			header = buildHeader(row);
		  }else{
			newRecord = buildRecord(header, row);
			upsertRecord(newRecord);
		  }
		})
		//.on('end', function(){console.log('done')});
}

function upsertRecord(record)
{
	var query = matchQueryBuilder(record);
	SalesRecord.update(query, record, {upsert: true}, //, callback);
	function(err)
	{
		if(err){console.log(err);
		}else{;}
	});
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
  var newRecord = {};
  for(var i = 0; i < header.length; i++)
  {
    newRecord[header[i]] = typeConvert(headerConversionTypes, 
                                       header[i], 
                                       row[i]);
	if(header[i] === 'neighborhood'){
		newRecord[header[i]] = newRecord[header[i]].replace(/ /g, '-').replace(/\./, '');
	}
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
//console.log(config);
//buildCollection();