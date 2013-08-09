var config = {};

//config.dbURI = 'mongodb://localhost:27017/thunder';
config.dbURI = 'mongodb://localhost:27017/thunder_test';

config.dataDirectory = __dirname + '/data_02';

config.modelsDirectory = __dirname + '/models';
config.viewsDirectory = __dirname + '/views';
config.controllersDirectory = __dirname + '/controllers';

config.helpersFile = __dirname + '/helpers/helpers.js';
config.validationFile = __dirname + '/validation/request_validation.js';

config.salseRecordModelName = 'salesRecord'; ////

config.metaModelFile = config.modelsDirectory + '/meta';

config.monthlyModelBaseFile = config.modelsDirectory + '/monthly_base';
config.salesRecordModelFile = config.modelsDirectory + '/sales_records';
config.monthlyZipSummaryModelFile = config.modelsDirectory + '/monthly_zip_summaries';
config.monthlyBoroughSummaryModelFile = config.modelsDirectory + '/monthly_borough_summaries';
config.monthlyNeighborhoodSummaryModelFile = config.modelsDirectory + '/monthly_neighborhood_summaries';



config.salesRecordsFile = __dirname + '/data/summary_staten.csv';
//config.salesRecordsFile = __dirname + '/data/short_summary.csv';

config.key = {};
config.key.zip = 'zipList';
config.key.neighborhood = 'neighborhood';

//date before first record
config.startDate = new Date(2000, 0, 1);
config.concurrencyLimit = 10;

config.boroughs = [1, 2, 3, 4, 5];

//time to wait for mongo to check if mongo is still saving records
config.dbBuildTimeout = 10000;

config.internalServerError = 'The server encountered an unexpected condition which prevented it from fulfilling the request.';

//ensure no dependencies than remove
config.mothlyBoroughSummariesModelName = 'monthlySummary';


module.exports = config;