const test = require('tape');
const {makeFunctionString} = require('../zome-functions-transform');
const assemblyscript = require('assemblyscript');

const {
  CommonFlags,
  Node,
  NodeKind,
  SourceKind,
  TypeKind,
  Parser,
  parseFile
} = assemblyscript;


test('Can generate a template for function with no parameters', function (t) {
	const funcDef = {
		name: 'testFunc',
		parameters: [],
		returnType: 'string'
	}
	const fString = makeFunctionString(funcDef);
	t.comment(fString)
	t.end();
});