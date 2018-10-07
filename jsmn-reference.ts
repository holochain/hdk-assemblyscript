

const json2: string = `{"a": "xxx", "b": {"c": [1, 2, 3]}}`
let toks2: Array<JsmnToken> = [
  tok(JsmnType.OBJECT, 0, 34),
  tok(JsmnType.STRING, 2, 3),
  tok(JsmnType.STRING, 7, 10),
  tok(JsmnType.STRING, 14, 15),

  tok(JsmnType.OBJECT, 18, 33),
  tok(JsmnType.STRING, 20, 21),

  tok(JsmnType.ARRAY, 24, 33),
  tok(JsmnType.PRIMITIVE, 25, 26),
  tok(JsmnType.PRIMITIVE, 28, 29),
  tok(JsmnType.PRIMITIVE, 31, 32),
]

@deserializable
class A {
  a: i32;
  b: B;
}

@deserializable
class B {
  c: Array<u32>;
}

const struct = {
  'A': [
    ['a', 'i32'],
    ['b', 'B'],
  ],
  'B': [
    ['c', 'Array', 'u32']
  ]
}

@inline
function tokenVal(json: string, tok: JsmnToken): string {
  return json.substr(tok.start, tok.end)
}

function marshal_A(json: string, toks: Tokens): A {
  let obj = new A()
  let objTok = toks.shift()
  assert(objTok.type === JsmnType.OBJECT)
  // TODO: check for empty object

  do {
    let keyTok: JsmnToken = toks.shift()
    let valTok: JsmnToken = toks.shift()
    const key = tokenVal(json, keyTok)
    const val = tokenVal(json, valTok)
    if (key === 'a') {
      assert(valTok.type === JsmnType.PRIMITIVE)
      obj.a = parse_i32(val)  // ***
    } else if (key === 'b') {
      assert(valTok.type === JsmnType.OBJECT)
      obj.b = marshal_B(val)  // ***
    }
  } while(toks.length && toks[0].start < objTok.end)
  return obj
}

function marshal_B(json: string, toks: Tokens): B {
  let obj = new B()
  let objTok = toks.shift()
  assert(objTok.type === JsmnType.OBJECT)
  // TODO: check for empty object

  do {
    let keyTok: JsmnToken = toks.shift()
    let valTok: JsmnToken = toks.shift()
    const key = tokenVal(json, keyTok)
    const val = tokenVal(json, valTok)
    if (key === 'c') {
      assert(valTok.type === JsmnType.ARRAY)
      obj.c = marshal_array<u32>(json, toks)  // ***
    }
  } while(toks.length > 0 && toks[0].start < objTok.end)
}

function marshal_array<T>(json: string, toks: Tokens): Array<T> {
  let arr = new Array<T>()
  let arrTok = toks.shift()
  assert(arrTok.type === JsmnType.ARRAY)
  // TODO: check for empty array

  do {
    let tok: JsmnToken = toks.shift()
    const val = tokenVal(json, tok)
    arr.push(parse<T>(val))  // ***
  } while (toks.length > 0 && toks[0].start < arrTok.end)
  return arr
}

function marshal_prim<T>(val: string) {

}