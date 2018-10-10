const assemblyscript = require('assemblyscript');
const {
  CommonFlags,
  Node,
  NodeKind,
  SourceKind,
  TypeKind,
  parseFile
} = assemblyscript;


exports.applyTransform = function(parser) {

  const entrySrcIdx = parser.program.sources.findIndex(s => s.isEntry)
  const entrySrc = parser.program.sources[entrySrcIdx]
  
  entrySrc.statements.forEach(stmt => {
    if (
      stmt.kind === 49 && //NodeKind.FUNCTIONDECLARATION &&
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

      // TODO: add some data to the manifest.json

    }

  })
}


/**
 * Produces the assemblyscript to export a zome function
 * Includes deserializing arguments, parsing to local variables, serializing result
 *
 * @param      {FuncDef}  funcDef  The function definition
 * @param      {string} funcDef.name Name of the public zome function
 * @param      {Array<Param>} funcDef.parameters The list of parameters for the function as {name: string, type: string}
 * @param      {string} funcDef.returnType The return type as a string
 */ 
function makeFunctionString(funcDef) {

  const codeString = `
  export function ${funcDef.name}(e: u32): u32 {
    ${makePreamble(funcDef)}
    ${makeCall(funcDef)}
    ${makePostamble(funcDef)}
  }
  `
  return codeString
}


// the code that runs before the function
function makePreamble(funcDef) {
  if(funcDef.params.length === 0) {
    return ``;
  } else if (funcDef.params.length === 1) {
    if(funcDef.params[0].type === 'string') {
      return `let paramString: string = deserialize(e);`;
    } else {
      throw Error("Only string input parameters supported at this time.");
    }
  } else {
    throw Error("Multiple parameters not yet supported for zome functions.");
  }
}


function makeCall(funcDef) {
  let paramString = "";

  if(funcDef.params.length !== 0) {
    paramString = "paramString";
  }

  if(funcDef.returnType === 'void') {
    return `_${funcDef.name}(${paramString});`
  } else {
    return `
    let result: ${funcDef.returnType} = _${funcDef.name}(${paramString});
    `
  }
}


function makePostamble(funcDef) {
  switch(funcDef.returnType) {
    case 'void':
      return `return 0;`;
    case 'string':
      return  `return serialize(result)`;
    default:
      throw Error("Return type not yet supported.");
  }
}
