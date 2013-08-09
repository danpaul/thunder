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

exports.getAverage = function(dataArray)
{
	var sum = 0.0;
	_.each(dataArray, function(value)
	{
		sum += value;
	});
	if(sum === 0){return sum;}
	return(sum/dataArray.length);
}

exports.sanitizeNumberString = function(inputString)
{
	return parseFloat(inputString.replace(/[^\d.-]/g, ''));
}

exports.sanitizeString = sanitizeString = function(inputString)
{
	return inputString.trim().toLowerCase();
}

exports.buildDateArray = function(startDate, endDate)
{
	var dateIter = new Date(startDate.getTime());
	var dateArray = [];
	//build an array of start dates ranging from `startDate` to `endDate`
	while(dateIter.getTime() < endDate.getTime())
	{
		dateIter = getNextMonth(dateIter);
		dateArray.push(dateIter.getTime());
	}
	return dateArray;
}

var getNextMonth = exports.getNextMonth = function(date)
{
	var newDate = new Date(date.getTime());
	if(newDate.getMonth == 11)
	{
		newDate.setMonth(0);
		newDate.setYear(newDate.getYear() + 1);
	}else{
		newDate.setMonth(newDate.getMonth() + 1);
	}
	return newDate;
}

exports.zeroDate = function(dateIn)
{
	dateIn.setDate(1);
	dateIn.setHours(0,0,0,0);
	return dateIn;
}