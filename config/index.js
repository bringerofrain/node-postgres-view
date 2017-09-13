//In Real World these values would be encrypted and decrupted at the endpoint
var configValues = require('./config');

module.exports = {
    getDBConnStr: configValues.uri,
    allvalues: configValues

}