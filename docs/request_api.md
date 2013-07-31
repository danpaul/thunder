## formatting notes

#### dates:
All dates are formatted as YYYY-MM-DD (e.g. 2010-01-15).

Requests for months should be for the first day of the month (e.g. 2010-01-01).

Requests for a range of months will include the `startDate` and go up to (but not include) the `endDate`.

#### multi word arguments:
If multiple words are used for a single argument, separate them with a hyphen (e.g. `staten-island`).

#### Case:
Keep all arguments lower case (e.g. `staten-island`).

## API documentation

### monthly zip code data

#### url: `/api/monthly/zip/[:zipCode]/[:startDate]/[:endDate].json`

**Takes**:
* `zipCode`: a valid NYC zip code
* `startDate`: a formatted date
* `endDate`: a formatted date

**Returns**:
A sorted array of JSON objects from least to most recent. Each object has the following attributes.
* `date`(Date): first day of the month
* `averageSalePrice` (Number)
* `medianSalePrice` (Number)
* `salesSum` (Number): sum of all sales for the month
* `totalSales` (Number): total number of sales for the month

### monthly borough data

#### url: `/api/monthly/borough/[:borough]/[:startDate]/[:endDate].json`

**Takes**:
* `borough`: a valid lower case NYC borough, (hyphen separated for Staten Island (`staten-island`)). 
* `startDate`: a formatted date
* `endDate`: a formatted date

**Returns**:
A sorted array of JSON objects from least to most recent. Each object has the following attributes.
* `date`(Date): first day of the month
* `borough` (Number): between 1-5 (see 'borough codes' in reference).
* `averageSalePrice` (Number)
* `medianSalePrice` (Number)
* `salesSum` (Number): sum of all sales for the month
* `totalSales` (Number): total number of sales for the month

## reference

#### borough codes:

* manhattan: 1
* bronx: 2
* brooklyn: 3
* queens: 4
* staten-island: 5	
