import {
  serialize,
  debug,
  commit_entry,
  deserialize,
} from "../../../../../../../index"
//TODO: Remove this relative import and link to node_modules. Good for dev only



/*----------  Public Functions  ----------*/


export function test_debug(encoded_allocation: u32): u32 {
  // necessary for setting memory module to at least one page
  // find another way
  const tree = "test";

  var val: string = deserialize(encoded_allocation);
  debug(val);
  return 0;
}

export function test_commit(encoded_allocation: u32): u32 {
  // necessary for setting memory module to at least one page
  // find another way
  const tree = "test";

  var result: string = commit_entry("customType", "someData")
  debug(result)

  return 0;
}


/*----------  prototyping  ----------*/


// example of a hard-coded class that can be parsed and stringified from json
// work to make this more generic within the constraints of assemblyscript (no interfaces, no Object.keys() etc)
// class CommitParams {
//   entryType: string
//   entryContent: string

//   constructor(jsonString: string) {
//     const fields = ['entryType', 'entryContent']

//     for(var i=0; i<fields.length; i++) {

//     }

//   }

//   stringify(): string {
//     return `{"entryType":"`+this.entryType+`","entryContent":"`+this.entryContent+`"}`
//   }

// }


/*----------  Callbacks  ----------*/


export function validate_commit(encoded_allocation: u32): u32 {
  debug("Validate Commit");
  return 0;	
}

export function genesis(encoded_allocation: u32): u32 {
  debug("Genesis");
  return 0;	
}

