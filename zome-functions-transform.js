const fs = require('fs')
const path = require('path')
var assemblyscript
(() => {
  try {
    assemblyscript = require('assemblyscript')
  } catch (e) {
    require('ts-node').register({ project: path.join(__dirname, 'node_modules', 'assemblyscript', 'src', 'tsconfig-base.json') })
    require('./node_modules/assemblyscript/src/glue/js')
    assemblyscript = require('./node_modules/assemblyscript/src')
  }
})()
const {
  CommonFlags,
  Node,
  NodeKind,
  SourceKind,
  TypeKind,
  parseFile
} = assemblyscript

exports.afterParse = function(parser) {

  const entrySrcIdx = parser.program.sources.findIndex(s => s.isEntry)
  const entrySrc = parser.program.sources[entrySrcIdx]
  
  entrySrc.statements.forEach(stmt => {
    //console.log(Object.keys(stmt))
    if (
      stmt.kind === NodeKind.FUNCTIONDECLARATION &&
      stmt.decorators &&
      stmt.decorators.length &&
      stmt.decorators[0].name.text === "zome_function"
    ) {
      console.log("params " + stmt.signature.parameters)
      console.log("returnType " + stmt.signature.returnType)

      // create a new node for the input param

      console.log(stmt.body)

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