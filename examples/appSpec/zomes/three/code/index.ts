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



/*----------  Public Functions  ----------*/

@zome_function
function test_debug(val: string): void {
  debug(val);
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
