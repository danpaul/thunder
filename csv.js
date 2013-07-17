//npm install to insall packages

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
			header = row;
		}else{
console.log(row);
			var newRecord = {};
			for(var i = 0; i < arrayLength; i++){
				newRecord[header[i]] = row[i];
			}
			//console.log(newRecord);
		}
	})
	.on('end', function() {console.log("done")});

});