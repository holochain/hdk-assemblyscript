const fs = require('fs')
const path = require('path')
const assemblyscript = require('assemblyscript')

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
    if (
      stmt.kind === NodeKind.FUNCTIONDECLARATION &&
      stmt.decorators &&
      stmt.decorators.length &&
      stmt.decorators.some(d => d.name.text === "zome_function")
    ) {




      console.log("================params=============")

      // use this to create a handler that will populate the 
      // local scope with the deserialized parameter values

      stmt.signature.parameters.forEach((param) => {
        console.log(param.name.text + " : " + param.type.name.text)
        // console.log()
      })

      console.log("===========returnType=========")

      // use the return type to create a stringifier for the return type
      // support only string returns for now

      console.log(stmt.signature.returnType.name.text)

      console.log("===========body=========")


      // create a new node for the input param

      console.log(stmt.body.statements[0].expression)

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