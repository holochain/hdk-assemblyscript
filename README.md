# Assemblyscript HDK (WIP)
The Holochain Developer Kit for Assemblyscript (TypeScript)

To enable developers to write zomes in assemblyscript in a familiar way the HDK is responsible for 3 different things:

- Wrapping Holochain API calls from asm so that they can be called with familiar parameters
- Wrapping exported functions from asm so that the holochain runtime can call them
- Wrapping callbacks (e.g. validate_commit etc)

The medium of communication between holochain core and wasm zomes is strings which may optionally use json to encode objects. More speficically all wasm calls must accept a single u32 (encoded_allocation) where the high 16 bits are the memory offset and the low 32 bits are the size of the string. Similarly this is what a wasm call must return. 

## Status

### Working Functions
- [x] debug
- [x] commit_entry
- [x] get_entry
- [x] init_globals

### Functions Ready To Implement (in holochain-rust)
- [ ] call
- [ ] get_links

### Functions Not Ready
- [ ] sign
- [ ] verify_signature
- [ ] update_entry
- [ ] update_agent
- [ ] remove_entry
- [ ] link_entries
- [ ] query
- [ ] send
- [ ] start_bundle
- [ ] close_bundle

## Using the API Functions

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

## Limitations of assemblyscript
It is important to note that assemblyscript is NOT typescript. There are several important features that are missing notably:
- interfaces
- use of untyped variables or the any type
- JSON.parse/JSON.stringify
- virtual methods (the method of the compile time type will always be called)
- Closures

This may make writing zome in ASM difficult for developers used to javascript/typescript.

## Serializing and de-serializing strings from encoded_allocations
Rust passes and expects UTF-8 null terminated strings. Assemblyscript deals in UTF-16LE encoded non-null terminated strings with a 32 bit header specifyin g the length. It is important to deal with the conversion between these two types in the serialize and deserialize functions.

## Parsing json strings to assemblyscript variables
There is a need for a Serde style library for parsing a JSON string into the fields of a known type. For this purpose we have created [asm-json-parser](https://github.com/willemolding/asm-json-parser). This is an event driven JSON parser for assemblyscript.

Users may specify a custom handler object that will make callbacks upon reaching certain JSON events e.g. objectStart, arrayStart, key, string, int, float etc. It is straightfoward to then write a custom parser to populate the fields of a given class.

## Macros for improving the developer experience
Assemblyscript supports transforming the typescript source as part of the build pipeline. It is also able to recognise decorators e.g `@zome_function`. This mean that the boilerplate of deserializing/serializing arguments can be abstracted from the developer. 

The proposed tranform is as follows:
Developer writes:
```typescript
@zome_function
function writePost(title: string, body: string, timestamp: i32): string {
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
    
    // attempt to parse the json string into the variables
    class ParameterHandler extends Handler {
      onInt(value: i32, stringValue: string) {
        if(currentKey == "timestamp") {
            timestamp = value;
        }
      }
      onString(value: string) {
        if(currentKey == "title") {
            title = value;
        } else if (currentKey == "body") {
            body = value;
        }
      }
    }
    
    let handler = new ParameterHandler()
    parseString<ParameterHandler>(jsonString, handler)
    
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

# Running Tests

To run the tests of this repo...

First, make sure you have the latest version of [hc](https://github.com/holochain/holochain-cmd) and [hcx](https://github.com/holochain/holosqape) installed.

```shell
cd examples/appSpec
hc test | test/node_modules/faucet/bin/cmd.js
```
