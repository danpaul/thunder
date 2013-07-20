var config = {};

config.dbURI = 'mongodb://localhost:27017/thunder';

//------------------------------------------------------------------------------
// csv.js specific
//------------------------------------------------------------------------------

config.csvFile = __dirname + '/data/short_summary.csv';

//this will also be the collection name for the base records
config.salseRecordModelName = 'salesRecord';

config.headerConversionTypes = 
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

config.salesRecordSchemaObject =
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
  saleDate: Date
}

config.matchQueryBuilder = function(mongooseModel)
{
	return
	({
		'address': mongooseModel.address,
    	'apartmentNumber': mongooseModel.apartmentNumber,
    	'saleDate': mongooseModel.saleDate
    });
}



module.exports = config;