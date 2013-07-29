p = console.log

function buildDate(dateIn)
{
	var dateArray = dateIn.split('-');
	var date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
	if( isNaN(date.getTime()) ){ return false };
	return date;

}

var d = '123-23';

p(buildDate(d));