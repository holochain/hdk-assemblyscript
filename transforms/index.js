
const zomeFunctions = require('./zome_function');
const canStringify = require('./can_stringify');

exports.afterParse = function(parser) {
	canStringify.applyTransform(parser);
	zomeFunctions.applyTransform(parser);
}