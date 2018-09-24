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


export function test_debug(encoded_allocation: u32): u32 {
  // necessary for setting memory module to at least one page
  // find another way
  const tree = "test";
  let val: string = deserialize(encoded_allocation);
  debug(val);
  return 0;
}

export function test_commit(encoded_allocation: u32): u32 {
  let val: string = deserialize(encoded_allocation);
  // TODO: how do we parse JSON input here, to get custom values?
  // at least pass through the "entry_data" part
  let result: string = commit_entry("message", val);
  return serialize(result);
}


export function test_get(encoded_allocation: u32): u32 {
  const hash = "QmY2NoZ9Ep3EUuiirXiyQgYpKBMiSTGsdzh4LSVn1ceiFf"
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
