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
} from './utils';

declare namespace env {
  function hc_debug(encoded_allocation_of_input: u32): u32;
  function hc_call(encoded_allocation_of_input: u32): u32;
  function hc_sign(encoded_allocation_of_input: u32): u32;
  function hc_verify_signature(encoded_allocation_of_input: u32): u32;
  function hc_commit_entry(encoded_allocation_of_input: u32): u32;
  function hc_update_entry(encoded_allocation_of_input: u32): u32;
  function hc_update_agent(encoded_allocation_of_input: u32): u32;
  function hc_remove_entry(encoded_allocation_of_input: u32): u32;
  function hc_get_entry(encoded_allocation_of_input: u32): u32;
  function hc_link_entries(encoded_allocation_of_input: u32): u32;
  function hc_query(encoded_allocation_of_input: u32): u32;
  function hc_send(encoded_allocation_of_input: u32): u32;
  function hc_start_bundle(encoded_allocation_of_input: u32): u32;
  function hc_close_bundle(encoded_allocation_of_input: u32): u32;
}

export function debug(message: string): void {
  let encoded_allocation: u32 = serialize(message);
  let ptr = u32_high_bits(encoded_allocation);
  env.hc_debug(encoded_allocation);
  // local memory deals in unencoded pointers, unlike holochain
  free(ptr);
}

// these are the function that core implements and exposes at this stage

// @unmanaged
// class CommitParams {
//   entryType: string
//   entryContent: string
// }

export function commit_entry(entryType: string, entryContent: string): void {
  let jsonEncodedParams: string = `{"entryType":${entryType},"entryContent":${entryContent}}`
  let encoded_allocation: u32 = serialize(jsonEncodedParams)
  let result: u32 = env.hc_commit_entry(encoded_allocation)
  // probably free some memory here...
}

// export function hc_get_entry(hash: string) {

// }

// export function init_globals() {

// }
