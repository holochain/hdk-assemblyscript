import "allocator/tlsf";

import { Globals } from "./types"

import {
  u32_high_bits,
  u32_low_bits,
  serialize,
  deserialize,
  check_encoded_allocation,
  errorCodeToString,
  free,
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

import { stringify } from './json';
export { stringify } from './json';

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
  function hc_init_globals(encoded_allocation_of_input: u32): u32;
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

// handleSerialization
// creates a consistent pattern we can use for serializing the input into memory,
// calling the core API function (api_call) which is passed in,
// and then returning an error or the deserialized result
// @param input: string, the string value that api_call will pull from memory and use as an input
// @param api_call: function, the core API call, which should be wrapped in a small inline function because assemblyscript
// @returns string, the successful result of the call, or an error string

function handleSerialization(input: string, api_call: (e: u32) => u32): string {
  let encoded_allocation: u32 = serialize(input);
  let result: u32 = api_call(encoded_allocation);
  let resultCode = check_encoded_allocation(result);

  if(resultCode == ErrorCode.Success) {
    return deserialize(result)
  } else {
    return errorCodeToString(resultCode)
  }
}

export function debug<T>(message: T): void {
  if(isString<T>(message)) {
    handleSerialization(message, (e: u32): u32 => env.hc_debug(e));
  } else {
    handleSerialization(stringify(message), (e: u32): u32 => env.hc_debug(e));
  }
}

export function commit_entry<T>(entryType: string, entryContent: T): string {
  let entryContentString: String;
  if(isString<T>(entryContent)) {
    entryContentString = entryType;
  } else {
    entryContentString = stringify(entryType);
  }
  let jsonEncodedParams = `{"entry_type_name":"`+entryType+`","entry_content":"`+entryContentString+`"}`;
  return handleSerialization(jsonEncodedParams, (e: u32): u32 => env.hc_commit_entry(e));
}

export function get_entry(hash: string): string {
  let jsonEncodedParams: string = `{"address":"`+hash+`"}`;
  return handleSerialization(jsonEncodedParams, (e: u32): u32 => env.hc_get_entry(e));
}

export function init_globals(): string {
  return handleSerialization("", (e: u32): u32 => env.hc_init_globals(e));
}
