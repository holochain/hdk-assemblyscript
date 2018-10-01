# assemblyscript-example-app

Example of running an app using a Rust based holochain container.

Install [holochain-cmd](https://github.com/holochain/holochain-cmd), and also Rust (with Cargo). Both are expected in your path for `./build-and-test.sh` to run.

In a CLI:

First, change directories to the root directory of hdk-assemblyscript.

In that directory, run `npm install`

Second, change directories into `examples/appSpec`.

In that directory, run `./build-and-test.sh`.

That command first compiles a DNA file `app.hcpkg` using `hcdev package`, and then calls the Rust based tests written in `src` using `cargo test`. The `cargo test` command internally imports and uses the built `app.hcpkg` file, so combining the two steps is important.

## Files

**src, Cargo.toml, Cargo.lock**

All of these files pertain to the Container that is used to actually run, and make calls into the app. Within `src/main.rs` are tests that test each of the main functions defined in the Zomes.

**zomes**

Within the `zomes` folder are other folders, containing one zome per folder. There is a subfolder `three` which defines our only Zome.

**app.json**

This is the top level app definition JSON file, which gets built in to the `app.hcpkg` using `hcdev package`.

**build-and-test.sh**

This file has been described. It compiles the DNA build step, and the running of tests.

**.hcignore**

Specifies which files to ignore as `hcdev package` is running, to build the DNA.

**.gitignore**

Standard git ignore file.
