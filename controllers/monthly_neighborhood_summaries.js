var _ = require('underscore');

var config = require('../config');
var MonthlyNeighborhood = require(config.monthlyNeighborhoodSummaryModelFile).model;

exports.get = function(req, res, params)
{
	MonthlyNeighborhood.find
	({
		date:{$gte: params.startDate, $lt: params.endDate},
		neighborhood: params.neighborhood
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