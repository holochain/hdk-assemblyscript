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


        // test debug
        let debug_result = hc.call("three", "main", "test_debug", r#"test value"#);
        assert!(debug_result.is_ok());


        // test calling commit
        let hash = hc.call("three", "main", "test_commit", r#"test value"#).unwrap();
        assert_eq!(hash, "QmTB1F5LNJvQHVriLH5b13oeEvDBJNA7YUjogpiX8s1yCJ");

        // test get
        let get_result = hc.call("three", "main", "test_get", &hash).unwrap();
        println!("{}", &get_result);
        // assert!(get_result.is_ok());

        // test test_decode_params
        let test_decode_result = hc.call("three", "main", "test_decode_params",r#"{"keyString": "valueString"}"#).unwrap();
        let test_decode_result = test_decode_result.trim_right_matches(char::from(0));

        assert_eq!(test_decode_result, "valueString");

        // test_decode_multiple_params
        let test_decode_multiple_params_result = hc.call("three", "main", "test_decode_multiple_params",r#"{"firstString" : "abc", "secondString" : "def"}"#).unwrap();
        let test_decode_multiple_params_result = test_decode_multiple_params_result.trim_right_matches(char::from(0));

        assert_eq!(test_decode_multiple_params_result, "abcdef");

        let test_logger = test_logger.lock().unwrap();
        println!("{:?}", *test_logger)
    }
}
