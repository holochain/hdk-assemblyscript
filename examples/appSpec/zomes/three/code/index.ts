import {
  serialize,
  deserialize,
  debug,
  commit_entry,
  get_entry,
  init_globals,
  check_encoded_allocation
} from "../../../../../index"
//TODO: Remove this relative import and link to node_modules. Ok for dev

import {
  JsmnType, JsmnToken
} from '../../../../../jsmn-interop'

import {
  tok, join, offset
} from '../../../../../jsmn-test'

@deserializable
class A {
  a: string;
}

const json_A: string = `{"a": "nested"}`
function toks_A(): Array<JsmnToken> {
  return [
    tok(JsmnType.OBJECT, 0, 15),
      tok(JsmnType.STRING, 2, 3),
      tok(JsmnType.STRING, 6, 14),
  ]
}
/*----------  Public Functions  ----------*/

@zome_function
function test_debug(val: string): void {
  debug("TODO: debug() only works the first time!")
  debug(val);
}

@zome_function
function test_marshal(): string {
  let a = marshal_A(json_A, toks_A())
  return a.a
}

@zome_function
function test_commit_entry(jsonStringParams: string): string {
  return commit_entry("message", jsonStringParams);
}

@zome_function
function test_get_entry(hash: string): string {
  return get_entry(hash);
}

@zome_function
function test_init_globals(): string {
	return init_globals();
}

/*----------  Callbacks  ----------*/


export function validate_commit(encoded_allocation: u32): u32 {
  return 0;
}

// export function genesis(encoded_allocation: u32): u32 {
//   debug("Genesis");
//   return 0;
// }
