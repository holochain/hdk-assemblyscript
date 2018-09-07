import "allocator/tlsf";

declare function hc_debug(encoded_allocation_of_input: i32): i32;
declare function hc_call(encoded_allocation_of_input: i32): i32;
declare function hc_sign(encoded_allocation_of_input: i32): i32;
declare function hc_verify_signature(encoded_allocation_of_input: i32): i32;
declare function hc_commit_entry(encoded_allocation_of_input: i32): i32;
declare function hc_update_entry(encoded_allocation_of_input: i32): i32;
declare function hc_update_agent(encoded_allocation_of_input: i32): i32;
declare function hc_remove_entry(encoded_allocation_of_input: i32): i32;
declare function hc_get_entry(encoded_allocation_of_input: i32): i32;
declare function hc_link_entries(encoded_allocation_of_input: i32): i32;
declare function hc_query(encoded_allocation_of_input: i32): i32;
declare function hc_send(encoded_allocation_of_input: i32): i32;
declare function hc_start_bundle(encoded_allocation_of_input: i32): i32;
declare function hc_close_bundle(encoded_allocation_of_input: i32): i32;

export function debug(message: String): void {
  // 2 bytes per each char?
  let byteLength: i32 = message.length*2;
  // TODO: safeguard against overflow
  let ptr: i32 = memory.allocate(byteLength);
  for (let i: i32 = 0, strLen: i32 = message.length; i<strLen; i++) {
    // use built-in store function to write to memory
    // technically fits in an i8, but typescript function signature says otherwise
    // TODO: store each value at the correct ptr offset
    store<i32>(ptr, message.charCodeAt(i));
  }
  hc_debug(ptr);
  memory.free(ptr);
}
