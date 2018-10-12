"use strict";

var _testHelper = require("./test-helper");

// This test file uses the tape testing framework.
// To learn more, go here: https://github.com/substack/tape
(0, _testHelper.hctest)('test commit_entry', function (app, t) {
  t.plan(1);
  var result = app.call("three", "main", "test_commit_entry", "hello");
  var obj;

  try {
    obj = JSON.parse(result);
  } catch (e) {
    t.end();
  }

  t.deepEqual(obj, {
    address: 'QmZsRsCTUGBy7ox5hiitArDfCjxUJxvoLLZBwZrmCy5wv4'
  });
});
(0, _testHelper.hctest)('test get_entry', function (app, t) {
  t.plan(1);
  app.call("three", "main", "test_commit_entry", "hello");
  var result = app.call("three", "main", "test_get_entry", "QmZsRsCTUGBy7ox5hiitArDfCjxUJxvoLLZBwZrmCy5wv4"); // TODO: fix this once GET gets fixed

  t.equal(result, '"message"');
});
(0, _testHelper.hctest)('test init_globals', function (app, t) {
  t.plan(1);
  var result = app.call("three", "main", "test_init_globals", "");
  var obj;

  try {
    obj = JSON.parse(result);
  } catch (e) {
    t.end();
  }

  t.deepEqual(obj, {
    "app_name": "My Typescript App!",
    "app_dna_hash": "FIXME-app_dna_hash",
    "app_agent_id_str": "c_bob",
    "app_agent_key_hash": "FIXME-app_agent_key_hash",
    "app_agent_initial_hash": "FIXME-app_agent_initial_hash",
    "app_agent_latest_hash": "FIXME-app_agent_latest_hash"
  });
});
