const fs = require('fs');
const path = require('path');
const assemblyscript = require('assemblyscript');
const {
  CommonFlags,
  Node,
  NodeKind,
  SourceKind,
  TypeKind,
  parseFile
} = assemblyscript;

const templateGen = require('./function-template-generator')
const {
  makeFunctionString
} = templateGen;


exports.afterParse = function(parser) {

  const entrySrcIdx = parser.program.sources.findIndex(s => s.isEntry)
  const entrySrc = parser.program.sources[entrySrcIdx]
  
  entrySrc.statements.forEach(stmt => {
    if (
      stmt.kind === NodeKind.FUNCTIONDECLARATION &&
      stmt.decorators &&
      stmt.decorators.length &&
      stmt.decorators.some(d => d.name.text === "zome_function")
    ) {

      // unpack what we need from this function

      const func = {
        name: stmt.signature.parent.name.text,
        params: stmt.signature.parameters.map((param) => {
          return {name: param.name.text, type: param.type.name.text}
        }),
        returnType: stmt.signature.returnType.name.text
      }

      console.log(func)


      // rename the old function to be prefixed with an underscore
      stmt.signature.parent.name.text = "_"+func.name;

      // create a new function with the same name that does the unwrapping and 
      // calls the old function
      const callWrapperStmt = parseFile(
        makeFunctionString(func),
        entrySrc.range.source.normalizedPath, 
        true,
        null
      ).program.sources[0].statements[0];
    
      // add the new function to the AST as an exported function
      entrySrc.statements.push(callWrapperStmt);

      // (optionally) add some data to the manifest.json



      // to modify
      /*
      Create a string, then run "parseFile" on the string to get an AST of its own
      const callWrapperStatement = parseFile(
            `storageLoadWrapper()`, entrySrc.range.source.normalizedPath, true, null).program.sources[0].statements[0]
      Then assign any results into the old AST, like
      callWrapperStatement.expression.arguments.push(keyExpr)
      */
    }

  })
/*
export function test_commit(val: string): string {
  return commit_entry("message", val);
}

- search for functions with decorators
- use the same function name
- replace the function signature with consistent one
- move the function signature var declaration into the main function body
- take the return value and wrap it in serialize

export function test_commit(e: u32): u32 {
  let val: string = deserialize(e);
  return serialize(commit_entry("message", val));
}

*/

  // check out for examples of working with the ast
  // https://github.com/etherts/ewasm-as/blob/master/assembly/src/transform.js
}