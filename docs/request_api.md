### formatting notes

#### dates
All dates are formatted as YYYY-MM-DD (e.g. 2010-01-15).
Requests for months should be for the first day of the month (e.g. 2010-01-01).
Requests for a range of months will include the `startDate` and go up to (but not include) the `endDate`.

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

#### url: 