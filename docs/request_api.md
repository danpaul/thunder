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

### monthly neighborhood data

#### url: `/api/monthly/neighborhood/[:neighborhood]/[:startDate]/[:endDate].json`

**Takes**:
* `neighborhood`: a valid lower case, hyphen separated NYC neighborhood, (e.g. `chelsea`, `washington-heights`)). * see reference for a list of neighborhoods *
* `startDate`: a formatted date
* `endDate`: a formatted date

**Returns**:
A sorted array of JSON objects from least to most recent. Each object has the following attributes.
* `date`(Date): first day of the month
* `neighborhood` (String): a lower case, hyphen separated neighborhood.
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

#### valid neighborhoods:

<pre>
'airport-la-guardia',
'alphabet-city',
'annadale',
'arden-heights',
'arrochar',
'arrochar-shore-acres',
'arverne',
'astoria',
'bath-beach',
'bathgate',
'bay-ridge',
'baychester',
'bayside',
'bedford-park/norwood',
'bedford-stuyvesant',
'beechhurst',
'belle-harbor',
'bellerose',
'belmont',
'bensonhurst',
'bergen-beach',
'bloomfield',
'boerum-hill',
'borough-park',
'breezy-point',
'briarwood',
'brighton-beach',
'broad-channel',
'bronx-park',
'bronxdale',
'brooklyn-heights',
'brooklyn-unknown',
'bulls-head',
'bush-terminal',
'bushwick',
'cambria-heights',
'canarsie',
'carroll-gardens',
'castle-hill/unionport',
'castleton-corners',
'chelsea',
'chinatown',
'city-island',
'civic-center',
'clinton',
'clinton-hill',
'clove-lakes',
'co-op-city',
'cobble-hill',
'cobble-hill-west',
'college-point',
'concord',
'concord-fox-hills',
'coney-island',
'corona',
'country-club',
'crotona-park',
'crown-heights',
'cypress-hills',
'dongan-hills',
'dongan-hills-colony',
'dongan-hills-old-town',
'douglaston',
'downtown-fulton-ferry',
'downtown-fulton-mall',
'downtown-metrotech',
'dyker-heights',
'east-elmhurst',
'east-new-york',
'east-tremont',
'east-village',
'elmhurst',
'eltingville',
'emerson-hill',
'far-rockaway',
'fashion',
'fieldston',
'financial',
'flatbush-central',
'flatbush-east',
'flatbush-lefferts-garden',
'flatbush-north',
'flatiron',
'flatlands',
'floral-park',
'flushing-north',
'flushing-south',
'fordham',
'forest-hills',
'fort-greene',
'fresh-kills',
'fresh-meadows',
'glen-oaks',
'glendale',
'gowanus',
'gramercy',
'grant-city',
'grasmere',
'gravesend',
'great-kills',
'great-kills-bay-terrace',
'greenpoint',
'greenwich-village-central',
'greenwich-village-west',
'grymes-hill',
'hammels',
'harlem-central',
'harlem-east',
'harlem-upper',
'harlem-west',
'highbridge/morris-heights',
'hillcrest',
'hollis',
'hollis-hills',
'holliswood',
'howard-beach',
'huguenot',
'hunts-point',
'inwood',
'jackson-heights',
'jamaica',
'jamaica-bay',
'jamaica-estates',
'jamaica-hills',
'javits-center',
'kensington',
'kew-gardens',
'kingsbridge-hts/univ-hts',
'kingsbridge/jerome-park',
'kips-bay',
'laurelton',
'little-italy',
'little-neck',
'livingston',
'long-island-city',
'lower-east-side',
'madison',
'manhattan-beach',
'manhattan-valley',
'manor-heights',
'marine-park',
'mariners-harbor',
'maspeth',
'melrose/concourse',
'middle-village',
'midland-beach',
'midtown-cbd',
'midtown-east',
'midtown-west',
'midwood',
'morningside-heights',
'morris-park/van-nest',
'morrisania/longwood',
'mott-haven/port-morris',
'mount-hope/mount-eden',
'murray-hill',
'neponsit',
'new-brighton',
'new-brighton-st-george',
'new-dorp',
'new-dorp-beach',
'new-dorp-heights',
'new-springville',
'oakland-gardens',
'oakwood',
'oakwood-beach',
'ocean-hill',
'ocean-parkway-north',
'ocean-parkway-south',
'old-mill-basin',
'ozone-park',
'park-slope',
'park-slope-south',
'parkchester',
'pelham-gardens',
'pelham-parkway-north',
'pelham-parkway-south',
'pleasant-plains',
'port-ivory',
'port-richmond',
'princes-bay',
'prospect-heights',
'queens-village',
'red-hook',
'rego-park',
'richmond-hill',
'richmondtown',
'richmondtown-lighths-hill',
'ridgewood',
'riverdale',
'rockaway-park',
'rosebank',
'rosedale',
'rossville',
'rossville-charleston',
'rossville-port-mobil',
'rossville-richmond-valley',
'schuylerville/pelham-bay',
'sheepshead-bay',
'silver-lake',
'so-jamaica-baisley-park',
'soho',
'soundview',
'south-beach',
'south-jamaica',
'south-ozone-park',
'southbridge',
'springfield-gardens',
'st-albans',
'stapleton',
'stapleton-clifton',
'staten-island-unknown',
'sunnyside',
'sunset-park',
'throgs-neck',
'todt-hill',
'tompkinsville',
'tottenville',
'travis',
'tribeca',
'upper-east-side-(59-79)',
'upper-east-side-(79-96)',
'upper-east-side-(96-110)',
'upper-west-side-(59-79)',
'upper-west-side-(79-96)',
'upper-west-side-(96-116)',
'van-cortlandt-park',
'wakefield',
'washington-heights-lower',
'washington-heights-upper',
'west-new-brighton',
'westchester',
'westerleigh',
'whitestone',
'williamsbridge',
'williamsburg-central',
'williamsburg-east',
'williamsburg-north',
'williamsburg-south',
'willowbrook',
'windsor-terrace',
'woodhaven',
'woodlawn',
'woodrow',
'woodside',
'wyckoff-heights'
</pre>