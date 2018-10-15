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
    use std::io::prelude::*;
    use holochain_dna::*;
    use holochain_core_api::*;
    use test_utils::*;

    #[derive(Deserialize, Debug)]
    struct CommitResult {
        hash: String
    }

    fn setup_hc() -> Holochain {
        // Setup the holochain instance
        let mut dna_file = File::open("app.hcpkg").expect("file not found");
        let mut dna_string = String::new();
        dna_file.read_to_string(&mut dna_string)
            .expect("something went wrong reading the file");

        let dna = Dna::from_json_str(&dna_string).unwrap();

        let (context, _test_logger) = test_context_and_logger("alex");
        let mut hc = Holochain::new(dna, context).unwrap();

        // Run the holochain instance
        hc.start().expect("couldn't start");
        return hc;
    }


    // #[test]
    // fn test_debug() {
    //     let mut hc = setup_hc();
    //     let _debug_result = hc.call("three", "main", "test_debug", r#"holochain debug!"#);
    //     assert!(true);
    // }

    #[test]
    fn test_debug_object() {
        let mut hc = setup_hc();
        let _debug_result = hc.call("three", "main", "test_debug_object", r#""#);
        assert!(true);
    }


    #[test]
    fn test_marshal() {
        let mut hc = setup_hc();
        let marshal_result = hc.call("three", "main", "test_marshal", "");
        let raw = marshal_result.unwrap();
        let expected = "\"nested\"";
        assert_eq!(raw, expected);
    }


    #[test]
    fn test_commit() {
        let mut hc = setup_hc();
        let commit_result = hc.call("three", "main", "test_commit_entry", r#"test value"#);
        assert!(commit_result.is_ok());
        let raw_commit_result = commit_result.unwrap();

        // have to cut off trailing null char
        let raw_commit_result = raw_commit_result.trim_right_matches(char::from(0));
        let commit_result: CommitResult = match serde_json::from_str(&raw_commit_result) {
            Ok(entry_output) => entry_output,
            Err(e) => CommitResult {
                hash: e.to_string()
            }
        };
        assert_eq!(commit_result.hash, "QmZsRsCTUGBy7ox5hiitArDfCjxUJxvoLLZBwZrmCy5wv4".to_string());
    }


    #[test]
    fn test_get() {
        let mut hc = setup_hc();
        let _commit_result = hc.call("three", "main", "test_commit_entry", r#"test value"#);
        let get_result = hc.call("three", "main", "test_get_entry", "QmZsRsCTUGBy7ox5hiitArDfCjxUJxvoLLZBwZrmCy5wv4");
        assert!(get_result.is_ok());
    }

    #[test]
    fn test_init_globals() {
        let mut hc = setup_hc();
        let globals_result = hc.call("three", "main", "test_init_globals", "");
        assert!(globals_result.is_ok());

        let globals_result_string = globals_result.unwrap();
        assert_eq!(
            globals_result_string.trim_right_matches(char::from(0)),
            r#"{"app_name":"My Typescript App!","app_dna_hash":"FIXME-app_dna_hash","app_agent_id_str":"alex","app_agent_key_hash":"FIXME-app_agent_key_hash","app_agent_initial_hash":"FIXME-app_agent_initial_hash","app_agent_latest_hash":"FIXME-app_agent_latest_hash"}"#
        );
    }
}
