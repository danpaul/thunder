////////////////////////////////////////////////////////////////////////////////
// Require
////////////////////////////////////////////////////////////////////////////////

var csv = require('csv');
var mongoose = require('mongoose');

////////////////////////////////////////////////////////////////////////////////
// Globals
////////////////////////////////////////////////////////////////////////////////

var CSV_FILE = "./short_summary.csv";
var THUNDER_DB_URI = "mongodb://localhost:27017/exampleDb";
var COLLECTION_NAME = "testCollection";

var HEADER_CONVERSION_TYPES = 
{
	"borough": "int",
	"taxClassAtPresent": "int",
	"block": "int",
	"lot": "int",
	"residentialUnits": "int",
	"commercialUnits": "int",
	"totalUnits": "int",
	"landSquareFeet": "int",
	"squreFeet": "int",
	"grossSquareFeet": "int",
	"salePrice": "int",
	"yearBuilt": "int",
	"saleDate": "date"
};

////////////////////////////////////////////////////////////////////////////////
// Mongoose
////////////////////////////////////////////////////////////////////////////////

mongoose.connect('mongodb://localhost/test');
//mongoose.connection.db.dropCollection('salesRecord');

var salesRecordSchema = mongoose.Schema
({
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
	saleDate: Date
});

var salesRecordModel = mongoose.model('salesRecord', salesRecordSchema);

var saveRecord = function(salesRecord)
{
	var salesRecord = new salesRecordModel(salesRecord);
console.log(salesRecordIsMatch(salesRecord));
	if((salesRecordIsMatch(salesRecord)))
	{
console.log("match");
	}else{
console.log("no match");
	}
	salesRecord.save(function (error, record)
	{
		if(error)
		{
			console.log("unable to save");
		}else{
//console.log("success");
		}
	});
}

function salesRecordIsMatch(salesRecord)
{
	query =
	{
		'address': salesRecord.address,
		'apartmentNumber': salesRecord.apartmentNumber,
		'saleDate': salesRecord.saleDate
	};
	
	salesRecordModel.findOne(query, function(error, doc)
	{
//console.log(doc);
if((doc)){console.log("foo");}
		if(!(doc))
		{
			return true;
		}else{
			return false;
		}
	});
	return false;
}

////////////////////////////////////////////////////////////////////////////////
// Driver
////////////////////////////////////////////////////////////////////////////////

function csvParse(saveFunction)
{
	var arrayLength = 0,
		header,
		newRecord = {};

	csv().from(CSV_FILE)
		.transform(function(row, index)
		{
			if(index === 0)
			{
				arrayLength = row.length;
				header = new Array(arrayLength);
				for(var i = 0; i < arrayLength; i++)
				{	
					header[i] = camelCase(row[i]);
				}
			}else{
				var newRecord = {};
				for(var i = 0; i < arrayLength; i++)
				{
					newRecord[header[i]] = typeConvert(HEADER_CONVERSION_TYPES, header[i], row[i]);
				}
				saveFunction(newRecord);
			}
//console.log(newRecord);
		})
}

////////////////////////////////////////////////////////////////////////////////
// Helper functions
////////////////////////////////////////////////////////////////////////////////

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
//console.log(value);
				return new Date(value.replace('/', '.'));
			default: //should not reach herestring
				console.log("error: unknown type in typeConvert()");
		}
	}else{ //type is string
		return value.trim().toLowerCase();
	}
}

csvParse(saveFunction);

salesRecordModel.findOne( {'yearBuilt': 1962}, function(error, document)
{
	//console.log(document);
});

// var foo = " BAR ";
// console.log(foo);
// console.log(foo.trim().toLowerCase());