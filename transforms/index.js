const zomeFunctions = require('./zome_function');
const canStringify = require('./can_stringify');
const deserializableDecorator = require('./decorator-deserializable')

exports.afterParse = function(parser) {
  canStringify.applyTransform(parser);
  zomeFunctions.applyTransform(parser);
  deserializableDecorator.afterParse(parser);
}
