import {
  serialize,
  debug,
  deserialize
} from "../../../../../../../index"

//TODO: Remove this relative import and link to node_modules. Good for dev only

export function debugg(encoded_allocation: u32): u32 {
  // necessary for setting memory module to at least one page
  // find another way
  let tree = "test";

  let val: string = deserialize(encoded_allocation);
  debug(val);
  return 0;
}
