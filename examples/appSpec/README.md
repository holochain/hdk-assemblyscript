# assemblyscript-example-app

Example of writing an app with Assemblyscript zomes. Used to drive testing of the hdk-assemblyscript.

Install [holochain-cmd](https://github.com/holochain/holochain-cmd), and also [hcshell](https://github.com/holochain/holosqape).

In a CLI:

First, change directories to the root directory of `hdk-assemblyscript`.

In that directory, run `npm install`

Second, change directories into `examples/appSpec`.

In that directory, run `hc test | test/node_modules/faucet/bin/cmd.js`.

## Files

**test**

All of these files pertain to the testing of your app. Within `test/index.js` are tests that test each of the main functions defined in the Zomes.

**zomes**

Within the `zomes` folder are other folders, containing one zome per folder. There is a subfolder `three` which defines our only Zome.

**app.json**

This is the top level app definition JSON file, which gets built in to the `dist/bundle.json` using `hc package`.

**.hcignore**

Specifies which files to ignore as `hc package` is running, to build the DNA.

**.gitignore**

Standard git ignore file. Files in here also get ignored by `hc package`
