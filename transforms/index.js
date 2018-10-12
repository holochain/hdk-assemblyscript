
const capability = require('./capability');
const canStringify = require('./can_stringify');

exports.afterParse = function(parser) {
  canStringify.applyTransform(parser);
  capability.applyTransform(parser);
}
