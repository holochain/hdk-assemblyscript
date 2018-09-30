import {
  serialize,
  deserialize,
  debug,
  commit_entry,
  get_entry,
  check_encoded_allocation
} from "../../../../../../../index"
//TODO: Remove this relative import and link to node_modules. Ok for dev



/*----------  Public Functions  ----------*/

@zome_function
function test_debug(val: string): void {
  debug(val);
}

@zome_function
export function test_commit(jsonStringParams: string): string {
  return commit_entry("message", jsonStringParams);
}

@zome_function
export function test_get(hash: string): string {
  return get_entry(hash);
}


/*----------  Callbacks  ----------*/


// export function validate_commit(encoded_allocation: u32): u32 {
//   debug("Validate Commit");
//   return 0;	
// }

// export function genesis(encoded_allocation: u32): u32 {
//   debug("Genesis");
//   return 0;	
// }
