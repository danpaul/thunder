//npm install to insall packages

//from: http://stackoverflow.com/questions/10425287/convert-string-to-camelcase-with-regular-expression
function camelCase(input) { 
     return input
		.toLowerCase()
		.replace(/^\s+|\s+$/g,'')
		.replace(/\s(.)/g, function(match, group1) {
			return group1.toUpperCase();
		});
}

function typeConvert(conversionObject, key, value){
	if(conversionObject.hasOwnProperty(key)){
		switch(conversionObject[key]){
			case "int":
				console.log("int");
				console.log(parseInt(value));
return parseInt(value.replace(',',''));
		//		return parseInt(value);
		}
	}
	return value;
}

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
	"yearBuilt": "date",
	"taxClassAtTimeOfSale": "int",
	"salePrice": "int",
	"saleDate": "date"
};

var CSV_FILE = "./short_summary.csv";

var THUNDER_DB_URI = "mongodb://localhost:27017/exampleDb";
var COLLECTION_NAME = "testCollection";

var MongoClient = require('mongodb').MongoClient;
var csv = require('csv');

var header;

// Connect to the db
MongoClient.connect(THUNDER_DB_URI, function(err, db) {
  if(err) { return console.log("error connecting to db"); }
  var collection = db.collection(COLLECTION_NAME, function(err, collection) {});
  var arrayLength = 0;
  csv().from(CSV_FILE)
	.transform(function(row, index){
	if(index === 0){
			arrayLength = row.length;
			header = new Array(arrayLength);
			for(var i = 0; i < arrayLength; i++){
				header[i] = camelCase(row[i]);
			}
//console.log(header);
		}else{
			var newRecord = {};
			for(var i = 0; i < arrayLength; i++){
				newRecord[header[i]] = typeConvert(HEADER_CONVERSION_TYPES, header[i], row[i]);
				//newRecord[header[i]] = row[i];
			}
			console.log(newRecord);
		}
	})
	.on('end', function() {console.log("done")});
});

//console.log(camelCase("  Foo bAr"));