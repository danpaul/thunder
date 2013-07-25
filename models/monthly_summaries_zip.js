//------------------------------------------------------------------------------
// require/setup
//------------------------------------------------------------------------------

var config = require('../config');
var mongoose = require('mongoose');


//var salesRecordModel = salesRecordGetDateRange


var db = config.dbURI;
mongoose.connect(config.dbURI);

var monthlySummaryModelName = config.mothlySummariesModelName;

//------------------------------------------------------------------------------
// schema
//------------------------------------------------------------------------------

var monthlySummarySchema = mongoose.Schema
({
//String
  zipCode: String,
//Number
  monthSold: {type: Number, index: true},
  yearSold: Number,
  salePrice: Number
}).index({yearSold: 1, monthSold: 1});

var monthlySummaryModel = mongoose.model(salseRecordModelName, salesRecordSchema);

//------------------------------------------------------------------------------
// build collection
//------------------------------------------------------------------------------







// //saveMethodFlag can be: upsert, update, refresh
// var buildCollection = exports.buildCollection = function(saveMethodFlag)
// {
//   var arrayLength = 0,
//     header,
//     newRecord = {},
//     now = Date.now;

//   csv().from(config.salesRecordsFile)
//     .transform(function(row, index)
//     {
//       if(index === 0)
//       {
//         arrayLength = row.length;
//         header = buildHeader(row);
//       }else{
//         newRecord = buildRecord(header, row);
//         switch(saveMethodFlag)
//         {
//           case 'update':
//             break;
//           case 'upsert':
//             upsertRecord(newRecord);
//             break;
//           case 'refresh':
//             break;
//         }
//       }
//       if(saveMethodFlag === 'refresh'){
// //trigger loop to delete all records and pass callback to handle error
//       }
//     })
// }

// var create = exports.createModel = function() 
// { 
//   return(mongoose.model(salseRecordModelName, salesRecordSchema));
// }

// function upsertRecord(salesRecordObject)
// {
//   var salesRecord = new salesRecordModel(salesRecordObject);
//   query = matchQueryBuilder(salesRecord);

//   salesRecordModel.findOne(query, function(error, doc)
//   {   
//     if(!(doc)) //no match(new record)
//     {
//       salesRecord.save(function (error, record)
//       {
//         if(error)
//         {
//           console.log("unable to save");
//         }
//       });
//     }
//   });
// }

// //------------------------------------------------------------------------------
// // helpers
// //------------------------------------------------------------------------------

// function buildHeader(headerRow)
// {
//   var arrayLength = headerRow.length;
//   var header = new Array(arrayLength);
//   for(var i = 0; i < arrayLength; i++) { header[i] = camelCase(headerRow[i]); }
//   return(header);
// }

// function buildRecord(header, row)
// {
// //console.log(header);
//   var newRecord = {};
//   for(var i = 0; i < header.length; i++)
//   {
//     newRecord[header[i]] = typeConvert(headerConversionTypes, 
//                                        header[i], 
//                                        row[i]);
//   }
//   return newRecord;
// }

// function camelCase(input)
// { 
//    return input
//     .toLowerCase()
//     .replace(/^\s+|\s+$/g,'')
//     .replace(/\s(.)/g, function(match, g){ return g.toUpperCase(); });
// }

// function typeConvert(conversionObject, key, value){
//   if(conversionObject.hasOwnProperty(key))
//   {
//     switch(conversionObject[key])
//     {
//       case "int":
//         return parseInt(value.replace(',',''));
//       case "date":
//         return new Date(value.replace('/', '.'));
//       default: //should not reach here
//         console.log("error: unknown type in typeConvert()");
//     }
//   }else{ //type is string
//     return value.trim().toLowerCase();
//   }
// }