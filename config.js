var config = {};

config.dbURI = 'mongodb://localhost:27017/thunder';

config.modelsDirectory = __dirname + '/models';
config.viewsDirectory = __dirname + '/views';
config.controllersDirectory = __dirname + '/controllers';

//collection will be this name pluralized
config.salseRecordModelName = 'salesRecord';
config.salesRecordModelfile = config.modelsDirectory + '/sales_records';
config.mothlyBoroughSummariesModelName = 'monthlySummary';

config.salesRecordsFile = __dirname + '/data/summary_staten.csv';
//config.salesRecordsFile = __dirname + '/data/short_summary.csv';

module.exports = config;