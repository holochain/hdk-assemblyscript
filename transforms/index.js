
const zomeFunctions = require('./zome_function');
const can_stringify = require('./can_stringify');

exports.afterParse = function(parser) {
	can_stringify.applyTransform(parser);
	zomeFunctions.applyTransform(parser);
}