import {
  serialize,
  deserialize,
  debug,
  commit_entry,
  get_entry,
  check_encoded_allocation,
  parseString,
  Handler
} from "../../../../../../../index";

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


/*----------  test_decode_params boilerplate  ----------*/


var valueString: string = "";

class ParameterHandler extends Handler {
  onString(value: string): void {
    if(this.currentKey == "keyString") {
        valueString = value;
    }
  }
}

export function test_decode_params(encoded_allocation: u32): u32 {
   let jsonString: string = deserialize(encoded_allocation);   

    let handler = new ParameterHandler()
    parseString<ParameterHandler>(jsonString, handler)

   return serialize(valueString);

}

/*----------  test_decode_multiple_params boilerplate  ----------*/

var string1: string = "+";
var string2: string = "-";
var keys: string = ""

class MultiParameterHandler extends Handler {
  currentKey: string;

  onKey(value: string): void {
    this.currentKey = value;
    keys += value;
  }

  onString(value: string): void {
    if(this.currentKey == "firstString") {
      string1 = value;
    } else if (this.currentKey == "secondString") {
      string2 = value;
    }
  }
}

export function test_decode_multiple_params(encoded_allocation: u32): u32 {
  let jsonString: string = deserialize(encoded_allocation);   

  let handler = new MultiParameterHandler()
  parseString<MultiParameterHandler>(jsonString, handler)

  return serialize(string1+string2);

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
