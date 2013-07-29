exports.camelCase = function(input)
{ 
   return input
    .toLowerCase()
    .replace(/^\s+|\s+$/g,'')
    .replace(/\s(.)/g, function(match, g){ return g.toUpperCase(); });
}

exports.getMedian = function(dataArray)
{
	dataArray.sort(function(x, y){return x-y});
	if(dataArray.length % 2 == 0)
	{
		return((dataArray[dataArray.length/2-1] + dataArray[dataArray.length/2]) / 2.0);
	}else{
		return(dataArray[Math.floor(dataArray.length/2)]);
	}
}

exports.sanitizeNumberString = function(inputString)
{
	return parseFloat(inputString.replace(/[^\d.-]/g, ''));
}

exports.sanitizeString = sanitizeString = function(inputString)
{
	return inputString.trim().toLowerCase();
}