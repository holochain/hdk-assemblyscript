///<reference path="./jsmn-interop.d.ts" />

import {JsmnType, JsmnToken} from './jsmn-interop'

@external("env", "logf")
declare function logf(val: f64): void;

@external("env", "logi")
declare function logi(val: i32): void;

@external("env", "log")
declare function log<T>(val: T): void;


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

const json2: string = `{"a": 12345, "b": {"c": [1, 2, 3]}}`
let toks2: Array<JsmnToken> = [
  tok(JsmnType.OBJECT, 0, 34),
    tok(JsmnType.STRING, 2, 3),
    tok(JsmnType.PRIMITIVE, 6, 11),

    tok(JsmnType.STRING, 14, 15),
    tok(JsmnType.OBJECT, 18, 33),
      tok(JsmnType.STRING, 20, 21),
      tok(JsmnType.ARRAY, 24, 33),
        tok(JsmnType.PRIMITIVE, 25, 26),
        tok(JsmnType.PRIMITIVE, 28, 29),
        tok(JsmnType.PRIMITIVE, 31, 32),
]

function offset(toks: Array<JsmnToken>, off: i32): Array<JsmnToken> {
  let i = 0
  while(i < toks.length) {
    toks[i].start += off
    toks[i].end += off
    i++
  }
  return toks
}

function join(a: Array<JsmnToken>, b: Array<JsmnToken>): Array<JsmnToken> {
  for (let i = 0; i < b.length; i++) {
    a.push(b[i])
  }
  return a
}

const json_S: string = `{"a": 12345}`
let toks_S: Array<JsmnToken> = [
  tok(JsmnType.OBJECT, 0, 12),
    tok(JsmnType.STRING, 2, 3),
    tok(JsmnType.PRIMITIVE, 6, 11),
]

const json_T: string = `{"s": {"a": 98765}}`
let toks_T: Array<JsmnToken> = join(
  [
    tok(JsmnType.OBJECT, 0, 12),
      tok(JsmnType.STRING, 2, 3),
  ], offset(toks_S, 6))

@deserializable
class S {
  a: i32;
}

@deserializable
class T {
  s: S;
}

// @deserializable
class A {
  a: i32;
  b: B;
}

// @deserializable
class B {
  c: Array<i32>;
}


let s = marshal_S(json_S, toks_S)
let t = marshal_T(json_T, toks_T)
export function result(): i32 {
  return t.s.a
}

// log<i32>(a.b.c[0])