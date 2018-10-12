import {
  serialize,
  deserialize,
  debug,
  commit_entry,
  get_entry,
  init_globals,
  check_encoded_allocation,
  stringify
} from "../../../../../index"
//TODO: Remove this relative import and link to node_modules. Ok for dev

/*----------  Public Functions  ----------*/

@zome_function
function test_debug(val: string): void {
  debug(val);
}

@can_stringify
class X {
  a: string
  b: i32
  c: Array<Y>
}

@can_stringify
class Y {
  n: bool
}

@zome_function
function test_debug_object(): void {
  let c: X = {a: "hi", b: 20, c: [{n: false},{n:true}]}
  debug(c);
}

@zome_function
function test_commit_entry(jsonStringParams: string): string {
  debug("hi");
  debug("sup");
  debug("aslkdfjsa dkfjasldkfj asdklfj aslkdfj sadfljasdlfkja sdflkaj df");
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

export function genesis(encoded_allocation: u32): u32 {
  return 0;
}

/*----------  Callbacks  ----------*/


export function validate_message(encoded_allocation: u32): u32 {
  return 0;
}

// export function genesis(encoded_allocation: u32): u32 {
//   debug("Genesis");
//   return 0;	
// }
