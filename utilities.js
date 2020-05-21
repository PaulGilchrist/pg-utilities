const axios = require('axios');
const https = require('https');
const jwtWebToken = require('jsonwebtoken');

const utilities = {
    abs: (inputObjectArray, propertyName) => {
        // Converts every negative value for propertyName to its absolute value across an array of objects
        return inputObjectArray.map((i) => {
            i[propertyName] = Math.abs(i[propertyName]);
            return i;
        });
    },
    base64Decode: (base64Encoded) => {
        return Buffer.from(base64Encoded, 'base64').toString();
    },
    base64Encode: (string) => {
        return Buffer.from(string).toString('base64');
    },
    filter: (inputObjectArray, searchString) => {
        // Filters any objects from the array where any of their properties contain the passed in search string
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
    isDate: (value) => {
        var dateFormat;
        if (toString.call(value) === '[object Date]') {
            return true;
        }
        if (typeof value.replace === 'function') {
            value.replace(/^\s+|\s+$/gm, '');
        }
        dateFormat = /(^\d{1,4}[.|\\/|-]\d{1,2}[.|\\/|-]\d{1,4})(\s*(?:0?[1-9]:[0-5]|1(?=[012])\d:[0-5])\d\s*[ap]m)?$/;
        return dateFormat.test(value);
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
    sort: (inputObjectArray, propertyName, descending = false) => {
        // Sort an array of objects (in place) by the value of a given propertyName either ascending (default) or descending
        if (inputObjectArray && propertyName) {
            inputObjectArray.sort((a, b) => {
                let aValue = a[propertyName];
                let bValue = b[propertyName];
                // Check if strings are actually dates
                if(isDate(aValue) && isDate(bValue)) {
                    aValue = new Date(a[propertyName]);
                    bValue = new Date(b[propertyName]);
                }
                if (aValue < bValue) {
                    return descending ? 1 : -1;
                }
                if (bValue < aValue) {
                    return descending ? -1 : 1;
                }
                return 0;
            });
        }
    },
    streamToString: async (readableStream) => {
        // A helper function used to read a Node.js readable stream into a string
        return new Promise((resolve, reject) => {
            const chunks = [];
            readableStream.on("data", (data) => {
                chunks.push(data.toString());
            });
            readableStream.on("end", () => {
                resolve(chunks.join(""));
            });
            readableStream.on("error", reject);
        });
    },
    jwt: {
        decode: (encodedJwt) => {
            let idTokenPartsRegex = /^([^\.\s]*)\.([^\.\s]+)\.([^\.\s]*)$/;
            let matches = idTokenPartsRegex.exec(encodedJwt);
            if (!matches || matches.length < 4) {
                console.log('The returned token is not parseable.');
                return null;
            }
            let decodedJwt = {
                header: matches[1],
                payload: matches[2],
                signature: matches[3]
            };
            return decodedJwt;
        },
        extractHeader: (encodedJwt) => {
            // id token will be decoded to get the username
            let decodedJwt = utilities.jwt.decode(encodedJwt);
            if(decodedJwt) {
                try {
                    return JSON.parse(utilities.base64Decode(decodedJwt.header));
                } catch (err) {
                    console.log('The token could not be decoded: ' + err);
                }
            }
            return null;
        },
        extractSignature: (encodedJwt) => {
            // id token will be decoded to get the username
            let decodedJwt = utilities.jwt.decode(encodedJwt);
            if(decodedJwt) {
                try {
                    return JSON.parse(utilities.base64Decode(decodedJwt.signature));
                } catch (err) {
                    console.log('The token could not be decoded: ' + err);
                }
            }
            return null;
        },
        extractToken: (encodedJwt) => {
            // id token will be decoded to get the username
            let decodedJwt = utilities.jwt.decode(encodedJwt);
            let base64Jwt = null;
            if(decodedJwt) {
                base64Jwt = decodedJwt.payload;
            } else {
                base64Jwt = encodedJwt;
            }
            try {
                return JSON.parse(utilities.base64Decode(base64Jwt));
            } catch (err) {
                console.log('The token could not be decoded: ' + err);
            }
            return null;
        },
        verify: async (encodedJwt) => {
            const header = utilities.jwt.extractHeader(encodedJwt);
            // Get Azure configuration
            // const configuration = await axios.request({
            //     data: null,            
            //     headers: {
            //             'Content-Type': 'application/json'
            //     },
            //     httpsAgent: new https.Agent({
            //         keepAlive: true,
            //         rejectUnauthorized: false // (NOTE: this will disable client verification)
            //     }),
            //     method: 'get',
            //     url: "https://login.microsoftonline.com/common/.well-known/openid-configuration"
            // }).then(response => response.data);
            // Get Azure public encryption keys
            const keys = await axios.request({
                data: null,            
                headers: {
                        'Content-Type': 'application/json'
                },
                httpsAgent: new https.Agent({
                    keepAlive: true,
                    rejectUnauthorized: false // (NOTE: this will disable client verification)
                }),
                method: 'get',
                url: "https://login.microsoftonline.com/common/discovery/keys" //could also get from above commented out code - configuration.jwks_uri
            }).then(response => response.data.keys);
            // Make sure the key used to encrypt the token matches Microsoft's key
            const matchingKey = keys.find(key => key.kid===header.kid);
            const certificate = `-----BEGIN CERTIFICATE-----\n${matchingKey.x5c}\n-----END CERTIFICATE-----`;
            return jwtWebToken.verify(encodedJwt, certificate);
        }
    }
}

module.exports = utilities;