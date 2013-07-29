var _ = require('underscore');
//will return true if valid, otherwise an error message

exports.validateParams = function(requestParameters, callback)
{
	var errorMessage = '';
	var valid = true;
	//check properties in requestParameters
	_.each(requestParameters, function(value, key)
	{
		if(value === false)
		{
			valid = false;
			errorMessage += key + " in request is invalid. \n";
		}
	});
	if(valid){return valid;}else{return errorMessage;}	
}

exports.buildBorough = function buildBorough(boroughIn)
{
	var boroughCodes = 
	{
		manhattan: 1,
		bronx: 2,
		brooklyn: 3,
		queens: 4,
		'staten-island': 5	
	}
	var borough = sanitizeString(boroughIn);
	if(boroughCodes.hasOwnProperty(borough)){return boroughCodes[borough];
	}else{return false;}
}

exports.buildDate = function buildDate(dateIn)
{
	var dateArray = dateIn.split('-');
	var date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
	if(isNaN(date.getTime())){return false;}else{return date;}
}