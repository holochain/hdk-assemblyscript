# Holochain Developer Kit for Assemblyscript

## Status

The `hdk-assemblyscript` is not currently ready for use, and has an "experimental" status.

The hdk-assemblyscript development is currently partially blocked by the lack of JSON parsing in assemblyscript. There is an [open issue](https://github.com/AssemblyScript/assemblyscript/issues/292) for this in the Assemblyscript repository. There are some who've said it is being worked on.

Until these issues are resolved, [hdk-rust](https://github.com/holochain/holochain-rust/tree/develop/hdk-rust) will be the most functional HDK for app development.

There are several pieces required to complete an HDK, here are their status:
- Declaring capabilities and their functions: A prototype using `@zome_function` decorator is complete, but being reworked, [issue here](https://github.com/holochain/hdk-assemblyscript/pull/23)
- Declaring entry types: Not implemented, but a proposal is in [this issue](https://github.com/holochain/hdk-assemblyscript/issues/14)
- Stringification of class instances to string: Implemented using the `@can_stringify` decorator for classes
- Entry Validation: Not implemented, but a proposal is in [this issue](https://github.com/holochain/hdk-assemblyscript/issues/14)
- Link Validation: Not implemented
- Genesis wrapper: Not implemented, [issue here](https://github.com/holochain/hdk-assemblyscript/issues/21)

### Working Functions
- [x] debug
- [x] commit_entry
- [x] get_entry
- [x] init_globals
- [x] call

### Functions Not Ready (and not ready in holochain-rust)
- [ ] get_links
- [ ] link_entries
- [ ] hash_entry
- [ ] sign
- [ ] verify_signature
- [ ] update_entry
- [ ] update_agent
- [ ] remove_entry
- [ ] query
- [ ] send
- [ ] start_bundle
- [ ] close_bundle

## Using the API Functions (decorators subject to change)

To use a function, just import it...
```typescript
import {
  debug
} from 'hdk-assemblyscript'
```

Then, in some zome function that you are writing, you can just call that function...
```typescript
@zome_function
function createPost(...) {
  ...
  debug("hello");
  ...
}
```

# Running Tests

### Dependencies
- [Nodejs](https://nodejs.org)
  - Nodejs must be installed, as the assemblyscript build system relies on node/npm
- [hc](https://github.com/holochain/holochain-cmd)
  - `hc` is the command line tools for Holochain app development
- [hcshell](https://github.com/holochain/holosqape#hcshell)
  - `hcshell` is the underlying container that runs Holochain DNA tests

To run the tests of this repo, run the following commands within this repository in the command line, having cloned or downloaded it to your computer.

```shell
npm install
cd examples/appSpec
hc test | test/node_modules/faucet/bin/cmd.js
```

The use of `| test/node_modules/faucet/bin/cmd.js` ensures a nicer visual output. To read more about options for test running, visit the [holochain-cmd](https://github.com/holochain/holochain-cmd#writing-and-running-tests) repository.

## Limitations of assemblyscript
It is important to note that assemblyscript is NOT typescript. There are several important features that are missing notably:
- interfaces
- use of untyped variables or the any type
- JSON.parse/JSON.stringify
- virtual methods (the method of the compile time type will always be called)
- Closures

This may make writing zome in ASM difficult for developers used to javascript/typescript.

## Background

To enable developers to write zomes in assemblyscript in a familiar way the HDK is responsible for 3 different things:

- Wrapping Holochain API calls from assemblyscript so that they can be called with familiar parameters
- Wrapping exported functions from assemblyscript so that the holochain runtime can call them
- Wrapping callbacks (e.g. validate_commit etc)

The medium of communication between holochain core and wasm zomes is strings which use json to encode objects. More speficically all wasm calls must accept a single u32 (encoded_allocation) where the high 16 bits are the memory offset and the low 32 bits are the size of the string. Similarly this is what a wasm call must return.

### Serializing and de-serializing strings from encoded_allocations
Rust passes and expects UTF-8 null terminated strings. Assemblyscript deals in UTF-16LE encoded non-null terminated strings with a 32 bit header specifying the length. It is important to deal with the conversion between these two types in the serialize and deserialize functions.

## Macros for improving the developer experience
Assemblyscript supports transforming the typescript source as part of the build pipeline. It is also able to recognise decorators e.g `@zome_function`. This mean that the boilerplate of deserializing/serializing arguments can be abstracted from the developer. 

The proposed tranform is as follows:
Developer writes:
```typescript
@zome_function
function writePost(title: string): string {
    ... commit entries etc
}
```
compiler sees:
```typescript

function _writePost(title: string, body: string, timestamp: i32): string {
    ... commit entries etc
}

export function writePost(e: u32): u32 {
    let jsonString: string = deserialize(e);
    // `{"title": "wasm for beginners", "body": "...", "timestamp": 1234}``
    
    // parameters defined as variables
    let title: string;
    let body: string;
    let timestamp: i32;
    
    // call the original function
    let result: string = _writePost(title, body, timestamp);
    
    // return the serialized result string
    return serialize(result);
}

```

The above still has some limitations such as:

- only string values allowed for public zome function returns
- only primitive types and strings permitted as function parameters

This may or may not be acceptable going forward
