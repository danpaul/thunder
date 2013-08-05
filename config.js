var config = {};

config.dbURI = 'mongodb://localhost:27017/thunder';

config.modelsDirectory = __dirname + '/models';
config.viewsDirectory = __dirname + '/views';
config.controllersDirectory = __dirname + '/controllers';

config.helpersFile = __dirname + '/helpers/helpers.js';
config.validationFile = __dirname + '/validation/request_validation.js';

config.salseRecordModelName = 'salesRecord'; ////

config.metaModelFile = config.modelsDirectory + '/meta';

config.salesRecordModelFile = config.modelsDirectory + '/sales_records';
config.mothlyBoroughSummariesModelName = 'monthlySummary';
config.monthlyZipSummaryModelFile = config.modelsDirectory + '/monthly_zip_summaries';

config.salesRecordsFile = __dirname + '/data/summary_staten.csv';
//config.salesRecordsFile = __dirname + '/data/short_summary.csv';

config.key = {};
config.key.zip = 'zipList';
config.key.neighborhood = 'neighborhood';

//date before first record
config.earliestDate = new Date(2000, 0, 1);

config.boroughs = [1, 2, 3, 4, 5];

config.internalServerError = 'The server encountered an unexpected condition which prevented it from fulfilling the request.';

module.exports = config;