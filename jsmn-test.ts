///<reference path="./jsmn-interop.d.ts" />

import {JsmnType, JsmnToken} from './jsmn-interop'

@external("env", "logf")
declare function logf(val: f64): void;

@external("env", "logi")
declare function logi(val: i32): void;

// @external("env", "log")
// declare function log<T>(val: T): void;

@external("env", "logs")
declare function logs(size: i32, index: i32): void;

function log(s: string): void {
  logs(s.length, s as i32)
}


export function tok(type: JsmnType, start: u32, end: u32): JsmnToken {
  let t = new JsmnToken()
  t.type = type
  t.start = start
  t.end = end
  return t
}

// const json1: string = `{"a": 0, "b": "x", "c": [1, 2, 3]}`
// let toks1: Array<JsmnToken> = [
//   tok(JsmnType.OBJECT, 0, 34),
//   tok(JsmnType.STRING, 2, 3),
//   tok(JsmnType.PRIMITIVE, 6, 7),
//   tok(JsmnType.STRING, 10, 11),
//   tok(JsmnType.STRING, 15, 16),
//   tok(JsmnType.STRING, 20, 21),
//   tok(JsmnType.ARRAY, 24, 33),
//   tok(JsmnType.PRIMITIVE, 25, 26),
//   tok(JsmnType.PRIMITIVE, 28, 29),
//   tok(JsmnType.PRIMITIVE, 31, 32),
// ]

// const json2: string = `{"a": 12345, "b": {"c": [1, 2, 3]}}`
// let toks2: Array<JsmnToken> = [
//   tok(JsmnType.OBJECT, 0, 34),
//     tok(JsmnType.STRING, 2, 3),
//     tok(JsmnType.PRIMITIVE, 6, 11),

//     tok(JsmnType.STRING, 14, 15),
//     tok(JsmnType.OBJECT, 18, 33),
//       tok(JsmnType.STRING, 20, 21),
//       tok(JsmnType.ARRAY, 24, 33),
//         tok(JsmnType.PRIMITIVE, 25, 26),
//         tok(JsmnType.PRIMITIVE, 28, 29),
//         tok(JsmnType.PRIMITIVE, 31, 32),
// ]

export function offset(toks: Array<JsmnToken>, off: i32): Array<JsmnToken> {
  let i = 0
  while(i < toks.length) {
    toks[i].start += off
    toks[i].end += off
    i++
  }
  return toks
}

export function join(aa: Array<Array<JsmnToken>>): Array<JsmnToken> {
  let r = new Array<JsmnToken>()
  for (let i = 0; i < aa.length; i++) {
    for (let j = 0; j < aa[i].length; j++) {
      r.push(aa[i][j])
    }
  }
  return r
}

const json_S: string = `{"a": 12345}`
function toks_S(): Array<JsmnToken> {
  return [
    tok(JsmnType.OBJECT, 0, 12),
      tok(JsmnType.STRING, 2, 3),
      tok(JsmnType.PRIMITIVE, 6, 11),
  ]
}

@deserializable
class S {
  a: i32;
}

const json_T: string = `{"s": {"a": 98765}}`
function toks_T(): Array<JsmnToken> {
  let a: Array<JsmnToken> = [
      tok(JsmnType.OBJECT, 0, 12),
        tok(JsmnType.STRING, 2, 3),
    ]
  let b = offset(toks_S(), 6)
  return join([a, b])
}

@deserializable
class T {
  s: S;
}

const json_Arr: string = `{"ss": [${json_S()}, ${json_S()}], "t": ${json_T()}}`
// const json_Arr: string = `{"ss": [{"a": 12345}, {"a": 12345}], "t": {"s": {"a": 98765}}}`
function toks_Arr(): Array<JsmnToken> {
  let a: Array<JsmnToken> = [
      tok(JsmnType.OBJECT, 0, 62),
        tok(JsmnType.STRING, 2, 4),
        tok(JsmnType.ARRAY, 7, 35)
    ]
  let b = offset(toks_S(), 8)
  let c = offset(toks_S(), 22)
  let d: Array<JsmnToken> = [
        tok(JsmnType.STRING, 38, 39)
    ]
  let e = offset(toks_T(), 42)
  // 3 + 3 + 3 + 1 + 5 = 15
  return join([a, b, c, d, e])
}

@deserializable
class Arr {
  ss: Array<S>;
  t: T;
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


// let s = marshal_S(json_S, toks_S())
// let t = marshal_T(json_T, toks_T())
// let arrval = marshal_Arr(json_Arr, toks_Arr())
// export function result(): i32 {
//   // return s.a
//   // return t.s.a
//   return arrval.ss.length
//   // return arrval.t.s.a
// }

// log<i32>(a.b.c[0])