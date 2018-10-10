
const zomeFuncions = require('./zome_function');
const serializable = require('./serializable');

exports.afterParse = function(parser) {
	zomeFuncions.applyTransform(parser);
	serializable.applyTransform(parser);
}