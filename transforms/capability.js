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


/*
*   @zome_function decorator
*   ========================
*   Informs the compiler that a particular function should be exported 
*   and made callable by holochain as a zome function.
*   A new exported function is created that handles serializing 
*   and deserializing of parameters. 
*   Also adds an entry to the zome.json
*/

exports.applyTransform = function(parser) {

  const entrySrcIdx = parser.program.sources.findIndex(s => s.isEntry);
  const entrySrc = parser.program.sources[entrySrcIdx];
  let zomeFuncs = [];
  
  entrySrc.statements.forEach(stmt => {
    if (
      stmt.kind === NodeKind.FUNCTIONDECLARATION &&
      stmt.decorators &&
      stmt.decorators.length &&
      stmt.decorators.some(d => d.name.text === "capability")
    ) {

      // retrieve the parameter (which capability)
      const decoratorArgs = stmt.decorators
        .filter(d => d.name.text === "capability")[0]
        .arguments

      if(decoratorArgs.length !== 1) {
        throw Error("capability decorator must specify a single string argument that is the capability to add the function to.")
      }

      // unpack what we need from this function
      const func = {
        name: stmt.signature.parent.name.text,
        params: stmt.signature.parameters.map((param) => {
          return {name: param.name.text, type: param.type.name.text}
        }),
        returnType: stmt.signature.returnType.name.text,
        capability: decoratorArgs[0].value
      }

      zomeFuncs.push(func);

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
    }

  })

  const capabilitiesRoot = "../capabilities/"
  // group funcs by capabilities
  capabilities = {}
  zomeFuncs.forEach(func => {
    if(!capabilities[func.capability]) { 
      capabilities[func.capability] = [] 
    }
    capabilities[func.capability].push(func)
  })

  for (let cap in capabilities) {
    writeZomeJSON(capabilities[cap], capabilitiesRoot+cap+'/autogen.zome.json')
  }
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

// The following functions are for doing the autogen of JSON for the capabilities

function writeZomeJSON(zomeFuncs, outputPath) {
  let zome;
  if (fs.existsSync(outputPath)) { // update an existing zome.json
    let rawJSON = fs.readFileSync(outputPath);
    zome = JSON.parse(rawJSON);
  } else { // have to create a new one from scratch

    zome = {
      description: "",
      capability: {
        membrane: "agent"
      },
      functions: []
    }
  }

  zome.functions = zomeFuncs.map(func => {
    return {
      name: func.name,
      inputs: func.params,
      outputs: []
    }
  });

  ensureDirectoryExistence(outputPath);

  try {
    fs.writeFileSync(outputPath, JSON.stringify(zome, null, 2));
  } catch (err) {
    throw Error("Unable to create file at "+outputPath);
  }
}

// will recursively create all the directories required to form a path
function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}