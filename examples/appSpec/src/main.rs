#[macro_use]
extern crate serde_derive;

extern crate holochain_core;
extern crate holochain_core_api;
extern crate holochain_dna;
extern crate test_utils;

#[cfg(test)]
mod tests {
    extern crate serde;
    extern crate serde_json;

    use std::fs::File;
    use std::collections::HashMap;
    use std::io::prelude::*;
    use holochain_dna::*;
    use holochain_dna::zome::Zome;
    use holochain_core_api::*;
    use test_utils::*;

    #[derive(Deserialize, Debug)]
    struct CommitResult {
        hash: String
    }

    #[test]
    fn testing() {
        // Setup the holochain instance
        let mut dna_file = File::open("app.hcpkg").expect("file not found");
        let mut dna_string = String::new();
        dna_file.read_to_string(&mut dna_string)
            .expect("something went wrong reading the file");

        let mut dna = Dna::from_json_str(&dna_string).unwrap();

        // We need to inject a capability with empty string as name because the validation callback
        // has set its capability to nothing and the callback mechanism is using that as a string
        // and tries to call the callback there.
        // TODO:
        // That has to be changed. Validation callbacks should be found in the WASM of the entry type
        // instead.
        // Or we go all the way and change the spec to have only one WASM module per zome..
        // See: https://github.com/holochain/holochain-rust/issues/342
        dna.zomes = dna
            .zomes
            .into_iter()
            .map(|(zome_name, mut zome)| {
                if zome_name == "three" {
                    zome.capabilities
                        .insert("".to_string(), validation_capability());
                }
                (zome_name, zome)
            })
            .collect::<HashMap<String, Zome>>();

        let (context, test_logger) = test_context_and_logger("alex");
        let mut hc = Holochain::new(dna, context).unwrap();

        // Run the holochain instance
        hc.start().expect("couldn't start");
        // Call the exposed wasm function that calls the Commit API function
        // zome, capability, function name, input value
        let debug_result = hc.call("three", "main", "test_debug", r#"test value"#);
        assert!(debug_result.is_ok());

        let raw_commit_result = hc.call("three", "main", "test_commit", r#"test value"#).unwrap();
        let commit_result: CommitResult = match serde_json::from_str(&raw_commit_result) {
            Ok(entry_output) => entry_output,
            // Exit on error
            Err(e) => CommitResult {
                hash: e.to_string()
            }
        };
        // assert_eq!(commit_result.hash, "QmTB1F5LNJvQHVriLH5b13oeEvDBJNA7YUjogpiX8s1yCJ".to_string());

        let get_result = hc.call("three", "main", "test_get", &"QmTB1F5LNJvQHVriLH5b13oeEvDBJNA7YUjogpiX8s1yCJ".to_string());
        assert!(get_result.is_ok());

        let test_logger = test_logger.lock().unwrap();
        println!("{:?}", *test_logger)
    }
}
