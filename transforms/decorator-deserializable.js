const fs = require('fs')
const path = require('path')
const {
  CommonFlags,
  MethodDeclaration,
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
    if (
      s.kind === NodeKind.CLASSDECLARATION &&
      s.decorators &&
      s.decorators.length &&
      s.decorators.some(d => d.name.text === "deserializable")
    ) {
      const name = s.name.text
      const marshalCode = buildMarshal(name, deserializableClasses[name])
      console.log(marshalCode)
      const marshalStmt = parseStatements(entrySrc, marshalCode)[0]
      const method = Node.createMethodDeclaration(
        marshalStmt.name,
        null,
        marshalStmt.signature,
        marshalStmt.body,
        null,
        CommonFlags.STATIC,
        entrySrc.range  // TODO
      )
      // s.members.push(method)
      entrySrc.statements.push(marshalStmt)
    }
  })

  // entrySrc.statements.forEach(s => {
  //   if (s.kind === NodeKind.EXPRESSION && s.expression.kind === NodeKind.CALL) {
  //     const funcName = s.expression.expression.text
  //     if (funcName === 'marshal') {
  //       const args = s.expression.arguments.map(a => a.text)
  //       const typeName = s.expression.typeArguments[0].name.text
  //       const typeArgs = []//s.expression.typeArguments.map(t => t.name.text)
  //       const code = `marshal_${typeName}(${args[0]}, ${args[1]})`
  //       const statement = parseStatements(entrySrc, code)[0]
  //       // rewrite function body
  //       s.expression = statement.expression
  //     }
  //   }
  // })

  const code = builtinMarshalFuncs(deserializableClasses)
  console.log('*** *** *** *** *** ')
  console.log(code)
  console.log('*** *** *** *** *** ')
  const stmts = parseStatements(entrySrc, code)

  // add the new function to the AST as an exported function
  entrySrc.statements.push(...stmts);

  // show(deserializableClasses)

}

// {"S":[["a","i32"]],"T":[["s","S"]],"Arr":[["ss","Array","S"],["t","T"]]}

function builtinMarshalFuncs(structs) {
  return `

  @inline
  function tokenVal(json: string, tok: JsmnToken): string {
    return json.substring(tok.start, tok.end)
  }

  @inline
  function marshal_i32(json: string, toks: Array<JsmnToken>): i32 {
    let val = tokenVal(json, toks.shift())
    return parseI32(val, 10)
  }

  @inline
  function marshal_i64(json: string, toks: Array<JsmnToken>): i64 {
    let val = tokenVal(json, toks.shift())
    return parseI64(val, 10)
  }

  @inline
  function marshal_float(json: string, toks: Array<JsmnToken>): f64 {
    let val = tokenVal(json, toks.shift())
    return parseFloat(val)
  }

  @inline
  function marshal_string(json: string, toks: Array<JsmnToken>): string {
    let val = tokenVal(json, toks.shift())
    return val
  }

  // function marshal_array<__T>(marshalChild: (json: string, toks: Array<JsmnToken>) => __T):
  //   (json: string, toks: Array<JsmnToken>) => Array<__T>
  //   {
  //     return function(json: string, toks: Array<JsmnToken>): Array<__T> {
  //       let arr = new Array<__T>()
  //       let arrTok = toks.shift()
  //       assert(arrTok.type === JsmnType.ARRAY)
  //       // TODO: check for empty array

  //       while (toks.length > 0 && toks[0].start < arrTok.end) {
  //         arr.push(marshalChild(json, toks))  // ***  parse
  //       }
  //       return arr
  //     }
  //   }

  function marshal_array<Ty>(
    json: string,
    toks: Array<JsmnToken>,
    marshalChild: (json: string, toks: Array<JsmnToken>) => Ty
  ): Array<Ty> {
    let arr = new Array<Ty>()
    let arrTok = toks.shift()
    assert(arrTok.type === JsmnType.ARRAY)
    // TODO: check for empty array

    while (toks.length > 0 && toks[0].start < arrTok.end) {
      let v = marshalChild(json, toks)
      arr.push(v)
    }
    return arr
  }
  `
}

function marshalCallSwitch(typeName, typeArgs) {
  switch(typeName) {
    case 'i32':
    case 'u32':
      return 'marshal_i32'
    case 'i64':
    case 'u64':
      return 'marshal_i64'
    case 'f32':
    case 'f64':
      return 'marshal_f64'
    case 'string':
      return 'marshal_string'
    case 'Array':
      const targ = typeArgs[0]
      const fn = marshalCallSwitch(targ)
      return `((json: string, toks: Array<JsmnToken>): Array<${targ}> =>
        marshal_array<${targ}>(json, toks, ${fn})
      )`
      // return `((json: string, toks: Array<JsmnToken>): Array<${targ}> => marshal_array<${targ}>(${fn})(json, toks) )`
    default:
      return `marshal_${typeName}`
  }
}

function jsmnTypeSwitch(typeName) {
  switch(typeName) {
    case 'i32':
    case 'u32':
    case 'i64':
    case 'u64':
    case 'f32':
    case 'f64':
      return 'JsmnType.PRIMITIVE'
    case 'string':
      return 'JsmnType.STRING'
    case 'Array':
      return 'JsmnType.ARRAY'
    default:
      // TODO: check for invalid
      return 'JsmnType.OBJECT'
  }
}

function parametricTypeString(name, args) {
  return args && args.length > 0 ? `${name}<${args.join(',')}>` : name
}

let xyzzy = 666

function buildMarshal(ty, struct) {

  const conditions = struct.map(([key, typeName, ...typeArgs]) => {
    const parseCall = marshalCallSwitch(typeName, typeArgs)
    const jsmnType = jsmnTypeSwitch(typeName)
    return `(key == '${key}') {
      assert(valTok.type === ${jsmnType})
      obj.${key} = (${parseCall}(json, toks))
    }`
  })

  const elseStatement = ` else { debug("OH NO") }`
  const conditionCode = 'if ' + conditions.join(' else if ') + elseStatement

  return `

function marshal_${ty}(json: string, toks: Array<JsmnToken>): ${ty} {
  let obj = new ${ty}()
  let objTok = toks.shift()
  assert(objTok.type === JsmnType.OBJECT)
  // TODO: check for empty object

  do {
    let keyTok: JsmnToken = toks.shift()
    let valTok: JsmnToken = toks[0]  // maybe shift later
    let key = tokenVal(json, keyTok)
    let val = tokenVal(json, valTok)
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
    false,
    null
  ).program.sources[0].statements
}
