var config = {};

config.dbURI = 'mongodb://localhost:27017/thunder';

config.modelsDirectory = __dirname + '/models';
config.viewsDirectory = __dirname + '/views';
config.controllersDirectory = __dirname + '/controllers';

config.salesRecordsFile = __dirname + '/data/short_summary.csv';

module.exports = config;