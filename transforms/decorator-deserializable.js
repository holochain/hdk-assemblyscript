const fs = require('fs')
const path = require('path')
const {
  CommonFlags,
  Node,
  NodeKind,
  SourceKind,
  TypeKind,
  parseFile
} = require('assemblyscript');

const show = x => {throw Error(JSON.stringify((x)))}
const showKeys = x => {throw Error(JSON.stringify(Object.keys(x)))}

exports.afterParse = function(parser) {

  const entrySrcIdx = parser.program.sources.findIndex(s => s.isEntry)
  const entrySrc = parser.program.sources[entrySrcIdx]

  const deserializableClasses = {}

  entrySrc.statements.forEach(s => {
    if (
      s.kind === NodeKind.CLASSDECLARATION &&
      s.decorators &&
      s.decorators.length &&
      s.decorators.some(d => d.name.text === "deserializable")
    ) {
      if (s.isGeneric) {
        throw Error("Generic classes are not currently @deserializable")
      }

      const fields = []
      s.members.forEach(m => {
        if (m.kind === NodeKind.FIELDDECLARATION) {
          const name = m.name.text
          const type = m.type.name.text
          const typeArgs = m.type.typeArguments.map(t => t.name.text)
          fields.push([m.name.text, type, ...typeArgs])
        }
      })

      deserializableClasses[s.name.text] = fields
    }
  })

  entrySrc.statements.forEach(s => {
    if (s.kind === NodeKind.EXPRESSION && s.expression.kind === NodeKind.CALL) {
      const funcName = s.expression.expression.text
      if (funcName === 'unmarshal') {
        const args = s.expression.arguments.map(a => a.text)
        const typeName = s.expression.typeArguments[0].name.text
        const typeArgs = []//s.expression.typeArguments.map(t => t.name.text)
        const code = `
          unmarshal_impl(
            ${args[0]},
            ${args[1]},
            0,
            '${typeName}',
            ${typeArgs ? "[" + typeArgs.join('","') + "]" : "[]"},
          )
        `
        const statement = parseStatements(entrySrc, code)[0]
        // rewrite function body
        s.expression = statement.expression
      }
    }
  })

  const funcFile = fs.readFileSync(
    path.join(__dirname, 'unmarshal-helpers.js'),
    'utf8'
  )
  const code = structCode(deserializableClasses) + '\n' + funcFile
  console.log(code)
  const stmts = parseStatements(entrySrc, code)

  // add the new function to the AST as an exported function
  entrySrc.statements.push(...stmts);

  // show(deserializableClasses)

  // create a new function with the same name that does the unwrapping and
  // calls the old function
  // const funcStatement = parseFile(
  //   func_getTypeTree,
  //   entrySrc.range.source.normalizedPath,
  //   true,
  //   null
  // ).program.sources[0].statements[0];

  // // add the new function to the AST as an exported function
  // entrySrc.statements.push(funcStatement);
}

function structCode(structs) {
  const decl = `
    let structs: Map<string, AoA > = new Map();
  `
  const defs = ''
  Object.keys(structs).forEach(key => {
    const struct = structs[key]
    defs += `
    structs.set('${key}', <AoA>${JSON.stringify(struct)});
    `
  })
  return `
    type AoA = Array< Array<string> >;
    function __deserializableClasses(): Map<string, AoA > { `
    + decl + '\n' + defs + '\nreturn structs'
    + '}'
}

function parseStatements(entrySrc, code) {
  return parseFile(
    code,
    entrySrc.range.source.normalizedPath,
    true,
    null
  ).program.sources[0].statements
}


// const makeParseFn = classes => (className, type) => `
//   function __jsonParse_${type}(json: string): ${type} {
//     const tokens = tokenize(json)
//     unmarshal<(tokens)
//   }
// `

