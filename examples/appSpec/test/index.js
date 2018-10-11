// This test file uses the tape testing framework. 
// To learn more, go here: https://github.com/substack/tape
const test = require('tape');

function loadApp() {
    // instantiate an app from the Genome JSON bundle
    const app = Container.loadAndInstantiate("dist/bundle.json")
    // activate the new instance
    app.start()
    return app
}

test('test commit_entry', (t) => {
  t.plan(1)
  const app = loadApp()
  let result = app.call("three", "main", "test_commit_entry", "hello")
  let obj
  try {
    obj = JSON.parse(result)
  } catch (e) {
    t.end()
  }
  t.deepEqual(obj, { address: 'QmZsRsCTUGBy7ox5hiitArDfCjxUJxvoLLZBwZrmCy5wv4' })
})

test('test get_entry', (t) => {
  t.plan(1)
  const app = loadApp()
  app.call("three", "main", "test_commit_entry", "hello")
  let result = app.call("three", "main", "test_get_entry", "QmZsRsCTUGBy7ox5hiitArDfCjxUJxvoLLZBwZrmCy5wv4")
  // TODO: fix this once GET gets fixed
  t.equal(result, '"message"')
})

test('test init_globals', (t) => {
  t.plan(1)
  const app = loadApp()
  let result = app.call("three", "main", "test_init_globals", "")
  let obj
  try {
    obj = JSON.parse(result)
  } catch (e) {
    t.end()
  }
  t.deepEqual(obj, {
    "app_name": "My Typescript App!",
    "app_dna_hash": "FIXME-app_dna_hash",
    "app_agent_id_str": "c_bob",
    "app_agent_key_hash": "FIXME-app_agent_key_hash",
    "app_agent_initial_hash": "FIXME-app_agent_initial_hash",
    "app_agent_latest_hash": "FIXME-app_agent_latest_hash"
  })
})
