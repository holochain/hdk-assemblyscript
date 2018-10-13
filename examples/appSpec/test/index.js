// This test file uses the tape testing framework.
// To learn more, go here: https://github.com/substack/tape

import {hctest} from './test-helper'

hctest('test debug_object', (app, t) => {
  t.plan(1)
  let result = app.call("three", "main", "test_debug_object", "")
  let obj
  try {
    obj = JSON.parse(result)
  } catch (e) {
    t.end()
  }
  t.deepEqual(obj, { a: 'hi', b: 20, c: [ { n: false }, { n: true } ] })
})

hctest('test commit_entry', (app, t) => {
  t.plan(1)
  let result = app.call("three", "main", "test_commit_entry", "hello")
  let obj
  try {
    obj = JSON.parse(result)
  } catch (e) {
    t.end()
  }
  t.deepEqual(obj, { address: 'QmRN6wdp1S2A5EtjW9A3M1vKSBuQQGcgvuhoMUoEz4iiT5' })
})

hctest('test get_entry', (app, t) => {
  t.plan(1)
  app.call("three", "main", "test_commit_entry", "hello")
  let result = app.call("three", "main", "test_get_entry", "QmRN6wdp1S2A5EtjW9A3M1vKSBuQQGcgvuhoMUoEz4iiT5")
  let obj
  try {
    obj = JSON.parse(result)
  } catch (e) {
    t.end()
  }
  t.deepEqual(obj, {
    status: "Found",
    entry: "hello"
  })
})

hctest('test init_globals', (app, t) => {
  t.plan(1)
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

hctest('test call', (app, t) => {
  t.plan(1)
  let result = app.call("three", "main", "test_call", "myinput")
  t.equal(result, "myoutput")
})