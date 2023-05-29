// runTests.js

import { deckTest } from './deck.test.js';
import { gameTest } from './game.test.js';
import { logTestResult, assert, test, beforeEach, beforeEachSetupFunction } from './testUtils.js';

export function runTests() {
  if (beforeEachSetupFunction) {
    beforeEachSetupFunction(); // Run the setup before each test
  }

  function customLogTestResult(result, description) {
    logTestResult(result, description);
  }

  deckTest(customLogTestResult, assert, test);
  gameTest()
}

window.addEventListener('DOMContentLoaded', runTests);
