var _ = require('underscore');

var config = require('../config');

var MonthlyZip = require(config.monthlyZipSummaryModelfile).model;

exports.get = function(req, res, params)
{
	MonthlyZip.find
	({
		date:{$gte: params.startDate, $lt: params.endDate},
		zipCode: params.zipCode
	})
	.sort({date: 1})
	.exec(function(err, records)
	{
		if(err)
		{
			console.log(err);
			res.send(500, config.internalServerError);
		}else{
			res.send(records);
		}
	});
}