#!/usr/bin/env node
/**
 * stark-industries/tests/e2e/run_tests.cjs
 * Local bridge runner that delegates to root tests/e2e/run_tests.cjs.
 */
const path = require("node:path");
const rootRunner = path.resolve(__dirname, "../../../tests/e2e/run_tests.cjs");
require(rootRunner);
