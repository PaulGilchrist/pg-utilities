const utilities = {
    abs: (inputObjectArray, propertyName) => {
        // Converts every negative value for propertyName to its absolute value across an array of objects
        return inputObjectArray.map((i) => {
            i[propertyName] = Math.abs(i[propertyName]);
            return i;
        });
    },
    filter: (inputObjectArray, searchString) => {
        // Filters out any object from the array where none of its properties contain the passed in search string
        if (inputObjectArray != null && searchString != null && searchString.length > 0) {
            const searchStringLower = searchString.toLowerCase();
            return inputObjectArray.filter(o => {
                for (const property in o) { // Look at each property
                    if (typeof o[property] === 'string') {
                        if (o[property].toLowerCase().indexOf(searchStringLower) !== -1) {
                            return true;
                        }
                    }
                }
                return false;
            });
        } else {
            return inputObjectArray;
        }
    },
    guid: () => {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            // eslint-disable-next-line
			const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	},
    jsonParseNumbers: (inputObject) => {
        return JSON.parse(inputObject, (k, v) => {
            if(typeof v === "object") {
                return v;
            } else {
                return isNaN(v) ? v : Number(v);
            }
        });
    },
	nameSort: (a, b) => {
		if(a.name < b.name) {
			return -1;
		} else if (b.name < a.name) {
			return 1;
		} else {
			return 0;
		}
	},
    sort: (inputObjectArray, propertyName, descending = false) => {
        // Sort an array of objects by the value of a given propertyName either ascending (default) or descending
        if (inputObjectArray && propertyName) {
            return inputObjectArray.sort((a, b) => {
                if (a[propertyName] < b[propertyName]) {
                    return descending ? 1 : -1;
                }
                if (b[propertyName] < a[propertyName]) {
                    return descending ? -1 : 1;
                }
                return 0;
            });
        }
        return inputObjectArray;
    }

}

export default utilities;