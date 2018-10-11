// This test file uses the tape testing framework. 
// To learn more, go here: https://github.com/substack/tape
const test = require('tape');

// instantiate an app from the Genome JSON bundle
const app = Container.loadAndInstantiate("dist/bundle.json")

// activate the new instance
app.start()

test('description of example test', (t) => {
  // indicates the number of assertions that follow
  t.plan(1)

  // Make a call to a Zome function
  // indicating the capability and function, and passing it an input
  // const result = app.call("three", "main", "test_debug_object", "");
  const commit_result = app.call("three", "main", "test_commit_entry", "test value");
  let get_result = app.call("three", "main", "test_get_entry", "QmZsRsCTUGBy7ox5hiitArDfCjxUJxvoLLZBwZrmCy5wv4");
  let globals_result = app.call("three", "main", "test_init_globals", "");

  console.log(commit_result);
  console.log(get_result);
  console.log(globals_result);

  // check for equality of the actual and expected results
  t.equal("e", "expected result!")
})
