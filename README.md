# Commonly Used Utilities JavaScript Library

## Functions

* `abs(inputObjectArray, propertyName)` - Converts every negative value for propertyName to its absolute value across an array of objects
* `base64Decode(base64Encoded)` - Given a base64 encoded string, returns an ASCII string
* `base64Encode(string)` - Given a an ASCII string, returns a base64 encoded string
* `filter(inputObjectArray, searchString)` - Filters any objects from the array where any of their properties contain the passed in search string
* `guid()` - GUID generator
* `jsonParseNumbers(inputObject)` - Similar to JSON.parse() but parses all number properties
* `jwt.decode(encodedJwt)` - Decode the JSON Web Token and return its 3 parts (header, payload, and signature) still in JSON format
* `jwt.extractHeader(encodedJwt)` - Decode the JSON Web Token and return just its header as an object
* `jwt.extractSignature(encodedJwt)` - Decode the JSON Web Token and return just its signature as an object
* `jwt.extractToken(encodedJwt)` - Decode the JSON Web Token and return just its payload as an object
* `jwt.verify(encodedJwt)` - Asynchronous function that decodes the JSON Web Token and validate it against Azure AD.  Other validations coming in the future.
* `nameSort(a, b)` - Used when a and b are objects containing name properties
* `sort(inputObjectArray, propertyName, descending = false)` - Sort an array of objects by the value of a given propertyName either ascending (default) or descending
* `streamToString(readableStream)` - Asynchronous function that given a readable NodeJS stream, returns it as a string