

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