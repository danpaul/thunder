var _ = require('underscore');
//will return true if valid, otherwise an error message

exports.validateRequest = function(requestParameters, callback)
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