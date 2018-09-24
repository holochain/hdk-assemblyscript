import "allocator/tlsf";
import { allocateUnsafe, copyUnsafe, HEADER_SIZE } from "internal/string"
import { ErrorCode, debug } from "./index"


export function u32_high_bits(encoded_allocation: u32): u16 {
  // right shift and explicit type cast it
  let high: u16 = (encoded_allocation >> 16) as u16;
  return high;
}


export function u32_low_bits(encoded_allocation: u32): u16 {
  // type cast and remainder
  let low: u16 = encoded_allocation as u16 % u16.MAX_VALUE;
  return low;
}

// offset, length
export function u32_merge_bits(high: u16, low: u16): u32 {
  // left shift, bitwise or
  return high as u32 << 16 | (low as u32);
}


export function check_encoded_allocation(encoded_allocation: u32): ErrorCode {
  let offset: u16 = u32_high_bits(encoded_allocation);
  let length: u16 = u32_low_bits(encoded_allocation);
  if (length == 0) {
    return offset as ErrorCode;
  }
  // switch to u32 from u16
  let u32offset: u32 = offset;
  let u32length: u32 = length;
  let max: u32 = u16.MAX_VALUE;
  if ((u32offset + u32length) > max) {
    return ErrorCode.PageOverflowError;
  }
  return ErrorCode.Success;
}


// writes string to memory, then returns encoded allocation ref
export function serialize(val: string): u32 {
  let dataLength = val.length;
  // each char takes two bytes, encoded
  let ptr = memory.allocate(dataLength << 1);
  //checkMem();
  for (let i = 0; i < dataLength; ++i) {
    store<u16>(ptr + i, val.charCodeAt(i));
  }
  let encoded_allocation = u32_merge_bits(ptr as u16, dataLength as u16);
  return encoded_allocation;
}


// reads a string into a new memory allocation that uses the format for asm
export function deserialize(encoded_allocation: u32): string {
  let offset = u32_high_bits(encoded_allocation);
  let length = u32_low_bits(encoded_allocation);
  let res: string = allocateUnsafe(length);

  // TODO: figure out how to do this in a single copy. Need to change boundaries on characters
  for (let i: u16 = 0; i < length; i++) {
    memory.copy(
      changetype<usize>(res) + HEADER_SIZE + (i<<1),
      changetype<usize>(offset) + i,
      1
    );
  }
  return res;
}


export function free(ptr: u32): void {
  memory.free(ptr);
}


export function errorCodeToString(code: ErrorCode): string {
  switch(code) {
    case ErrorCode.Success:
      return "Success";
    case ErrorCode.Failure:
      return "Failure";
    case ErrorCode.ArgumentDeserializationFailed:
      return "Argument Deserialization Failed";
    case ErrorCode.OutOfMemory:
      return "OutOfMemory";
    case ErrorCode.ReceivedWrongActionResult:
      return "Received Wrong Action Result";
    case ErrorCode.CallbackFailed:
      return "Callback Failed";
    case ErrorCode.RecursiveCallForbidden:
      return "Recursive Call Forbidden";
    case ErrorCode.ResponseSerializationFailed:
      return "Response Serialization Failed";
    case ErrorCode.PageOverflowError:
      return "Page Overflow Error";
    default:
      return "Unknown Error";
  }
}
