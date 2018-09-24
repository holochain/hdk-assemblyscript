import {
  serialize,
  deserialize,
  debug,
  commit_entry,
} from "../../../../../../../index"
//TODO: Remove this relative import and link to node_modules. Ok for dev



/*----------  Public Functions  ----------*/


export function test_debug(encoded_allocation: u32): u32 {
  // necessary for setting memory module to at least one page
  // find another way
  const tree = "test";

  var val: string = deserialize(encoded_allocation);
  debug(val);
  return 0;
}

export function test_commit(encoded_allocation: u32): u32 {
  // necessary for setting memory module to at least one page
  // find another way
  const tree = "test";

  var result: string = commit_entry("customType", "someData")
  debug(result)
  return 0;
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

