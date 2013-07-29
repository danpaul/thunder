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