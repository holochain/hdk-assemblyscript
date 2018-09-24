import "allocator/tlsf";

import {
  u32_high_bits,
  u32_low_bits,
  serialize,
  deserialize,
  check_encoded_allocation,
  errorCodeToString,
  free
} from './utils';

export {
  u32_high_bits,
  u32_low_bits,
  serialize,
  deserialize,
  check_encoded_allocation,
  errorCodeToString,
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


export const enum ErrorCode {
  Success = 0,
  Failure = 1,
  ArgumentDeserializationFailed = 2,
  OutOfMemory = 3,
  ReceivedWrongActionResult = 4,
  CallbackFailed = 5,
  RecursiveCallForbidden = 6,
  ResponseSerializationFailed = 7,
  PageOverflowError = 8, // returned by hdk if offset+size exceeds a page
}




export function debug(message: string): void {
  let encoded_allocation: u32 = serialize(message);
  let ptr = u32_high_bits(encoded_allocation);
  env.hc_debug(encoded_allocation);
  // local memory deals in unencoded pointers, unlike holochain
  // free(ptr);
}



export function commit_entry(entryType: string, entryContent: string): string {
  let jsonEncodedParams: string = `{"entry_type_name":"`+entryType+`","entry_content":"`+entryContent+`"}`;

  let encoded_allocation: u32 = serialize(jsonEncodedParams);
  let ptr = u32_high_bits(encoded_allocation);

  let result: u32 = env.hc_commit_entry(encoded_allocation);

  // check if the result encodes an error
  let resultString: string;
  let errorCode = check_encoded_allocation(result)

  // free(ptr);

  if(errorCode === ErrorCode.Success) {
    // commit should be returning a hash but it is not...
    return deserialize(result)
  } else {
    return errorCodeToString(errorCode)
  }

}


// export function get_entry(hash: string) {



// }

// export function init_globals() {

// }
