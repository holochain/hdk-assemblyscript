# js-tests-scaffold

This is a recommended configuration for developing tests for Holochain Genomes. The point of these files are to write tests that can successfully run within the `[holoconsole](https://github.com/holochain/holosqape)` Holochain container environment.
 
For now, the Javascript file for use by `hcdev test` MUST be placed in `dist/bundle.js` of this directory. So if you decide to eliminate webpack, place your JS file there.

It currently includes webpack in its configuration because the javascript execution environment in the [holoconsole](https://github.com/holochain/holosqape) container does not support full ES6 Javascript.
In terms of syntax, ES5 is safe, but check the [QJSEngine documentation](http://doc.qt.io/qt-5/qtqml-javascript-functionlist.html) to be completely sure of syntax compatibility.

To get proper assertions and formatted output we want to use existing JS scripting frameworks. The configuration currently uses [tape](https://github.com/substack/tape) as a testing framework. We chose Tape for now because of its minimal footprint.

These files are copied into the `test` folder of any new Genome that is started using `hcdev init`.

Dependencies are installed by running `npm install`. 

Javascript build step is done by running `npm run build`. This places a new file called `bundle.js` within a `dist` folder, within this folder.

Note that those steps are performed automatically by `hcdev test`.

**Note about default configuration with TAPE testing**: If you use this default configuration with Tape for testing, to get an improved CLI visual output (with colors! and accurate exit codes), we recommend adjusting the command you use to run tests as follows:
```
hcdev test | test/node_modules/faucet/bin/cmd.js
```

## Webpack config
If you create your own testing project and you want to use Webpack for bundling make sure to set the following node parameters to have the output run in Holoconsole JS engine:

```
node: {
	fs: 'empty',
	setImmediate: false
}
```
