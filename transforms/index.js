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
  let zomeFuncs = []
  
  entrySrc.statements.forEach(stmt => {
    if (
      stmt.kind == NodeKind.FUNCTIONDECLARATION && 
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

  // this will need to be changed to support multiple capabilities
  writeZomeJSON(zomeFuncs, '../capabilities/main/autogen.zome.json')
}


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
