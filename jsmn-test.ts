///<reference path="./jsmn-interop.d.ts" />

import {unmarshal, JsmnType, JsmnToken} from './jsmn-interop'


function tok(type: JsmnType, start: u32, end: u32): JsmnToken {
  let t = new JsmnToken()
  t.type = type
  t.start = start
  t.end = end
  return t
}

const json1: string = `{"a": 0, "b": "x", "c": [1, 2, 3]}`
let toks1: Array<JsmnToken> = [
  tok(JsmnType.OBJECT, 0, 34),
  tok(JsmnType.STRING, 2, 3),
  tok(JsmnType.PRIMITIVE, 6, 7),
  tok(JsmnType.STRING, 10, 11),
  tok(JsmnType.STRING, 15, 16),
  tok(JsmnType.STRING, 20, 21),
  tok(JsmnType.ARRAY, 24, 33),
  tok(JsmnType.PRIMITIVE, 25, 26),
  tok(JsmnType.PRIMITIVE, 28, 29),
  tok(JsmnType.PRIMITIVE, 31, 32),
]

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

unmarshal<A>(json2, toks2)