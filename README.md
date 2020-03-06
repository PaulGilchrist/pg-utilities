# Commonly Used Utilities JavaScript Library

## Functions

* `abs(inputObjectArray, propertyName)` - Converts every negative value for propertyName to its absolute value across an array of objects
* `filter(inputObjectArray, searchString)` - Filters any objects from the array where any of their properties contain the passed in search string
* `guid()` - GUID generator
* `jsonParseNumbers(inputObject)` - Similar to JSON.parse() but parses all number properties
* `nameSort(a, b)` - Used when a and b are objects containing name properties
* `sort(inputObjectArray, propertyName, descending = false)` - Sort an array of objects by the value of a given propertyName either ascending (default) or descending
