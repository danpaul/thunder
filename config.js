var config = {};

config.dbURI = 'mongodb://localhost:27017/thunder';

config.modelsDirectory = __dirname + '/models';
config.viewsDirectory = __dirname + '/views';
config.controllersDirectory = __dirname + '/controllers';

//collection will be this name pluralized
config.salseRecordModelName = 'salesRecord';
config.mothlySummariesModelName = 'monthlySummary';

config.salesRecordsFile = __dirname + '/data/short_summary.csv';

module.exports = config;