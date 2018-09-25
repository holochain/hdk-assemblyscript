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
export function test_debug(val: string): void {
  debug(val);
}

export function test_commit(encoded_allocation: u32): u32 {
  let val: string = deserialize(encoded_allocation);
  // TODO: how do we parse JSON input here, to get custom values?
  // at least pass through the "entry_data" part
  let result: string = commit_entry("message", val);
  return serialize(result);
}


export function test_get(encoded_allocation: u32): u32 {
  let hash: string = deserialize(encoded_allocation);
  let result: string = get_entry(hash);
  return serialize(result);
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
