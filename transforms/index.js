
const zomeFuncions = require('./zome_function');
const serializable = require('./serializable');

exports.afterParse = function(parser) {
	serializable.applyTransform(parser);
	zomeFuncions.applyTransform(parser);
}