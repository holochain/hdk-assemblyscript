import {
    serialize,
    deserialize,
    debug,
    commit_entry,
    get_entry,
    init_globals,
    check_encoded_allocation,
    stringify
  } from "../../../../../index"

@zome_function
function testfunction(param1: string): string {
    return "myoutput";
}
