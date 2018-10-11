
const zomeFuncions = require('./zome_function');
const can_stringify = require('./can_stringify');

exports.afterParse = function(parser) {
	can_stringify.applyTransform(parser);
	zomeFuncions.applyTransform(parser);
}