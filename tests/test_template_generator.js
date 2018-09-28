const test = require('tape');
const {makeFunctionString} = require('../function-template-generator');
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


test('Can generate a template for function with a single parameters', function (t) {
	const funcDef = {
		name: 'testFunc',
		parameters: [{name: 'p1', type: 'string'}],
		returnType: 'string'
	}
	const fString = makeFunctionString(funcDef);
	t.comment(fString)

	t.end();
});


test('Can generate a template for function with multiple parameters', function (t) {
	const funcDef = {
		name: 'testFunc',
		parameters: [{name: 'p1', type: 'string'}, {name: 'p2', type: 'i32'}],
		returnType: 'string'
	}
	const fString = makeFunctionString(funcDef);
	t.comment(fString)

	t.end();
});