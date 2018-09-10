import "allocator/tlsf";

import {
  u32_high_bits,
  u32_low_bits,
  serialize,
  deserialize,
  free
} from './utils';

export {
  u32_high_bits,
  u32_low_bits,
  serialize,
  deserialize,
  free
}

declare function hc_debug(encoded_allocation_of_input: u32): u32;
declare function hc_call(encoded_allocation_of_input: u32): u32;
declare function hc_sign(encoded_allocation_of_input: u32): u32;
declare function hc_verify_signature(encoded_allocation_of_input: u32): u32;
declare function hc_commit_entry(encoded_allocation_of_input: u32): u32;
declare function hc_update_entry(encoded_allocation_of_input: u32): u32;
declare function hc_update_agent(encoded_allocation_of_input: u32): u32;
declare function hc_remove_entry(encoded_allocation_of_input: u32): u32;
declare function hc_get_entry(encoded_allocation_of_input: u32): u32;
declare function hc_link_entries(encoded_allocation_of_input: u32): u32;
declare function hc_query(encoded_allocation_of_input: u32): u32;
declare function hc_send(encoded_allocation_of_input: u32): u32;
declare function hc_start_bundle(encoded_allocation_of_input: u32): u32;
declare function hc_close_bundle(encoded_allocation_of_input: u32): u32;

export function debug(message: string): void {
  let encoded_allocation: u32 = serialize(message);
  let ptr = u32_high_bits(encoded_allocation);
  hc_debug(encoded_allocation);
  // local memory deals in unencoded pointers, unlike holochain
  free(ptr);
}
