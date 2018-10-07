
export function unmarshal_impl(
  json: string,
  toks: Array<JsmnToken>,
  index: i32,
  typeName: string,
  typeArgs: Array<string>
): string {
  const tok = toks[index]
  let ty = makeTypeString(typeName, typeArgs)
  const slice = json.substr(tok.start, tok.end)
  const structs = __deserializableClasses()

  if (structs.has(typeName) ) {
    const struct = structs.get(typeName)
    // create follow structure of custom class
    const start0 = toks[0].start
    const end0 = toks[0].end
    //? const obj = new ${ty}()
    let i = index + 1
    let j = 0
    let vals: Array<string> = []
    while (j < struct.length && i < toks.length && toks[i].end < end0) {
      const [keyName, typeName, ...typeArgs] = struct[j]
      let ty0 = makeTypeString(typeName, typeArgs)

      const key = json.substr(toks[i].start, toks[i].end)
      i++
      j++
      // const valStr = json.substr(toks[i].start, toks[i].end)
      const val = unmarshal_impl(json, toks, i, ty0, [])
      vals.push(`${ty0}, ${key}, ${val}`)

      //? obj.${key} = val
    }
    return '||' //vals.join('||') //? obj
  }

  if (tok.type === JsmnType.STRING && typeName === 'string') {
    return('SRING ' + parseString(slice))
  } else if (tok.type === JsmnType.PRIMITIVE) {
    return 'PRIM TODO'
  } else if (tok.type === JsmnType.ARRAY && typeName === 'Array') {
    return 'OBJ'
    const childType = typeArgs[0]
    //? let arr = new Array<${childType}>()
    for(let j = 0; j < tok.size; j++) {
      const val = unmarshal_impl(json, toks, j + index + 1, childType, [])
      // console.log(ty, ':', val)
      //? arr[j] = val
    }
  } else if (tok.type === JsmnType.OBJECT) {
    return ("OBJECT: not yet")
  }
  return "NOTHING???"
}

function parseString(val: string): string {
  return val
}

function parsePrimitive(ty: string, val: string): string {
  return "TODO"
}

function makeTypeString(type: string, args: Array<string>): string {
  if (args.length > 0) {
    return `${type}<${args.join(',')}>`
  } else {
    return type
  }
}
