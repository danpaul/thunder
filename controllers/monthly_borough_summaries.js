var _ = require('underscore');

var config = require('../config');


var monthlyBoroughSummaries = require(config.modelsDirectory).monthlyBoroughSummaries.model;

exports.get = function(req, res, params)
{
	monthlyBoroughSummaries.find
	({
		date:{$gte: params.startDate, $lt: params.endDate},
		borough: params.borough
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