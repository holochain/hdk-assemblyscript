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
      if (funcName === 'marshal') {
        const args = s.expression.arguments.map(a => a.text)
        const typeName = s.expression.typeArguments[0].name.text
        const typeArgs = []//s.expression.typeArguments.map(t => t.name.text)
        const code = `marshal_${typeName}(${args[0]}, ${args[1]})`
        const statement = parseStatements(entrySrc, code)[0]
        // rewrite function body
        s.expression = statement.expression
      }
    }
  })

  const funcFile = fs.readFileSync(
    path.join(__dirname, 'unmarshal-helpers.ts'),
    'utf8'
  )
  const code = buildMarshalFuncs(deserializableClasses)
  console.log('*** *** *** *** *** ')
  console.log(code)
  console.log('*** *** *** *** *** ')
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

function buildMarshalFuncs(structs) {
  const common = `

  @inline
  function tokenVal(json: string, tok: JsmnToken): string {
    return json.substring(tok.start, tok.end)
  }

  function marshal_array<T>(json: string, toks: Array<JsmnToken>): Array<T> {
    let arr = new Array<T>()
    let arrTok = toks.shift()
    assert(arrTok.type === JsmnType.ARRAY)
    // TODO: check for empty array

    do {
      let tok: JsmnToken = toks.shift()
      const val = tokenVal(json, tok)
      arr.push(42)  // ***  parse
    } while (toks.length > 0 && toks[0].start < arrTok.end)
    return arr
  }

`
  return common + Object
    .keys(structs)
    .map(key => buildMarshal(key, structs[key]))
    .join('\n')
}

function buildMarshal(ty, struct) {

  const conditions = struct.map(([key, typeName, ...typeArgs]) => {
    const [parseCall, jsmnType] = (() => {
      switch(typeName) {
        case 'i32':
        case 'u32':
          return [
            `parseI32(val, 10)`,
            'JsmnType.PRIMITIVE'
          ]
        case 'i64':
        case 'u64':
          return [
            `parseI64(val, 10)`,
            'JsmnType.PRIMITIVE'
          ]
        case 'f32':
        case 'f64':
          return [
            'parseFloat(val)',
            'JsmnType.PRIMITIVE'
          ]
        case 'string':
          return [
            'val',
            'JsmnType.STRING'
          ]
        case 'Array':
          const targs = typeArgs.join(',')
          return [
            `marshal_array<${targs}>(json, toks)`,
            'JsmnType.ARRAY'
          ]
        default:
          // TODO: check for invalid type
          return [
            `marshal_${typeName}(json, toks)`,
            'JsmnType.OBJECT'
          ]
      }
    })()
    return `(key == '${key}') {
      assert(valTok.type === ${jsmnType})
      obj.${key} = ${parseCall}
    }`
  })

  const elseStatement = ` else { /* log<string>('TODO unknown key: ' + key) */ }`
  const conditionCode = 'if ' + conditions.join(' else if ') + elseStatement

  return `

function marshal_${ty}(json: string, toks: Array<JsmnToken>): ${ty} {
  let obj = new ${ty}()
  let objTok = toks.shift()
  assert(objTok.type === JsmnType.OBJECT)
  // TODO: check for empty object

  do {
    let keyTok: JsmnToken = toks.shift()
    let valTok: JsmnToken = toks.shift()
    const key = tokenVal(json, keyTok)
    const val = tokenVal(json, valTok)
    // *** begin generated conditionals ***
    ${ conditionCode }
    // ***  end generated conditionals  ***
  } while(toks.length > 0 && toks[0].start < objTok.end)
  return obj
}
  `
}

function parseStatements(entrySrc, code) {
  return parseFile(
    code,
    entrySrc.range.source.normalizedPath,
    true,
    null
  ).program.sources[0].statements
}
