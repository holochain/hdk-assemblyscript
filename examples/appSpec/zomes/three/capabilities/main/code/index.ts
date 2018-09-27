import {
  serialize,
  deserialize,
  debug,
  commit_entry,
  get_entry,
  check_encoded_allocation
} from "../../../../../../../index";


import {
  parseString,
  Handler
} from "../../../../../../../asmjson";
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
  let hash: string = deserialize(encoded_allocation);
  let result: string = get_entry(hash);
  return serialize(result);
}


// attempt to parse the json string into the variables
var valueString: string = "";

class ParameterHandler extends Handler {
  currentKey: string

  onKey(value: string): boolean {
    this.currentKey = value;
    return true;
  }

  onString(value: string): boolean {
    if(this.currentKey == "keyString") {
        valueString = value;
    }
    return true;
  }
}

export function test_decode_params(encoded_allocation: u32): u32 {
   let jsonString: string = deserialize(encoded_allocation);   

    let handler = new ParameterHandler()
    parseString<ParameterHandler>(jsonString, handler)

   return serialize(valueString);

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
