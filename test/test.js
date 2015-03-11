var mock = require('../index');


var path = require('path');
var fs = require('fs');
var url = path.resolve('../demo/a.json');
var jj =  JSON.parse(fs.readFileSync(url, 'utf-8'));
console.log(jj);

console.log(mock.schema2mock(jj));


