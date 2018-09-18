extern crate holochain_core;
extern crate holochain_core_api;
extern crate holochain_dna;
extern crate test_utils;

use std::fs::File;
use std::io::prelude::*;
use holochain_core_api::*;
use test_utils::*;

fn main() {
    // Setup the holochain instance
    let mut dna_file = File::open("app.hcpkg").expect("file not found");
    let mut dna_string = String::new();
    dna_file.read_to_string(&mut dna_string)
        .expect("something went wrong reading the file");

    let dna = holochain_dna::Dna::from_json_str(&dna_string).unwrap();

    let (context, test_logger) = test_context_and_logger("alex");
    let mut hc = Holochain::new(dna, context).unwrap();

    // Run the holochain instance
    hc.start().expect("couldn't start");
    // Call the exposed wasm function that calls the Commit API function
    // zome, capability, function name, input value
    let result = hc.call("three", "main", "debugg", r#"test value"#);
    println!("{:?}", result);
    let test_logger = test_logger.lock().unwrap();
    println!("{:?}", *test_logger)
}
