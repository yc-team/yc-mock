var random = require('yc-random');
var web = random.web;
var word = random.word;

function handleBasicMock (schema) {
    var type = schema['type'];
    var defaultVal = schema['default'];
    var result;

    switch (type) {
        case 'boolean':
            result = random.boolean();
            break;

        case 'string':
            min = schema['minLength'] || 1;
            max = schema['maxLength'] || 1;
            format = schema['format'];

            //TODO support pattern

            if (format == 'ip') {
                result = web.ip();
            } else if (format == 'domain') {
                result = web.domain();
            } else if (format == 'url') {
                result = web.url();
            } else if (format == 'tld') {
                result = web.tld();
            } else if (format == 'email') {
                result = random.email();
            } else if (format == 'camelCase') {
                result = word.word() + word.capitalize(word.word());
            } else if (format == 'PascalCase') {
                result = word.capitalize(word.word()) + word.capitalize(word.word()); 
            } else if (format == 'word') {
                result = word.word();
            } else {
                if (defaultVal) {
                    result = defaultVal;
                } else {
                    result = word.string({min: min,max: max});
                }
            }
            break;

        case 'number':
        case 'integer':
            min = schema['minimum'] || 0;
            max = schema['maximum'] || 99999;
            if (defaultVal) {
                result = defaultVal
            } else {
                result = random.integer(min, max);
            }
            break;
    }

    return result;
}


function handleMock (schema) {
    var result;

    //TODO required support~
    var properties = schema['properties'];

    //TODO set default value as object
    var type = schema['type'] || 'object';

    //default
    if (schema['default']) {
        return schema['default'];
    }

    //enum
    if (schema['enum']) {
        var len = schema['enum'].length;
        return schema['enum'][word.integer(0, len-1)];
    }

    //array
    if (type == 'array') {
        result = [];

        var min = schema['minItems'] || 0;
        var max = schema['maxItems'] || 1;
        var randomInteger = random.integer(min, max);

        for (var i = 0; i < randomInteger.length; i++) {
            if (schema['items']['type'] == 'object' || schema['items']['type'] == 'array') {
                //TODO
                result.push(arguments.callee(schema['items']));
            } else {
                //items
                result.push(handleBasicMock(schema['items']));
            }
        };

    }

    //object
    if (type == 'object') {
        result = {};
        for (var key in properties) {

            //TODO set default value as string
            var ptype = properties[key]['type'] || 'string';

            if (ptype == 'object' || ptype == 'array') {
                result[key] = arguments.callee(properties[key]);
            } else {
                result[key] = handleBasicMock(properties[key]);
            }

        }
    }

    return result;
}


module.exports = {
    schema2mock: function (schema) {
        return handleMock(schema);
    }
};